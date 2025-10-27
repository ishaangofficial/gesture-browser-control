export class KalmanFilter {
  private x: number; // state
  private p: number; // error covariance
  private q: number; // process noise
  private r: number; // measurement noise
  private k: number; // kalman gain

  constructor(
    initialValue: number = 0,
    processNoise: number = 0.1,
    measurementNoise: number = 0.8
  ) {
    this.x = initialValue;
    this.p = 1;
    this.q = processNoise;
    this.r = measurementNoise;
    this.k = 0;
  }

  filter(measurement: number, speed: number = 0): number {
    // Adaptive noise based on speed
    const adaptiveR = speed > 500 ? this.r * 0.5 : speed < 50 ? this.r * 1.5 : this.r;

    // Prediction
    this.p = this.p + this.q;

    // Update
    this.k = this.p / (this.p + adaptiveR);
    this.x = this.x + this.k * (measurement - this.x);
    this.p = (1 - this.k) * this.p;

    return this.x;
  }

  reset(value: number = 0): void {
    this.x = value;
    this.p = 1;
    this.k = 0;
  }
}

export class MultiAxisKalman {
  private xFilter: KalmanFilter;
  private yFilter: KalmanFilter;
  private zFilter: KalmanFilter;
  private vxFilter: KalmanFilter;
  private vyFilter: KalmanFilter;

  constructor() {
    this.xFilter = new KalmanFilter(0, 0.1, 0.8);
    this.yFilter = new KalmanFilter(0, 0.1, 0.8);
    this.zFilter = new KalmanFilter(0, 0.1, 0.8);
    this.vxFilter = new KalmanFilter(0, 0.05, 0.6);
    this.vyFilter = new KalmanFilter(0, 0.05, 0.6);
  }

  filter(x: number, y: number, z: number, vx: number = 0, vy: number = 0): {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
  } {
    const speed = Math.sqrt(vx * vx + vy * vy);

    return {
      x: this.xFilter.filter(x, speed),
      y: this.yFilter.filter(y, speed),
      z: this.zFilter.filter(z, speed),
      vx: this.vxFilter.filter(vx, speed),
      vy: this.vyFilter.filter(vy, speed),
    };
  }

  reset(): void {
    this.xFilter.reset();
    this.yFilter.reset();
    this.zFilter.reset();
    this.vxFilter.reset();
    this.vyFilter.reset();
  }
}
