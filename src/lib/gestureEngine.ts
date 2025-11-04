import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

type Landmark = { x: number; y: number; z: number };

export type GestureName =
  | "OPEN_PALM"
  | "POINT"
  | "L_SHAPE"
  | "OK_SIGN"
  | "PINCH"
  | "TWO_FINGERS"
  | "THREE_FINGERS"
  | "THUMB_OUT";

export interface GestureResult {
  gesture: GestureName;
  confidence: number;
  latency: number;
  timestamp: number;
}

const CONFIG = {
  MODEL_ASSET_PATH:
    "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
  NUM_HANDS: 1,
  MIN_DETECTION_CONFIDENCE: 0.7,
  MIN_TRACKING_CONFIDENCE: 0.7,
  CONFIDENCE_THRESHOLD: 0.85,
  DWELL_TIME_MS: 300,
  COOLDOWN_MS: 2000,
  STABILITY_THRESHOLD: 0.05,
  STABILITY_FRAMES: 3,
  ZONE_X_MIN: 0.2,
  ZONE_X_MAX: 0.8,
  ZONE_Y_MIN: 0.2,
  ZONE_Y_MAX: 0.8,
  FINGER_EXTENDED_ANGLE: 160,
  FINGER_BENT_ANGLE: 100,
  PINCH_DISTANCE: 0.05,
  OK_DISTANCE: 0.06,
};

class GestureState {
  lastGestureTimes = new Map<string, number>();
  gestureStartTimes = new Map<string, number>();
  previousHandPosition: { x: number; y: number } | null = null;
  stabilityFrameCount = new Map<string, number>();
  detectionEnabled = true;
  currentGesture: GestureName | null = null;
  gestureConfidence = 0;
  performanceMetrics = {
    detectionCount: 0,
    falsePositives: 0,
    avgLatency: 0,
    latencies: [] as number[],
  };

  reset() {
    this.gestureStartTimes.clear();
    this.stabilityFrameCount.clear();
    this.previousHandPosition = null;
    this.currentGesture = null;
    this.gestureConfidence = 0;
  }

  toggleDetection() {
    this.detectionEnabled = !this.detectionEnabled;
    if (!this.detectionEnabled) this.reset();
    return this.detectionEnabled;
  }

  recordLatency(latency: number) {
    this.performanceMetrics.latencies.push(latency);
    if (this.performanceMetrics.latencies.length > 100) {
      this.performanceMetrics.latencies.shift();
    }
    this.performanceMetrics.avgLatency =
      this.performanceMetrics.latencies.reduce((a, b) => a + b, 0) /
      this.performanceMetrics.latencies.length;
  }
}

const state = new GestureState();

let handLandmarker: HandLandmarker | null = null;
let lastVideoTime = -1;
let lastLandmarks: Landmark[] | null = null;

export async function initialize() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );
  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: CONFIG.MODEL_ASSET_PATH,
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numHands: CONFIG.NUM_HANDS,
    minHandDetectionConfidence: CONFIG.MIN_DETECTION_CONFIDENCE,
    minHandPresenceConfidence: CONFIG.MIN_DETECTION_CONFIDENCE,
    minTrackingConfidence: CONFIG.MIN_TRACKING_CONFIDENCE,
  });
}

function calculateAngle(a: Landmark, b: Landmark, c: Landmark) {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180) / Math.PI);
  if (angle > 180) angle = 360 - angle;
  return angle;
}

function calculateDistance(a: Landmark, b: Landmark) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}

const L = {
  WRIST: 0,
  THUMB_TIP: 4,
  THUMB_MCP: 2,
  INDEX_TIP: 8,
  INDEX_PIP: 6,
  INDEX_MCP: 5,
  MIDDLE_TIP: 12,
  MIDDLE_PIP: 10,
  MIDDLE_MCP: 9,
  RING_TIP: 16,
  RING_PIP: 14,
  RING_MCP: 13,
  PINKY_TIP: 20,
  PINKY_PIP: 18,
  PINKY_MCP: 17,
};

