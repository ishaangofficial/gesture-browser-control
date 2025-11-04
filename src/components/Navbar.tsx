import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Hand, BarChart3, Settings, Library, Download, LogOut, Play, GraduationCap, DollarSign, User } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import WaitlistDialog from "./WaitlistDialog";
import logoIcon from "@/assets/sparshmuktilogo (1).ico";

const Navbar = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [showWaitlist, setShowWaitlist] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-2 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-3/4 md:w-1/2 min-w-[320px] max-w-[800px] backdrop-blur-2xl bg-white/50 dark:bg-black/50 border border-border/20 rounded-full shadow-lg">
      <div className="px-6 py-2 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-all">
          <img 
            src={logoIcon}
            alt="SparshMukhti Logo" 
            className="w-8 h-8"
          />
          <h1 className="text-2xl font-bold text-gradient">SparshMukhti</h1>
        </Link>
        
        <div className="flex items-center gap-2">
          <Link to="/studio">
            <Button 
              variant={isActive("/studio") ? "default" : "ghost"} 
              size="sm" 
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              Studio
            </Button>
          </Link>
          <Link to="/training">
            <Button 
              variant={isActive("/training") ? "default" : "ghost"} 
              size="sm" 
              className="gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              Training
            </Button>
          </Link>
          <Link to="/library">
            <Button 
              variant={isActive("/library") ? "default" : "ghost"} 
              size="sm" 
              className="gap-2"
            >
              <Library className="w-4 h-4" />
              Library
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 clay clay-hover"
            onClick={() => setShowWaitlist(true)}
          >
            <Download className="w-4 h-4" />
            Get App
          </Button>
        </div>
      </div>
      
      <WaitlistDialog open={showWaitlist} onOpenChange={setShowWaitlist} />
    </nav>
  );
};

export default Navbar;
