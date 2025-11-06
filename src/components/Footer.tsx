import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Hand,
  Github,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  MapPin,
  Phone
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t mt-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg border">
                <Hand className="w-5 h-5 text-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">SparshMukhti</h2>
            </Link>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Revolutionary hand gesture control for OBS Studio. Stream hands-free with 
              sub-100ms latency and 99.3% accuracy. Built for creators, by creators.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" size="icon" className="">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="">
                <Github className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="">
                <Youtube className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-3 text-foreground">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/studio" className="text-muted-foreground hover:text-foreground transition-colors">
                  OBS Simulator
                </Link>
              </li>
              <li>
                <Link to="/training" className="text-muted-foreground hover:text-foreground transition-colors">
                  Training
                </Link>
              </li>
              <li>
                <Link to="/library" className="text-muted-foreground hover:text-foreground transition-colors">
                  Gesture Library
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Download
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-3 text-foreground">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3 text-foreground">Contact</h3>
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
        <div className="pt-8 border-t">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} SparshMukhti. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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
