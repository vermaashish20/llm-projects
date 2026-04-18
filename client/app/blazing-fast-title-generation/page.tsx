"use client";

import { useState } from "react";
import Link from "next/link";

export default function TitleGenerationPage() {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [isReadmeOpen, setIsReadmeOpen] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setTitle("");
      return;
    }

    setIsGenerating(true);
    setError("");
    setTitle(""); // Clear previous title while generating

    try {
      // Assuming backend runs on 8000
      const res = await fetch("http://localhost:8000/api/title/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate title");
      }

      const data = await res.json();
      setTitle(data.title);
    } catch (err) {
      console.error(err);
      setError("Error generating title.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-black transition-colors duration-300">
      <header className="w-full max-w-3xl mx-auto px-6 py-4 flex items-center">
        <Link href="/" className="text-xs font-semibold text-gray-500 hover:text-black transition-colors border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50">
          ← Back
        </Link>
      </header>
      
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-4 relative">
        <div className="mb-6 flex flex-col items-start gap-2">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Blazing Fast Title Generation</h1>
            <button 
              onClick={() => setIsReadmeOpen(true)}
              className="text-sm text-gray-500 underline underline-offset-4 hover:text-black transition-colors cursor-pointer"
            >
              Readme
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Paste your content below and click generate to instantly get a catchy title.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Title Output Area */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Generated Title</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={isGenerating ? "Generating..." : title}
                placeholder="Your generated title will appear here..."
                className={`flex-1 p-3 text-sm border rounded-lg bg-gray-50 focus:outline-none transition-colors ${
                  error ? 'border-red-300 text-red-600' : 'border-gray-300 text-black font-semibold'
                }`}
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !text.trim()}
                className="px-6 py-3 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
              >
                {isGenerating ? "Generating..." : "Generate Title"}
              </button>
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          {/* Input Area */}
          <div className="flex flex-col gap-1">
            <label htmlFor="content" className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Source Content
            </label>
            <textarea
              id="content"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your article, draft, or any text here..."
              className="w-full h-80 p-4 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-black transition-all resize-y shadow-sm"
            />
          </div>
        </div>

        {/* Readme Modal */}
        {isReadmeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-bold">Project Readme</h2>
                <button 
                  onClick={() => setIsReadmeOpen(false)}
                  className="text-gray-400 hover:text-black transition-colors"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="prose prose-sm prose-gray">
                  <h3 className="font-bold text-lg mb-2">Blazing Fast Title Generation</h3>
                  <p className="mb-4 text-gray-700">
                    This project uses a FastAPI backend paired with a Next.js frontend to instantly generate captivating titles for any given block of text. This application acts as a streamlined testbed for exploring inference speed and LLM integration in a sleek, minimalistic environment.
                  </p>
                  
                  <h4 className="font-semibold text-md mb-2">How it works:</h4>
                  <ul className="list-disc pl-5 mb-4 text-gray-700 space-y-1">
                    <li>Built with Next.js App Router for optimal frontend performance.</li>
                    <li>Connected to a lightweight Python FastAPI server (`localhost:8000`).</li>
                    <li>Designed to provide a fluid, instant, and high-contrast user experience.</li>
                  </ul>
                  
                  <p className="text-gray-500 italic text-xs">
                    *Ensure your FastAPI backend is running before testing the title generation feature.
                  </p>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-right">
                <button 
                  onClick={() => setIsReadmeOpen(false)}
                  className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
