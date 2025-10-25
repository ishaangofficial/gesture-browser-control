import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle2 } from "lucide-react";

interface WaitlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WaitlistDialog = ({ open, onOpenChange }: WaitlistDialogProps) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setLoading(false);
    
    toast({
      title: "You're on the waitlist! 🎉",
      description: "We'll notify you when the desktop app is ready.",
    });

    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="clay sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Join the Waitlist</DialogTitle>
          <DialogDescription>
            Get early access to the SparshMukhti desktop app with full OBS Studio integration.
          </DialogDescription>
        </DialogHeader>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 clay-inset"
                    required
                  />
                </div>
              </div>
              
              <div className="clay-inset p-4 rounded-lg space-y-2">
                <p className="text-sm font-semibold">What you'll get:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Native OBS Studio plugin</li>
                  <li>✓ Advanced gesture customization</li>
                  <li>✓ Offline mode support</li>
                  <li>✓ Priority support</li>
                </ul>
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="submit" 
                className="w-full clay clay-hover"
                disabled={loading}
              >
                {loading ? "Joining..." : "Join Waitlist"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="clay p-4 rounded-full clay-glow">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gradient mb-2">You're in!</h3>
              <p className="text-muted-foreground">
                Check your email for confirmation.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WaitlistDialog;