function isFingerExtended(landmarks: Landmark[], fingerTipIdx: number, fingerPipIdx: number, fingerMcpIdx: number, wristIdx: number) {
  const angle = calculateAngle(landmarks[wristIdx], landmarks[fingerMcpIdx], landmarks[fingerTipIdx]);
  return angle > CONFIG.FINGER_EXTENDED_ANGLE;
}

function isFingerBent(landmarks: Landmark[], fingerTipIdx: number, fingerPipIdx: number, fingerMcpIdx: number, wristIdx: number) {
  const angle = calculateAngle(landmarks[wristIdx], landmarks[fingerMcpIdx], landmarks[fingerTipIdx]);
  return angle < CONFIG.FINGER_BENT_ANGLE;
}

function detectOpenPalm(landmarks: Landmark[]) {
  const indexExtended = isFingerExtended(landmarks, L.INDEX_TIP, L.INDEX_PIP, L.INDEX_MCP, L.WRIST);
  const middleExtended = isFingerExtended(landmarks, L.MIDDLE_TIP, L.MIDDLE_PIP, L.MIDDLE_MCP, L.WRIST);
  const ringExtended = isFingerExtended(landmarks, L.RING_TIP, L.RING_PIP, L.RING_MCP, L.WRIST);
  const pinkyExtended = isFingerExtended(landmarks, L.PINKY_TIP, L.PINKY_PIP, L.PINKY_MCP, L.WRIST);
  const thumbExtended = landmarks[L.THUMB_TIP].x < landmarks[L.THUMB_MCP].x + 0.1;
  const fingersSpread = calculateDistance(landmarks[L.INDEX_TIP], landmarks[L.PINKY_TIP]) > 0.15;
  const detected = indexExtended && middleExtended && ringExtended && pinkyExtended && thumbExtended && fingersSpread;
  return { detected, confidence: detected ? 0.98 : 0, name: "OPEN_PALM" as const };
}

function detectPoint(landmarks: Landmark[]) {
  const indexExtended = isFingerExtended(landmarks, L.INDEX_TIP, L.INDEX_PIP, L.INDEX_MCP, L.WRIST);
  const middleBent = isFingerBent(landmarks, L.MIDDLE_TIP, L.MIDDLE_PIP, L.MIDDLE_MCP, L.WRIST);
  const ringBent = isFingerBent(landmarks, L.RING_TIP, L.RING_PIP, L.RING_MCP, L.WRIST);
  const pinkyBent = isFingerBent(landmarks, L.PINKY_TIP, L.PINKY_PIP, L.PINKY_MCP, L.WRIST);
  const thumbTucked = landmarks[L.THUMB_TIP].y > landmarks[L.THUMB_MCP].y;
  const detected = indexExtended && middleBent && ringBent && pinkyBent && thumbTucked;
  return { detected, confidence: detected ? 0.92 : 0, name: "POINT" as const };
}

function detectLShape(landmarks: Landmark[]) {
  const thumbExtended = calculateDistance(landmarks[L.THUMB_TIP], landmarks[L.WRIST]) > 0.15;
  const indexExtended = isFingerExtended(landmarks, L.INDEX_TIP, L.INDEX_PIP, L.INDEX_MCP, L.WRIST);
  const middleBent = isFingerBent(landmarks, L.MIDDLE_TIP, L.MIDDLE_PIP, L.MIDDLE_MCP, L.WRIST);
  const ringBent = isFingerBent(landmarks, L.RING_TIP, L.RING_PIP, L.RING_MCP, L.WRIST);
  const pinkyBent = isFingerBent(landmarks, L.PINKY_TIP, L.PINKY_PIP, L.PINKY_MCP, L.WRIST);
  const thumbIndexAngle = calculateAngle(landmarks[L.THUMB_TIP], landmarks[L.WRIST], landmarks[L.INDEX_TIP]);
  const detected = thumbExtended && indexExtended && middleBent && ringBent && pinkyBent && thumbIndexAngle > 60 && thumbIndexAngle < 120;
  return { detected, confidence: detected ? 0.88 : 0, name: "L_SHAPE" as const };
}

