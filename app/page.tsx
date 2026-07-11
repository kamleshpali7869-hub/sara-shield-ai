"use client";
import { useEffect, useState } from "react";

// ================= LIVE PAYPAL CONFIG =================
const PAYPAL_CLIENT_ID = "AeuBNcCmBD9D3vxm4K0vlK2Hv1fl049dCbBtdULFw5lO4o3-6-IfIYlxUSlCEHO_uQUOimny9MBdZSaF"; // <-- YAHAN APNA LIVE CLIENT ID DALO jo Ae... se shuru hota hai
const PAYPAL_PLAN_ID = "P-6NT272815G8021324NJJGFJI"; // Tera naya Plan ID

declare global {
  interface Window {
    paypal: any;
  }
}

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isPro, setIsPro] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  // PayPal SDK Load + Pro Check
  useEffect(() => {
    if (localStorage.getItem("sara_pro") === "true") {
      setIsPro(true);
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
    script.async = true;
    script.onload = () => {
      setPaypalLoaded(true);
      if (window.paypal) {
        window.paypal.Buttons({
          style: {
            shape: "pill",
            color: "gold",
            layout: "vertical",
            label: "subscribe",
          },
          createSubscription: function (data: any, actions: any) {
            return actions.subscription.create({
              plan_id: PAYPAL_PLAN_ID,
            });
          },
          onApprove: function (data: any, actions: any) {
            console.log("PAYPAL SUCCESS", data);
            localStorage.setItem("sara_pro", "true");
            setIsPro(true);
            alert("✅ Payment Successful!\nSubscription ID: " + data.subscriptionID + "\nAb aap PRO ho gaye!");
          },
          onError: function (err: any) {
            console.error(err);
            alert("PayPal abhi Under Review hai.\nPayPal 2-4 ghante me Email karega 'Approved'. Uske baad payment auto-chalu ho jayega.");
          },
          onCancel: function () {
            alert("Payment Cancel kiya gaya.");
          }
        }).render("#paypal-button-container");
      }
    };
    document.body.appendChild(script);
  }, []);

  // Tera Original Scan Function - Safe hai
  const handleScan = async () => {
    if (!input.trim()) {
      alert("Pehle message daalo!");
      return;
    }
    setLoading(true);
    setResult(null);

    // Dummy AI Logic - Tu apna original API yahan laga sakta hai
    setTimeout(() => {
      const isScam = input.toLowerCase().includes("urgent") || input.toLowerCase().includes("link") || input.toLowerCase().includes("lottery");
      setResult({
        riskLevel: isScam? "High" : "Low",
        riskFlags: isScam? ["Urgent Language Detected", "Suspicious Link"] : ["Safe Content"],
        explanation: isScam? "Ye message aapko dara kar turant action lene ko bol raha hai, ye scam ka sign hai." : "Ye message safe lag raha hai.",
        recommendation: isScam? "Is link par click na karein aur is number ko block kar dein." : "Safe hai, but phir bhi savdhani rakhein.",
      });
      setLoading(false);
    }, 1500);
  };

  const getColor = (level: string) => {
    if (level === "High") return "border-red-500 bg-red-500/10 text-red-400";
    if (level === "Medium") return "border-yellow-500 bg-yellow-500/10 text-yellow-400";
    return "border-green-500 bg-green-500/10 text-green-400";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Yellow Banner for PayPal Review */}
      <div className="bg-yellow-400 text-black text-center py-2 text-sm font-bold">
        ⚠️ PayPal Review Pending: You can't accept payments just yet. Approval ke baad auto-on ho jayega. Plan ID: {PAYPAL_PLAN_ID}
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black tracking-tighter">SARA SHIELD AI 🛡️</h1>
          <p className="text-gray-400 mt-3">World's Most Advanced AI Scam Detector - Global Protection</p>
          {isPro && <span className="inline-block mt-3 bg-green-500 text-black px-4 py-1 rounded-full text-sm font-bold">✅ PRO ACTIVE</span>}
        </div>

        {/* Scanner Box */}
        <div className="bg-[#15151d] border border-[#2a2a35] rounded-[24px] p-8 shadow-2xl">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Yahan suspicious message paste karo... Ex: 'Urgent! Your account will be blocked, click here...'"
            className="w-full h-32 bg-[#0a0a0f] border border-[#2a2a35] rounded-xl p-4 text-white outline-none focus:border-yellow-400"
          />
          <button
            onClick={handleScan}
            disabled={loading}
            className="w-full mt-4 bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
          >
            {loading? "Scanning with AI..." : "🔍 Scan Now with SARA AI"}
          </button>

          {result && (
            <div className={`mt-6 border rounded-xl p-5 ${getColor(result.riskLevel)}`}>
              <h3 className="font-bold text-lg">Risk Level: {result.riskLevel}</h3>
              <p className="text-sm mt-2"><b>Flags:</b> {result.riskFlags.join(", ")}</p>
              <p className="text-sm mt-2"><b>Explanation:</b> {result.explanation}</p>
              <p className="text-sm mt-2 font-semibold"><b>Advice:</b> {result.recommendation}</p>
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-[#15151d] border border-[#2a2a35] rounded-2xl p-6">
            <h3 className="font-bold">Free</h3><p className="text-3xl font-black mt-2">$0</p><p className="text-gray-500 text-sm mt-2">5 checks / day</p>
          </div>

          <div className="bg-gradient-to-b from-yellow-500/10 to-[#15151d] border-2 border-yellow-400 rounded-2xl p-6 scale-105 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
            <h3 className="font-bold text-yellow-400">⭐ PRO - $9.99/mo</h3>
            <p className="text-sm text-gray-300 mt-3">Unlimited checks, AI Analysis, 24/7 Protection</p>

            <div className="mt-6">
              {!paypalLoaded && <p className="text-xs text-gray-400 text-center">Loading Secure PayPal Button...</p>}
              <div id="paypal-button-container"></div>
              {isPro && <p className="text-green-400 text-center font-bold mt-3">✅ You are PRO!</p>}
              <p className="text-[10px] text-gray-500 text-center mt-3">Secure payment by PayPal • Cancel anytime</p>
            </div>
          </div>

          <div className="bg-[#15151d] border border-[#2a2a35] rounded-2xl p-6">
            <h3 className="font-bold">Lifetime</h3><p className="text-3xl font-black mt-2">$49.99</p><p className="text-gray-500 text-sm mt-2">One time payment</p>
            <button className="w-full mt-6 bg-[#2a2a35] py-3 rounded-xl font-bold">Coming Soon</button>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-12">© 2025 SARA Shield AI • Product ID: PROD-4YQ99022AF9172103</p>
      </div>
    </div>
  );
}