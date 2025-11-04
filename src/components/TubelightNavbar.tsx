"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Hand, Play, GraduationCap, Library, Download } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import logoIcon from "@/assets/sparshmuktilogo (1).ico";

const TubelightNavbar = () => {
  const location = useLocation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/studio", label: "Studio", icon: Play, active: isActive("/studio") },
    { path: "/training", label: "Training", icon: GraduationCap, active: isActive("/training") },
    { path: "/library", label: "Library", icon: Library, active: isActive("/library") },
  ];

  return (
    <nav className="fixed top-2 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-3/4 md:w-1/2 min-w-[320px] max-w-[800px] backdrop-blur-2xl bg-white/50 dark:bg-black/50 border border-border/20 rounded-full shadow-lg">
      <div className="px-6 py-2 flex items-center justify-between relative">
        {/* Tubelight effect */}
        <div
          className="absolute top-0 left-0 h-full pointer-events-none transition-all duration-300 rounded-full"
          style={{
            width: "200px",
            background: "linear-gradient(90deg, transparent, hsl(215 100% 55% / 0.3), transparent)",
            transform: `translateX(${mousePosition.x - 100}px)`,
            maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
          }}
        />

        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-all relative z-10">
          <img 
            src={logoIcon}
            alt="SparshMukhti Logo" 
            className="w-8 h-8"
          />
          <h1 className="text-2xl font-bold text-gradient">SparshMukhti</h1>
        </Link>

        <div className="flex items-center gap-2 relative z-10">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={item.active ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "gap-2 transition-all relative",
                    item.active && "bg-primary text-white shadow-lg shadow-primary/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            className="gap-2 clay clay-hover"
          >
            <Download className="w-4 h-4" />
            Get App
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default TubelightNavbar;