function detectOKSign(landmarks: Landmark[]) {
  const thumbIndexDistance = calculateDistance(landmarks[L.THUMB_TIP], landmarks[L.INDEX_TIP]);
  const touching = thumbIndexDistance < CONFIG.OK_DISTANCE;
  const middleExtended = isFingerExtended(landmarks, L.MIDDLE_TIP, L.MIDDLE_PIP, L.MIDDLE_MCP, L.WRIST);
  const ringExtended = isFingerExtended(landmarks, L.RING_TIP, L.RING_PIP, L.RING_MCP, L.WRIST);
  const pinkyExtended = isFingerExtended(landmarks, L.PINKY_TIP, L.PINKY_PIP, L.PINKY_MCP, L.WRIST);
  const detected = touching && middleExtended && ringExtended && pinkyExtended;
  return { detected, confidence: detected ? 0.87 : 0, name: "OK_SIGN" as const };
}

function detectPinch(landmarks: Landmark[]) {
  const thumbIndexDistance = calculateDistance(landmarks[L.THUMB_TIP], landmarks[L.INDEX_TIP]);
  const pinching = thumbIndexDistance < CONFIG.PINCH_DISTANCE;
  const middleBent = isFingerBent(landmarks, L.MIDDLE_TIP, L.MIDDLE_PIP, L.MIDDLE_MCP, L.WRIST);
  const ringBent = isFingerBent(landmarks, L.RING_TIP, L.RING_PIP, L.RING_MCP, L.WRIST);
  const pinkyBent = isFingerBent(landmarks, L.PINKY_TIP, L.PINKY_PIP, L.PINKY_MCP, L.WRIST);
  const detected = pinching && middleBent && ringBent && pinkyBent;
  return { detected, confidence: detected ? 0.83 : 0, name: "PINCH" as const };
}

function detectTwoFingers(landmarks: Landmark[]) {
  const indexExtended = isFingerExtended(landmarks, L.INDEX_TIP, L.INDEX_PIP, L.INDEX_MCP, L.WRIST);
  const middleExtended = isFingerExtended(landmarks, L.MIDDLE_TIP, L.MIDDLE_PIP, L.MIDDLE_MCP, L.WRIST);
  const ringBent = isFingerBent(landmarks, L.RING_TIP, L.RING_PIP, L.RING_MCP, L.WRIST);
  const pinkyBent = isFingerBent(landmarks, L.PINKY_TIP, L.PINKY_PIP, L.PINKY_MCP, L.WRIST);
  const thumbBent = landmarks[L.THUMB_TIP].y > landmarks[L.THUMB_MCP].y;
  const detected = indexExtended && middleExtended && ringBent && pinkyBent && thumbBent;
  return { detected, confidence: detected ? 0.78 : 0, name: "TWO_FINGERS" as const };
}

function detectThreeFingers(landmarks: Landmark[]) {
  const indexExtended = isFingerExtended(landmarks, L.INDEX_TIP, L.INDEX_PIP, L.INDEX_MCP, L.WRIST);
  const middleExtended = isFingerExtended(landmarks, L.MIDDLE_TIP, L.MIDDLE_PIP, L.MIDDLE_MCP, L.WRIST);
  const ringExtended = isFingerExtended(landmarks, L.RING_TIP, L.RING_PIP, L.RING_MCP, L.WRIST);
  const pinkyBent = isFingerBent(landmarks, L.PINKY_TIP, L.PINKY_PIP, L.PINKY_MCP, L.WRIST);
  const thumbBent = landmarks[L.THUMB_TIP].y > landmarks[L.THUMB_MCP].y;
  const detected = indexExtended && middleExtended && ringExtended && pinkyBent && thumbBent;
  return { detected, confidence: detected ? 0.73 : 0, name: "THREE_FINGERS" as const };
}

