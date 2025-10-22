import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GestureCanvas from "@/components/GestureCanvas";
import { 
  Camera, 
  Hand, 
  MousePointer2, 
  Play,
  Square,
  Activity,
  Sparkles,
  BarChart3,
  Settings,
  Library
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<string>("");
  const [gestureMode, setGestureMode] = useState<string>("");
  const [sessionTime, setSessionTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
        setSessionTime(0);
        toast({
          title: "Camera activated",
          description: "Gesture control is now active. Start making gestures!",
        });
      }
    } catch (error) {
      console.error("Camera access denied:", error);
      toast({
        title: "Camera access denied",
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
        description: `Session duration: ${Math.floor(sessionTime / 60)}m ${sessionTime % 60}s`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="glass border-b border-border/50 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 glow">
              <Hand className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gradient">SparshMukhti</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/library">
              <Button variant="ghost" size="sm" className="gap-2">
                <Library className="w-4 h-4" />
                Library
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="ghost" size="sm" className="gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8 animate-fade-in">
          <Badge className="mb-2 glass border-primary/30 text-primary px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Next-Gen Gesture Control
          </Badge>
          <h2 className="text-5xl font-bold text-gradient leading-tight">
            Control Your Browser<br />With Hand Gestures
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced AI-powered hand tracking for seamless browser control. No hardware required.
          </p>
          <div className="flex gap-3 justify-center flex-wrap pt-4">
            <Badge variant="outline" className="glass border-primary/30 text-primary px-3 py-2">
              <MousePointer2 className="w-4 h-4 mr-2" />
              Virtual Mouse
            </Badge>
            <Badge variant="outline" className="glass border-accent/30 text-accent px-3 py-2">
              <Activity className="w-4 h-4 mr-2" />
              Real-time Tracking
            </Badge>
            <Badge variant="outline" className="glass border-success/30 text-success px-3 py-2">
              <Camera className="w-4 h-4 mr-2" />
              Browser-Based
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Feed - Takes 2 columns */}
          <Card className="lg:col-span-2 glass border-border/50 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Camera className="w-6 h-6 text-primary" />
                    Live Camera Feed
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isActive ? "Gesture detection active" : "Start camera to begin"}
                  </p>
                </div>
                {isActive ? (
                  <Button onClick={stopCamera} variant="destructive" size="lg" className="gap-2">
                    <Square className="w-4 h-4" />
                    Stop
                  </Button>
                ) : (
                  <Button onClick={startCamera} className="gap-2 glow" size="lg">
                    <Play className="w-4 h-4" />
                    Start Session
                  </Button>
                )}
              </div>

              {/* Video Container */}
              <div className="relative bg-black rounded-xl overflow-hidden aspect-video border-2 border-primary/20 shadow-2xl">
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
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted/50 to-background/50 backdrop-blur-sm">
                    <div className="text-center space-y-4 p-8">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse-glow" />
                        <Camera className="w-20 h-20 mx-auto text-primary relative animate-float" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold mb-2">Ready to Start</p>
                        <p className="text-sm text-muted-foreground">Click the button above to begin gesture control</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Bar */}
              {isActive && (
                <div className="grid grid-cols-3 gap-4">
                  <Card className="glass p-4 border-border/50">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Gesture</p>
                    <p className="text-lg font-bold text-primary">
                      {currentGesture || "None"}
                    </p>
                  </Card>
                  <Card className="glass p-4 border-border/50">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Mode</p>
                    <p className="text-lg font-bold text-accent">
                      {gestureMode || "Ready"}
                    </p>
                  </Card>
                  <Card className="glass p-4 border-border/50">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-success rounded-full animate-pulse glow" />
                      <p className="text-lg font-bold text-success">Live</p>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Info Sidebar */}
          <div className="space-y-4">
            {/* Quick Stats */}
            <Card className="glass p-6 border-border/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Session Info
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Gestures Detected</span>
                  <Badge variant="outline">24</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Accuracy</span>
                  <Badge className="bg-success/20 text-success border-success/30">96%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Session Time</span>
                  <Badge variant="outline">{Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, '0')}</Badge>
                </div>
              </div>
            </Card>

            {/* Available Gestures */}
            <Card className="glass p-6 border-border/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Hand className="w-5 h-5 text-primary" />
                Quick Guide
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="text-2xl">☝️</div>
                  <div>
                    <p className="font-medium">Cursor</p>
                    <p className="text-xs text-muted-foreground">Index finger up</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="text-2xl">👆</div>
                  <div>
                    <p className="font-medium">Click</p>
                    <p className="text-xs text-muted-foreground">Pinch fingers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="text-2xl">🖐️</div>
                  <div>
                    <p className="font-medium">Right Click</p>
                    <p className="text-xs text-muted-foreground">Open palm</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="text-2xl">🔍</div>
                  <div>
                    <p className="font-medium">Zoom</p>
                    <p className="text-xs text-muted-foreground">Two hands pinch</p>
                  </div>
                </div>
              </div>
              <Link to="/library">
                <Button variant="outline" className="w-full mt-4" size="sm">
                  View All Gestures
                </Button>
              </Link>
            </Card>

            {/* Browser Limitation Notice */}
            <Card className="glass p-6 border-warning/30 bg-warning/5">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-warning">
                <Sparkles className="w-4 h-4" />
                Browser Mode
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This works within your browser tab. For system-wide control, a desktop app or browser extension is needed.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
