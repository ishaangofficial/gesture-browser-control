import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  TrendingUp, 
  Clock, 
  Target,
  Award,
  BarChart3,
  Zap
} from "lucide-react";

const Dashboard = () => {
  const [stats] = useState({
    totalGestures: 1247,
    sessionsToday: 8,
    accuracy: 94,
    avgResponseTime: 120,
    streak: 12,
    level: 5
  });

  const recentGestures = [
    { name: "Cursor Move", count: 456, trend: "+12%" },
    { name: "Left Click", count: 234, trend: "+8%" },
    { name: "Scroll", count: 189, trend: "+15%" },
    { name: "Zoom", count: 98, trend: "+5%" },
    { name: "Right Click", count: 67, trend: "+3%" }
  ];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Track your gesture control mastery</p>
          </div>
          <Badge className="h-10 px-4 text-lg bg-primary/20 text-primary border-primary/30">
            <Award className="w-5 h-5 mr-2" />
            Level {stats.level}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass p-6 glass-hover">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-primary" />
              <Badge variant="outline" className="text-xs">Today</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold">{stats.totalGestures}</p>
              <p className="text-sm text-muted-foreground">Total Gestures</p>
            </div>
          </Card>

          <Card className="glass p-6 glass-hover">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-success" />
              <Badge variant="outline" className="text-xs">Accuracy</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold">{stats.accuracy}%</p>
              <Progress value={stats.accuracy} className="h-2" />
            </div>
          </Card>

          <Card className="glass p-6 glass-hover">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-accent" />
              <Badge variant="outline" className="text-xs">Avg</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold">{stats.avgResponseTime}ms</p>
              <p className="text-sm text-muted-foreground">Response Time</p>
            </div>
          </Card>

          <Card className="glass p-6 glass-hover">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-5 h-5 text-warning" />
              <Badge variant="outline" className="text-xs">Streak</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold">{stats.streak} days</p>
              <p className="text-sm text-muted-foreground">Keep it up!</p>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="glass p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Most Used Gestures</h2>
          </div>
          <div className="space-y-4">
            {recentGestures.map((gesture, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-medium">{gesture.name}</p>
                    <p className="text-sm text-muted-foreground">{gesture.count} times</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-success border-success/30 bg-success/10">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {gesture.trend}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="glass p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Button className="h-auto py-4 flex-col gap-2" variant="outline">
              <Activity className="w-6 h-6" />
              <span>Start Session</span>
            </Button>
            <Button className="h-auto py-4 flex-col gap-2" variant="outline">
              <Target className="w-6 h-6" />
              <span>Training Mode</span>
            </Button>
            <Button className="h-auto py-4 flex-col gap-2" variant="outline">
              <BarChart3 className="w-6 h-6" />
              <span>View Reports</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
