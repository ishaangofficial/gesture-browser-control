import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import GestureCanvas from "@/components/GestureCanvas";
import { Camera, Hand, CheckCircle2, Circle, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Training = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isActive, setIsActive] = useState(false);
  const [detectedGesture, setDetectedGesture] = useState<string>("None");
  const videoRef = useRef<HTMLVideoElement>(null);

  const trainingSteps = [
    {
      title: "Cursor Movement",
      gesture: "Cursor Move",
      instruction: "Point with your index finger. Keep other fingers down. Move your hand to control the cursor.",
      icon: "👆",
      tips: "Keep your hand steady and move slowly for better control"
    },
    {
      title: "Left Click",
      gesture: "Left Click",
      instruction: "Extend index and middle fingers. Pinch them together to click.",
      icon: "🤏",
      tips: "Make sure your fingers are close together (less than 40px)"
    },
    {
      title: "Right Click",
      gesture: "Right Click",
      instruction: "Open your palm completely. All five fingers extended.",
      icon: "✋",
      tips: "Spread your fingers wide apart for better detection"
    },
    {
      title: "Scroll",
      gesture: "Scroll",
      instruction: "Thumb down, all other fingers up. Move hand up/down to scroll.",
      icon: "📜",
      tips: "Keep the thumb pointing down and move vertically"
    },
    {
      title: "Grab & Drag",
      gesture: "Grab & Drag",
      instruction: "Open both palms simultaneously. This enters grab mode for dragging.",
      icon: "🙌",
      tips: "Both hands must be visible with all fingers extended"
    },
    {
      title: "Zoom",
      gesture: "Zoom",
      instruction: "Make 'L' shape with both hands (thumb + index). Move hands apart to zoom in, together to zoom out.",
      icon: "🔍",
      tips: "Keep the L-shape consistent while moving your hands"
    }
  ];

  useEffect(() => {
    if (detectedGesture !== "None" && detectedGesture !== "Cursor Move") {
      const expectedGesture = trainingSteps[currentStep].gesture;
      
      if (detectedGesture.includes(expectedGesture.split(" ")[0])) {
        if (!completedSteps.has(currentStep)) {
          setCompletedSteps(new Set([...completedSteps, currentStep]));
          toast({
            title: "Perfect! ✨",
            description: `You've mastered the ${trainingSteps[currentStep].title} gesture!`,
          });
        }
      }
    }
  }, [detectedGesture, currentStep, completedSteps, toast]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
        toast({
          title: "Camera activated! 📹",
          description: "Follow the instructions to practice each gesture.",
        });
      }
    } catch (error) {
      console.error("Camera access denied:", error);
      toast({
        title: "Camera access required",
        description: "Please allow camera access to practice gestures.",
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
    }
  };

  const currentTraining = trainingSteps[currentStep];
  const progress = (completedSteps.size / trainingSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />

      <div className="max-w-[1400px] mx-auto p-6 space-y-6">
        {/* Header */}
        <Card className="glass border-primary/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">Gesture Training</h1>
              <p className="text-muted-foreground">Master each gesture step by step</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gradient">{completedSteps.size}/{trainingSteps.length}</div>
              <p className="text-sm text-muted-foreground">Gestures Mastered</p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-6">
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Training Steps */}
          <div className="lg:col-span-1 space-y-3">
            <Card className="glass border-primary/20 p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Hand className="w-4 h-4 text-primary" />
                Training Steps
              </h3>
              <div className="space-y-2">
                {trainingSteps.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      currentStep === idx
                        ? 'bg-primary/20 border-2 border-primary'
                        : 'bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{step.icon}</span>
                        <div>
                          <div className="font-medium text-sm">{step.title}</div>
                          <div className="text-xs text-muted-foreground">{step.gesture}</div>
                        </div>
                      </div>
                      {completedSteps.has(idx) ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Training Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Step */}
            <Card className="glass border-primary/20 p-8">
              <div className="text-center space-y-4">
                <div className="text-6xl">{currentTraining.icon}</div>
                <h2 className="text-3xl font-bold">{currentTraining.title}</h2>
                <Badge variant={completedSteps.has(currentStep) ? "default" : "secondary"} className="text-sm">
                  {completedSteps.has(currentStep) ? "✓ Completed" : "In Progress"}
                </Badge>
                <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                  {currentTraining.instruction}
                </p>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-primary">
                    💡 <strong>Tip:</strong> {currentTraining.tips}
                  </p>
                </div>
              </div>
            </Card>

            {/* Camera Feed */}
            <Card className="glass border-primary/20 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Camera className="w-4 h-4 text-primary" />
                  Practice Area
                </h3>
                {!isActive ? (
                  <Button onClick={startCamera} size="sm">Start Camera</Button>
                ) : (
                  <Button onClick={stopCamera} size="sm" variant="destructive">Stop Camera</Button>
                )}
              </div>
              
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
                    onGestureDetected={setDetectedGesture}
                    onModeChange={() => {}}
                  />
                )}
                {!isActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-muted-foreground">Start camera to begin training</p>
                  </div>
                )}
                
                {/* Detected Gesture Indicator */}
                {isActive && detectedGesture !== "None" && (
                  <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-lg">
                    <p className="text-sm font-medium">Detected: {detectedGesture}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              <div className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {trainingSteps.length}
              </div>
              <Button
                onClick={() => setCurrentStep(Math.min(trainingSteps.length - 1, currentStep + 1))}
                disabled={currentStep === trainingSteps.length - 1}
                className="gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Training;
