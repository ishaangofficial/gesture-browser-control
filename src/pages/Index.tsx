import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OnboardingTour from "@/components/OnboardingTour";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WaitlistDialog from "@/components/WaitlistDialog";
import { GlowingBentoGrid } from "@/components/GlowingBentoGrid";
import { TypewriterText } from "@/components/TypewriterText";
import { SplineHand } from "@/components/SplineHand";
import HeroVortex from "@/components/HeroVortex";
import videoSrc from "@/assets/WhatsApp Video 2025-10-26 at 20.48.05_4b89d6b0.mp4";
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
  Code,
  CheckCircle2,
  ArrowRight,
  Pointer,
  LayoutGrid,
  CircleDot,
  Minimize2,
  Layers,
  Target,
  Gauge,
  Wifi
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem("onboarding_completed");
    
    if (!onboardingCompleted) {
      setShowOnboarding(true);
    }
  }, [navigate]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    navigate("/training");
  };


  return (
    <div className="min-h-screen bg-white relative">
      {showOnboarding && <OnboardingTour onComplete={handleOnboardingComplete} />}
      
      <Navbar />

      {/* Hero Section with animated vortex background */}
      <section id="home" className="min-h-[88vh] flex items-center justify-center px-4 md:px-6 lg:px-8 relative bg-white overflow-hidden">
        <HeroVortex className="absolute inset-0 -z-0" intensity={1.1} bgAlpha={0.85} />
        <div className="max-w-[1600px] w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-0 lg:gap-0">
          {/* Left Side - Text */}
          <div className="flex-1 space-y-6 md:space-y-8 z-10 max-w-2xl">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight tracking-tight text-foreground">
                <span className="block">Stream Like</span>
                <span className="block">
                  <TypewriterText 
                    texts={[
                      "Magic",
                      "A Pro",
                      "The Future",
                      "Innovation"
                    ]}
                    speed={100}
                    deleteSpeed={50}
                    delay={2000}
                  />
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-normal">
                The world's most advanced gesture control system for OBS Studio.
                <br />
                <span className="font-semibold">No mouse. No keyboard. Just your hands.</span>
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to="/studio">
                <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-base font-semibold">
                  <Play className="w-5 h-5 mr-2" />
                  Try OBS Simulator
                </Button>
              </Link>
              <Link to="/training">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-6 text-base font-semibold">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Start Training
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side - Spline Hand over vortex */}
          <div className="flex-1 flex items-center justify-center lg:justify-end w-full lg:w-auto order-1 lg:order-2 relative z-10">
            <div className="w-full max-w-[600px] h-[400px] md:h-[500px] lg:h-[600px]">
              <SplineHand 
                className="w-full h-full" 
                scene="https://prod.spline.design/qtNMPitWHEYcFE66/scene.splinecode"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section - 2nd Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 md:px-8 lg:px-12 py-24 relative bg-white">
        <div className="max-w-[1600px] w-full space-y-12 md:space-y-16">
          <div className="text-center space-y-3">
            <Badge className="text-base px-5 py-1.5 mb-2">
              <Video className="w-4 h-4 mr-2" />
              Demo Video
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-2 leading-tight text-foreground">
              See It In Action
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch how gesture control transforms your streaming workflow
            </p>
          </div>
          
          {/* Video Section */}
          <div className="w-full max-w-5xl mx-auto">
            <div className="relative rounded-xl overflow-hidden shadow-sm border">
              <video 
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - 100vh */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 md:px-8 lg:px-12 py-24 relative bg-white">
        <div className="max-w-[1600px] w-full space-y-12 md:space-y-16">
          <div className="text-center space-y-3">
            <Badge className="text-base px-5 py-1.5 mb-2">
              <Layers className="w-4 h-4 mr-2" />
              Core Features
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-2 leading-tight text-foreground">
              Everything You Need to
              <span className="text-foreground"> Stream Hands-Free</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed for professional streamers
            </p>
          </div>
          <GlowingBentoGrid />
        </div>
      </section>

      {/* How It Works - 100vh */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 md:px-8 lg:px-12 py-24 relative bg-white">
        <div className="max-w-[1600px] w-full space-y-12 md:space-y-16">
          <div className="text-center space-y-3">
            <Badge className="text-base px-5 py-1.5 mb-2">
              <Target className="w-4 h-4 mr-2" />
              Simple Process
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-2 leading-tight text-foreground">
              Get Started in
              <span className="text-foreground"> 3 Easy Steps</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              From zero to streaming in minutes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <Card className="p-8 text-center relative overflow-hidden group border shadow-sm">
              <div className="absolute top-0 left-0 w-full h-px bg-border" />
              <div className="p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center border">
                <span className="text-4xl font-semibold text-foreground">1</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Learn Gestures</h3>
              <p className="text-muted-foreground leading-relaxed">
                Complete our interactive training to master 5 core hand gestures in under 5 minutes
              </p>
            </Card>
            
            <Card className="p-8 text-center relative overflow-hidden group border shadow-sm">
              <div className="absolute top-0 left-0 w-full h-px bg-border" />
              <div className="p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center border">
                <span className="text-4xl font-semibold text-foreground">2</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Practice in Simulator</h3>
              <p className="text-muted-foreground leading-relaxed">
                Test gestures with our realistic OBS simulator before going live on your stream
              </p>
            </Card>
            
            <Card className="p-8 text-center relative overflow-hidden group border shadow-sm">
              <div className="absolute top-0 left-0 w-full h-px bg-border" />
              <div className="p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center border">
                <span className="text-4xl font-semibold text-foreground">3</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Stream Hands-Free</h3>
              <p className="text-muted-foreground leading-relaxed">
                Control your entire OBS setup with natural hand movements during your live streams
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Performance Metrics - 100vh */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 md:px-8 lg:px-12 py-24 relative bg-white">
        <div className="max-w-[1600px] w-full space-y-12 md:space-y-16">
          <div className="text-center space-y-3">
            <Badge className="text-base px-5 py-1.5 mb-2">
              <Gauge className="w-4 h-4 mr-2" />
              Performance
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-2 leading-tight text-foreground">
              Built for
              <span className="text-foreground"> Speed & Accuracy</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Industry-leading performance metrics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <Card className="p-10 text-center border shadow-sm">
              <TrendingUp className="w-16 h-16 text-foreground mx-auto mb-6" />
              <div className="text-6xl font-semibold text-foreground mb-3">99.3%</div>
              <h3 className="text-xl font-medium mb-2 text-foreground">Gesture Accuracy</h3>
              <p className="text-muted-foreground">Industry-leading precision with MediaPipe AI</p>
            </Card>
            
            <Card className="p-10 text-center border shadow-sm">
              <Zap className="w-16 h-16 text-foreground mx-auto mb-6" />
              <div className="text-6xl font-semibold text-foreground mb-3">&lt;100ms</div>
              <h3 className="text-xl font-medium mb-2 text-foreground">Response Time</h3>
              <p className="text-muted-foreground">Instant reaction to your hand gestures</p>
            </Card>
            
            <Card className="p-10 text-center border shadow-sm">
              <Wifi className="w-16 h-16 text-foreground mx-auto mb-6" />
              <div className="text-6xl font-semibold text-foreground mb-3">0ms</div>
              <h3 className="text-xl font-medium mb-2 text-foreground">Network Lag</h3>
              <p className="text-muted-foreground">100% local processing, no cloud delays</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Section - 100vh */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 md:px-8 lg:px-12 py-24 relative bg-white">
        <div className="max-w-[1600px] w-full space-y-12 md:space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-2 leading-tight text-foreground">
              Why Choose
              <span className="text-foreground"> SparshMukhti?</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Built by streamers, for streamers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <Card className="p-10 border shadow-sm">
              <Award className="w-14 h-14 text-foreground mb-6" />
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Industry Leading</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                99.3% gesture accuracy with &lt;100ms response time—the fastest gesture 
                control system in the market
              </p>
              <div className="p-4 rounded-lg border">
                <span className="text-sm text-muted-foreground">Used by 1000+ streamers worldwide</span>
              </div>
            </Card>
            
            <Card className="p-10 border shadow-sm">
              <Headphones className="w-14 h-14 text-foreground mb-6" />
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Premium Support</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Get help from our team of experts via Discord, email, or live chat whenever you need
              </p>
              <div className="p-4 rounded-lg border">
                <span className="text-sm text-muted-foreground">Average response time: &lt;2 hours</span>
              </div>
            </Card>
            
            <Card className="p-10 border shadow-sm">
              <Code className="w-14 h-14 text-foreground mb-6" />
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Open Source Core</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Our gesture recognition engine is open source and community-driven
              </p>
              <Button variant="outline" className="gap-2">
                <Github className="w-4 h-4" />
                View on GitHub
              </Button>
            </Card>
            
            <Card className="p-10 border shadow-sm">
              <Users className="w-14 h-14 text-foreground mb-6" />
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Active Community</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Join our Discord with 5000+ members sharing tips, presets, and custom gestures
              </p>
              <Button variant="outline" className="gap-2">
                Join Discord
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - 100vh */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 md:px-8 lg:px-12 py-24 relative bg-white">
        <div className="max-w-[1600px] w-full">
          <Card className="p-12 md:p-16 lg:p-20 text-center relative overflow-hidden border shadow-sm">
            <div className="relative z-10 space-y-6 md:space-y-8">
              <Badge className="text-base px-5 py-1.5 mb-2">
                <Star className="w-4 h-4 mr-2" />
                Ready to Get Started?
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight">
                Transform Your Streaming Experience Today
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                Join hundreds of streamers using gesture control. Try it now—no installation required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/studio">
                  <Button size="lg" className="gap-3 text-lg px-10 py-7 w-full sm:w-auto">
                    <Play className="w-5 h-5" />
                    Try OBS Simulator
                  </Button>
                </Link>
                <Link to="/training">
                  <Button variant="outline" size="lg" className="gap-3 text-lg px-10 py-7 w-full sm:w-auto">
                    <GraduationCap className="w-5 h-5" />
                    Start Training
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>
      
      <Footer />
      <WaitlistDialog open={showWaitlist} onOpenChange={setShowWaitlist} />
    </div>
  );
};

export default Index;
