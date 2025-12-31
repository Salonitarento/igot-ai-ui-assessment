import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, LogIn, CheckCircle2, Sparkles, Brain, Target, BarChart3 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import igotLogo from "@/assets/igot-ai-logo.svg";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username.length < 3) {
      toast({
        title: "Validation Error",
        description: "Username must be at least 3 characters.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const result = await login(username, password);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Welcome!",
        description: "You have successfully logged in.",
      });
      navigate("/");
    } else {
      toast({
        title: "Login Failed",
        description: result.error || "Invalid credentials.",
        variant: "destructive",
      });
    }
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Generation",
      description: "Create assessments in seconds using advanced AI technology"
    },
    {
      icon: Target,
      title: "Bloom's Taxonomy Aligned",
      description: "Ensure cognitive level coverage with configurable distributions"
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Track assessment performance and learning outcomes"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#1f2847] to-[#2a3a5f] flex">
      {/* Left Side - Product Showcase */}
      <div className="hidden lg:flex lg:w-3/5 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#f0951e]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#1f3c85]/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#e94e12]/10 rounded-full blur-3xl" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <img src={igotLogo} alt="iGOT AI" className="h-14" />
        </div>

        {/* Main content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/10">
              <Sparkles className="w-4 h-4 text-[#f0951e]" />
              <span className="text-sm font-medium text-white/90">AI-Driven Assessment Platform</span>
            </div>
            <h1 className="text-5xl font-bold text-white leading-tight">
              Create Intelligent<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f0951e] to-[#e94e12]">
                Assessments
              </span>
              <br />in Minutes
            </h1>
            <p className="text-lg text-white/70 max-w-lg">
              Transform your teaching with iGOT AI's powerful assessment generation. Create curriculum-aligned questions that adapt to your learning objectives.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 transition-all hover:bg-white/10"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#f0951e] to-[#e94e12] flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-white/60">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-sm text-white/50">
            Powered by iGOT AI • Karmayogi Bharat
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <img src={igotLogo} alt="iGOT AI" className="h-12" />
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
            <p className="text-muted-foreground">
              Sign in to continue to iGOT AI
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-foreground">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11 bg-background border-border focus:border-primary focus:ring-primary/20"
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10 bg-background border-border focus:border-primary focus:ring-primary/20"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-[#1f3c85] to-[#2a4a9f] hover:from-[#2a4a9f] hover:to-[#1f3c85] text-white font-medium shadow-lg transition-all hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Benefits */}
          <div className="pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-4">What you'll get with iGOT AI</p>
            <div className="space-y-2">
              {[
                "Generate MCQs, True/False & more",
                "Customize difficulty levels",
                "Export in multiple formats"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              iGOT AI • AI-Driven Assessment Generation Tool
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
