import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Hand, 
  Zap, 
  Palette,
  Bell,
  Shield,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [sensitivity, setSensitivity] = useState([7]);
  const [smoothing, setSmoothing] = useState([5]);
  const [settings, setSettings] = useState({
    soundEffects: true,
    hapticFeedback: false,
    showCursor: true,
    autoStart: false,
    darkMode: true,
    notifications: true
  });

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your gesture control experience</p>
        </div>

        <Tabs defaultValue="gestures" className="w-full">
          <TabsList className="glass w-full justify-start">
            <TabsTrigger value="gestures" className="gap-2">
              <Hand className="w-4 h-4" />
              Gestures
            </TabsTrigger>
            <TabsTrigger value="performance" className="gap-2">
              <Zap className="w-4 h-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-2">
              <Shield className="w-4 h-4" />
              Privacy
            </TabsTrigger>
          </TabsList>

          {/* Gestures Tab */}
          <TabsContent value="gestures" className="space-y-4">
            <Card className="glass p-6">
              <h3 className="text-lg font-semibold mb-4">Gesture Sensitivity</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Cursor Sensitivity</Label>
                    <Badge variant="outline">{sensitivity[0]}</Badge>
                  </div>
                  <Slider 
                    value={sensitivity} 
                    onValueChange={setSensitivity}
                    min={1} 
                    max={10} 
                    step={1}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Higher values make cursor more responsive
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Smoothing</Label>
                    <Badge variant="outline">{smoothing[0]}</Badge>
                  </div>
                  <Slider 
                    value={smoothing} 
                    onValueChange={setSmoothing}
                    min={1} 
                    max={10} 
                    step={1}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Higher values make cursor movement smoother
                  </p>
                </div>
              </div>
            </Card>

            <Card className="glass p-6">
              <h3 className="text-lg font-semibold mb-4">Gesture Options</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Virtual Cursor</Label>
                    <p className="text-sm text-muted-foreground">Display visual cursor overlay</p>
                  </div>
                  <Switch 
                    checked={settings.showCursor}
                    onCheckedChange={(checked) => setSettings({...settings, showCursor: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">Play sounds for gestures</p>
                  </div>
                  <Switch 
                    checked={settings.soundEffects}
                    onCheckedChange={(checked) => setSettings({...settings, soundEffects: checked})}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <Card className="glass p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-start Camera</Label>
                    <p className="text-sm text-muted-foreground">Start camera when page loads</p>
                  </div>
                  <Switch 
                    checked={settings.autoStart}
                    onCheckedChange={(checked) => setSettings({...settings, autoStart: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Haptic Feedback</Label>
                    <p className="text-sm text-muted-foreground">Vibration on supported devices</p>
                  </div>
                  <Switch 
                    checked={settings.hapticFeedback}
                    onCheckedChange={(checked) => setSettings({...settings, hapticFeedback: checked})}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-4">
            <Card className="glass p-6">
              <h3 className="text-lg font-semibold mb-4">Visual Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Use dark color scheme</p>
                  </div>
                  <Switch 
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => setSettings({...settings, darkMode: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications</Label>
                    <p className="text-sm text-muted-foreground">Show gesture notifications</p>
                  </div>
                  <Switch 
                    checked={settings.notifications}
                    onCheckedChange={(checked) => setSettings({...settings, notifications: checked})}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-4">
            <Card className="glass p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Privacy & Security
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>✓ All video processing happens locally in your browser</p>
                <p>✓ No data is sent to external servers</p>
                <p>✓ Camera feed is never recorded or stored</p>
                <p>✓ Open source and fully transparent</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button variant="outline">Reset to Defaults</Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
