import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MousePointer2, Hand, ZoomIn, Move, ArrowUpDown } from "lucide-react";

const gestures = [
  {
    icon: <MousePointer2 className="w-6 h-6" />,
    name: "Cursor Control",
    description: "Index finger up",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30"
  },
  {
    icon: <Hand className="w-6 h-6" />,
    name: "Left Click",
    description: "Pinch (index + middle)",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30"
  },
  {
    icon: <Hand className="w-6 h-6" />,
    name: "Right Click",
    description: "Open palm (all fingers)",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30"
  },
  {
    icon: <ArrowUpDown className="w-6 h-6" />,
    name: "Scroll",
    description: "4 fingers up, thumb down",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30"
  },
  {
    icon: <ZoomIn className="w-6 h-6" />,
    name: "Zoom",
    description: "Two hands: thumb + index",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30"
  },
  {
    icon: <Move className="w-6 h-6" />,
    name: "Grab & Drag",
    description: "Two hands: both palms open",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30"
  }
];

const GestureInfo = () => {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Hand className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-semibold">Gesture Guide</h2>
        </div>

        <div className="space-y-3">
          {gestures.map((gesture, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${gesture.bgColor} ${gesture.borderColor} transition-all hover:scale-105 hover:shadow-lg`}
            >
              <div className="flex items-start gap-3">
                <div className={`${gesture.color} mt-1`}>
                  {gesture.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${gesture.color} mb-1`}>
                    {gesture.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {gesture.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2 text-primary">Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Keep hands within the cyan boundary</li>
            <li>• Smooth movements work best</li>
            <li>• Use two hands for zoom/grab</li>
            <li>• Single hand for cursor/clicks</li>
          </ul>
        </div>

        <Badge variant="outline" className="w-full justify-center border-primary text-primary py-2">
          Browser-based • Real-time • No Installation
        </Badge>
      </div>
    </Card>
  );
};

export default GestureInfo;
