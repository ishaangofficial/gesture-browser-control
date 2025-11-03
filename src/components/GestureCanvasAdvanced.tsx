import { useEffect, useRef, RefObject, useState } from "react";
import type { Results, NormalizedLandmarkList } from "@mediapipe/hands";
import { MultiAxisKalman } from "@/lib/kalman";

interface GestureCanvasProps {
  videoRef: RefObject<HTMLVideoElement>;
  onGestureDetected: (gesture: string) => void;
  onModeChange: (mode: string) => void;
  onCursorMove?: (x: number, y: number) => void;
  onPerformanceUpdate?: (metrics: {
    latency: number;
    fps: number;
    confidence: number;
    predictionAccuracy: number;
  }) => void;
}

interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

interface PredictedHand {
  landmarks: HandLandmark[];
  confidence: number;
}

interface CurrentHand {
  landmarks: HandLandmark[];
  label: string;
}

const GestureCanvasAdvanced = ({ 
  videoRef, 
  onGestureDetected, 
  onModeChange, 
  onCursorMove,
  onPerformanceUpdate 
}: GestureCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [kalmanFilter] = useState(() => new MultiAxisKalman());
  
  const gestureStateRef = useRef({
    prevX: 0,
    prevY: 0,
    velocityX: 0,
    velocityY: 0,
    zoomPrevDist: null as number | null,
    grabMode: false,
    scrollMode: false,
    scrollStartY: null as number | null,
    virtualCursorX: 320,
    virtualCursorY: 240,
    pinchEngaged: false,
    lastProcessTime: 0,
    gestureConfirmation: {
      lastGesture: "None",
      confirmCount: 0,
      requiredFrames: 3,
      confidence: 0,
    },
    predictedHand: null as PredictedHand | null,
    currentHand: null as CurrentHand | null,
    performanceMetrics: {
      frameStartTime: 0,
      latencies: [] as number[],
      fps: 60,
      predictionErrors: [] as number[],
    },
  });

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    let hands: any = null;
    let camera: any = null;
    let isInitialized = false;
    let animationFrameId: number;

    const initializeMediaPipe = async () => {
      let attempts = 0;
      while (attempts < 50) {
        const { Hands, Camera } = (window as any);
        if (Hands && Camera) {
          try {
            hands = new Hands({
              locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
            });

            hands.setOptions({
              maxNumHands: 2,
              modelComplexity: 0,
              minDetectionConfidence: 0.9,
              minTrackingConfidence: 0.85,
            });

            hands.onResults((results: Results) => {
              if (isInitialized) {
                const startTime = performance.now();
                processResults(results);
                const endTime = performance.now();
                
                // Track latency
                const state = gestureStateRef.current;
                state.performanceMetrics.latencies.push(endTime - startTime);
                if (state.performanceMetrics.latencies.length > 60) {
                  state.performanceMetrics.latencies.shift();
                }
              }
            });

            camera = new Camera(videoRef.current!, {
              onFrame: async () => {
                if (videoRef.current && hands && isInitialized) {
                  const now = Date.now();
                  const state = gestureStateRef.current;
                  // 30 FPS for MediaPipe processing (33ms)
                  if (now - state.lastProcessTime >= 33) {
                    state.lastProcessTime = now;
                    state.performanceMetrics.frameStartTime = performance.now();
                    await hands.send({ image: videoRef.current });
                  }
                }
              },
              width: 640,
              height: 480,
            });

            await camera.start();
            isInitialized = true;
            console.log("✅ Advanced gesture system initialized");

            // Start render loop
            const render = () => {
              renderCanvas();
              animationFrameId = requestAnimationFrame(render);
            };
            render();

            return;
          } catch (error) {
            console.error("MediaPipe initialization error:", error);
          }
        }
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      console.error("❌ MediaPipe failed to load");
    };

    initializeMediaPipe();

    return () => {
      isInitialized = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (hands) {
        try {
          hands.close();
        } catch (e) {
          console.error("Error closing hands:", e);
        }
      }
      if (camera) {
        try {
          camera.stop();
        } catch (e) {
          console.error("Error stopping camera:", e);
        }
      }
    };
  }, [videoRef]);

  const confirmGesture = (gesture: string, confidence: number, callback: () => void) => {
    const confirmation = gestureStateRef.current.gestureConfirmation;
    if (confirmation.lastGesture === gesture) {
      confirmation.confirmCount++;
      confirmation.confidence = confidence;
      if (confirmation.confirmCount >= confirmation.requiredFrames && confidence > 0.9) {
        callback();
        confirmation.confirmCount = confirmation.requiredFrames;
      }
    } else {
      confirmation.lastGesture = gesture;
      confirmation.confirmCount = 1;
      confirmation.confidence = confidence;
    }
  };

  const isFingerExtended = (lm: HandLandmark[], tipIdx: number, pipIdx: number, mcpIdx: number): boolean => {
    return lm[tipIdx].y < lm[pipIdx].y - 0.02 && lm[pipIdx].y < lm[mcpIdx].y - 0.01;
  };

  // NEW GESTURES
  const isOpenPalm = (lm: HandLandmark[], label: string): boolean => {
    const thumbOk = label === "Right" ? lm[4].x < lm[3].x : lm[4].x > lm[3].x;
    const indexUp = isFingerExtended(lm, 8, 6, 5);
    const middleUp = isFingerExtended(lm, 12, 10, 9);
    const ringUp = isFingerExtended(lm, 16, 14, 13);
    const pinkyUp = isFingerExtended(lm, 20, 18, 17);
    return thumbOk && indexUp && middleUp && ringUp && pinkyUp;
  };

  const isPointGesture = (lm: HandLandmark[]): boolean => {
    const indexUp = isFingerExtended(lm, 8, 6, 5);
    const middleUp = isFingerExtended(lm, 12, 10, 9);
    const ringUp = isFingerExtended(lm, 16, 14, 13);
    const pinkyUp = isFingerExtended(lm, 20, 18, 17);
    return indexUp && !middleUp && !ringUp && !pinkyUp;
  };

  const isLShapeGesture = (lm: HandLandmark[], label: string): boolean => {
    const thumbExtended = label === "Right" ? lm[4].x < lm[3].x - 0.05 : lm[4].x > lm[3].x + 0.05;
    const indexUp = isFingerExtended(lm, 8, 6, 5);
    const middleUp = isFingerExtended(lm, 12, 10, 9);
    const ringUp = isFingerExtended(lm, 16, 14, 13);
    const pinkyUp = isFingerExtended(lm, 20, 18, 17);
    return thumbExtended && indexUp && !middleUp && !ringUp && !pinkyUp;
  };

  const isOKSignGesture = (lm: HandLandmark[]): boolean => {
    const thumbTip = lm[4];
    const indexTip = lm[8];
    const distance = Math.sqrt(
      Math.pow((thumbTip.x - indexTip.x) * 640, 2) + 
      Math.pow((thumbTip.y - indexTip.y) * 480, 2)
    );
    const middleUp = isFingerExtended(lm, 12, 10, 9);
    const ringUp = isFingerExtended(lm, 16, 14, 13);
    const pinkyUp = isFingerExtended(lm, 20, 18, 17);
    return distance < 30 && middleUp && ringUp && pinkyUp;
  };

  const isPinchGesture = (lm: HandLandmark[]): boolean => {
    const thumbTip = lm[4];
    const indexTip = lm[8];
    const distance = Math.sqrt(
      Math.pow((thumbTip.x - indexTip.x) * 640, 2) + 
      Math.pow((thumbTip.y - indexTip.y) * 480, 2)
    );
    return distance < 25;
  };

  const processResults = (results: Results) => {
    const state = gestureStateRef.current;

    // Calculate FPS
    const now = performance.now();
    const elapsed = now - state.performanceMetrics.frameStartTime;
    if (elapsed > 0) {
      state.performanceMetrics.fps = 1000 / elapsed;
    }

    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      state.grabMode = false;
      state.scrollMode = false;
      state.zoomPrevDist = null;
      state.predictedHand = null;
      state.currentHand = null;
      onModeChange("Ready");
      onGestureDetected("None");
      
      // Update performance metrics
      updatePerformanceMetrics();
      return;
    }

    const handCount = results.multiHandLandmarks.length;

    // Store current hand for rendering
    if (handCount >= 1) {
      const hand = results.multiHandLandmarks[0];
      const label = (results.multiHandedness?.[0] as any)?.label || "Right";
      state.currentHand = {
        landmarks: hand as HandLandmark[],
        label: label,
      };
    }

    // NEW SINGLE-HAND GESTURES
    if (handCount === 1) {
      const hand = results.multiHandLandmarks[0];
      const label = (results.multiHandedness?.[0] as any)?.label || "Right";
      const lm = hand as HandLandmark[];

      // Open Palm → Start/Stop Recording
      if (isOpenPalm(lm, label)) {
        confirmGesture("Open Palm", 0.95, () => {
          onGestureDetected("Open Palm");
          onModeChange("✋ OPEN PALM");
        });
      }
      // Point → Mute/Unmute Microphone
      else if (isPointGesture(lm)) {
        confirmGesture("Point", 0.92, () => {
          onGestureDetected("Point");
          onModeChange("👉 POINT");
        });
      }
      // L-Shape → Switch to Next Scene
      else if (isLShapeGesture(lm, label)) {
        confirmGesture("L-Shape", 0.90, () => {
          onGestureDetected("L-Shape");
          onModeChange("🔲 L-SHAPE");
        });
      }
      // OK Sign → Start/Stop Streaming
      else if (isOKSignGesture(lm)) {
        confirmGesture("OK Sign", 0.88, () => {
          onGestureDetected("OK Sign");
          onModeChange("👌 OK SIGN");
        });
      }
      // Pinch → Pause Gesture Detection
      else if (isPinchGesture(lm)) {
        confirmGesture("Pinch", 0.87, () => {
          onGestureDetected("Pinch");
          onModeChange("🤏 PINCH");
        });
      }
    }

    updatePerformanceMetrics();
  };

  const updatePerformanceMetrics = () => {
    if (!onPerformanceUpdate) return;

    const state = gestureStateRef.current;
    const avgLatency = state.performanceMetrics.latencies.length > 0
      ? state.performanceMetrics.latencies.reduce((a, b) => a + b, 0) / state.performanceMetrics.latencies.length
      : 0;

    const avgPredictionAccuracy = state.performanceMetrics.predictionErrors.length > 0
      ? 100 - (state.performanceMetrics.predictionErrors.reduce((a, b) => a + b, 0) / state.performanceMetrics.predictionErrors.length)
      : 90;

    onPerformanceUpdate({
      latency: avgLatency,
      fps: state.performanceMetrics.fps,
      confidence: state.gestureConfirmation.confidence * 100,
      predictionAccuracy: avgPredictionAccuracy,
    });
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = gestureStateRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw current hand landmarks (actual detected hand)
    if (state.currentHand) {
      drawHandLandmarks(ctx, state.currentHand.landmarks);
    }

    // Draw predicted hand (ghost)
    if (state.predictedHand) {
      drawGhostHand(ctx, state.predictedHand);
    }

    // Draw confidence glow around index finger tip
    const confidence = state.gestureConfirmation.confidence;
    if (confidence > 0 && state.currentHand) {
      const indexTip = state.currentHand.landmarks[8];
      const x = indexTip.x * 640;
      const y = indexTip.y * 480;
      
      const color = confidence > 0.9 ? "59, 255, 59" : confidence > 0.7 ? "255, 255, 59" : "255, 59, 59";
      ctx.shadowBlur = 25 * confidence;
      ctx.shadowColor = `rgba(${color}, 0.9)`;
      ctx.strokeStyle = `rgba(${color}, ${confidence * 0.8})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(x, y, 35, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  };

  const drawHandLandmarks = (ctx: CanvasRenderingContext2D, landmarks: HandLandmark[]) => {
    // Draw blue shadow landmarks for actual detected hand
    landmarks.forEach((lm, i) => {
      const baseSize = i === 8 ? 10 : 6; // Larger for index finger tip
      
      // Outer shadow glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = `rgba(59, 130, 246, 0.9)`; // Blue glow
      
      // Draw filled circle
      ctx.fillStyle = `rgba(59, 130, 246, 0.85)`; // Solid blue
      ctx.beginPath();
      ctx.arc(lm.x * 640, lm.y * 480, baseSize, 0, 2 * Math.PI);
      ctx.fill();
      
      // Inner highlight
      ctx.shadowBlur = 0;
      ctx.fillStyle = `rgba(147, 197, 253, 0.7)`; // Lighter blue center
      ctx.beginPath();
      ctx.arc(lm.x * 640, lm.y * 480, baseSize * 0.5, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    ctx.shadowBlur = 0; // Reset shadow
  };

  const drawGhostHand = (ctx: CanvasRenderingContext2D, predictedHand: PredictedHand) => {
    const landmarks = predictedHand.landmarks;
    const alpha = Math.max(0.15, predictedHand.confidence * 0.5);

    // Draw semi-transparent predicted landmarks
    landmarks.forEach((lm, i) => {
      const baseSize = i === 8 ? 8 : 5;
      
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(147, 197, 253, ${alpha * 0.6})`;
      
      ctx.fillStyle = `rgba(147, 197, 253, ${alpha * 0.4})`; // Very transparent light blue
      ctx.beginPath();
      ctx.arc(lm.x * 640, lm.y * 480, baseSize, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    ctx.shadowBlur = 0;
  };
  return (
    <canvas
      ref={canvasRef}
      width={640}
      height={480}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ transform: "scaleX(-1)" }}
    />
  );
};

export default GestureCanvasAdvanced;
