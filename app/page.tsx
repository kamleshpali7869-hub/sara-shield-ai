
"use client";
import { useEffect, useState } from "react";

const PAYPAL_CLIENT_ID = "AeuBNcCmBD9D3vxm4K0vlK2Hv1fl049dCbBtdULFw5lO4o3-6-IfIYlxUSlCEHO_uQUOimny9MBdZSaF"; 
const PAYPAL_PLAN_ID = "P-6NT272815G8021324NJJGFJI";

declare global { interface Window { paypal: any; } }

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("sara_pro") === "true") setIsPro(true);
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription,order&currency=USD`;
    script.async = true;
    script.onload = () => {
      if (!window.paypal) return;
      // PRO Monthly Button $9.99
      window.paypal.Buttons({
        style: { shape: "pill", color: "gold", layout: "vertical", label: "subscribe" },
        createSubscription: (data:any, actions:any) => actions.subscription.create({ plan_id: PAYPAL_PLAN_ID }),
        onApprove: (data:any) => { localStorage.setItem("sara_pro","true"); setIsPro(true); alert("✅ PRO Active! ID: "+data.subscriptionID); }
      }).render("#paypal-pro-container");

      // LIFETIME One-Time $49.99
      window.paypal.Buttons({
        style: { shape: "pill", color: "white", layout: "vertical", label: "buynow" },
        createOrder: (data:any, actions:any) => actions.order.create({ purchase_units: [{ amount: { value: "49.99" }, description: "SARA Shield Lifetime" }] }),
        onApprove: (data:any, actions:any) => actions.order.capture().then((d:any)=>{ localStorage.setItem("sara_pro","true"); setIsPro(true); alert("🔥 Lifetime Unlocked! ID: "+d.id); })
      }).render("#paypal-lifetime-container");
    };
    document.body.appendChild(script);
  }, []);

  const handleScan = async () => {
    if(!input.trim()) return alert("Message dalo!");
    setLoading(true); setResult(null);
    setTimeout(()=>{ const isScam = input.toLowerCase().includes("urgent"); setResult({ riskLevel: isScam?"High":"Low", riskFlags: isScam?["Urgent"]:["Safe"], explanation: isScam?"Scam lag raha hai":"Safe hai", recommendation: isScam?"Click mat karo":"OK hai"}); setLoading(false); },1200);
  };
  const getColor = (l:string) => l==="High"?"border-red-500 bg-red-500/10 text-red-400":"border-green-500 bg-green-500/10 text-green-400";

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="bg-yellow-400 text-black text-center py-2 text-xs font-bold">PayPal Review Pending - Approval ke baad payment auto-on. Plan: {PAYPAL_PLAN_ID}</div>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-5xl font-black text-center">SARA SHIELD AI 🛡️</h1>
        {isPro && <p className="text-center mt-2 text-green-400 font-bold">✅ PRO ACTIVE</p>}
        <div className="bg-[#15151d] border border-[#2a2a35] rounded-2xl p-6 mt-8">
          <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Suspicious message paste karo..." className="w-full h-28 bg-[#0a0a0f] border border-[#333] rounded-xl p-4 outline-none"/>
          <button onClick={handleScan} className="w-full mt-4 bg-white text-black font-bold py-3 rounded-xl">{loading?"Scanning...":"Scan Now"}</button>
          {result && <div className={`mt-4 border rounded-xl p-4 ${getColor(result.riskLevel)}`}>{result.riskLevel}</div>}
        </div>
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <div className="bg-[#15151d] border border-[#222] p-6 rounded-2xl"><h3>Free</h3><p className="text-3xl font-black">$0</p><p className="text-sm text-gray-500">5 checks/day</p></div>
          <div className="bg-[#15151d] border-2 border-yellow-400 p-6 rounded-2xl scale-105"><h3 className="text-yellow-400 font-bold">PRO $9.99/mo</h3><div id="paypal-pro-container" className="mt-4"></div><p className="text-xs text-center text-gray-500 mt-2">Powered by PayPal</p></div>
          <div className="bg-[#15151d] border-2 border-white p-6 rounded-2xl"><h3 className="font-bold">Lifetime</h3><p className="text-3xl font-black">$49.99</p><p className="text-sm text-gray-500">One time</p><div id="paypal-lifetime-container" className="mt-4"></div></div>
        </div>
      </div>
    </div>
  );
}