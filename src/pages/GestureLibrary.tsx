import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Hand, 
  Library,
  ArrowLeft,
  Pointer,
  LayoutGrid,
  CircleDot,
  Minimize2
} from "lucide-react";
import { Link } from "react-router-dom";

const gestures = {
  basic: [
    {
      name: "Open Palm",
      icon: <Hand className="w-8 h-8" />,
      description: "All five fingers extended (open palm)",
      action: "Start/Stop Recording",
      difficulty: "Easy",
      color: "text-success",
      priority: "Critical"
    },
    {
      name: "Point",
      icon: <Pointer className="w-8 h-8" />,
      description: "Index finger extended, others down",
      action: "Mute/Unmute Microphone",
      difficulty: "Easy",
      color: "text-success",
      priority: "Critical"
    },
    {
      name: "L-Shape",
      icon: <LayoutGrid className="w-8 h-8" />,
      description: "Thumb + Index extended forming L",
      action: "Switch to Next Scene",
      difficulty: "Medium",
      color: "text-warning",
      priority: "High"
    }
  ],
  advanced: [
    {
      name: "OK Sign",
      icon: <CircleDot className="w-8 h-8" />,
      description: "Thumb + Index form circle, others up",
      action: "Start/Stop Streaming",
      difficulty: "Medium",
      color: "text-warning",
      priority: "High"
    },
    {
      name: "Pinky",
      icon: <Minimize2 className="w-8 h-8" />,
      description: "Pinky finger extended, others down",
      action: "Pause Gesture Detection",
      difficulty: "Medium",
      color: "text-warning",
      priority: "Medium"
    }
  ]
};

const GestureLibrary = () => {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="icon" className="clay clay-hover">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2 flex items-center gap-3">
              <Library className="w-10 h-10" />
              Gesture Library
            </h1>
            <p className="text-muted-foreground">Master all available gestures for OBS control</p>
          </div>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="glass">
            <TabsTrigger value="basic">Basic Gestures</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Gestures</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gestures.basic.map((gesture, i) => (
                <Card key={i} className="glass p-6 glass-hover group">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-primary/10 ${gesture.color} group-hover:scale-110 transition-transform`}>
                      {gesture.icon}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                        {gesture.difficulty}
                      </Badge>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        {gesture.priority}
                      </Badge>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{gesture.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{gesture.description}</p>
                  <div className="pt-3 border-t border-border/50">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">OBS Action</p>
                    <p className="text-sm font-medium">{gesture.action}</p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gestures.advanced.map((gesture, i) => (
                <Card key={i} className="glass p-6 glass-hover group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-primary/10 ${gesture.color} group-hover:scale-110 transition-transform`}>
                        {gesture.icon}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge variant="outline" className={
                          gesture.difficulty === "Medium" 
                            ? "bg-warning/10 text-warning border-warning/30"
                            : "bg-destructive/10 text-destructive border-destructive/30"
                        }>
                          {gesture.difficulty}
                        </Badge>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                          {gesture.priority}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{gesture.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{gesture.description}</p>
                    <div className="pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">OBS Action</p>
                      <p className="text-sm font-medium">{gesture.action}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Pro Tips */}
        <Card className="glass p-6">
          <h2 className="text-xl font-semibold mb-4">Pro Tips</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="font-medium mb-1">🎯 Accuracy</p>
              <p className="text-sm text-muted-foreground">Keep your hand in the frame boundary for best detection</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
              <p className="font-medium mb-1">💡 Lighting</p>
              <p className="text-sm text-muted-foreground">Good lighting improves gesture recognition significantly</p>
            </div>
            <div className="p-4 rounded-lg bg-success/5 border border-success/20">
              <p className="font-medium mb-1">✋ Practice</p>
              <p className="text-sm text-muted-foreground">Start with basic gestures before trying advanced ones</p>
            </div>
            <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
              <p className="font-medium mb-1">⚡ Speed</p>
              <p className="text-sm text-muted-foreground">Slow, deliberate movements work better than fast ones</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GestureLibrary;
