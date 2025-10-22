import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GestureCanvas from "@/components/GestureCanvas";
import GestureInfo from "@/components/GestureInfo";
import { Camera, Hand, MousePointer2 } from "lucide-react";

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<string>("");
  const [gestureMode, setGestureMode] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
      }
    } catch (error) {
      console.error("Camera access denied:", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsActive(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="text-center space-y-3 animate-in fade-in slide-in-from-top duration-700">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Hand className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
              SparshMukhti
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Advanced Touchless Gesture Control System
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Badge variant="outline" className="border-primary text-primary">
              <MousePointer2 className="w-3 h-3 mr-1" />
              Virtual Mouse
            </Badge>
            <Badge variant="outline" className="border-primary text-primary">
              <Camera className="w-3 h-3 mr-1" />
              Real-time Detection
            </Badge>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Feed - Takes 2 columns */}
          <Card className="lg:col-span-2 p-6 bg-card border-border shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Camera className="w-6 h-6 text-primary" />
                  Camera Feed
                </h2>
                {isActive ? (
                  <Button onClick={stopCamera} variant="destructive" size="sm">
                    Stop Camera
                  </Button>
                ) : (
                  <Button onClick={startCamera} className="bg-primary hover:bg-primary/90" size="sm">
                    Start Camera
                  </Button>
                )}
              </div>

              {/* Video Container */}
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {isActive && (
                  <GestureCanvas
                    videoRef={videoRef}
                    onGestureDetected={setCurrentGesture}
                    onModeChange={setGestureMode}
                  />
                )}
                {!isActive && (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <div className="text-center space-y-2">
                      <Camera className="w-16 h-16 mx-auto opacity-50" />
                      <p>Click "Start Camera" to begin</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Bar */}
              {isActive && (
                <div className="flex gap-4 p-4 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Current Gesture</p>
                    <p className="text-lg font-semibold text-foreground">
                      {currentGesture || "None"}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Mode</p>
                    <p className="text-lg font-semibold text-primary">
                      {gestureMode || "Ready"}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                      <p className="text-lg font-semibold text-success">Active</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Gesture Info - Takes 1 column */}
          <div className="space-y-6">
            <GestureInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
