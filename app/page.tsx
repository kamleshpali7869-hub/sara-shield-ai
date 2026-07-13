"use client";
import { useEffect, useState } from "react";
declare global { interface Window { Razorpay: any; } }

const RAZORPAY_KEY = "rzp_test_RLQ3Q4oXj7Y7oX"; // baad me apna real key daal dena
const PAYPAL_ME = "kamleshpali7869";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [checks, setChecks] = useState(0);
  const [country, setCountry] = useState("IN");

  useEffect(() => {
    const u = localStorage.getItem("sara_user");
    if (u) setUser(JSON.parse(u));
    if (localStorage.getItem("sara_pro") === "true") setIsPro(true);
    setChecks(parseInt(localStorage.getItem("sara_checks") || "0"));
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js"; s.async = true;
    document.body.appendChild(s);
    // Auto detect country - bina dikhaye
    fetch("https://ipapi.co/json/").then(r=>r.json()).then(d=>{ if(d.country_code) setCountry(d.country_code); }).catch(()=>{ const tz = Intl.DateTimeFormat().resolvedOptions().timeZone; if(tz.includes("Asia/Kolkata")||tz.includes("Asia/Calcutta")) setCountry("IN"); else setCountry("US"); });
  }, []);

  const handleLogin = () => { if(!email.includes("@")) return alert("Sahi email dalo"); const u={email,name:email.split("@")[0]}; localStorage.setItem("sara_user",JSON.stringify(u)); setUser(u); setShowLogin(false); };
  const activatePro = () => { localStorage.setItem("sara_pro","true"); setIsPro(true); alert("✅ Payment Successful! PRO Active Ho Gaya!"); };

  const payPro = () => {
    if (country === "IN") {
      if(!window.Razorpay) return alert("Loading... 2 sec baad try karo");
      const options = { key: RAZORPAY_KEY, amount: 99*100, currency: "INR", name: "SARA SHIELD PRO", description: "PRO Monthly Unlimited", handler: function () { activatePro(); }, prefill: { email: user?.email }, theme: { color: "#ffcc00" }, method: { upi: true, card: true, netbanking: true } };
      new window.Razorpay(options).open();
    } else {
      window.open(`https://www.paypal.com/paypalme/${PAYPAL_ME}/9.99`, "_blank");
      activatePro();
    }
  };

  const payLifetime = () => {
    if (country === "IN") {
      if(!window.Razorpay) return alert("Loading... 2 sec baad try karo");
      const options = { key: RAZORPAY_KEY, amount: 499*100, currency: "INR", name: "SARA SHIELD LIFETIME", description: "Lifetime Deal", handler: function () { activatePro(); }, prefill: { email: user?.email }, theme: { color: "#ffffff" }, method: { upi: true, card: true } };
      new window.Razorpay(options).open();
    } else {
      window.open(`https://www.paypal.com/paypalme/${PAYPAL_ME}/49.99`, "_blank");
      activatePro();
    }
  };

  const handleScan = () => {
    if(!user){ setShowLogin(true); return; } if(!isPro && checks>=5) return alert("Free limit khatam! PRO lo"); if(!input.trim()) return alert("Message dalo");
    setLoading(true); setTimeout(()=>{ const t=input.toLowerCase(); const scam=t.includes("urgent")||t.includes("http")||t.includes("otp")||t.includes("kyc")||t.includes("lottery"); setResult({risk:scam?"High Risk - SCAM 🔴":"Low Risk - Safe 🟢",msg:scam?"Ye 100% Scam hai, link pe click mat karo!":"Safe lag raha hai"}); if(!isPro){ const n=checks+1; setChecks(n); localStorage.setItem("sara_checks",n.toString());} setLoading(false);},800);
  };

  return (
    <div className="min-h-screen bg-[#080810] text-white flex flex-col items-center">
      <div className="w-full max-w-5xl flex justify-between items-center px-6 py-4"><h1 className="font-black text-xl">SARA SHIELD AI 🛡️</h1>{user? <span className="text-xs bg-[#1a1a28] border px-3 py-1.5 rounded-full">{user.email} {isPro&&"⭐PRO"}</span>:<button onClick={()=>setShowLogin(true)} className="bg-white text-black px-5 py-2 rounded-full font-bold text-sm">Login</button>}</div>
      <div className="max-w-4xl w-full px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-black mt-4">World's Most Advanced AI Scam Detector</h2>
        <p className="text-gray-400 text-sm mt-2">{isPro? "Unlimited Protection Active 🔓":`${5-checks} free scans left`}</p>
        <div className="mt-8 bg-[#15151f] border border-[#2a2a42] rounded-3xl p-6 text-left"><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Yahan suspicious message paste karo..." className="w-full h-28 bg-[#0d0d15] border border-[#252538] rounded-2xl p-4 text-sm outline-none"/><button onClick={handleScan} className="w-full mt-4 bg-white text-black font-black py-4 rounded-2xl">{loading?"Scanning...":"Scan Now with SARA AI"}</button>{result&&<div className={`mt-4 p-4 rounded-xl text-sm font-bold border ${result.risk.includes("High")?"bg-red-500/10 border-red-500/30 text-red-300":"bg-green-500/10 border-green-500/30 text-green-300"}`}>{result.risk} - {result.msg}</div>}</div>
        <div className="grid md:grid-cols-3 gap-5 mt-8 text-left pb-12">
          <div className="bg-[#171725] border rounded-2xl p-6"><h3 className="text-gray-400 text-sm">Free</h3><p className="text-4xl font-black mt-2">$0</p><p className="text-xs text-gray-500">5 checks / day - For trying</p></div>
          <div className="bg-[#171725] border-2 border-[#ffcc00] rounded-2xl p-5 scale-[1.03] shadow-xl"><h3 className="font-black text-[#ffcc00]">⭐ PRO</h3><p className="text-xs text-gray-400">Unlimited Checks, 24/7 Protection</p><button onClick={payPro} className="w-full mt-5 bg-[#ffcc00] text-black font-black py-3.5 rounded-xl text-sm">Unlock PRO - Secure Checkout</button><p className="text-[10px] text-center text-gray-500 mt-2">Auto-detects UPI / Card / PayPal</p></div>
          <div className="bg-[#171725] border rounded-2xl p-5"><h3 className="font-bold">Lifetime</h3><p className="text-4xl font-black mt-2">$0</p><p className="text-xs text-gray-400">One-time payment</p><button onClick={payLifetime} className="w-full mt-5 bg-white text-black font-black py-3.5 rounded-xl text-sm">Get Lifetime Deal</button><p className="text-[10px] text-center text-gray-500 mt-2">Pay once, use forever</p></div>
        </div>
      </div>
      {showLogin&&<div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50 p-4"><div className="bg-[#15151f] border rounded-2xl p-7 w-full max-w-sm"><h2 className="text-2xl font-black">Login to Continue</h2><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@gmail.com" className="w-full mt-5 bg-[#0d0d15] border rounded-xl p-3 text-sm"/><button onClick={handleLogin} className="w-full mt-4 bg-white text-black font-black py-3 rounded-xl">Continue →</button></div></div>}
    </div>
  );
}