"use client";
import { useState, useEffect } from "react";

type ResultType = {
  riskScore: number;
  riskLevel: "Low" | "Medium" | "High";
  redFlags: string[];
  explanation: string;
  recommendation: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultType | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [tab, setTab] = useState<"message" | "url">("message");

  const handleScan = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input, type: tab }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      // Agar API abhi nahi bani to ye demo result dikhega
      setTimeout(() => {
        setResult({
          riskScore: 92,
          riskLevel: "High",
          redFlags: ["Urgent Language Detected", "Suspicious Link", "Bank Details Asked"],
          explanation: "Ye message aapko dara kar turant action lene ko bol raha hai, ye scam ka sabse bada sign hai.",
          recommendation: "Is link par click na karein aur is number ko block kar dein.",
        });
      }, 1000);
    }
    setLoading(false);
  };

  const getColor = (level: string) => {
    if (level === "High") return "border-red-500 bg-red-50";
    if (level === "Medium") return "border-yellow-500 bg-yellow-50";
    return "border-green-500 bg-green-50";
  };

  return (
    <div className={darkMode? "dark" : ""}>
      <div className="min-h-screen bg-[#fcfcfc] dark:bg-black text-zinc-900 dark:text-white flex flex-col items-center px-4 py-6 transition-colors">

        {/* Header */}
        <div className="w-full max-w-2xl flex justify-between items-center">
          <h1 className="text-xl font-black tracking-tight">SARA Shield AI</h1>
          <button onClick={() => setDarkMode(!darkMode)} className="px-4 py-1.5 rounded-full border text-sm font-medium">
            {darkMode? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* Hero */}
        <div className="text-center mt-12">
          <h2 className="text-4xl md:text-5xl font-black leading-tight">Scam hai ya Safe?</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-3 text-lg">Koi bhi SMS, WhatsApp ya Link paste karo. <br/>AI 5 second me sach batayega.</p>
        </div>

        {/* Scanner Card */}
        <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[24px] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] p-2 md:p-3 mt-10 border dark:border-zinc-800">
          <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-black rounded-full w-fit">
            <button onClick={() => setTab("message")} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${tab === "message"? "bg-black dark:bg-white text-white dark:text-black shadow" : "text-zinc-500"}`}>Paste Message</button>
            <button onClick={() => setTab("url")} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${tab === "url"? "bg-black dark:bg-white text-white dark:text-black shadow" : "text-zinc-500"}`}>Paste URL</button>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={tab === "message"? "Ex: Aapka SBI account block ho raha hai, turant is link par KYC update karein..." : "Ex: https://sbi-kyc-update-vip.com"}
            className="w-full h-36 p-5 mt-2 bg-transparent outline-none resize-none placeholder:text-zinc-400 text-[15px]"
          />

          <button
            onClick={handleScan}
            disabled={loading ||!input}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-[16px] font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40"
          >
            {loading? "Analyzing..." : "Analyze Now →"}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="w-full max-w-2xl mt-8 flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-zinc-200 dark:border-zinc-700 border-t-black dark:border-t-white rounded-full animate-spin"></div>
            <p className="text-sm text-zinc-500">SARA AI aapke message ko scan kar rahi hai...</p>
          </div>
        )}

        {/* Result Card */}
        {result &&!loading && (
          <div className={`w-full max-w-2xl rounded-[24px] p-6 md:p-8 mt-8 border-l-[6px] shadow-lg bg-white dark:bg-zinc-900 ${getColor(result.riskLevel)} dark:bg-opacity-10`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold opacity-60 uppercase tracking-widest">Risk Score</p>
                <h3 className="text-5xl font-black mt-1">{result.riskScore}%</h3>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-sm font-black ${result.riskLevel === "High"? "bg-red-500 text-white" : result.riskLevel === "Medium"? "bg-yellow-500 text-black" : "bg-green-500 text-white"}`}>
                {result.riskLevel} Risk
              </span>
            </div>

            <div className="mt-6">
              <h4 className="font-bold">🚩 Red Flags</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.redFlags.map((flag, i) => (
                  <span key={i} className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-medium border dark:border-zinc-700">{flag}</span>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-3 text-[14px] leading-relaxed">
              <p><span className="font-bold">Explanation:</span> {result.explanation}</p>
              <div className="p-4 bg-zinc-50 dark:bg-black rounded-xl border dark:border-zinc-800">
                <span className="font-bold">✅ Recommended Action:</span> {result.recommendation}
              </div>
              <p className="text-[11px] opacity-50 text-center pt-2">Disclaimer: AI predictions may be incorrect. Always verify from official sources.</p>
            </div>
          </div>
        )}

        <p className="text-xs text-zinc-400 mt-16 mb-6">Built for India • 100% Safe & Private</p>
      </div>
    </div>
  );
}