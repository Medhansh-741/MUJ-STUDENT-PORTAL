import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import MUJWordmark from "@/components/MUJWordmark";
import { Link, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [ready, setReady] = useState(false);
  const [pwd, setPwd] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      supabase.auth
        .exchangeCodeForSession(code)
        .then(({ error }) => {
          if (error) {
            toast({
              variant: "destructive",
              title: "Error",
              description: error.message,
            });
          } else {
            setReady(true);
          }
        });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Link",
        description: "No reset code found in URL",
      });
    }
  }, [toast]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: pwd });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } else {
        toast({
          title: "Success",
          description: "Password updated successfully!",
        });
        navigate("/login");
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
  }

  if (!ready) {
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
            <div className="text-center">
              <p className="text-gray-600">Loading…</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

            {/* Heading */}
            <div className="text-center space-y-2 pt-4">
              <p className="text-sm text-gray-600 uppercase tracking-wider">RESET PASSWORD</p>
              <h2 className="text-2xl font-semibold text-[#d97706]">Set New Password</h2>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="space-y-6 pt-2">
              <div className="space-y-2">
                <Input
                  type="password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="New password"
                  minLength={6}
                  required
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#d97706] hover:bg-[#b45309] text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Setting Password..." : (
                  <>
                    Set Password <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="text-left pt-2">
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

