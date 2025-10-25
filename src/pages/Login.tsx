import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Hand, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const demoCredentials = {
    email: "demo@sparshmukhti.com",
    password: "demo123"
  };

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = (values: z.infer<typeof loginSchema>) => {
    if (values.email === demoCredentials.email && values.password === demoCredentials.password) {
      localStorage.setItem("isLoggedIn", "true");
      toast({
        title: "Welcome back! 👋",
        description: "Successfully logged in to SparshMukhti",
      });
      navigate("/");
    } else {
      toast({
        title: "Invalid credentials",
        description: "Please check your email and password",
        variant: "destructive"
      });
    }
  };

  const handleAutoFill = () => {
    form.setValue("email", demoCredentials.email);
    form.setValue("password", demoCredentials.password);
    toast({
      title: "Demo credentials filled",
      description: "Click Login to continue",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      
      <Card className="max-w-md w-full glass border-primary/20 p-8 relative z-10 animate-scale-in">
        <div className="text-center space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-2xl animate-pulse-glow">
              <Hand className="w-12 h-12 text-primary" />
            </div>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gradient">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to SparshMukhti</p>
          </div>

          {/* Demo badge */}
          <div className="glass-hover px-4 py-3 rounded-lg border border-primary/20 cursor-pointer" onClick={handleAutoFill}>
            <div className="flex items-center gap-2 justify-center text-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Click here to auto-fill demo credentials</span>
            </div>
          </div>

          {/* Login form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="demo@sparshmukhti.com"
                        className="glass"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••"
                        className="glass"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" size="lg">
                Login
              </Button>
            </form>
          </Form>

          {/* Demo info */}
          <div className="pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-2">Demo Credentials:</p>
            <div className="text-xs text-muted-foreground space-y-1 font-mono">
              <p>Email: {demoCredentials.email}</p>
              <p>Password: {demoCredentials.password}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;