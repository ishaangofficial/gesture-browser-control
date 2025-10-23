import { Button } from "@/components/ui/button";
import { Hand, BarChart3, Settings, Library, Download, LogOut, Play, GraduationCap } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="glass border-b border-border/50 sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-[1920px] mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="p-2 rounded-xl bg-primary/10 glow animate-pulse-glow">
            <Hand className="w-6 h-6 text-primary" />
          </div>
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
          <Link to="/dashboard">
            <Button 
              variant={isActive("/dashboard") ? "default" : "ghost"} 
              size="sm" 
              className="gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
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
          <Link to="/settings">
            <Button 
              variant={isActive("/settings") ? "default" : "ghost"} 
              size="sm" 
              className="gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Get App
          </Button>
          <Button variant="ghost" size="sm" className="gap-2" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
