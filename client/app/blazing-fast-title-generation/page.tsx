"use client";

import { useState } from "react";
import Link from "next/link";

export default function TitleGenerationPage() {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

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
      
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight mb-2">Blazing Fast Title Generation</h1>
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
      </main>
    </div>
  );
}