function detectThumbOut(landmarks: Landmark[]) {
  const thumbExtended = calculateDistance(landmarks[L.THUMB_TIP], landmarks[L.WRIST]) > 0.18;
  const indexBent = isFingerBent(landmarks, L.INDEX_TIP, L.INDEX_PIP, L.INDEX_MCP, L.WRIST);
  const middleBent = isFingerBent(landmarks, L.MIDDLE_TIP, L.MIDDLE_PIP, L.MIDDLE_MCP, L.WRIST);
  const ringBent = isFingerBent(landmarks, L.RING_TIP, L.RING_PIP, L.RING_MCP, L.WRIST);
  const pinkyBent = isFingerBent(landmarks, L.PINKY_TIP, L.PINKY_PIP, L.PINKY_MCP, L.WRIST);
  const thumbHorizontal = Math.abs(landmarks[L.THUMB_TIP].y - landmarks[L.THUMB_MCP].y) < 0.05;
  const detected = thumbExtended && indexBent && middleBent && ringBent && pinkyBent && thumbHorizontal;
  return { detected, confidence: detected ? 0.75 : 0, name: "THUMB_OUT" as const };
}

function recognizeGesture(landmarks: Landmark[]) {
  const gestures = [
    detectOpenPalm(landmarks),
    detectPoint(landmarks),
    detectLShape(landmarks),
    detectOKSign(landmarks),
    detectPinch(landmarks),
    detectTwoFingers(landmarks),
    detectThreeFingers(landmarks),
    detectThumbOut(landmarks),
  ];
  let best: { name: GestureName; confidence: number } | null = null;
  let max = CONFIG.CONFIDENCE_THRESHOLD;
  for (const g of gestures) {
    if (g.detected && g.confidence > max) {
      best = { name: g.name, confidence: g.confidence };
      max = g.confidence;
    }
  }
  return best;
}

function isInCooldown(gestureName: string) {
  const now = Date.now();
  const lastTime = state.lastGestureTimes.get(gestureName);
  if (!lastTime) {
    state.lastGestureTimes.set(gestureName, now);
    return false;
  }
  if (now - lastTime > CONFIG.COOLDOWN_MS) {
    state.lastGestureTimes.set(gestureName, now);
    return false;
  }
  return true;
}

function checkDwellTime(gestureName: string) {
  const now = Date.now();
  const startTime = state.gestureStartTimes.get(gestureName);
  if (!startTime) {
    state.gestureStartTimes.set(gestureName, now);
    return false;
  }
  const held = now - startTime;
  if (held >= CONFIG.DWELL_TIME_MS) {
    state.gestureStartTimes.delete(gestureName);
    return true;
  }
  return false;
}

function isInActiveZone(landmarks: Landmark[]) {
  const handCenter = {
    x: (landmarks[L.WRIST].x + landmarks[L.MIDDLE_MCP].x) / 2,
    y: (landmarks[L.WRIST].y + landmarks[L.MIDDLE_MCP].y) / 2,
  } as any;
  const inX = handCenter.x > CONFIG.ZONE_X_MIN && handCenter.x < CONFIG.ZONE_X_MAX;
  const inY = handCenter.y > CONFIG.ZONE_Y_MIN && handCenter.y < CONFIG.ZONE_Y_MAX;
  return inX && inY;
}

