/// <reference lib="webworker" />

import type { Results } from "@mediapipe/hands";

interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

interface GestureResult {
  gesture: string;
  confidence: number;
  metadata: {
    velocity: { x: number; y: number };
    acceleration: { x: number; y: number };
    predicted: { x: number; y: number };
  };
}

let prevState = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  ax: 0,
  ay: 0,
  lastTime: Date.now(),
};

// Anti-false-positive state
let lastGestureTime: { [key: string]: number } = {};
let gestureStartTime: { [key: string]: number } = {};
const COOLDOWN_MS = 2000;
const DWELL_TIME_MS = 300;

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

// Check if hand is in gesture zone (center 60%)
const isInGestureZone = (lm: HandLandmark[]): boolean => {
  const palmCenter = lm[9]; // Middle of palm
  return palmCenter.x > 0.2 && palmCenter.x < 0.8 && palmCenter.y > 0.2 && palmCenter.y < 0.8;
};

// Check if hand is stable
const isHandStable = (lm: HandLandmark[], prevLm: HandLandmark[] | null): boolean => {
  if (!prevLm) return false;
  const palmCenter = lm[9];
  const prevPalmCenter = prevLm[9];
  const movement = Math.sqrt(
    Math.pow((palmCenter.x - prevPalmCenter.x) * 640, 2) + 
    Math.pow((palmCenter.y - prevPalmCenter.y) * 480, 2)
  );
  return movement < 15; // Less than 15 pixels of movement
};

// OLD GESTURES (COMMENTED OUT)
// const isPalmOpen = (lm: HandLandmark[], label: string): boolean => {
//   const thumbOk = label === "Right" ? lm[4].x < lm[3].x : lm[4].x > lm[3].x;
//   const indexUp = isFingerExtended(lm, 8, 6, 5);
//   const middleUp = isFingerExtended(lm, 12, 10, 9);
//   const ringUp = isFingerExtended(lm, 16, 14, 13);
//   const pinkyUp = isFingerExtended(lm, 20, 18, 17);
//   return thumbOk && indexUp && middleUp && ringUp && pinkyUp;
// };

// const isZoomGesture = (lm: HandLandmark[], label: string): boolean => {
//   const thumbUp = label === "Right" ? lm[4].x < lm[3].x : lm[4].x > lm[3].x;
//   const indexUp = isFingerExtended(lm, 8, 6, 5);
//   const middleUp = isFingerExtended(lm, 12, 10, 9);
//   const ringUp = isFingerExtended(lm, 16, 14, 13);
//   const pinkyUp = isFingerExtended(lm, 20, 18, 17);
//   return thumbUp && indexUp && !middleUp && !ringUp && !pinkyUp;
// };

let prevLandmarks: HandLandmark[] | null = null;

