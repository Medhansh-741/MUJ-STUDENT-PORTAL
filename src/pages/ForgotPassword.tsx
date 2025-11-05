import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import MUJWordmark from "@/components/MUJWordmark";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  const buildEmail = (v: string) => {
    const raw = v.trim().toLowerCase();
    return raw.includes("@") ? raw : `${raw}@muj.manipal.edu`;
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const fullEmail = buildEmail(email);
    navigate(`/auth/otp-reset?email=${encodeURIComponent(fullEmail)}`);
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

            {/* Heading */}
            <div className="text-center space-y-2 pt-4">
              <p className="text-sm text-gray-600 uppercase tracking-wider">RESET PASSWORD</p>
              <h2 className="text-2xl font-semibold text-[#d97706]">Forgot Password</h2>
            </div>

            {/* Form */}
            <form onSubmit={handleResetPassword} className="space-y-6 pt-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1"
                  />
                  {!email.includes("@") && (
                    <span className="text-sm text-gray-600 whitespace-nowrap">@muj.manipal.edu</span>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#d97706] hover:bg-[#b45309] text-white font-medium"
              >
                Continue to OTP Reset <ArrowRight className="ml-2 h-4 w-4" />
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
};

export default ForgotPassword;
