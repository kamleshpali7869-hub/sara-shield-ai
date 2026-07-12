"use client";
import { useEffect, useState } from "react";

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
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  // 1. Load script once
  useEffect(() => {
    const savedUser = localStorage.getItem("sara_user");
    if (savedUser) setUser(JSON.parse(savedUser));
    if (localStorage.getItem("sara_pro") === "true") setIsPro(true);
    setChecks(parseInt(localStorage.getItem("sara_checks") || "0"));
    if (document.getElementById("paypal-sdk")) { setPaypalLoaded(true); return; }
    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&currency=USD&components=buttons`;
    script.onload = () => setPaypalLoaded(true);
    document.body.appendChild(script);
  }, []);

  // 2. Render PayPal JAB BHI user login ho ya paypal load ho
  useEffect(() => {
    if (!user ||!paypalLoaded ||!window.paypal) return;
    // thoda delay taaki div DOM me aa jaye
    setTimeout(() => {
      const pro = document.getElementById("paypal-pro-container");
      const life = document.getElementById("paypal-lifetime-container");
      if (!pro ||!life) return;
      pro.innerHTML = ""; life.innerHTML = "";
      try {
        window.paypal.Buttons({
          style: { shape: "pill", color: "gold", layout: "vertical", label: "subscribe", height: 42 },
          createSubscription: (_a:any, actions:any) => actions.subscription.create({ plan_id: PAYPAL_PLAN_ID }),
          onApprove: (d:any) => { localStorage.setItem("sara_pro","true"); setIsPro(true); alert("✅ PRO Active! "+d.subscriptionID); }
        }).render("#paypal-pro-container");
        window.paypal.Buttons({
          style: { shape: "pill", color: "white", layout: "vertical", label: "buynow", height: 42 },
          createOrder: (_a:any, actions:any) => actions.order.create({ purchase_units: [{ amount: { value: "49.99" } }] }),
          onApprove: (_a:any, actions:any) => actions.order.capture().then(()=>{ localStorage.setItem("sara_pro","true"); setIsPro(true); alert("🔥 Lifetime Unlocked!"); })
        }).render("#paypal-lifetime-container");
      } catch(e){ console.log("paypal render error", e); }
    }, 500);
  }, [user, paypalLoaded]);

  const handleLogin = () => { if(!email.includes("@")) return alert("Sahi email dalo"); const u={email,name:email.split("@")[0]}; localStorage.setItem("sara_user",JSON.stringify(u)); setUser(u); setShowLogin(false); };
  const handleLogout = () => { localStorage.removeItem("sara_user"); setUser(null); setResult(null); };
  const handleScan = () => { if(!user){setShowLogin(true);return;} if(!isPro && checks>=5) return alert("Free limit khatam! PRO lo"); if(!input.trim()) return alert("Message paste karo"); setLoading(true); setTimeout(()=>{ const t=input.toLowerCase(); const s=t.includes("urgent")||t.includes("click here")||t.includes("earn rs"); setResult({risk:s?"High Risk - SCAM":"Low Risk - Safe",msg:s?"Ye 100% Scam hai! Link par click mat karo.":"Safe lag raha hai."}); if(!isPro){const n=checks+1; setChecks(n); localStorage.setItem("sara_checks",n.toString());} setLoading(false);},1000); };

  return (
    <div className="min-h-screen bg-[#080810] text-white flex flex-col items-center">
      <div className="w-full bg-[#ffeb3b] text-black text-center py-2 text-[11px] font-bold">PayPal Review Pending - Plan ID: {PAYPAL_PLAN_ID}</div>
      <div className="w-full max-w-5xl flex justify-between items-center px-6 py-4"><h1 className="font-black text-xl">SARA SHIELD AI 🛡️</h1>{user? <div className="flex gap-2 items-center"><span className="text-[11px] bg-[#1a1a28] border border-[#2a2a40] px-3 py-1.5 rounded-full">{user.email} {isPro && "⭐PRO"}</span><button onClick={handleLogout} className="bg-[#222] px-3 py-1.5 rounded-full text-xs">Logout</button></div> : <button onClick={()=>setShowLogin(true)} className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm">Login</button>}</div>

      <div className="max-w-4xl w-full px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-black mt-4">World's Most Advanced</h2><h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">AI Scam Detector</h2>
        <p className="text-gray-400 text-sm mt-3">{user? (isPro? "Unlimited Protection Active":`${5-checks} free checks bache hain`):"Global Protection - Login to start"}</p>

        {!user? (
          <div className="mt-8 bg-[#15151f] border border-[#2a2a42] rounded-3xl p-10"><h2 className="text-2xl font-black">🔒 Login Required</h2><p className="text-sm text-gray-400 mt-2">Bina login ke scan aur payment kaam nahi karega</p><button onClick={()=>setShowLogin(true)} className="mt-6 bg-white text-black font-black px-8 py-3.5 rounded-2xl">Login to Continue →</button></div>
        ) : (
          <>
            <div className="mt-8 bg-[#15151f] border border-[#2a2a42] rounded-3xl p-6 text-left"><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Yahan message paste karo..." className="w-full h-28 bg-[#0d0d15] border border-[#252538] rounded-2xl p-4 text-sm outline-none focus:border-yellow-400 resize-none"/><button onClick={handleScan} className="w-full mt-4 bg-white text-black font-black py-4 rounded-2xl">{loading? "Scanning...":"Scan Now with SARA AI"}</button>{result && <div className={`mt-4 p-4 rounded-2xl text-sm font-bold border ${result.risk.includes("High")?"bg-red-500/10 border-red-500/30 text-red-300":"bg-green-500/10 border-green-500/30 text-green-300"}`}><b>{result.risk}</b> - {result.msg}</div>}</div>

            <div className="grid md:grid-cols-3 gap-5 mt-8 text-left pb-10">
              <div className="bg-[#171725] border border-[#26263a] rounded-2xl p-6"><h3 className="text-sm text-gray-400">Free</h3><p className="text-4xl font-black mt-1">$0</p><p className="text-xs text-gray-500">5 checks / day</p></div>
              <div className="bg-[#171725] border-2 border-[#ffcc00] rounded-2xl p-6 scale-[1.03] shadow-[0_0_30px_rgba(255,204,0,0.15)]"><h3 className="font-black text-[#ffcc00] text-sm">⭐ PRO - $9.99/mo</h3><p className="text-xs text-gray-400 mt-1">Unlimited checks</p><div id="paypal-pro-container" className="mt-4 min-h-[50px]"></div><p className="text-[10px] text-center text-gray-500 mt-2">Secure by PayPal</p></div>
              <div className="bg-[#171725] border border-[#26263a] rounded-2xl p-6"><h3 className="text-sm">Lifetime</h3><p className="text-4xl font-black mt-1">$49.99</p><div id="paypal-lifetime-container" className="mt-4 min-h-[50px]"></div><p className="text-[10px] text-center text-gray-500 mt-2">Pay once, use forever</p></div>
            </div>
          </>
        )}
      </div>

      {showLogin && (<div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50 p-4"><div className="bg-[#15151f] border border-[#2a2a42] rounded-2xl p-7 w-full max-w-[360px]"><h2 className="text-2xl font-black">Login to SARA</h2><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@gmail.com" className="w-full mt-6 bg-[#0d0d15] border border-[#2a2a42] rounded-xl p-3.5 text-sm outline-none"/><button onClick={handleLogin} className="w-full mt-4 bg-white text-black font-black py-3.5 rounded-xl">Continue →</button><button onClick={()=>setShowLogin(false)} className="w-full mt-3 text-xs text-gray-500">Cancel</button></div></div>)}
    </div>
  );
}