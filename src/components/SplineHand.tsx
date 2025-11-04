import { Suspense, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Hand } from "lucide-react";

interface SplineHandProps {
  className?: string;
  scene?: string;
}

export const SplineHand = ({ className, scene }: SplineHandProps) => {
  const [SplineComponent, setSplineComponent] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Dynamically import Spline to avoid SSR issues
    import("@splinetool/react-spline")
      .then((module) => {
        setSplineComponent(() => module.default);
      })
      .catch((err) => {
        console.error("Failed to load Spline:", err);
        setError(true);
      });
  }, []);

  // Use provided scene URL
  const defaultScene = scene || "https://prod.spline.design/qtNMPitWHEYcFE66/scene.splinecode";

  if (error) {
    // Fallback if Spline fails to load
    return (
      <div className={cn("w-full h-full flex items-center justify-center", className)}>
        <div className="text-center space-y-4">
          <Hand className="w-32 h-32 md:w-40 md:h-40 text-primary mx-auto animate-float" />
          <p className="text-primary">3D Hand Model</p>
        </div>
      </div>
    );
  }

  if (!SplineComponent) {
    // Loading state
    return (
      <div className={cn("w-full h-full flex items-center justify-center", className)}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={cn("w-full h-full", className)}>
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }>
        <SplineComponent 
          scene={defaultScene}
          className="w-full h-full"
          onError={(error: any) => {
            console.error("Spline error:", error);
            setError(true);
          }}
        />
      </Suspense>
    </div>
  );
};

