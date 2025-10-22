import { useEffect, useRef, RefObject } from "react";
import { Hands, Results, NormalizedLandmarkList } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

interface GestureCanvasProps {
  videoRef: RefObject<HTMLVideoElement>;
  onGestureDetected: (gesture: string) => void;
  onModeChange: (mode: string) => void;
}

interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

const GestureCanvas = ({ videoRef, onGestureDetected, onModeChange }: GestureCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gestureStateRef = useRef({
    prevX: 0,
    prevY: 0,
    zoomPrevDist: null as number | null,
    grabMode: false,
    scrollMode: false,
    scrollStartY: null as number | null,
    virtualCursorX: 320,
    virtualCursorY: 240,
  });

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results: Results) => {
      processResults(results);
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) {
          await hands.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480,
    });

    camera.start();

    return () => {
      hands.close();
    };
  }, [videoRef]);

  const isZoomGesture = (lm: HandLandmark[], label: string): boolean => {
    const thumbUp = label === "Right" ? lm[4].x < lm[3].x : lm[4].x > lm[3].x;
    const indexUp = lm[8].y < lm[6].y;
    const middleUp = lm[12].y < lm[10].y;
    const ringUp = lm[16].y < lm[14].y;
    const pinkyUp = lm[20].y < lm[18].y;
    return thumbUp && indexUp && !middleUp && !ringUp && !pinkyUp;
  };

  const isPalmOpen = (lm: HandLandmark[], label: string): boolean => {
    const thumbOk = label === "Right" ? lm[4].x < lm[3].x : lm[4].x > lm[3].x;
    const indexUp = lm[8].y < lm[6].y;
    const middleUp = lm[12].y < lm[10].y;
    const ringUp = lm[16].y < lm[14].y;
    const pinkyUp = lm[20].y < lm[18].y;
    return thumbOk && indexUp && middleUp && ringUp && pinkyUp;
  };

  const isScrollGesture = (lm: HandLandmark[], label: string): boolean => {
    const thumbDown = label === "Right" ? lm[4].x > lm[3].x : lm[4].x < lm[3].x;
    const indexUp = lm[8].y < lm[6].y;
    const middleUp = lm[12].y < lm[10].y;
    const ringUp = lm[16].y < lm[14].y;
    const pinkyUp = lm[20].y < lm[18].y;
    return thumbDown && indexUp && middleUp && ringUp && pinkyUp;
  };

  const processResults = (results: Results) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = gestureStateRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw frame reduction boundary
    const frameReduction = 100;
    ctx.strokeStyle = "rgba(0, 255, 255, 0.5)";
    ctx.lineWidth = 2;
    ctx.strokeRect(frameReduction, frameReduction, 640 - 2 * frameReduction, 480 - 2 * frameReduction);

    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      state.grabMode = false;
      state.scrollMode = false;
      state.zoomPrevDist = null;
      onModeChange("Ready");
      onGestureDetected("None");
      drawVirtualCursor(ctx, state.virtualCursorX, state.virtualCursorY);
      return;
    }

    const handCount = results.multiHandLandmarks.length;

    // TWO-HAND GESTURES
    if (handCount === 2) {
      const landmarks = results.multiHandLandmarks;
      const handedness = results.multiHandedness;

      // Draw both hands
      landmarks.forEach((hand) => drawHand(ctx, hand));

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
        const avgX = (pts[0][0] + pts[1][0]) / 2;
        const avgY = (pts[0][1] + pts[1][1]) / 2;
        
        state.virtualCursorX = avgX;
        state.virtualCursorY = avgY;
        state.grabMode = true;
        state.zoomPrevDist = null;

        onGestureDetected("Grab & Drag");
        onModeChange("🖐️ GRAB MODE");

        // Draw grab indicator
        ctx.strokeStyle = "rgba(255, 165, 0, 0.8)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(avgX, avgY, 50, 0, 2 * Math.PI);
        ctx.stroke();
      }
      // ZOOM GESTURE
      else if (zoomStates[0] && zoomStates[1]) {
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

        // Draw zoom indicator
        ctx.strokeStyle = "rgba(0, 255, 255, 1)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.fillStyle = "rgba(0, 255, 255, 0.3)";
        ctx.beginPath();
        ctx.arc((x1 + x2) / 2, (y1 + y2) / 2, currDist / 2, 0, 2 * Math.PI);
        ctx.fill();
      } else {
        state.grabMode = false;
        state.zoomPrevDist = null;
      }
    }
    // SINGLE-HAND GESTURES
    else if (handCount === 1) {
      const hand = results.multiHandLandmarks[0];
      const label = (results.multiHandedness?.[0] as any)?.label || "Right";
      const lm = hand as HandLandmark[];

      drawHand(ctx, hand);

      const indexUp = lm[8].y < lm[6].y;
      const middleUp = lm[12].y < lm[10].y;
      const openPalm = isPalmOpen(lm, label);
      const scrollGesture = isScrollGesture(lm, label);

      // SCROLL MODE
      if (scrollGesture) {
        const currentY = lm[8].y * 480;
        if (!state.scrollMode) {
          state.scrollMode = true;
          state.scrollStartY = currentY;
          onModeChange("⬆️⬇️ SCROLL MODE");
        } else {
          const deltaY = currentY - (state.scrollStartY || currentY);
          if (Math.abs(deltaY) > 10) {
            const direction = deltaY > 0 ? "Scroll Down" : "Scroll Up";
            onGestureDetected(direction);
            state.scrollStartY = currentY;
          }
        }

        // Draw scroll indicator
        ctx.strokeStyle = "rgba(255, 0, 255, 1)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(320, 100);
        ctx.lineTo(320, 380);
        ctx.stroke();
      } else {
        state.scrollMode = false;
        state.scrollStartY = null;

        // CURSOR MODE
        if (indexUp && !middleUp && !openPalm) {
          const xPx = lm[8].x * 640;
          const yPx = lm[8].y * 480;

          // Smooth interpolation
          const smoothing = 7;
          state.virtualCursorX = state.prevX + (xPx - state.prevX) / smoothing;
          state.virtualCursorY = state.prevY + (yPx - state.prevY) / smoothing;
          state.prevX = state.virtualCursorX;
          state.prevY = state.virtualCursorY;

          onGestureDetected("Cursor Move");
          onModeChange("🖱️ CURSOR MODE");
        }
        // LEFT CLICK
        else if (indexUp && middleUp && !openPalm) {
          const x1 = lm[8].x * 640;
          const y1 = lm[8].y * 480;
          const x2 = lm[12].x * 640;
          const y2 = lm[12].y * 480;
          const dist = Math.hypot(x2 - x1, y2 - y1);

          if (dist < 40) {
            onGestureDetected("Left Click");
            onModeChange("👆 CLICK");

            // Draw click indicator
            ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
            ctx.beginPath();
            ctx.arc((x1 + x2) / 2, (y1 + y2) / 2, 30, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
        // RIGHT CLICK
        else if (openPalm) {
          onGestureDetected("Right Click");
          onModeChange("✋ RIGHT CLICK");

          // Draw right click indicator
          const palmX = lm[9].x * 640;
          const palmY = lm[9].y * 480;
          ctx.fillStyle = "rgba(255, 255, 0, 0.4)";
          ctx.beginPath();
          ctx.arc(palmX, palmY, 60, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      state.grabMode = false;
      state.zoomPrevDist = null;
    }

    // Draw virtual cursor
    drawVirtualCursor(ctx, state.virtualCursorX, state.virtualCursorY);
  };

  const drawHand = (ctx: CanvasRenderingContext2D, hand: NormalizedLandmarkList) => {
    const landmarks = hand as HandLandmark[];

    // Draw connections
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4],
      [0, 5], [5, 6], [6, 7], [7, 8],
      [0, 9], [9, 10], [10, 11], [11, 12],
      [0, 13], [13, 14], [14, 15], [15, 16],
      [0, 17], [17, 18], [18, 19], [19, 20],
      [5, 9], [9, 13], [13, 17]
    ];

    ctx.strokeStyle = "rgba(0, 255, 255, 0.6)";
    ctx.lineWidth = 2;
    connections.forEach(([start, end]) => {
      ctx.beginPath();
      ctx.moveTo(landmarks[start].x * 640, landmarks[start].y * 480);
      ctx.lineTo(landmarks[end].x * 640, landmarks[end].y * 480);
      ctx.stroke();
    });

    // Draw landmarks
    landmarks.forEach((lm, i) => {
      ctx.fillStyle = i === 8 || i === 12 || i === 4 ? "rgba(255, 0, 255, 1)" : "rgba(0, 255, 255, 1)";
      ctx.beginPath();
      ctx.arc(lm.x * 640, lm.y * 480, i === 8 ? 8 : 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const drawVirtualCursor = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Cursor crosshair
    ctx.strokeStyle = "rgba(0, 255, 255, 0.9)";
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, 2 * Math.PI);
    ctx.stroke();

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

    // Glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(0, 255, 255, 0.8)";
    ctx.fillStyle = "rgba(0, 255, 255, 0.3)";
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
    />
  );
};

export default GestureCanvas;
