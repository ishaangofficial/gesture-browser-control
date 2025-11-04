import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ChevronRight, Hand, SkipForward, CheckCircle2, ArrowRight } from "lucide-react";

interface GestureStep {
  id: number;
  gesture: string;
  icon: string;
  title: string;
  description: string;
  action: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
}

const gestureSteps: GestureStep[] = [
  {
    id: 1,
    gesture: "Open Palm",
    icon: "✋",
    title: "Open Palm",
    description: "Show your open palm with all fingers extended",
    action: "Start/Stop Recording",
    position: "top-left"
  },
  {
    id: 2,
    gesture: "Point",
    icon: "👉",
    title: "Point Gesture",
    description: "Extend only your index finger",
    action: "Mute/Unmute Microphone",
    position: "top-right"
  },
  {
    id: 3,
    gesture: "L-Shape",
    icon: "🔲",
    title: "L-Shape",
    description: "Form an L with your thumb and index finger",
    action: "Switch to Next Scene",
    position: "bottom-left"
  },
  {
    id: 4,
    gesture: "OK Sign",
    icon: "👌",
    title: "OK Sign",
    description: "Touch thumb and index tips together, others up",
    action: "Start/Stop Streaming",
    position: "bottom-right"
  },
];

interface OBSOnboardingProps {
  isActive: boolean;
  currentGesture: string;
  onComplete: () => void;
  onSkip: () => void;
}

const OBSOnboarding = ({ isActive, currentGesture, onComplete, onSkip }: OBSOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedGestures, setCompletedGestures] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(true);
  const [actionPerformed, setActionPerformed] = useState<string>("");

  useEffect(() => {
    if (!isActive) {
      setIsVisible(false);
      return;
    }

    // Check if current gesture matches the step we're on
    if (currentStep < gestureSteps.length) {
      const step = gestureSteps[currentStep];
      if (currentGesture === step.gesture && currentGesture !== "None") {
        // Mark as completed and show what action was performed
        setCompletedGestures(prev => new Set([...prev, step.gesture]));
        setActionPerformed(step.action);
      }
    }
  }, [currentGesture, currentStep, isActive]);

  if (!isVisible || !isActive || currentStep >= gestureSteps.length) {
    return null;
  }

  const step = gestureSteps[currentStep];
  const isCompleted = completedGestures.has(step.gesture);
  const progress = ((currentStep + 1) / gestureSteps.length) * 100;

  const getPositionClasses = (position: string) => {
    switch (position) {
      case "top-left":
        return "top-4 left-4";
      case "top-right":
        return "top-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      case "center":
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
      default:
        return "top-4 right-4";
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none animate-in fade-in duration-300">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto" />
      
      {/* Floating Popup */}
      <div
        className={`absolute ${getPositionClasses(step.position)} pointer-events-auto animate-in zoom-in-95 fade-in duration-500`}
      >
          <Card className="clay clay-glow p-6 w-80 shadow-2xl">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="clay text-xs">
                  Step {currentStep + 1} of {gestureSteps.length}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSkip}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  style={{ width: `${progress}%` }}
                  className="h-full bg-primary rounded-full transition-all duration-300"
                />
              </div>
            </div>

            {/* Gesture Icon */}
            <div className="text-center mb-4 relative">
              <div className="relative inline-block">
                <div className={`text-6xl mb-2 transition-transform duration-500 ${isCompleted ? 'scale-110' : ''}`}>
                  {step.icon}
                </div>
                {isCompleted && (
                  <div className="absolute -top-2 -right-2 animate-in zoom-in duration-300">
                    <CheckCircle2 className="w-8 h-8 text-green-500 bg-background rounded-full" />
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="text-center space-y-2 mb-4">
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              <div className="clay-inset p-3 rounded-lg mt-3">
                <p className="text-xs font-medium text-primary flex items-center justify-center gap-2">
                  <Hand className="w-4 h-4" />
                  {step.action}
                </p>
              </div>
            </div>

            {/* Status */}
            {isCompleted ? (
              <div className="text-center animate-in slide-in-from-bottom-2 fade-in duration-300 space-y-3">
                <div className="clay-inset p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-sm font-medium text-green-500 mb-2">
                    ✓ Gesture detected!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Action performed: <span className="font-semibold text-foreground">{actionPerformed}</span>
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setActionPerformed("");
                    if (currentStep < gestureSteps.length - 1) {
                      setCurrentStep(prev => prev + 1);
                    } else {
                      onComplete();
                    }
                  }}
                  className="w-full"
                  size="lg"
                >
                  Next Gesture <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <p className="text-xs text-muted-foreground">
                  Try making this gesture now
                </p>
                <Button
                  onClick={() => {
                    if (currentStep < gestureSteps.length - 1) {
                      setCurrentStep(prev => prev + 1);
                    } else {
                      onComplete();
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Skip <SkipForward className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Navigation - Previous button */}
            {currentStep > 0 && !isCompleted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setActionPerformed("");
                  setCurrentStep(prev => prev - 1);
                }}
                className="absolute left-4 bottom-4"
              >
                Previous
              </Button>
            )}
          </Card>
        </div>
      </div>
  );
};

export default OBSOnboarding;

