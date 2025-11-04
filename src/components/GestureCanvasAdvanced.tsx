import { useEffect, useRef, RefObject } from "react";
import type { Results, NormalizedLandmarkList } from "@mediapipe/hands";

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
  const gestureStateRef = useRef({
    lastProcessTime: 0,
    fps: 60,
      frameStartTime: 0,
    // Safeguards
    lastGestureTimes: new Map<string, number>(),
    gestureStartTimes: new Map<string, number>(),
    previousHandPosition: null as { x: number; y: number } | null,
    stabilityFrameCount: new Map<string, number>(),
    // Latest
    latestLandmarks: null as HandLandmark[] | null,
  });

  const CONFIG = {
    CONFIDENCE_THRESHOLD: 0.85,
    DWELL_TIME_MS: 300,
    COOLDOWN_MS: 500,
    STABILITY_THRESHOLD: 0.05,
    STABILITY_FRAMES: 3,
    ZONE_X_MIN: 0.2,
    ZONE_X_MAX: 0.8,
    ZONE_Y_MIN: 0.2,
    ZONE_Y_MAX: 0.8,
    // Pixel-based thresholds (from provided code)
    CAM_WIDTH: 640,
    CAM_HEIGHT: 480,
    OK_PINCH_THRESH: 35,      // pixels
    FINGER_JOIN_THRESH: 40,   // pixels
  };

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    let hands: any = null;
    let camera: any = null;
    let isInitialized = false;
    let animationFrameId = 0;

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
              maxNumHands: 1,
              modelComplexity: 1,  // Enhanced from provided code
              minDetectionConfidence: 0.7,  // Lower threshold from provided code
              minTrackingConfidence: 0.6,   // Lower threshold from provided code
            });

            hands.onResults((results: Results) => {
              if (!isInitialized) return;
                const startTime = performance.now();
                processResults(results);
                const endTime = performance.now();
              gestureStateRef.current.fps = 1000 / Math.max(16, endTime - (gestureStateRef.current.frameStartTime || endTime));
            });

            camera = new Camera(videoRef.current!, {
              onFrame: async () => {
                if (videoRef.current && hands && isInitialized) {
                  const now = Date.now();
                  const s = gestureStateRef.current;
                  if (now - s.lastProcessTime >= 33) {
                    s.lastProcessTime = now;
                    s.frameStartTime = performance.now();
                    await hands.send({ image: videoRef.current });
                    renderCanvas();
                  }
                }
              },
              width: 640,
              height: 480,
            });

            await camera.start();
            isInitialized = true;
            return;
          } catch (e) {
            console.error("MediaPipe init error", e);
          }
        }
        await new Promise(r => setTimeout(r, 100));
        attempts++;
      }
      console.error("MediaPipe failed to load");
    };

    initializeMediaPipe();

    return () => {
      isInitialized = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (hands) try { hands.close(); } catch {}
      if (camera) try { camera.stop(); } catch {}
    };
  }, [videoRef]);

  const uiModeFor = (prettyName: string) => {
    switch (prettyName) {
      case "Open Palm": return "✋ OPEN PALM";
      case "Point": return "👉 POINT";
      case "L-Shape": return "🔲 L-SHAPE";
      case "OK Sign": return "👌 OK SIGN";
      case "Two Fingers": return "✌️ TWO FINGERS";
      case "Three Fingers": return "🖖 THREE FINGERS";
      case "Thumb Out": return "👍 THUMB OUT";
      default: return "Ready";
    }
  };

  // Enhanced gesture detection helpers (from provided code)
  const toPx = (point: HandLandmark, w: number, h: number): [number, number] => {
    return [Math.floor(point.x * w), Math.floor(point.y * h)];
  };

  const distPx = (a: HandLandmark, b: HandLandmark, w: number, h: number): number => {
    const [ax, ay] = toPx(a, w, h);
    const [bx, by] = toPx(b, w, h);
    return Math.hypot(bx - ax, by - ay);
  };

  const anglePx = (a: HandLandmark, b: HandLandmark, c: HandLandmark, w: number, h: number): number => {
    const [ax, ay] = toPx(a, w, h);
    const [bx, by] = toPx(b, w, h);
    const [cx, cy] = toPx(c, w, h);
    const v1 = [ax - bx, ay - by];
    const v2 = [cx - bx, cy - by];
    const norm1 = Math.hypot(v1[0], v1[1]);
    const norm2 = Math.hypot(v2[0], v2[1]);
    const denom = norm1 * norm2;
    if (denom === 0) return 180.0;
    const dot = v1[0] * v2[0] + v1[1] * v2[1];
    const cosang = Math.max(-1.0, Math.min(1.0, dot / denom));
    return Math.acos(cosang) * (180 / Math.PI);
  };

  // Fingers up detection (simplified from provided code)
  const fingersUp = (lm: HandLandmark[], label: string): [number, number, number, number, number] => {
    const tips = [4, 8, 12, 16, 20];
    const state: number[] = [];
    
    // Thumb: compare x coords vs previous joint (hand-aware)
    const thumbTip = lm[tips[0]];
    const thumbPrev = lm[tips[0] - 1];
    if (label === "Right") {
      state.push(thumbTip.x < thumbPrev.x ? 1 : 0);
    } else {
      state.push(thumbTip.x > thumbPrev.x ? 1 : 0);
    }
    
    // Other fingers: tip y < pip y => finger up
    for (let i = 1; i < tips.length; i++) {
      const fid = tips[i];
      state.push(lm[fid].y < lm[fid - 2].y ? 1 : 0);
    }
    
    return [state[0], state[1], state[2], state[3], state[4]]; // [thumb, index, middle, ring, pinky]
  };

  // Enhanced gesture detection (from provided code logic)
  const detectGesture = (lm: HandLandmark[], label: string): { name: string; confidence: number } | null => {
    const w = CONFIG.CAM_WIDTH;
    const h = CONFIG.CAM_HEIGHT;
    const fu = fingersUp(lm, label);
    const [thumb, index, middle, ring, pinky] = fu;

    // Basic openness checks
    const allOpen = fu.every(f => f === 1);
    const onlyIndex = index === 1 && thumb === 0 && middle === 0 && ring === 0 && pinky === 0;
    const onlyThumb = thumb === 1 && index === 0 && middle === 0 && ring === 0 && pinky === 0;

    // Landmark shortcuts
    const wrist = lm[0];
    const tipThumb = lm[4];
    const tipIndex = lm[8];
    const tipMiddle = lm[12];

    // Pixel-based distances
    const dThumbIndex = distPx(tipThumb, tipIndex, w, h);
    const dIndexMiddle = distPx(tipIndex, tipMiddle, w, h);

    // Angle for L-shape (between wrist->thumb_tip and wrist->index_tip)
    const angL = anglePx(tipThumb, wrist, tipIndex, w, h);

    // Priority order (from provided code)
    
    // 1) Open Palm
    if (allOpen) {
      return { name: "Open Palm", confidence: 0.98 };
    }

    // 2) Point (Index only)
    if (onlyIndex) {
      return { name: "Point", confidence: 0.92 };
    }

    // 3) L-Shape (Thumb + Index up, others down, approx right angle)
    if (thumb === 1 && index === 1 && middle === 0 && ring === 0 && pinky === 0) {
      if (angL >= 50 && angL <= 120) {
        return { name: "L-Shape", confidence: 0.88 };
      }
    }

    // 4) OK Sign (thumb-index tips touching/close AND at least middle up)
    if (dThumbIndex < CONFIG.OK_PINCH_THRESH && middle === 1) {
      return { name: "OK Sign", confidence: 0.87 };
    }

    // 5) Two Fingers (index + middle up only, separated)
    if (index === 1 && middle === 1 && thumb === 0 && ring === 0 && pinky === 0) {
      // Keep them apart
      if (dIndexMiddle > CONFIG.FINGER_JOIN_THRESH) {
        return { name: "Two Fingers", confidence: 0.78 };
      }
    }

    // 6) Three Fingers (index + middle + ring up only)
    if (index === 1 && middle === 1 && ring === 1 && thumb === 0 && pinky === 0) {
      return { name: "Three Fingers", confidence: 0.73 };
    }

    // 7) Thumb Out (thumb only)
    if (onlyThumb) {
      return { name: "Thumb Out", confidence: 0.75 };
    }

    return null;
  };

  const inActiveZone = (lm: HandLandmark[]) => {
    const center = { x: (lm[0].x + lm[9].x) / 2, y: (lm[0].y + lm[9].y) / 2 };
    return center.x > CONFIG.ZONE_X_MIN && center.x < CONFIG.ZONE_X_MAX && center.y > CONFIG.ZONE_Y_MIN && center.y < CONFIG.ZONE_Y_MAX;
  };

  const isStable = (lm: HandLandmark[]) => {
    const center = { x: lm[9].x, y: lm[9].y };
    const prev = gestureStateRef.current.previousHandPosition;
    gestureStateRef.current.previousHandPosition = center;
    if (!prev) return true; // allow first
    const move = Math.hypot(center.x - prev.x, center.y - prev.y);
    return move < CONFIG.STABILITY_THRESHOLD;
  };

  const inCooldown = (name: string) => {
    const now = Date.now();
    const last = gestureStateRef.current.lastGestureTimes.get(name);
    if (!last || now - last > CONFIG.COOLDOWN_MS) {
      gestureStateRef.current.lastGestureTimes.set(name, now);
      return false;
    }
    return true;
  };

  const checkDwell = (name: string) => {
    const now = Date.now();
    const start = gestureStateRef.current.gestureStartTimes.get(name);
    if (!start) {
      gestureStateRef.current.gestureStartTimes.set(name, now);
      return false;
    }
    if (now - start >= CONFIG.DWELL_TIME_MS) {
      gestureStateRef.current.gestureStartTimes.delete(name);
      return true;
    }
    return false;
  };

  const stableFramesReached = (name: string) => {
    const count = (gestureStateRef.current.stabilityFrameCount.get(name) || 0) + 1;
    gestureStateRef.current.stabilityFrameCount.set(name, count);
    for (const k of gestureStateRef.current.stabilityFrameCount.keys()) {
      if (k !== name) gestureStateRef.current.stabilityFrameCount.set(k, 0);
    }
    return count >= CONFIG.STABILITY_FRAMES;
  };

  const processResults = (results: Results) => {
    const s = gestureStateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      s.latestLandmarks = null;
      onModeChange("Ready");
      onGestureDetected("None");
      renderCanvas();
      return;
    }

    const hand = results.multiHandLandmarks[0] as HandLandmark[];
    const label = (results.multiHandedness?.[0] as any)?.label || "Right";
    s.latestLandmarks = hand;

    if (!inActiveZone(hand)) {
      onModeChange("Ready");
      onGestureDetected("None");
      renderCanvas();
      return;
    }
    if (!isStable(hand)) {
      onModeChange("Ready");
      renderCanvas();
      return;
    }

    // Use enhanced gesture detection (from provided code)
    const detected = detectGesture(hand, label);

    if (!detected || detected.confidence < CONFIG.CONFIDENCE_THRESHOLD) {
      onGestureDetected("None");
      onModeChange("Ready");
      renderCanvas();
      return;
    }

    const best = detected;

    if (!stableFramesReached(best.name)) { renderCanvas(); return; }
    if (inCooldown(best.name)) { renderCanvas(); return; }
    if (!checkDwell(best.name)) { renderCanvas(); return; }

    onGestureDetected(best.name);
    onModeChange(uiModeFor(best.name));
    renderCanvas();
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw latest landmarks if available (from in-component results)
    const lms = gestureStateRef.current.latestLandmarks;
    if (lms && lms.length > 0) {
      // connections
      const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4],
        [0, 5], [5, 6], [6, 7], [7, 8],
        [0, 9], [9, 10], [10, 11], [11, 12],
        [0, 13], [13, 14], [14, 15], [15, 16],
        [0, 17], [17, 18], [18, 19], [19, 20],
        [5, 9], [9, 13], [13, 17]
      ] as [number, number][];
      ctx.strokeStyle = "rgba(0, 255, 255, 0.6)";
      ctx.lineWidth = 2;
      connections.forEach(([a, b]) => {
      ctx.beginPath();
        ctx.moveTo(lms[a].x * 640, lms[a].y * 480);
        ctx.lineTo(lms[b].x * 640, lms[b].y * 480);
      ctx.stroke();
      });
      lms.forEach((p, i) => {
        ctx.fillStyle = i === 8 ? "rgba(255, 0, 255, 1)" : "rgba(0, 255, 255, 1)";
        ctx.beginPath();
        ctx.arc(p.x * 640, p.y * 480, i === 8 ? 6 : 4, 0, 2 * Math.PI);
        ctx.fill();
      });
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
