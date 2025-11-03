import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import GestureCanvasAdvanced from "@/components/GestureCanvasAdvanced";
import { Camera, CheckCircle2, ArrowRight, Trophy, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Training = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [detectedGesture, setDetectedGesture] = useState<string>("None");
  const [progress, setProgress] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [gestureStartTime, setGestureStartTime] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const trainingSteps = [
    {
      title: "Open Palm",
      gesture: "Open Palm",
      instruction: "Open your palm completely with all five fingers extended.",
      details: "Spread your fingers wide - Start/Stop Recording",
      icon: "✋",
      requiredDuration: 6000,
      requiredCount: 1,
      type: "duration"
    },
    {
      title: "Point Gesture",
      gesture: "Point",
      instruction: "Point with your index finger. Keep other fingers down.",
      details: "Extend only index finger - Mute/Unmute Microphone",
      icon: "👉",
      requiredDuration: 6000,
      requiredCount: 1,
      type: "duration"
    },
    {
      title: "L-Shape",
      gesture: "L-Shape",
      instruction: "Extend your thumb and index finger to make an L shape.",
      details: "Form clear L with thumb and index - Switch to Next Scene",
      icon: "🔲",
      requiredDuration: 0,
      requiredCount: 3,
      type: "count"
    },
    {
      title: "OK Sign",
      gesture: "OK Sign",
      instruction: "Touch thumb and index tips together to form a circle.",
      details: "Extend other fingers while making circle - Start/Stop Streaming",
      icon: "👌",
      requiredDuration: 0,
      requiredCount: 3,
      type: "count"
    },
    {
      title: "Pinch",
      gesture: "Pinch",
      instruction: "Bring your thumb and index finger close together.",
      details: "Pinch fingers together - Pause Gesture Detection",
      icon: "🤏",
      requiredDuration: 0,
      requiredCount: 3,
      type: "count"
    }
  ];

  const currentTraining = trainingSteps[currentStep];

  useEffect(() => {
    if (detectedGesture === "None") {
      setGestureStartTime(null);
      return;
    }

    const expectedGesture = currentTraining.gesture;
    const matchesGesture = detectedGesture.includes(expectedGesture.split(" ")[0]) || 
                          (expectedGesture === "Grab & Drag" && detectedGesture === "Grab & Drag") ||
                          (expectedGesture === "Zoom" && (detectedGesture === "Zoom In" || detectedGesture === "Zoom Out"));

    if (matchesGesture) {
      if (currentTraining.type === "duration") {
        if (gestureStartTime === null) {
          setGestureStartTime(Date.now());
        } else {
          const elapsed = Date.now() - gestureStartTime;
          const newProgress = Math.min((elapsed / currentTraining.requiredDuration) * 100, 100);
          setProgress(newProgress);

          if (newProgress >= 100 && !showSuccess) {
            handleSuccess();
          }
        }
      } else {
        if (gestureStartTime === null) {
          setGestureStartTime(Date.now());
          setSuccessCount(prev => prev + 1);
          setProgress((successCount + 1) / currentTraining.requiredCount * 100);

          if (successCount + 1 >= currentTraining.requiredCount && !showSuccess) {
            handleSuccess();
          }
        }
      }
    } else {
      if (gestureStartTime !== null) {
        setGestureStartTime(null);
        setProgress(Math.max(0, progress - 10));
      }
    }
  }, [detectedGesture, gestureStartTime, currentTraining, successCount, progress, showSuccess]);

  useEffect(() => {
    if (currentTraining.type === "count" && gestureStartTime !== null) {
      const timeout = setTimeout(() => {
        setGestureStartTime(null);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [gestureStartTime, currentTraining]);

  const handleSuccess = () => {
    setShowSuccess(true);
    toast({
      title: "Perfect! ✨",
      description: `You've mastered the ${currentTraining.title} gesture!`,
    });

    setTimeout(() => {
      setShowSuccess(false);
      if (currentStep < trainingSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
        setProgress(0);
        setSuccessCount(0);
        setGestureStartTime(null);
      } else {
        setAllCompleted(true);
      }
    }, 2000);
  };

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

  const getProgressColor = () => {
    if (progress < 33) return "bg-red-500";
    if (progress < 66) return "bg-orange-500";
    return "bg-green-500";
  };

  if (allCompleted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto section-spacing">
          <Card className="clay clay-glow p-12 text-center">
            <div className="mb-8">
              <Trophy className="w-32 h-32 text-primary mx-auto mb-6" />
              <h1 className="text-5xl font-bold mb-4 text-gradient">Training Complete! 🎉</h1>
              <p className="text-xl text-muted-foreground mb-8">
                You've mastered all gesture controls! Ready to control OBS Studio like a pro.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {trainingSteps.map((step, idx) => (
                <div key={idx} className="clay-inset p-4 rounded-xl">
                  <div className="text-4xl mb-2">{step.icon}</div>
                  <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                </div>
              ))}
            </div>

            <Button onClick={() => navigate("/studio")} size="lg" className="clay clay-hover">
              Go to OBS Simulator
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto section-spacing">
        <Card className="clay p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">
              Gesture <span className="text-gradient">Training</span>
            </h1>
            <Badge className="clay text-lg px-4 py-2">
              {currentStep + 1} / {trainingSteps.length}
            </Badge>
          </div>
          <div className="flex gap-2">
            {trainingSteps.map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 h-2 rounded-full transition-all ${
                  idx < currentStep ? 'bg-green-500' :
                  idx === currentStep ? 'bg-primary' :
                  'bg-muted'
                }`}
              />
            ))}
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="clay clay-glow p-8">
              <div className="text-center mb-6">
                <div className="text-8xl mb-4">{currentTraining.icon}</div>
                <h2 className="text-3xl font-bold mb-2">{currentTraining.title}</h2>
                <Badge variant={showSuccess ? "default" : "secondary"} className="clay text-sm">
                  {showSuccess ? "✓ Success!" : "In Progress"}
                </Badge>
              </div>

              <div className="clay-inset p-4 rounded-xl mb-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Instructions
                </h3>
                <p className="text-sm mb-2">{currentTraining.instruction}</p>
                <p className="text-xs text-muted-foreground">{currentTraining.details}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {currentTraining.type === "duration" 
                      ? "Hold gesture for 6 seconds"
                      : `Perform ${currentTraining.requiredCount} times (${successCount}/${currentTraining.requiredCount})`
                    }
                  </span>
                  <span className={`font-bold ${
                    progress < 33 ? 'text-red-500' :
                    progress < 66 ? 'text-orange-500' :
                    'text-green-500'
                  }`}>
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getProgressColor()}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </Card>

            <Card className="clay p-6">
              <h3 className="font-semibold mb-3">💡 Tips</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Keep your hand within the camera frame</li>
                <li>• Perform gestures slowly and clearly</li>
                <li>• Good lighting improves detection</li>
                <li>• Maintain steady hand position</li>
              </ul>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="clay p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Camera className="w-4 h-4 text-primary" />
                  Practice Area
                </h3>
                {!isActive ? (
                  <Button onClick={startCamera} className="clay clay-hover">
                    Start Camera
                  </Button>
                ) : (
                  <Button onClick={stopCamera} variant="destructive">
                    Stop Camera
                  </Button>
                )}
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
                    onGestureDetected={setDetectedGesture}
                    onModeChange={() => {}}
                  />
                )}
                {!isActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-muted-foreground">Start camera to begin training</p>
                  </div>
                )}
                
                {isActive && detectedGesture !== "None" && (
                  <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-lg">
                    <p className="text-sm font-medium">{detectedGesture}</p>
                  </div>
                )}

                {showSuccess && (
                  <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center animate-fade-in">
                    <div className="clay-glow bg-background p-8 rounded-2xl">
                      <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-4" />
                      <p className="text-2xl font-bold text-center">Perfect!</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card className="clay p-4">
              <h3 className="font-semibold mb-3">All Gestures</h3>
              <div className="space-y-2">
                {trainingSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`clay-inset p-3 rounded-lg flex items-center justify-between transition-all ${
                      idx === currentStep ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{step.icon}</span>
                      <span className="font-medium text-sm">{step.title}</span>
                    </div>
                    {idx < currentStep ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : idx === currentStep ? (
                      <Badge variant="default" className="clay">Active</Badge>
                    ) : null}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Training;
