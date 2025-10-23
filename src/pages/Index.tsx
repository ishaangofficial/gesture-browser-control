import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import OnboardingTour from "@/components/OnboardingTour";
import { 
  Hand, 
  Sparkles,
  BarChart3,
  Settings,
  Library,
  Download,
  Zap,
  Shield,
  Laptop,
  Play,
  LogOut
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem("onboarding_completed");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    if (!isLoggedIn) {
      navigate("/login");
    } else if (!onboardingCompleted) {
      setShowOnboarding(true);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {showOnboarding && <OnboardingTour onComplete={() => setShowOnboarding(false)} />}
      
      {/* Navigation */}
      <nav className="glass border-b border-border/50 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 glow animate-pulse-glow">
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
            <Button variant="ghost" size="sm" className="gap-2" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-12">
        {/* Hero */}
        <div className="text-center space-y-6 py-12">
          <div className="flex justify-center">
            <div className="p-6 bg-primary/10 rounded-3xl animate-float">
              <Hand className="w-20 h-20 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gradient">
            Control Your PC
            <br />
            With Hand Gestures
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            No mouse, no keyboard. Just your hands. Experience the future of computer control.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link to="/studio">
              <Button size="lg" className="gap-2">
                <Play className="w-5 h-5" />
                Try OBS Simulator
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="gap-2">
              <Download className="w-5 h-5" />
              Download Desktop App
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="glass border-primary/20 p-6 hover:scale-105 transition-transform">
            <Zap className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground">Real-time gesture detection with minimal latency</p>
          </Card>
          <Card className="glass border-primary/20 p-6 hover:scale-105 transition-transform">
            <Shield className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">100% Private</h3>
            <p className="text-muted-foreground">All processing happens locally on your device</p>
          </Card>
          <Card className="glass border-primary/20 p-6 hover:scale-105 transition-transform">
            <Laptop className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">OBS Integration</h3>
            <p className="text-muted-foreground">Control OBS Studio seamlessly while streaming</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
