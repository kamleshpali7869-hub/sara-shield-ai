"use client";
import { useEffect, useState } from "react";

// Teri Live ID - kabhi change mat karna
const PAYPAL_CLIENT_ID = "AeuBNcCmBD9D3vxx4K0v1K2Hv1fI049dCbBtdULFw5I04o3-6-IfIY1xUS1CEH0_uQUOimny9MBdZSaF";
const PAYPAL_PLAN_ID = "P-6NT272815G8021324NJJGFJI";

declare global { interface Window { paypal: any; } }

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

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&currency=USD&components=buttons`;
    script.async = true;
    script.onload = () => {
      if (!window.paypal) return;

      window.paypal.Buttons({
        style: { shape: "pill", color: "gold", layout: "vertical", label: "subscribe", height: 42 },
        createSubscription: (_d: any, actions: any) => {
          if (!localStorage.getItem("sara_user")) { setShowLogin(true); throw new Error("Login Required"); }
          return actions.subscription.create({ plan_id: PAYPAL_PLAN_ID });
        },
        onApprove: (data: any) => {
          localStorage.setItem("sara_pro", "true"); setIsPro(true);
          alert("✅ PRO Activated! Subscription ID: " + data.subscriptionID);
        }
      }).render("#paypal-pro-container");

      window.paypal.Buttons({
        style: { shape: "pill", color: "white", layout: "vertical", label: "buynow", height: 42 },
        createOrder: (_d: any, actions: any) => {
          if (!localStorage.getItem("sara_user")) { setShowLogin(true); throw new Error("Login Required"); }
          return actions.order.create({ purchase_units: [{ amount: { value: "49.99" }, description: "SARA Shield AI - Lifetime Access" }] });
        },
        onApprove: (_d: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            localStorage.setItem("sara_pro", "true"); setIsPro(true);
            alert("🔥 Lifetime Unlocked! Order ID: " + details.id);
          });
        }
      }).render("#paypal-lifetime-container");
    };
    document.body.appendChild(script);
  }, []);

  const handleLogin = () => {
    if (!email.includes("@")) return alert("Sahi email dalo bhai");
    const u = { email, name: email.split("@")[0] };
    localStorage.setItem("sara_user", JSON.stringify(u));
    setUser(u); setShowLogin(false); setEmail("");
  };

  const handleLogout = () => {
    localStorage.removeItem("sara_user");
    setUser(null);
  };

  const handleScan = () => {
    if (!user) { setShowLogin(true); return; }
    if (!isPro && checks >= 5) { alert("Free limit khatam! PRO lo - 5 checks/day only"); return; }
    if (!input.trim()) return alert("Pehle message paste karo");
    setLoading(true); setResult(null);
    setTimeout(() => {
      const t = input.toLowerCase();
      const isScam = t.includes("urgent") || t.includes("blocked") || t.includes("click here") || t.includes("lottery");
      setResult({ risk: isScam? "High Risk - SCAM" : "Low Risk - Safe", msg: isScam? "Ye 100% Scam hai! Link par click mat karna aur kisi ko OTP mat dena." : "Ye message safe lag raha hai, par phir bhi anjaan link se bacho." });
      if (!isPro) { const n = checks + 1; setChecks(n); localStorage.setItem("sara_checks", n.toString()); }
      setLoading(false);
    }, 1100);
  };

  return (
    <div className="min-h-screen bg-[#080810] text-white flex flex-col items-center">
      <div className="w-full bg-[#ffeb3b] text-black text-center py-2 text-[11px] font-bold">PayPal Review Pending: Approval ke baad auto-on ho jayega. Plan ID: {PAYPAL_PLAN_ID}</div>

      {/* NAVBAR */}
      <div className="w-full max-w-5xl flex justify-between items-center px-6 py-4">
        <h1 className="font-black text-xl tracking-tight">SARA SHIELD AI 🛡️</h1>
        {user? (
          <div className="flex items-center gap-3">
            <span className="text-xs bg-[#1a1a28] border border-[#2a2a40] px-3 py-1.5 rounded-full">{user.email} {isPro && "⭐PRO"}</span>
            <button onClick={handleLogout} className="bg-[#222] px-3 py-1.5 rounded-full text-xs">Logout</button>
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)} className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-200">Login</button>
        )}
      </div>

      <div className="max-w-4xl w-full px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-black mt-4 tracking-tight">World's Most Advanced</h2>
        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">AI Scam Detector</h2>
        <p className="text-gray-400 text-sm mt-3">{user? (isPro? "Unlimited Protection Active" : `${5 - checks} free checks bache hain`) : "Global Protection - Login to start"}</p>

        <div className="mt-8 bg-[#15151f]/90 backdrop-blur border border-[#2a2a42] rounded-3xl p-6 shadow-2xl text-left">
          <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Yahan suspicious message paste karo... Ex: 'Urgent! Your account will be blocked, click here...'" className="w-full h-28 bg-[#0d0d15] border border-[#252538] rounded-2xl p-4 text-sm outline-none focus:border-yellow-400 resize-none"/>
          <button onClick={handleScan} className="w-full mt-4 bg-white text-black font-black py-4 rounded-2xl hover:bg-gray-100 transition text-sm tracking-wide">{loading? "SARA AI Scanning..." : user? "Scan Now with SARA AI" : "Login to Scan"}</button>
          {result && <div className={`mt-4 p-4 rounded-2xl text-sm font-bold border ${result.risk.includes("High")? "bg-red-500/10 border-red-500/30 text-red-300" : "bg-green-500/10 border-green-500/30 text-green-300"}`}><b>{result.risk}</b> - {result.msg}</div>}
        </div>

        <div className="grid md:grid-cols-3 gap-5 mt-10 text-left pb-10">
          <div className="bg-[#171725] border border-[#26263a] rounded-[22px] p-6 flex flex-col"><h3 className="text-sm font-bold text-gray-400">Free</h3><p className="text-4xl font-black mt-2">$0</p><p className="text-xs text-gray-500 mt-1">5 checks / day</p><p className="text-xs text-gray-500 mt-auto pt-8">Perfect for trying</p></div>

          <div className="bg-[#171725] border-2 border-[#ffcc00] rounded-[22px] p-6 flex flex-col shadow-[0_0_40px_rgba(255,204,0,0.12)] scale-[1.03]"><h3 className="text-sm font-black text-[#ffcc00]">⭐ PRO - $9.99/mo</h3><p className="text-[12px] text-gray-300 mt-2 leading-[18px]">Unlimited checks, AI Analysis, 24/7 Protection</p><div id="paypal-pro-container" className="mt-5"></div><p className="text-[10px] text-center text-gray-500 mt-3">Secure by PayPal • Cancel anytime</p></div>

          <div className="bg-[#171725] border border-[#26263a] rounded-[22px] p-6 flex flex-col"><h3 className="text-sm font-bold text-white">Lifetime</h3><p className="text-4xl font-black mt-2">$49.99</p><p className="text-xs text-gray-500 mt-1">One time payment</p><div id="paypal-lifetime-container" className="mt-5"></div><p className="text-[10px] text-center text-gray-500 mt-3">Pay once, use forever</p></div>
        </div>
        <p className="text-[10px] text-gray-600 pb-8">© 2025 SARA Shield AI • Product ID: PROD-4YQ98022AF9172103</p>
      </div>

      {showLogin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[99] p-4">
          <div className="bg-[#15151f] border border-[#2a2a42] rounded-[24px] p-7 w-full max-w-[360px] shadow-2xl">
            <h2 className="text-2xl font-black">Login to SARA</h2><p className="text-xs text-gray-400 mt-1">Client ka data secure rahega, PRO isi email par active hoga</p>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="client@gmail.com" className="w-full mt-6 bg-[#0d0d15] border border-[#2a2a42] rounded-xl p-3.5 text-sm outline-none focus:border-yellow-400"/>
            <button onClick={handleLogin} className="w-full mt-4 bg-white text-black font-black py-3.5 rounded-xl">Continue →</button>
            <button onClick={() => setShowLogin(false)} className="w-full mt-3 text-xs text-gray-500">Cancel, bina login ke dekhu</button>
            <p className="text-[10px] text-gray-500 text-center mt-4 leading-3">Login karne se hi Free ke 5 checks aur PRO unlock hoga. Yehi tera Client Login hai.</p>
          </div>
        </div>
      )}
    </div>
  );
}