function isHandStable(landmarks: Landmark[]) {
  const currentCenter = { x: landmarks[L.MIDDLE_MCP as any].x, y: landmarks[L.MIDDLE_MCP as any].y };
  if (!state.previousHandPosition) {
    // Allow the first frame to count as stable so we don't block initial detection
    state.previousHandPosition = currentCenter;
    return true;
  }
  const movement = Math.sqrt(
    (currentCenter.x - state.previousHandPosition.x) ** 2 +
    (currentCenter.y - state.previousHandPosition.y) ** 2
  );
  state.previousHandPosition = currentCenter;
  return movement < CONFIG.STABILITY_THRESHOLD;
}

function checkStabilityFrames(gestureName: string) {
  const current = state.stabilityFrameCount.get(gestureName) || 0;
  state.stabilityFrameCount.set(gestureName, current + 1);
  for (const name of Array.from(state.stabilityFrameCount.keys())) {
    if (name !== gestureName) state.stabilityFrameCount.set(name, 0);
  }
  return (state.stabilityFrameCount.get(gestureName) || 0) >= CONFIG.STABILITY_FRAMES;
}

export async function processFrame(video: HTMLVideoElement, timestamp: number): Promise<GestureResult | null> {
  if (!state.detectionEnabled || !handLandmarker) return null;
  if (timestamp === lastVideoTime) return null;
  lastVideoTime = timestamp;

  const start = performance.now();
  const results = handLandmarker.detectForVideo(video, timestamp);
  if (!results.landmarks || results.landmarks.length === 0) {
    state.reset();
    lastLandmarks = null;
    return null;
  }
  const landmarks = results.landmarks[0] as any as Landmark[];
  lastLandmarks = landmarks;
  if (!isInActiveZone(landmarks)) {
    state.reset();
    return null;
  }
  if (!isHandStable(landmarks)) return null;

  const best = recognizeGesture(landmarks);
  if (!best) {
    state.reset();
    return null;
  }
  if (!checkStabilityFrames(best.name)) return null;
  if (isInCooldown(best.name)) return null;
  if (!checkDwellTime(best.name)) return null;

  state.currentGesture = best.name;
  state.gestureConfidence = best.confidence;
  state.performanceMetrics.detectionCount++;
  const latency = performance.now() - start;
  state.recordLatency(latency);

  return { gesture: best.name, confidence: best.confidence, latency, timestamp };
}

export function toggleDetection() {
  return state.toggleDetection();
}

export function getMetrics() {
  const m = state.performanceMetrics;
  return {
    totalDetections: m.detectionCount,
    falsePositives: m.falsePositives,
    averageLatency: m.avgLatency,
    currentGesture: state.currentGesture,
    gestureConfidence: state.gestureConfidence,
    detectionEnabled: state.detectionEnabled,
  };
}

export function getLastLandmarks() {
  return lastLandmarks;
}

export function reportFalsePositive() {
  state.performanceMetrics.falsePositives++;
}

export const contextModes = {
  current: "NORMAL",
  modes: {
    NORMAL: { confidenceThreshold: 0.85, dwellTime: 300, cooldown: 2000, stabilityThreshold: 0.05 },
    GAMING: { confidenceThreshold: 0.92, dwellTime: 400, cooldown: 3000, stabilityThreshold: 0.03 },
    IRL_STREAMING: { confidenceThreshold: 0.9, dwellTime: 500, cooldown: 4000, stabilityThreshold: 0.04, allowedGestures: ["OPEN_PALM", "OK_SIGN"] },
    JUST_CHATTING: { confidenceThreshold: 0.85, dwellTime: 300, cooldown: 2000, stabilityThreshold: 0.05 },
  } as any,
  setMode(modeName: keyof any) {
    const mode = (this.modes as any)[modeName];
    if (mode) {
      this.current = modeName as any;
      CONFIG.CONFIDENCE_THRESHOLD = mode.confidenceThreshold;
      CONFIG.DWELL_TIME_MS = mode.dwellTime;
      CONFIG.COOLDOWN_MS = mode.cooldown;
      CONFIG.STABILITY_THRESHOLD = mode.stabilityThreshold;
    }
  },
};


