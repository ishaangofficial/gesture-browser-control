import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OBSSimulatorRealistic from "@/components/OBSSimulatorRealistic";
import GestureCanvasAdvanced from "@/components/GestureCanvasAdvanced";
import { PerformanceDashboard } from "@/components/PerformanceDashboard";
import Navbar from "@/components/Navbar";
import { Camera, Hand, Play, Square, Activity, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Studio = () => {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<string>("None");
  const [gestureMode, setGestureMode] = useState<string>("Ready");
  const [cursorX, setCursorX] = useState(0);
  const [cursorY, setCursorY] = useState(0);
  const [isClicking, setIsClicking] = useState(false);
  const [isRightClicking, setIsRightClicking] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    latency: 0,
    fps: 60,
    confidence: 0,
    predictionAccuracy: 90,
    gesture: "None",
    status: "ready" as "ready" | "processing" | "error",
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorX(e.clientX);
      setCursorY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
        toast({
          title: "Gesture control activated! 🚀",
          description: "Your camera is ready. Start making gestures to control OBS!",
        });
      }
    } catch (error) {
      console.error("Camera access denied:", error);
      toast({
        title: "Camera access required",
        description: "Please allow camera access to use gesture control.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsActive(false);
      toast({
        title: "Session ended",
        description: "Gesture control deactivated.",
      });
    }
  };

  const handleGestureDetected = (gesture: string) => {
    setCurrentGesture(gesture);
    setPerformanceMetrics(prev => ({ ...prev, gesture, status: "processing" }));
    
    if (gesture.includes("Click")) {
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 200);
    }
    
    if (gesture === "Right Click") {
      setIsRightClicking(true);
      setTimeout(() => setIsRightClicking(false), 200);
    }

    setTimeout(() => {
      setPerformanceMetrics(prev => ({ ...prev, status: "ready" }));
    }, 100);
  };

  const handleCursorMove = (x: number, y: number) => {
    setCursorX(x);
    setCursorY(y);
  };

  const handlePerformanceUpdate = (metrics: {
    latency: number;
    fps: number;
    confidence: number;
    predictionAccuracy: number;
  }) => {
    setPerformanceMetrics(prev => ({
      ...prev,
      ...metrics,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-[1920px] mx-auto section-spacing">
        {/* Header */}
        <Card className="clay p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">OBS Studio Simulator</h2>
              <p className="text-muted-foreground">
                Test gesture control with a realistic OBS interface simulation
              </p>
            </div>
            <div className="flex items-center gap-3">
              {!isActive ? (
                <Button onClick={startCamera} size="lg" className="gap-2">
                  <Play className="w-4 h-4" />
                  Start Camera
                </Button>
              ) : (
                <Button onClick={stopCamera} size="lg" variant="destructive" className="gap-2">
                  <Square className="w-4 h-4" />
                  Stop Camera
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Main content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* OBS Simulator - Takes 2/3 width */}
          <div className="xl:col-span-2 space-y-4">
            <Card className="clay p-0 overflow-hidden">
              <div className="aspect-video">
                <OBSSimulatorRealistic
                  cursorX={cursorX}
                  cursorY={cursorY}
                  isClicking={isClicking}
                  gesture={currentGesture}
                />
              </div>
            </Card>

            {/* Info */}
            <Card className="clay p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-semibold">How to control OBS</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• ✋ <strong>Open Palm:</strong> Start/Stop Recording</li>
                    <li>• 👉 <strong>Point:</strong> Mute/Unmute Microphone</li>
                    <li>• 🔲 <strong>L-Shape:</strong> Switch to Next Scene</li>
                    <li>• 👌 <strong>OK Sign:</strong> Start/Stop Streaming</li>
                    <li>• 🤏 <strong>Pinch:</strong> Pause Gesture Detection</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Camera feed + Stats */}
          <div className="space-y-4">
            {/* Camera feed */}
            <Card className="clay p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Camera className="w-4 h-4 text-primary" />
                    Camera Feed
                  </h3>
                  <Badge variant={isActive ? "default" : "secondary"} className="clay">
                    {isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
                  {isActive && (
                    <GestureCanvasAdvanced
                      videoRef={videoRef}
                      onGestureDetected={handleGestureDetected}
                      onModeChange={setGestureMode}
                      onCursorMove={handleCursorMove}
                      onPerformanceUpdate={handlePerformanceUpdate}
                    />
                  )}
                  {!isActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-muted-foreground text-sm">Camera inactive</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Stats */}
            <Card className="clay p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Live Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Mode</span>
                  <Badge variant="outline" className="clay">{gestureMode}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Gesture</span>
                  <span className="text-sm font-medium">{currentGesture}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cursor</span>
                  <span className="text-xs font-mono">
                    X: {Math.round(cursorX)} Y: {Math.round(cursorY)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Performance Dashboard */}
            {isActive && <PerformanceDashboard metrics={performanceMetrics} />}

            {/* Quick gestures */}
            <Card className="clay p-4">
              <h3 className="font-semibold mb-3 text-sm">Quick Gestures</h3>
              <div className="space-y-2 text-xs">
                <div className="clay-inset p-3 flex items-center justify-between rounded-lg">
                  <span className="text-muted-foreground">✋ Open Palm</span>
                  <span>Record</span>
                </div>
                <div className="clay-inset p-3 flex items-center justify-between rounded-lg">
                  <span className="text-muted-foreground">👉 Point</span>
                  <span>Mute Mic</span>
                </div>
                <div className="clay-inset p-3 flex items-center justify-between rounded-lg">
                  <span className="text-muted-foreground">🔲 L-Shape</span>
                  <span>Next Scene</span>
                </div>
                <div className="clay-inset p-3 flex items-center justify-between rounded-lg">
                  <span className="text-muted-foreground">👌 OK Sign</span>
                  <span>Stream</span>
                </div>
                <div className="clay-inset p-3 flex items-center justify-between rounded-lg">
                  <span className="text-muted-foreground">🤏 Pinch</span>
                  <span>Pause</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio;