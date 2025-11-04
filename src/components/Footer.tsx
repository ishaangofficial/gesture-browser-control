import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Hand,
  Github,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  MapPin,
  Phone,
  Send
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-background to-muted/20 border-t border-border mt-20">
      <div className="max-w-[1400px] mx-auto px-4 py-16">
        {/* Newsletter Section */}
        <Card className="clay clay-glow p-8 mb-16 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gradient mb-3">
            Stay Updated with SparshMukhti
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get the latest updates, tips, and exclusive content delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input 
              placeholder="Enter your email" 
              className="clay flex-1"
              type="email"
            />
            <Button className="clay clay-hover gap-2">
              <Send className="w-4 h-4" />
              Subscribe
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="clay p-3 rounded-xl clay-glow">
                <Hand className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gradient">SparshMukhti</h2>
            </Link>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Revolutionary hand gesture control for OBS Studio. Stream hands-free with 
              sub-100ms latency and 99.3% accuracy. Built for creators, by creators.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" size="icon" className="clay clay-hover">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="clay clay-hover">
                <Github className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="clay clay-hover">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="clay clay-hover">
                <Youtube className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-bold mb-4 text-foreground">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/studio" className="text-muted-foreground hover:text-primary transition-colors">
                  OBS Simulator
                </Link>
              </li>
              <li>
                <Link to="/training" className="text-muted-foreground hover:text-primary transition-colors">
                  Training
                </Link>
              </li>
              <li>
                <Link to="/library" className="text-muted-foreground hover:text-primary transition-colors">
                  Gesture Library
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Download
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold mb-4 text-foreground">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4 text-foreground">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
                <span className="text-sm">support@sparshmukhti.com</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 mt-1 flex-shrink-0" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span className="text-sm">San Francisco, CA<br />United States</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} SparshMukhti. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
