import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { User, Mail, Calendar, Download, Settings, LogOut, Edit2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Demo User",
    email: "demo@sparshmukhti.com",
    joinDate: "October 2025",
    plan: "Yearly",
    nextBilling: "October 2026"
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated!",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/login");
  };

  const stats = [
    { label: "Total Sessions", value: "127" },
    { label: "Gestures Performed", value: "2,456" },
    { label: "Training Completed", value: "100%" },
    { label: "Hours Saved", value: "43" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto section-spacing">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            Your <span className="text-gradient">Profile</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your account and subscription
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Card className="clay p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="clay rounded-full p-4">
                    <User className="w-12 h-12 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <p className="text-muted-foreground">{profile.email}</p>
                  </div>
                </div>
                <Button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="clay clay-hover"
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    disabled={!isEditing}
                    className="clay-inset"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    disabled={!isEditing}
                    className="clay-inset"
                  />
                </div>
              </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <Card key={idx} className="clay clay-hover p-6 text-center">
                  <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              ))}
            </div>

            {/* Activity Card */}
            <Card className="clay p-6">
              <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { action: "Completed training", time: "2 hours ago", icon: "🎯" },
                  { action: "Started OBS session", time: "5 hours ago", icon: "🎥" },
                  { action: "Updated profile", time: "1 day ago", icon: "✏️" },
                  { action: "Subscribed to Yearly plan", time: "3 days ago", icon: "💎" }
                ].map((activity, idx) => (
                  <div key={idx} className="clay-inset p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{activity.icon}</span>
                      <span className="font-medium">{activity.action}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Subscription & Actions */}
          <div className="space-y-6">
            {/* Subscription Card */}
            <Card className="clay p-6">
              <h3 className="text-xl font-bold mb-4">Subscription</h3>
              <Badge className="mb-4 bg-primary text-primary-foreground">
                {profile.plan} Plan
              </Badge>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Joined:</span>
                  <span className="font-medium">{profile.joinDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Next billing:</span>
                  <span className="font-medium">{profile.nextBilling}</span>
                </div>
              </div>
              <Button className="w-full clay clay-hover mb-3">
                Manage Subscription
              </Button>
              <Button variant="outline" className="w-full clay">
                View Billing History
              </Button>
            </Card>

            {/* Download Card */}
            <Card className="clay clay-glow p-6">
              <h3 className="text-xl font-bold mb-3">Desktop App</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Download the desktop app for full OBS Studio integration
              </p>
              <Button className="w-full clay clay-hover">
                <Download className="w-4 h-4 mr-2" />
                Download App
              </Button>
            </Card>

            {/* Actions Card */}
            <Card className="clay p-6">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full clay justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" className="w-full clay justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Support
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full justify-start"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
