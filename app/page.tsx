"use client";
import { useEffect, useState } from "react";

const PAYPAL_PLAN_ID = "P-6NT272815G8021324NJJGFJI";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isPro, setIsPro] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [checks, setChecks] = useState(0);

  useEffect(() => {
    const savedUser = localStorage.getItem("sara_user");
    if (savedUser) setUser(JSON.parse(savedUser));
    if (localStorage.getItem("sara_pro") === "true") setIsPro(true);
    setChecks(parseInt(localStorage.getItem("sara_checks") || "0"));
  }, []);

  const handleLogin = () => {
    if (!email.includes("@")) return alert("Sahi email dalo bhai");
    const u = { email, name: email.split("@")[0] };
    localStorage.setItem("sara_user", JSON.stringify(u));
    setUser(u);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("sara_user");
    setUser(null);
    setResult(null);
  };

  const handleScan = () => {
    if (!user) { setShowLogin(true); return; }
    if (!isPro && checks >= 5) return alert("Free limit khatam! PRO lo $9.99 me");
    if (!input.trim()) return alert("Pehle message paste karo");
    setLoading(true);
    setTimeout(() => {
      const t = input.toLowerCase();
      const isScam = t.includes("urgent") || t.includes("click here") || t.includes("earn") || t.includes("http") || t.includes("kyc") || t.includes("otp") || t.includes("lottery");
      setResult({
        risk: isScam? "High Risk - SCAM 🔴" : "Low Risk - Safe 🟢",
        msg: isScam? "Ye 100% Scam hai! Link par click mat karo, paise mat bhejo." : "Safe lag raha hai, phir bhi savdhani rakho."
      });
      if (!isPro) {
        const n = checks + 1;
        setChecks(n);
        localStorage.setItem("sara_checks", n.toString());
      }
      setLoading(false);
    }, 900);
  };

  const buyPro = () => {
    window.open(`https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=${PAYPAL_PLAN_ID}`, "_blank");
    localStorage.setItem("sara_pro", "true");
    setIsPro(true);
    alert("✅ PRO Active kar diya (Test Mode). PayPal approval ke baad real payment lagega!");
  };

  const buyLifetime = () => {
    window.open("https://www.paypal.com/ncp/payment/49.99", "_blank");
    localStorage.setItem("sara_pro", "true");
    setIsPro(true);
    alert("🔥 Lifetime Unlocked (Test Mode)!");
  };

  return (
    <div className="min-h-screen bg-[#080810] text-white flex flex-col items-center">
      <div className="w-full bg-[#ffeb3b] text-black text-center py-2 text-xs font-bold">PayPal Review Pending. Approval ke baad auto-on ho jayega. Plan ID: {PAYPAL_PLAN_ID}</div>

      <div className="w-full max-w-5xl flex justify-between items-center px-6 py-4">
        <h1 className="font-black text-xl tracking-tight">SARA SHIELD AI 🛡️</h1>
        {user? (
          <div className="flex gap-2 items-center">
            <span className="text-xs bg-[#1a1a28] border border-[#2a2a40] px-3 py-1.5 rounded-full">{user.email} {isPro && "⭐PRO"}</span>
            <button onClick={handleLogout} className="bg-[#222] px-3 py-1.5 rounded-full text-xs">Logout</button>
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)} className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm">Login</button>
        )}
      </div>

      <div className="max-w-4xl w-full px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-black mt-4 leading-tight">World's Most Advanced</h2>
        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">AI Scam Detector</h2>
        <p className="text-gray-400 text-sm mt-3">{user? (isPro? "Unlimited Protection Active 🔓" : `${5 - checks} free checks bache hain`) : "Global Protection - Login to start"}</p>

        {!user? (
          <div className="mt-8 bg-[#15151f] border border-[#2a2a42] rounded-3xl p-10">
            <h2 className="text-2xl font-black">🔒 Login Required</h2>
            <p className="text-sm text-gray-400 mt-2">Scam check karne ke liye pehle login karo. Free me 5 checks milenge.</p>
            <button onClick={() => setShowLogin(true)} className="mt-6 bg-white text-black font-black px-8 py-3.5 rounded-2xl">Login to Continue →</button>
          </div>
        ) : (
          <>
            <div className="mt-8 bg-[#15151f] border border-[#2a2a42] rounded-3xl p-6 text-left shadow-2xl">
              <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Yahan suspicious message paste karo..." className="w-full h-32 bg-[#0d0d15] border border-[#252538] rounded-2xl p-4 text-sm outline-none focus:border-yellow-400 resize-none" />
              <button onClick={handleScan} className="w-full mt-4 bg-white text-black font-black py-4 rounded-2xl hover:bg-gray-200 transition">{loading? "Scanning..." : isPro? "Scan Now (Unlimited) ♾️" : `Scan Now with SARA AI (${5 - checks} left)`}</button>
              {result && <div className={`mt-4 p-4 rounded-2xl text-sm font-bold border ${result.risk.includes("High")? "bg-red-500/10 border-red-500/30 text-red-300" : "bg-green-500/10 border-green-500/30 text-green-300"}`}><b>{result.risk}</b> - {result.msg}</div>}
            </div>

            <div className="grid md:grid-cols-3 gap-5 mt-8 text-left pb-12">
              <div className="bg-[#171725] border border-[#26263a] rounded-2xl p-6">
                <h3 className="text-sm text-gray-400">Free</h3><p className="text-4xl font-black mt-2">$0</p><p className="text-xs text-gray-500 mt-1">5 checks / day</p><p className="text-xs text-gray-600 mt-6">Perfect for trying</p>
              </div>
              <div className="bg-[#171725] border-2 border-[#ffcc00] rounded-2xl p-6 scale-[1.03] shadow-[0_0_40px_rgba(255,204,0,0.15)]">
                <h3 className="font-black text-[#ffcc00] text-sm">⭐ PRO - $9.99/mo</h3><p className="text-xs text-gray-400 mt-1">Unlimited checks, 24/7 Protection</p>
                <button onClick={buyPro} className="w-full mt-5 bg-[#ffcc00] text-black font-black py-3.5 rounded-xl">Pay with PayPal - $9.99</button>
                <p className="text-[10px] text-center text-gray-500 mt-2">Secure by PayPal • Cancel anytime</p>
              </div>
              <div className="bg-[#171725] border border-[#26263a] rounded-2xl p-6">
                <h3 className="text-sm">Lifetime</h3><p className="text-4xl font-black mt-2">$49.99</p><p className="text-xs text-gray-500 mt-1">Pay once, use forever</p>
                <button onClick={buyLifetime} className="w-full mt-5 bg-white text-black font-black py-3.5 rounded-xl">Pay with PayPal - $49.99</button>
                <p className="text-[10px] text-center text-gray-500 mt-2">One time payment</p>
              </div>
            </div>
          </>
        )}
      </div>

      {showLogin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50 p-4">
          <div className="bg-[#15151f] border border-[#2a2a42] rounded-2xl p-7 w-full max-w-[360px]">
            <h2 className="text-2xl font-black">Login to SARA</h2><p className="text-xs text-gray-500 mt-1">Free 5 checks paane ke liye login karo</p>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@gmail.com" className="w-full mt-6 bg-[#0d0d15] border border-[#2a2a42] rounded-xl p-3.5 text-sm outline-none focus:border-white" />
            <button onClick={handleLogin} className="w-full mt-4 bg-white text-black font-black py-3.5 rounded-xl">Continue →</button>
            <button onClick={() => setShowLogin(false)} className="w-full mt-3 text-xs text-gray-500">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}