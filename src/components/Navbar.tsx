import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Library, Download, Play, GraduationCap } from "lucide-react";
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
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-black/40 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl px-4">
        <div className="h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoIcon} alt="SparshMukhti Logo" className="w-6 h-6" />
            <span className="text-base font-semibold">SparshMukhti</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link to="/studio">
              <Button variant={isActive("/studio") ? "default" : "ghost"} size="sm" className="px-3">
                <Play className="w-3.5 h-3.5 mr-1.5" />
                Studio
              </Button>
            </Link>
            <Link to="/training">
              <Button variant={isActive("/training") ? "default" : "ghost"} size="sm" className="px-3">
                <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
                Training
              </Button>
            </Link>
            <Link to="/library">
              <Button variant={isActive("/library") ? "default" : "ghost"} size="sm" className="px-3">
                <Library className="w-3.5 h-3.5 mr-1.5" />
                Library
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="px-3" onClick={() => setShowWaitlist(true)}>
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Get App
            </Button>
          </div>
        </div>
      </div>
      <WaitlistDialog open={showWaitlist} onOpenChange={setShowWaitlist} />
    </nav>
  );
};

export default Navbar;
