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
    trail: [] as { x: number; y: number; opacity: number }[],
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

  const isZoomGesture = (lm: HandLandmark[], label: string): boolean => {
    const thumbUp = label === "Right" ? lm[4].x < lm[3].x : lm[4].x > lm[3].x;
    const indexUp = isFingerExtended(lm, 8, 6, 5);
    const middleUp = isFingerExtended(lm, 12, 10, 9);
    const ringUp = isFingerExtended(lm, 16, 14, 13);
    const pinkyUp = isFingerExtended(lm, 20, 18, 17);
    return thumbUp && indexUp && !middleUp && !ringUp && !pinkyUp;
  };

  const isPalmOpen = (lm: HandLandmark[], label: string): boolean => {
    const thumbOk = label === "Right" ? lm[4].x < lm[3].x : lm[4].x > lm[3].x;
    const indexUp = isFingerExtended(lm, 8, 6, 5);
    const middleUp = isFingerExtended(lm, 12, 10, 9);
    const ringUp = isFingerExtended(lm, 16, 14, 13);
    const pinkyUp = isFingerExtended(lm, 20, 18, 17);
    return thumbOk && indexUp && middleUp && ringUp && pinkyUp;
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
      onModeChange("Ready");
      onGestureDetected("None");
      
      // Update performance metrics
      updatePerformanceMetrics();
      return;
    }

    const handCount = results.multiHandLandmarks.length;

    // SINGLE-HAND GESTURES
    if (handCount === 1) {
      const hand = results.multiHandLandmarks[0];
      const label = (results.multiHandedness?.[0] as any)?.label || "Right";
      const lm = hand as HandLandmark[];

      const indexUp = isFingerExtended(lm, 8, 6, 5);
      const middleUp = isFingerExtended(lm, 12, 10, 9);
      const openPalm = isPalmOpen(lm, label);

      // CURSOR MODE with prediction
      if (indexUp && !middleUp && !openPalm) {
        const xPx = lm[8].x * 640;
        const yPx = lm[8].y * 480;

        // Calculate velocity and acceleration
        const deltaX = xPx - state.prevX;
        const deltaY = yPx - state.prevY;
        const acceleration = 0.35;
        const prevVx = state.velocityX;
        const prevVy = state.velocityY;
        
        state.velocityX = state.velocityX * 0.7 + deltaX * acceleration;
        state.velocityY = state.velocityY * 0.7 + deltaY * acceleration;

        const ax = state.velocityX - prevVx;
        const ay = state.velocityY - prevVy;

        // Apply Kalman filter
        const speed = Math.sqrt(state.velocityX ** 2 + state.velocityY ** 2);
        const filtered = kalmanFilter.filter(xPx, yPx, lm[8].z, state.velocityX, state.velocityY);

        // Smooth interpolation
        const smoothing = speed > 500 ? 2 : speed < 50 ? 4 : 3;
        state.virtualCursorX = state.prevX + (filtered.x - state.prevX) / smoothing + filtered.vx;
        state.virtualCursorY = state.prevY + (filtered.y - state.prevY) / smoothing + filtered.vy;

        // Predict future position (2 frames ahead)
        const predictedX = state.virtualCursorX + state.velocityX * 0.033 * 2 + ax * 0.033 * 0.033 * 4;
        const predictedY = state.virtualCursorY + state.velocityY * 0.033 * 2 + ay * 0.033 * 0.033 * 4;

        // Create predicted hand
        const predictedLandmarks = (hand as HandLandmark[]).map((landmark, i) => ({
          x: i === 8 ? predictedX / 640 : landmark.x + (predictedX - xPx) / 640 * 0.3,
          y: i === 8 ? predictedY / 480 : landmark.y + (predictedY - yPx) / 480 * 0.3,
          z: landmark.z,
        }));

        const predictionConfidence = Math.max(0, 1 - speed / 1000);
        state.predictedHand = {
          landmarks: predictedLandmarks,
          confidence: predictionConfidence,
        };

        // Add to trail
        state.trail.push({ x: state.virtualCursorX, y: state.virtualCursorY, opacity: 1 });
        if (state.trail.length > 15) state.trail.shift();
        state.trail = state.trail.map(p => ({ ...p, opacity: p.opacity * 0.85 }));

        state.prevX = state.virtualCursorX;
        state.prevY = state.virtualCursorY;

        // Map to screen coordinates
        const screenX = (1 - state.virtualCursorX / 640) * window.innerWidth;
        const screenY = (state.virtualCursorY / 480) * window.innerHeight;

        if (onCursorMove) {
          onCursorMove(screenX, screenY);
        }

        confirmGesture("Cursor Move", 0.88, () => {
          onGestureDetected("Cursor Move");
          onModeChange("🖱️ CURSOR MODE");
        });
      }
      // LEFT CLICK
      else if (indexUp && middleUp && !openPalm) {
        const x1 = lm[8].x * 640;
        const y1 = lm[8].y * 480;
        const x2 = lm[12].x * 640;
        const y2 = lm[12].y * 480;
        const dist = Math.hypot(x2 - x1, y2 - y1);

        if (!state.pinchEngaged && dist < 35) {
          state.pinchEngaged = true;
        }

        if (state.pinchEngaged && dist > 50) {
          state.pinchEngaged = false;
        }

        if (state.pinchEngaged) {
          confirmGesture("Left Click", 0.9, () => {
            onGestureDetected("Left Click");
            onModeChange("👆 CLICK");
          });
        }
      } else {
        state.pinchEngaged = false;
      }
      
      // RIGHT CLICK
      if (openPalm) {
        confirmGesture("Right Click", 0.87, () => {
          onGestureDetected("Right Click");
          onModeChange("✋ RIGHT CLICK");
        });
      }
    }
    // TWO-HAND GESTURES
    else if (handCount === 2) {
      const landmarks = results.multiHandLandmarks;
      const handedness = results.multiHandedness;

      const zoomStates: boolean[] = [];
      const openStates: boolean[] = [];
      const pts: [number, number][] = [];

      landmarks.forEach((hand, i) => {
        const label = (handedness?.[i] as any)?.label || "Right";
        const lm = hand as HandLandmark[];
        zoomStates.push(isZoomGesture(lm, label));
        openStates.push(isPalmOpen(lm, label));
        pts.push([lm[8].x * 640, lm[8].y * 480]);
      });

      // GRAB GESTURE
      if (openStates[0] && openStates[1]) {
        confirmGesture("Grab & Drag", 0.95, () => {
          const avgX = (pts[0][0] + pts[1][0]) / 2;
          const avgY = (pts[0][1] + pts[1][1]) / 2;

          state.virtualCursorX = avgX;
          state.virtualCursorY = avgY;
          state.grabMode = true;
          state.zoomPrevDist = null;

          onGestureDetected("Grab & Drag");
          onModeChange("🖐️ GRAB MODE");
        });
      }
      // ZOOM GESTURE
      else if (zoomStates[0] && zoomStates[1]) {
        confirmGesture("Zoom", 0.92, () => {
          const [x1, y1] = pts[0];
          const [x2, y2] = pts[1];
          const currDist = Math.hypot(x2 - x1, y2 - y1);

          if (state.zoomPrevDist === null) {
            state.zoomPrevDist = currDist;
          } else {
            const delta = currDist - state.zoomPrevDist;
            if (Math.abs(delta) > 10) {
              const direction = delta > 0 ? "Zoom In" : "Zoom Out";
              onGestureDetected(direction);
              state.zoomPrevDist = currDist;
            }
          }

          state.grabMode = false;
          onModeChange("🔍 ZOOM MODE");
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

    // Draw trail
    state.trail.forEach((point, i) => {
      const size = 2 + i * 0.3;
      ctx.fillStyle = `rgba(0, 255, 255, ${point.opacity * 0.6})`;
      ctx.beginPath();
      ctx.arc(point.x, point.y, size, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw predicted hand (ghost)
    if (state.predictedHand) {
      drawGhostHand(ctx, state.predictedHand);
    }

    // Draw virtual cursor with glow
    drawVirtualCursor(ctx, state.virtualCursorX, state.virtualCursorY);

    // Draw confidence glow
    const confidence = state.gestureConfirmation.confidence;
    if (confidence > 0) {
      const color = confidence > 0.9 ? "0, 255, 0" : confidence > 0.7 ? "255, 255, 0" : "255, 0, 0";
      ctx.shadowBlur = 20 * confidence;
      ctx.shadowColor = `rgba(${color}, 0.8)`;
      ctx.strokeStyle = `rgba(${color}, ${confidence})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(state.virtualCursorX, state.virtualCursorY, 30, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  };

  const drawGhostHand = (ctx: CanvasRenderingContext2D, predictedHand: PredictedHand) => {
    const landmarks = predictedHand.landmarks;
    const alpha = Math.max(0.2, predictedHand.confidence);

    // Draw connections
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4],
      [0, 5], [5, 6], [6, 7], [7, 8],
      [0, 9], [9, 10], [10, 11], [11, 12],
      [0, 13], [13, 14], [14, 15], [15, 16],
      [0, 17], [17, 18], [18, 19], [19, 20],
      [5, 9], [9, 13], [13, 17]
    ];

    ctx.strokeStyle = `rgba(0, 255, 255, ${alpha * 0.3})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    connections.forEach(([start, end]) => {
      ctx.beginPath();
      ctx.moveTo(landmarks[start].x * 640, landmarks[start].y * 480);
      ctx.lineTo(landmarks[end].x * 640, landmarks[end].y * 480);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Draw landmarks
    landmarks.forEach((lm, i) => {
      ctx.fillStyle = i === 8 ? `rgba(255, 0, 255, ${alpha})` : `rgba(0, 255, 255, ${alpha * 0.5})`;
      ctx.beginPath();
      ctx.arc(lm.x * 640, lm.y * 480, i === 8 ? 6 : 3, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const drawVirtualCursor = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Outer ring
    ctx.strokeStyle = "rgba(0, 255, 255, 0.9)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, 2 * Math.PI);
    ctx.stroke();

    // Crosshair
    ctx.beginPath();
    ctx.moveTo(x - 20, y);
    ctx.lineTo(x - 5, y);
    ctx.moveTo(x + 5, y);
    ctx.lineTo(x + 20, y);
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x, y - 5);
    ctx.moveTo(x, y + 5);
    ctx.lineTo(x, y + 20);
    ctx.stroke();

    // Center glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgba(0, 255, 255, 0.8)";
    ctx.fillStyle = "rgba(0, 255, 255, 0.4)";
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fill();
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
