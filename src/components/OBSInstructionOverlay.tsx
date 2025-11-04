import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Hand, 
  Pointer, 
  LayoutGrid, 
  CircleDot, 
  Minimize2,
  CheckCircle2,
  ArrowRight,
  X
} from "lucide-react";

interface Step {
  id: number;
  gesture: string;
  icon: React.ReactNode;
  description: string;
  action: string;
  completed: boolean;
}

interface OBSInstructionOverlayProps {
  currentGesture: string;
  onClose: () => void;
}

const OBSInstructionOverlay = ({ currentGesture, onClose }: OBSInstructionOverlayProps) => {
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      gesture: "Open Palm",
      icon: <Hand className="w-6 h-6" />,
      description: "Show open palm with all fingers extended",
      action: "Start/Stop Recording",
      completed: false,
    },
    {
      id: 2,
      gesture: "Point",
      icon: <Pointer className="w-6 h-6" />,
      description: "Point with index finger, others down",
      action: "Mute/Unmute Microphone",
      completed: false,
    },
    {
      id: 3,
      gesture: "L-Shape",
      icon: <LayoutGrid className="w-6 h-6" />,
      description: "Form L with thumb and index finger",
      action: "Switch to Next Scene",
      completed: false,
    },
    {
      id: 4,
      gesture: "OK Sign",
      icon: <CircleDot className="w-6 h-6" />,
      description: "Form circle with thumb and index, others up",
      action: "Start/Stop Streaming",
      completed: false,
    },
    {
      id: 5,
      gesture: "Pinky",
      icon: <Minimize2 className="w-6 h-6" />,
      description: "Extend only your pinky finger",
      action: "Pause Gesture Detection",
      completed: false,
    },
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (currentGesture === "None" || currentGesture === "") return;

    setSteps(prev => 
      prev.map(step => {
        if (step.gesture === currentGesture && !step.completed) {
          return { ...step, completed: true };
        }
        return step;
      })
    );

    const completedIndex = steps.findIndex(s => s.gesture === currentGesture);
    if (completedIndex !== -1 && completedIndex === currentStepIndex) {
      setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        }
      }, 1500);
    }
  }, [currentGesture]);

  const progress = (steps.filter(s => s.completed).length / steps.length) * 100;
  const currentStep = steps[currentStepIndex];

  return (
    <div className="fixed top-20 right-6 z-50 w-96 animate-slide-in">
      <Card className="clay p-6 border-2 border-primary/30 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="clay p-2 rounded-lg">
              <Hand className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-lg">Gesture Tutorial</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Progress: {steps.filter(s => s.completed).length} / {steps.length}
            </span>
            <span className="text-sm font-semibold text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current Step */}
        <div className={`clay-inset p-4 rounded-xl mb-4 transition-all ${
          currentStep.completed ? 'opacity-50' : 'animate-pulse-glow'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`clay p-3 rounded-lg flex-shrink-0 ${
              currentStep.completed ? 'bg-success/20' : 'bg-primary/20'
            }`}>
              {currentStep.completed ? (
                <CheckCircle2 className="w-6 h-6 text-success" />
              ) : (
                currentStep.icon
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={currentStep.completed ? "default" : "outline"}>
                  Step {currentStep.id}
                </Badge>
                <span className="font-semibold">{currentStep.gesture}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {currentStep.description}
              </p>
              <div className="flex items-center gap-2 text-xs">
                <ArrowRight className="w-3 h-3 text-primary" />
                <span className="font-medium text-primary">{currentStep.action}</span>
              </div>
            </div>
          </div>
        </div>

        {/* All Steps List */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            All Gestures
          </p>
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                index === currentStepIndex 
                  ? 'bg-primary/10 border border-primary/30' 
                  : step.completed
                    ? 'bg-success/5'
                    : 'bg-muted/30'
              }`}
            >
              <div className="flex-shrink-0">
                {step.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  step.completed ? 'line-through text-muted-foreground' : ''
                }`}>
                  {step.gesture}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Completion Message */}
        {progress === 100 && (
          <div className="mt-4 p-4 bg-success/10 border border-success/30 rounded-lg animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <p className="font-semibold text-success">Tutorial Complete!</p>
            </div>
            <p className="text-sm text-muted-foreground">
              You've mastered all gestures. Keep practicing in the simulator!
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default OBSInstructionOverlay;
