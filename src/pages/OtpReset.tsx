import { useEffect, useMemo, useState } from "react";
import { supabase as sb } from "@/integrations/supabase/client";
import { createClient } from "@supabase/supabase-js";

const supabase = (sb ?? createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
));

export default function OtpReset() {
  const qpEmail = useMemo(() => new URL(window.location.href).searchParams.get("email") ?? "", []);
  const [hover, setHover] = useState(false);
  const [email, setEmail] = useState(qpEmail);
  const [otp, setOtp] = useState("");
  const [pwd, setPwd] = useState("");
  const [cpwd, setCpwd] = useState("");
  const [step, setStep] = useState<1 | 2>(qpEmail ? 2 : 1);
  const [msg, setMsg] = useState<string | undefined>();
  const [err, setErr] = useState<string | undefined>();
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown(cooldown - 1), 1e3);
      return () => clearTimeout(t);
    }
  }, [cooldown]);

  const norm = (v: string) => {
    const raw = v.trim().toLowerCase();
    return raw.includes("@") ? raw : `${raw}@muj.manipal.edu`;
  };

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setErr(undefined);
    setMsg(undefined);
    const { error } = await supabase.auth.signInWithOtp({
      email: norm(email),
      options: { shouldCreateUser: false }
    });
    if (error) return setErr(error.message);
    setMsg("OTP sent");
    setStep(2);
    setCooldown(30);
  }

  async function resend() {
    if (cooldown > 0) return;
    const { error } = await supabase.auth.signInWithOtp({
      email: norm(email),
      options: { shouldCreateUser: false }
    });
    if (error) return setErr(error.message);
    setMsg("OTP resent");
    setCooldown(30);
  }

  async function resetPwd(e: React.FormEvent) {
    e.preventDefault();
    setErr(undefined);
    setMsg(undefined);
    if (pwd !== cpwd) return setErr("Passwords do not match");
    const v = await supabase.auth.verifyOtp({
      email: norm(email),
      token: otp.trim(),
      type: "email"
    });
    if (v.error) return setErr("Incorrect OTP");
    const u = await supabase.auth.updateUser({ password: pwd });
    if (u.error) return setErr(u.error.message);
    setMsg("Password updated");
    setTimeout(() => { window.location.href = "/login"; }, 800);
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
          <h2 className="text-center text-gray-600 tracking-widest text-sm uppercase">RESET PASSWORD</h2>
          {err && <div className="mt-3 text-sm text-red-600">{err}</div>}
          {msg && <div className="mt-3 text-sm text-green-700">{msg}</div>}

          {step === 1 && (
            <form onSubmit={sendOtp} className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                  required
                  className="flex-1 border p-3 rounded"
                />
                {!email.includes("@") && (
                  <span className="text-sm text-gray-600 whitespace-nowrap">@muj.manipal.edu</span>
                )}
              </div>
              <button type="submit" className="w-full bg-[#d97706] hover:bg-[#b45309] text-white p-3 rounded font-medium">
                Send OTP
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={resetPwd} className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                  required
                  className="flex-1 border p-3 rounded bg-gray-50"
                  readOnly={!!qpEmail}
                />
                {!email.includes("@") && (
                  <span className="text-sm text-gray-600 whitespace-nowrap">@muj.manipal.edu</span>
                )}
              </div>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                required
                className="w-full border p-3 rounded"
              />
              <input
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                type="password"
                placeholder="New password"
                minLength={6}
                required
                className="w-full border p-3 rounded"
              />
              <input
                value={cpwd}
                onChange={(e) => setCpwd(e.target.value)}
                type="password"
                placeholder="Confirm password"
                minLength={6}
                required
                className="w-full border p-3 rounded"
              />
              <button type="submit" className="w-full bg-[#d97706] hover:bg-[#b45309] text-white p-3 rounded font-medium">
                Reset Password
              </button>
              <button
                type="button"
                onClick={resend}
                disabled={cooldown > 0}
                className="w-full text-[#d97706] mt-1 disabled:opacity-50 disabled:cursor-not-allowed hover:underline"
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
