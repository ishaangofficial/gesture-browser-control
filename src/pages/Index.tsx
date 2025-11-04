import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OnboardingTour from "@/components/OnboardingTour";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    <div className="min-h-screen bg-background">
      {showOnboarding && <OnboardingTour onComplete={handleOnboardingComplete} />}
      
      <Navbar />

      <div className="max-w-[1400px] mx-auto px-4 space-y-32">
        {/* Hero Section - Enhanced */}
        <section className="py-20 md:py-32 text-center space-y-8">
          <Badge className="clay text-base px-6 py-2 mb-4 animate-fade-in">
            <Sparkles className="w-4 h-4 mr-2" />
            Sub-100ms Latency • 99.3% Accuracy
          </Badge>
          
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="clay clay-glow p-10 rounded-[2rem] animate-float">
                <Hand className="w-32 h-32 text-primary" />
              </div>
              <div className="absolute -top-4 -right-4 clay p-4 rounded-2xl animate-pulse-glow">
                <Zap className="w-8 h-8 text-warning" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight px-4">
            Stream Like Magic
            <br />
            <span className="text-gradient">Control OBS With</span>
            <br />
            <span className="text-gradient">Hand Gestures</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto px-4 leading-relaxed">
            The most advanced gesture control system for OBS Studio. 
            <br />
            <span className="font-semibold text-primary">No mouse. No keyboard. Just your hands.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 px-4">
            <Link to="/studio">
              <Button size="lg" className="clay clay-hover gap-3 text-lg px-10 py-7 w-full sm:w-auto group">
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Try OBS Simulator
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/training">
              <Button size="lg" variant="outline" className="clay clay-hover gap-3 text-lg px-10 py-7 w-full sm:w-auto">
                <GraduationCap className="w-5 h-5" />
                Start Training
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-12">
            <div className="clay-inset p-4 rounded-xl">
              <div className="text-3xl font-bold text-gradient mb-1">1000+</div>
              <p className="text-sm text-muted-foreground">Active Streamers</p>
            </div>
            <div className="clay-inset p-4 rounded-xl">
              <div className="text-3xl font-bold text-gradient mb-1">99.3%</div>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
            <div className="clay-inset p-4 rounded-xl">
              <div className="text-3xl font-bold text-gradient mb-1">&lt;100ms</div>
              <p className="text-sm text-muted-foreground">Latency</p>
            </div>
            <div className="clay-inset p-4 rounded-xl">
              <div className="text-3xl font-bold text-gradient mb-1">5 Core</div>
              <p className="text-sm text-muted-foreground">Gestures</p>
            </div>
          </div>
        </section>

        {/* Bento Grid Features - Premium */}
        <section className="space-y-8">
          <div className="text-center mb-12">
            <Badge className="clay text-base px-6 py-2 mb-4">
              <Layers className="w-4 h-4 mr-2" />
              Core Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to
              <span className="text-gradient"> Stream Hands-Free</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Large Feature Card */}
            <Card className="lg:col-span-2 lg:row-span-2 clay clay-hover p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <Video className="w-20 h-20 text-primary mb-6" />
                <h3 className="text-3xl font-bold mb-4">Built for OBS Studio</h3>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  Seamlessly control every aspect of your OBS setup—scenes, sources, audio, 
                  recording, and streaming—all without touching your peripherals.
                </p>
                <div className="space-y-3">
                  <div className="clay-inset p-4 rounded-lg flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <span>Switch scenes with gestures</span>
                  </div>
                  <div className="clay-inset p-4 rounded-lg flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <span>Control audio and recording</span>
                  </div>
                  <div className="clay-inset p-4 rounded-lg flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <span>Start/stop streaming hands-free</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Speed Card */}
            <Card className="clay clay-hover p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Zap className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">Sub-100ms latency for real-time control</p>
              <Badge className="mt-4 bg-warning/20 text-warning">Ultra-Low Latency</Badge>
            </Card>

            {/* Privacy Card */}
            <Card className="clay clay-hover p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">100% Private</h3>
              <p className="text-muted-foreground">All processing happens locally on your device</p>
              <Badge className="mt-4 bg-success/20 text-success">Local Processing</Badge>
            </Card>

            {/* Training Card */}
            <Card className="clay clay-hover p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <GraduationCap className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Easy to Learn</h3>
              <p className="text-muted-foreground">Master all gestures in under 5 minutes</p>
              <Badge className="mt-4 bg-accent/20 text-accent">Quick Start</Badge>
            </Card>

            {/* Desktop App Card */}
            <Card className="lg:col-span-2 clay clay-hover p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Laptop className="w-24 h-24 text-primary flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3">Desktop App</h3>
                  <p className="text-muted-foreground mb-4">
                    Download our desktop app for full OBS Studio integration with advanced features.
                  </p>
                  <Button 
                    className="clay clay-hover gap-2 w-full sm:w-auto"
                    onClick={() => setShowWaitlist(true)}
                  >
                    <Download className="w-4 h-4" />
                    Get Desktop App
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* 5 Core Gestures Section */}
        <section className="space-y-12">
          <div className="text-center">
            <Badge className="clay text-base px-6 py-2 mb-4">
              <Hand className="w-4 h-4 mr-2" />
              5 Core Gestures
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Master These Gestures
              <span className="text-gradient"> to Control Everything</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Each gesture is optimized for accuracy and designed for intuitive control
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="clay clay-hover p-8 text-center group">
              <div className="clay p-6 rounded-2xl mb-6 w-fit mx-auto group-hover:scale-110 transition-transform">
                <Hand className="w-16 h-16 text-primary" />
              </div>
              <Badge className="mb-4 bg-success/20 text-success">Critical</Badge>
              <h3 className="text-2xl font-bold mb-3">Open Palm</h3>
              <p className="text-muted-foreground mb-4">All fingers extended</p>
              <div className="clay-inset p-3 rounded-lg">
                <p className="text-sm font-medium text-primary">Start/Stop Recording</p>
              </div>
            </Card>

            <Card className="clay clay-hover p-8 text-center group">
              <div className="clay p-6 rounded-2xl mb-6 w-fit mx-auto group-hover:scale-110 transition-transform">
                <Pointer className="w-16 h-16 text-primary" />
              </div>
              <Badge className="mb-4 bg-success/20 text-success">Critical</Badge>
              <h3 className="text-2xl font-bold mb-3">Point</h3>
              <p className="text-muted-foreground mb-4">Index finger extended</p>
              <div className="clay-inset p-3 rounded-lg">
                <p className="text-sm font-medium text-primary">Mute/Unmute Mic</p>
              </div>
            </Card>

            <Card className="clay clay-hover p-8 text-center group">
              <div className="clay p-6 rounded-2xl mb-6 w-fit mx-auto group-hover:scale-110 transition-transform">
                <LayoutGrid className="w-16 h-16 text-primary" />
              </div>
              <Badge className="mb-4 bg-warning/20 text-warning">High Priority</Badge>
              <h3 className="text-2xl font-bold mb-3">L-Shape</h3>
              <p className="text-muted-foreground mb-4">Thumb + Index forming L</p>
              <div className="clay-inset p-3 rounded-lg">
                <p className="text-sm font-medium text-primary">Switch Scene</p>
              </div>
            </Card>

            <Card className="clay clay-hover p-8 text-center group md:col-span-2 lg:col-span-1">
              <div className="clay p-6 rounded-2xl mb-6 w-fit mx-auto group-hover:scale-110 transition-transform">
                <CircleDot className="w-16 h-16 text-primary" />
              </div>
              <Badge className="mb-4 bg-warning/20 text-warning">High Priority</Badge>
              <h3 className="text-2xl font-bold mb-3">OK Sign</h3>
              <p className="text-muted-foreground mb-4">Circle with thumb + index</p>
              <div className="clay-inset p-3 rounded-lg">
                <p className="text-sm font-medium text-primary">Start/Stop Stream</p>
              </div>
            </Card>

            <Card className="clay clay-hover p-8 text-center group">
              <div className="clay p-6 rounded-2xl mb-6 w-fit mx-auto group-hover:scale-110 transition-transform">
                <Minimize2 className="w-16 h-16 text-primary" />
              </div>
              <Badge className="mb-4 bg-info/20 text-info">Medium Priority</Badge>
              <h3 className="text-2xl font-bold mb-3">Pinch</h3>
              <p className="text-muted-foreground mb-4">Thumb + Index pinched</p>
              <div className="clay-inset p-3 rounded-lg">
                <p className="text-sm font-medium text-primary">Pause Detection</p>
              </div>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-12">
          <div className="text-center">
            <Badge className="clay text-base px-6 py-2 mb-4">
              <Target className="w-4 h-4 mr-2" />
              Simple Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Get Started in
              <span className="text-gradient"> 3 Easy Steps</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="clay clay-hover p-8 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
              <div className="clay p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-4xl font-bold text-gradient">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Learn Gestures</h3>
              <p className="text-muted-foreground leading-relaxed">
                Complete our interactive training to master 5 core hand gestures in under 5 minutes
              </p>
            </Card>
            
            <Card className="clay clay-hover p-8 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-success" />
              <div className="clay p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-4xl font-bold text-gradient">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Practice in Simulator</h3>
              <p className="text-muted-foreground leading-relaxed">
                Test gestures with our realistic OBS simulator before going live on your stream
              </p>
            </Card>
            
            <Card className="clay clay-hover p-8 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-success to-primary" />
              <div className="clay p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-4xl font-bold text-gradient">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Stream Hands-Free</h3>
              <p className="text-muted-foreground leading-relaxed">
                Control your entire OBS setup with natural hand movements during your live streams
              </p>
            </Card>
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="space-y-12">
          <div className="text-center">
            <Badge className="clay text-base px-6 py-2 mb-4">
              <Gauge className="w-4 h-4 mr-2" />
              Performance
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built for
              <span className="text-gradient"> Speed & Accuracy</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="clay clay-hover p-10 text-center">
              <TrendingUp className="w-16 h-16 text-primary mx-auto mb-6" />
              <div className="text-6xl font-bold text-gradient mb-3">99.3%</div>
              <h3 className="text-xl font-semibold mb-2">Gesture Accuracy</h3>
              <p className="text-muted-foreground">Industry-leading precision with MediaPipe AI</p>
            </Card>
            
            <Card className="clay clay-hover p-10 text-center">
              <Zap className="w-16 h-16 text-warning mx-auto mb-6" />
              <div className="text-6xl font-bold text-gradient mb-3">&lt;100ms</div>
              <h3 className="text-xl font-semibold mb-2">Response Time</h3>
              <p className="text-muted-foreground">Instant reaction to your hand gestures</p>
            </Card>
            
            <Card className="clay clay-hover p-10 text-center">
              <Wifi className="w-16 h-16 text-success mx-auto mb-6" />
              <div className="text-6xl font-bold text-gradient mb-3">0ms</div>
              <h3 className="text-xl font-semibold mb-2">Network Lag</h3>
              <p className="text-muted-foreground">100% local processing, no cloud delays</p>
            </Card>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="space-y-12">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose
              <span className="text-gradient"> SparshMukhti?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built by streamers, for streamers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="clay clay-hover p-10">
              <Award className="w-14 h-14 text-primary mb-6" />
              <h3 className="text-2xl font-bold mb-4">Industry Leading</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                99.3% gesture accuracy with &lt;100ms response time—the fastest gesture 
                control system in the market
              </p>
              <div className="clay-inset p-4 rounded-lg">
                <span className="text-sm text-muted-foreground">Used by 1000+ streamers worldwide</span>
              </div>
            </Card>
            
            <Card className="clay clay-hover p-10">
              <Headphones className="w-14 h-14 text-primary mb-6" />
              <h3 className="text-2xl font-bold mb-4">Premium Support</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Get help from our team of experts via Discord, email, or live chat whenever you need
              </p>
              <div className="clay-inset p-4 rounded-lg">
                <span className="text-sm text-muted-foreground">Average response time: &lt;2 hours</span>
              </div>
            </Card>
            
            <Card className="clay clay-hover p-10">
              <Code className="w-14 h-14 text-primary mb-6" />
              <h3 className="text-2xl font-bold mb-4">Open Source Core</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Our gesture recognition engine is open source and community-driven
              </p>
              <Button variant="outline" className="clay gap-2">
                <Github className="w-4 h-4" />
                View on GitHub
              </Button>
            </Card>
            
            <Card className="clay clay-hover p-10">
              <Users className="w-14 h-14 text-primary mb-6" />
              <h3 className="text-2xl font-bold mb-4">Active Community</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Join our Discord with 5000+ members sharing tips, presets, and custom gestures
              </p>
              <Button variant="outline" className="clay gap-2">
                Join Discord
              </Button>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pb-20">
          <Card className="clay clay-glow p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            <div className="relative z-10">
              <Badge className="text-base px-6 py-2 mb-6">
                <Star className="w-4 h-4 mr-2" />
                Ready to Get Started?
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
                Transform Your Streaming Experience Today
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                Join hundreds of streamers using gesture control. Try it now—no installation required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/studio">
                  <Button size="lg" className="clay clay-hover gap-3 text-lg px-10 py-7 w-full sm:w-auto">
                    <Play className="w-5 h-5" />
                    Try OBS Simulator
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline" className="clay gap-3 text-lg px-10 py-7 w-full sm:w-auto">
                    View Pricing
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>
      </div>
      
      <Footer />
      <WaitlistDialog open={showWaitlist} onOpenChange={setShowWaitlist} />
    </div>
  );
};

export default Index;
