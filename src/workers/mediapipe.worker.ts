/// <reference lib="webworker" />

import type { Results } from "@mediapipe/hands";

let hands: any = null;
let isInitialized = false;

const initializeMediaPipe = async () => {
  let attempts = 0;
  while (attempts < 50) {
    const { Hands } = (self as any);
    if (Hands) {
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
            self.postMessage({ type: 'results', data: results });
          }
        });

        isInitialized = true;
        self.postMessage({ type: 'initialized' });
        return;
      } catch (error) {
        self.postMessage({ type: 'error', error: String(error) });
      }
    }
    await new Promise(resolve => setTimeout(resolve, 100));
    attempts++;
  }
  self.postMessage({ type: 'error', error: 'MediaPipe failed to load' });
};

self.onmessage = async (e) => {
  const { type, data } = e.data;

  switch (type) {
    case 'init':
      await initializeMediaPipe();
      break;
    case 'process':
      if (hands && isInitialized && data) {
        await hands.send({ image: data });
      }
      break;
    case 'close':
      if (hands) {
        hands.close();
      }
      isInitialized = false;
      break;
  }
};
