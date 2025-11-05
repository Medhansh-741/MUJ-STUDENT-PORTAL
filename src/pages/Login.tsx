import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import MUJWordmark from "@/components/MUJWordmark";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const raw = username.trim().toLowerCase();
      const email = raw.includes("@") ? raw : `${raw}@muj.manipal.edu`;
      
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign In Failed",
          description: error.message,
        });
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className={`absolute inset-0 transition-[filter,transform] duration-300 ${hover ? "blur-sm scale-[1.01]" : ""}`}
        style={{
          backgroundImage: "url('https://images.careerindia.com/college-photos/21677/muj-campus_1463046011.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
        aria-hidden
      />
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="relative z-10 flex items-center justify-center min-h-screen px-4"
      >
        <div className="w-full max-w-[520px] rounded-2xl bg-white/95 shadow-2xl transition-transform duration-300 hover:scale-[1.02] hover:-translate-y-1 p-8">
          <div className="space-y-6">
            {/* Logo Section */}
            <MUJWordmark />

            {/* Welcome Message */}
            <div className="text-center space-y-2 pt-4">
              <p className="text-sm text-gray-600 uppercase tracking-wider">WELCOME TO MUJ PORTAL</p>
              <h2 className="text-2xl font-semibold text-[#d97706]">Sign In</h2>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSignIn} className="space-y-6 pt-2">
              {/* Username Field with Domain Suffix */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    id="username"
                    type="text"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="flex-1 text-[16px]"
                  />
                  {!username.includes("@") && (
                    <span className="text-sm text-gray-600 whitespace-nowrap">@muj.manipal.edu</span>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  className="flex-1 bg-[#d97706] hover:bg-[#b45309] text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : (
                    <>
                      Sign In <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  className="flex-1 bg-[#d97706] hover:bg-[#b45309] text-white font-medium"
                >
                  Parent Login <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Forgot Password Link */}
              <div className="text-left pt-2">
                <Link
                  to="/forgot-password"
                  className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
