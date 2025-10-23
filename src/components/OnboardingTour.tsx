import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ArrowRight, Hand, Video, Sparkles, Download } from "lucide-react";

interface OnboardingTourProps {
  onComplete: () => void;
}

const OnboardingTour = ({ onComplete }: OnboardingTourProps) => {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    {
      title: "Welcome to SparshMukhti! 👋",
      description: "Control your computer using just hand gestures. No mouse, no keyboard - pure magic!",
      icon: <Hand className="w-12 h-12 text-primary" />,
      position: "center"
    },
    {
      title: "Try Gestures in Browser 🎮",
      description: "Test all gestures right here in your browser with our OBS Studio simulator. See real-time control!",
      icon: <Video className="w-12 h-12 text-primary" />,
      position: "center"
    },
    {
      title: "Learn Gestures Quickly 🚀",
      description: "Point to move cursor, pinch to click, open palm for right click, and much more!",
      icon: <Sparkles className="w-12 h-12 text-primary" />,
      position: "center"
    },
    {
      title: "Get the Desktop App 💻",
      description: "For system-wide control, download our desktop application. Control everything - OBS, games, presentations!",
      icon: <Download className="w-12 h-12 text-primary" />,
      position: "center"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
      localStorage.setItem("onboarding_completed", "true");
    }, 300);
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isVisible) return null;

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="max-w-lg w-full glass border-primary/20 p-8 relative animate-scale-in">
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-2xl animate-pulse-glow">
              {currentStep.icon}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gradient">{currentStep.title}</h2>
            <p className="text-muted-foreground">{currentStep.description}</p>
          </div>

          <div className="flex items-center justify-center gap-2 py-4">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === step ? 'w-8 bg-primary' : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {step > 0 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="flex-1 gap-2"
            >
              {step === steps.length - 1 ? "Get Started" : "Next"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <button
            onClick={handleSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip tour
          </button>
        </div>
      </Card>
    </div>
  );
};

export default OnboardingTour;