import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import OnboardingTour from "@/components/OnboardingTour";
import Navbar from "@/components/Navbar";
import WaitlistDialog from "@/components/WaitlistDialog";
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
  TrendingUp,
  Award,
  Headphones,
  Code
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);

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
    <div className="min-h-screen bg-background">
      {showOnboarding && <OnboardingTour onComplete={handleOnboardingComplete} />}
      
      <Navbar />

      <div className="max-w-[1400px] mx-auto section-spacing space-y-20">
        {/* Hero Section */}
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <div className="clay clay-glow p-8 rounded-3xl animate-float">
              <Hand className="w-24 h-24 text-primary" />
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold leading-tight text-foreground">
            Control <span className="text-gradient">OBS Studio</span>
            <br />
            <span className="text-foreground">With Hand Gestures</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Revolutionary gesture control for streamers. No mouse, no keyboard—just your hands.
            <br />
            <span className="text-primary font-semibold">Built specifically for OBS Studio.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link to="/studio">
              <Button size="lg" className="clay clay-hover gap-2 text-lg px-8 py-6">
                <Play className="w-5 h-5" />
                Try OBS Simulator
              </Button>
            </Link>
            <Link to="/training">
              <Button size="lg" variant="outline" className="clay clay-hover gap-2 text-lg px-8 py-6">
                <GraduationCap className="w-5 h-5" />
                Start Training
              </Button>
            </Link>
          </div>
        </div>

        {/* Bento Grid Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 lg:row-span-2 clay clay-hover p-8">
            <Video className="w-16 h-16 text-primary mb-6" />
            <h3 className="text-3xl font-bold mb-4">Built for OBS Studio</h3>
            <p className="text-muted-foreground text-lg mb-6">
              Seamlessly control your OBS scenes, sources, audio, and recording—all without touching your mouse or keyboard.
            </p>
            <div className="space-y-3">
              <div className="clay-inset p-3 rounded-lg flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>Switch scenes with gestures</span>
              </div>
              <div className="clay-inset p-3 rounded-lg flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>Control audio and recording</span>
              </div>
            </div>
          </Card>

          <Card className="clay clay-hover p-6">
            <Zap className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground">Sub-100ms latency for real-time control</p>
          </Card>

          <Card className="clay clay-hover p-6">
            <Shield className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">100% Private</h3>
            <p className="text-muted-foreground">All processing happens locally</p>
          </Card>

          <Card className="clay clay-hover p-6">
            <GraduationCap className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Easy to Learn</h3>
            <p className="text-muted-foreground">Master gestures in minutes</p>
          </Card>

          <Card className="lg:col-span-2 clay clay-hover p-8">
            <div className="flex items-center gap-6">
              <Laptop className="w-20 h-20 text-primary flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold mb-3">Desktop App</h3>
                <p className="text-muted-foreground mb-4">
                  Download our desktop app for full OBS Studio integration.
                </p>
                <Button 
                  className="clay clay-hover gap-2"
                  onClick={() => setShowWaitlist(true)}
                >
                  <Download className="w-4 h-4" />
                  Get App
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* How It Works */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to revolutionize your streaming workflow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="clay clay-hover p-8 text-center">
              <div className="clay p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Learn Gestures</h3>
              <p className="text-muted-foreground">
                Complete our interactive training to master 12+ hand gestures in minutes
              </p>
            </Card>
            
            <Card className="clay clay-hover p-8 text-center">
              <div className="clay p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Practice in Studio</h3>
              <p className="text-muted-foreground">
                Test gestures with our realistic OBS simulator before going live
              </p>
            </Card>
            
            <Card className="clay clay-hover p-8 text-center">
              <div className="clay p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Stream Hands-Free</h3>
              <p className="text-muted-foreground">
                Control your entire OBS setup with natural hand movements
              </p>
            </Card>
          </div>
        </div>

        {/* Why Choose SparshMukhti */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose SparshMukhti?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built by streamers, for streamers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="clay clay-hover p-8">
              <Award className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-3">Industry Leading</h3>
              <p className="text-muted-foreground mb-4">
                99.3% gesture accuracy with &lt;100ms response time—the fastest in the market
              </p>
              <div className="clay-inset p-3 rounded-lg">
                <span className="text-sm text-muted-foreground">Used by 1000+ streamers worldwide</span>
              </div>
            </Card>
            
            <Card className="clay clay-hover p-8">
              <Headphones className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-3">Premium Support</h3>
              <p className="text-muted-foreground mb-4">
                Get help from our team of experts via Discord, email, or live chat
              </p>
              <div className="clay-inset p-3 rounded-lg">
                <span className="text-sm text-muted-foreground">Average response time: &lt;2 hours</span>
              </div>
            </Card>
            
            <Card className="clay clay-hover p-8">
              <Code className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-3">Open Source Core</h3>
              <p className="text-muted-foreground mb-4">
                Our gesture recognition engine is open source and community-driven
              </p>
              <Button variant="outline" className="clay gap-2">
                <Github className="w-4 h-4" />
                View on GitHub
              </Button>
            </Card>
            
            <Card className="clay clay-hover p-8">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-3">Active Community</h3>
              <p className="text-muted-foreground mb-4">
                Join our Discord with 5000+ members sharing tips, presets, and custom gestures
              </p>
              <Button variant="outline" className="clay gap-2">
                Join Discord
              </Button>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="clay clay-hover p-8 text-center">
            <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
            <div className="text-4xl font-bold text-gradient mb-2">99.3%</div>
            <p className="text-muted-foreground">Gesture Accuracy</p>
          </Card>
          <Card className="clay clay-hover p-8 text-center">
            <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
            <div className="text-4xl font-bold text-gradient mb-2">&lt;100ms</div>
            <p className="text-muted-foreground">Response Time</p>
          </Card>
          <Card className="clay clay-hover p-8 text-center">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <div className="text-4xl font-bold text-gradient mb-2">12+</div>
            <p className="text-muted-foreground">Gesture Types</p>
          </Card>
        </div>

        {/* CTA */}
        <Card className="clay clay-glow p-12 text-center">
          <h2 className="text-4xl font-bold text-gradient mb-4">Ready to Transform Your Streaming?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Join hundreds of streamers using gesture control. Try it now—no installation required.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/studio">
              <Button size="lg" className="clay clay-hover gap-2">
                <Play className="w-5 h-5" />
                Try Now
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="clay gap-2">
                View Pricing
              </Button>
            </Link>
          </div>
        </Card>
      </div>
      
      <WaitlistDialog open={showWaitlist} onOpenChange={setShowWaitlist} />
    </div>
  );
};

export default Index;
