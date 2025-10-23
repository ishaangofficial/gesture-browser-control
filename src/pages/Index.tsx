import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import OnboardingTour from "@/components/OnboardingTour";
import Navbar from "@/components/Navbar";
import { 
  Hand, 
  Sparkles,
  Download,
  Zap,
  Shield,
  Laptop,
  Play,
  Video,
  GraduationCap,
  Github,
  Star,
  Users,
  TrendingUp
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
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

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    navigate("/training");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {showOnboarding && <OnboardingTour onComplete={handleOnboardingComplete} />}
      
      <Navbar />

      <div className="max-w-[1400px] mx-auto p-6 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-8 py-20">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse-glow" />
              <div className="relative p-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl glass border-2 border-primary/30 animate-float">
                <Hand className="w-24 h-24 text-primary" />
              </div>
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold text-gradient leading-tight">
            Control OBS Studio
            <br />
            With Hand Gestures
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Revolutionary gesture control for streamers. No mouse, no keyboard—just your hands.
            <br />
            <span className="text-primary font-semibold">Built specifically for OBS Studio.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link to="/studio">
              <Button size="lg" className="gap-2 text-lg px-8 py-6 glow">
                <Play className="w-5 h-5" />
                Try OBS Simulator
              </Button>
            </Link>
            <Link to="/training">
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6">
                <GraduationCap className="w-5 h-5" />
                Start Training
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6">
              <Download className="w-5 h-5" />
              Get Desktop App
            </Button>
          </div>
          
          {/* Social Proof */}
          <div className="flex items-center justify-center gap-8 pt-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="text-sm">500+ Streamers</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              <span className="text-sm">Open Source</span>
            </div>
          </div>
        </div>

        {/* Bento Grid Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Large Feature Card */}
          <Card className="lg:col-span-2 lg:row-span-2 glass border-primary/20 p-8 hover:border-primary/40 transition-all relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 h-full flex flex-col">
              <Video className="w-16 h-16 text-primary mb-6 glow" />
              <h3 className="text-3xl font-bold mb-4">Built for OBS Studio</h3>
              <p className="text-muted-foreground text-lg mb-6 flex-grow">
                Seamlessly control your OBS scenes, sources, audio, and recording—all without touching your mouse or keyboard. 
                Perfect for streamers who want to focus on content, not controls.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span>Switch scenes with gestures</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span>Control audio and recording</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span>Real-time gesture recognition</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Speed Card */}
          <Card className="glass border-primary/20 p-6 hover:scale-105 transition-transform">
            <Zap className="w-12 h-12 text-primary mb-4 glow" />
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground">Sub-100ms latency for real-time control during live streams</p>
          </Card>

          {/* Privacy Card */}
          <Card className="glass border-primary/20 p-6 hover:scale-105 transition-transform">
            <Shield className="w-12 h-12 text-primary mb-4 glow" />
            <h3 className="text-xl font-bold mb-2">100% Private</h3>
            <p className="text-muted-foreground">All processing happens locally. Your data never leaves your device</p>
          </Card>

          {/* Training Card */}
          <Card className="glass border-primary/20 p-6 hover:scale-105 transition-transform">
            <GraduationCap className="w-12 h-12 text-primary mb-4 glow" />
            <h3 className="text-xl font-bold mb-2">Easy to Learn</h3>
            <p className="text-muted-foreground">Interactive training mode helps you master gestures in minutes</p>
          </Card>

          {/* Desktop App Card */}
          <Card className="lg:col-span-2 glass border-primary/20 p-8 hover:border-primary/40 transition-all relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center gap-6">
              <Laptop className="w-20 h-20 text-primary glow flex-shrink-0" />
              <div className="flex-grow">
                <h3 className="text-2xl font-bold mb-3">Desktop App for Full Control</h3>
                <p className="text-muted-foreground mb-4">
                  For system-wide gesture control, download our desktop application. Control OBS, games, presentations, and any application on your computer.
                </p>
                <Button className="gap-2">
                  <Download className="w-4 h-4" />
                  Download for Windows/Mac/Linux
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass border-primary/20 p-8 text-center">
            <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
            <div className="text-4xl font-bold text-gradient mb-2">99.3%</div>
            <p className="text-muted-foreground">Gesture Accuracy</p>
          </Card>
          <Card className="glass border-primary/20 p-8 text-center">
            <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
            <div className="text-4xl font-bold text-gradient mb-2">&lt;100ms</div>
            <p className="text-muted-foreground">Response Time</p>
          </Card>
          <Card className="glass border-primary/20 p-8 text-center">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <div className="text-4xl font-bold text-gradient mb-2">12+</div>
            <p className="text-muted-foreground">Gesture Types</p>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="glass border-primary/20 p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 animate-pulse-glow" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl font-bold text-gradient">Ready to Transform Your Streaming?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join hundreds of streamers already using gesture control. Try it in your browser now—no installation required.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/studio">
                <Button size="lg" className="gap-2 glow">
                  <Play className="w-5 h-5" />
                  Try OBS Simulator Now
                </Button>
              </Link>
              <Link to="/training">
                <Button size="lg" variant="outline" className="gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Learn Gestures
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