const recognizeGesture = (results: Results): GestureResult => {
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    prevLandmarks = null;
    return {
      gesture: "None",
      confidence: 1.0,
      metadata: {
        velocity: { x: 0, y: 0 },
        acceleration: { x: 0, y: 0 },
        predicted: { x: prevState.x, y: prevState.y },
      },
    };
  }

  const now = Date.now();
  const dt = (now - prevState.lastTime) / 1000;

  const hand = results.multiHandLandmarks[0];
  const label = (results.multiHandedness?.[0] as any)?.label || "Right";
  const lm = hand as HandLandmark[];

  // Calculate motion vectors
  const x = lm[8].x * 640;
  const y = lm[8].y * 480;
  const vx = dt > 0 ? (x - prevState.x) / dt : 0;
  const vy = dt > 0 ? (y - prevState.y) / dt : 0;
  const ax = dt > 0 ? (vx - prevState.vx) / dt : 0;
  const ay = dt > 0 ? (vy - prevState.vy) / dt : 0;

  // Predict future position (2 frames ahead)
  const predictedX = x + vx * 0.033 * 2 + ax * 0.033 * 0.033 * 4;
  const predictedY = y + vy * 0.033 * 2 + ay * 0.033 * 0.033 * 4;

  prevState = { x, y, vx, vy, ax, ay, lastTime: now };

  let gesture = "None";
  let confidence = 0.5;

  // Check gesture zone and stability
  const inZone = isInGestureZone(lm);
  const stable = isHandStable(lm, prevLandmarks);
  prevLandmarks = lm;

  if (!inZone) {
    return {
      gesture: "None",
      confidence: 0.5,
      metadata: {
        velocity: { x: vx, y: vy },
        acceleration: { x: ax, y: ay },
        predicted: { x: predictedX, y: predictedY },
      },
    };
  }

  // NEW GESTURE RECOGNITION
  if (isOpenPalm(lm, label)) {
    gesture = "Open Palm";
    confidence = 0.95;
  } else if (isPointGesture(lm)) {
    gesture = "Point";
    confidence = 0.92;
  } else if (isLShapeGesture(lm, label)) {
    gesture = "L-Shape";
    confidence = 0.90;
  } else if (isOKSignGesture(lm)) {
    gesture = "OK Sign";
    confidence = 0.88;
  } else if (isPinchGesture(lm)) {
    gesture = "Pinch";
    confidence = 0.87;
  }

  // Anti-false-positive: Dwell time check
  if (gesture !== "None") {
    if (!gestureStartTime[gesture]) {
      gestureStartTime[gesture] = now;
      gesture = "None"; // Don't trigger yet
      confidence = 0.5;
    } else if (now - gestureStartTime[gesture] < DWELL_TIME_MS) {
      gesture = "None"; // Still dwelling
      confidence = 0.5;
    } else {
      // Check cooldown
      if (lastGestureTime[gesture] && now - lastGestureTime[gesture] < COOLDOWN_MS) {
        gesture = "None"; // In cooldown
        confidence = 0.5;
      } else {
        // Gesture confirmed!
        lastGestureTime[gesture] = now;
        gestureStartTime[gesture] = 0;
      }
    }
  } else {
    // Reset all dwell times when no gesture
    gestureStartTime = {};
  }

  // Require stability for high confidence
  if (!stable && gesture !== "None") {
    confidence *= 0.7; // Reduce confidence if hand not stable
  }

  // Confidence threshold
  if (confidence < 0.85) {
    gesture = "None";
  }

  return {
    gesture,
    confidence,
    metadata: {
      velocity: { x: vx, y: vy },
      acceleration: { x: ax, y: ay },
      predicted: { x: predictedX, y: predictedY },
    },
  };

  // OLD GESTURE LOGIC (COMMENTED OUT)
  // if (results.multiHandLandmarks.length === 2) {
  //   const zoomStates = results.multiHandLandmarks.map((h, i) => {
  //     const l = (results.multiHandedness?.[i] as any)?.label || "Right";
  //     return isZoomGesture(h as HandLandmark[], l);
  //   });
  //   const openStates = results.multiHandLandmarks.map((h, i) => {
  //     const l = (results.multiHandedness?.[i] as any)?.label || "Right";
  //     return isPalmOpen(h as HandLandmark[], l);
  //   });
  //   if (openStates[0] && openStates[1]) {
  //     gesture = "Grab & Drag";
  //     confidence = 0.95;
  //   } else if (zoomStates[0] && zoomStates[1]) {
  //     gesture = "Zoom";
  //     confidence = 0.92;
  //   }
  // } else if (indexUp && !middleUp) {
  //   gesture = "Cursor Move";
  //   confidence = 0.88;
  // } else if (indexUp && middleUp) {
  //   const x1 = lm[8].x * 640;
  //   const y1 = lm[8].y * 480;
  //   const x2 = lm[12].x * 640;
  //   const y2 = lm[12].y * 480;
  //   const dist = Math.hypot(x2 - x1, y2 - y1);
  //   if (dist < 35) {
  //     gesture = "Left Click";
  //     confidence = 0.9;
  //   }
  // } else if (isPalmOpen(lm, label)) {
  //   gesture = "Right Click";
  //   confidence = 0.87;
  // }
};

self.onmessage = async (e) => {
  const { type, data } = e.data;

  if (type === 'recognize') {
    const result = recognizeGesture(data);
    self.postMessage({ type: 'gesture', data: result });
  }
};
