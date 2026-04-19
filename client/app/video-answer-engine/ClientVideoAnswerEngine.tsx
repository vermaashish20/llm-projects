"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ClientVideoAnswerEngine() {
  const [mode, setMode] = useState<"Transcribe" | "Search">("Transcribe");
  const [videoTitle, setVideoTitle] = useState("Untitled Video");
  const [inputText, setInputText] = useState("");
  const [status, setStatus] = useState<"idle" | "progress" | "done">("idle");
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([
    { sender: "ai", text: "Hello! Once you transcribe a video, you can ask me anything about it." },
  ]);
  const [transcription, setTranscription] = useState<string>("");
  const [showTranscription, setShowTranscription] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dummyVideos = [
    "Lecture 1: Quantum Mechanics",
    "Podcast: Future of AI",
    "React Server Components Deep Dive",
    "Y Combinator Startup Advice",
  ];

  const handleStartTranscribe = async () => {
    if (!inputText.trim()) return;
    setStatus("progress");
    
    try {
      const res = await fetch("http://127.0.0.1:8000/api/video/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputText }),
      });
      
      if (!res.ok) throw new Error("Transcription failed");
      const data = await res.json();
      
      setStatus("done");
      setVideoTitle(data.title || "Unknown Title");
      setTranscription(data.transcription);
      setMode("Search");
      setInputText("");
      setStatus("idle");
    } catch (err) {
      console.error(err);
      setStatus("idle");
      setTranscription("An error occurred while connecting to the transcription service.");
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const query = inputText;
    setChatMessages((prev) => [...prev, { sender: "user", text: query }]);
    setInputText("");
    
    try {
      const res = await fetch("http://127.0.0.1:8000/api/video/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query, video_id: videoTitle }), // using title as dummy ID for now
      });
      
      if (!res.ok) throw new Error("Chat failed");
      const data = await res.json();
      
      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: data.reply },
      ]);
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Error connecting to the chat engine." },
      ]);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 text-black font-sans overflow-hidden">
      {/* Left Sidebar (20%) */}
      <div className="w-[20%] bg-gray-50 flex flex-col z-10 border-r border-black">
        <div className="p-6 pb-2 flex items-center justify-between">
          <Link href="/" className="text-xs font-medium text-gray-400 hover:text-black transition-colors">
            ← Home
          </Link>
          <h2 className="font-semibold text-sm tracking-wide text-black">My Videos</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          {dummyVideos.map((video, idx) => (
            <div
              key={idx}
              className="px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-200 hover:text-black cursor-pointer transition-colors"
            >
              {video}
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar (80%) */}
      <div className="w-[80%] flex flex-col h-full bg-white relative">
        {/* Top: Titlebar */}
        <div className="pt-8 pb-4 px-8 flex items-center">
          <input
            type="text"
            className="text-lg font-medium bg-transparent outline-none w-full text-black placeholder-gray-300"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            placeholder="Video Title..."
          />
        </div>

        {/* Middle: Split into Transcription and Chat */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Section and Input */}
          <div className="flex-1 flex flex-col relative bg-white transition-all duration-500 ease-in-out min-w-0">
            {/* Chat Messages */}
            <div className="flex-1 px-8 py-4 flex flex-col overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-semibold text-black uppercase tracking-widest">
                  Video Chat
                </h3>
              </div>
              <div className="flex-1 flex flex-col justify-end space-y-3 pb-4">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`max-w-[75%] py-2.5 px-4 text-sm rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-black text-white self-end rounded-br-none"
                        : "bg-gray-100 text-gray-800 self-start rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom: Search / Input Area */}
            <div className="bg-white px-8 py-6 z-10 shrink-0">
              <div className="w-full max-w-4xl mx-auto flex items-center gap-4 bg-gray-50/50 p-1.5 rounded-full border border-gray-200 focus-within:border-gray-300 transition-colors">
                
                {/* Left side: Custom Dropdown */}
                <div className="relative group pr-2">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-transparent text-sm font-bold text-gray-600 pl-4 pr-1 py-1.5 outline-none cursor-pointer hover:text-black transition-colors flex items-center gap-2"
                  >
                    {mode}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 group-hover:text-black transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <>
                      {/* Invisible overlay to close dropdown when clicking outside */}
                      <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                      
                      {/* Dropdown Menu */}
                      <div className="absolute bottom-full mb-3 left-0 w-36 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 flex flex-col p-1.5 overflow-hidden">
                        <button 
                          onClick={() => { setMode("Transcribe"); setIsDropdownOpen(false); }}
                          className={`text-left px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${
                            mode === "Transcribe" 
                              ? "bg-gray-100 text-black" 
                              : "text-gray-500 hover:bg-gray-50 hover:text-black"
                          }`}
                        >
                          Transcribe
                        </button>
                        <button 
                          onClick={() => { setMode("Search"); setIsDropdownOpen(false); }}
                          className={`text-left px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${
                            mode === "Search" 
                              ? "bg-gray-100 text-black" 
                              : "text-gray-500 hover:bg-gray-50 hover:text-black"
                          }`}
                        >
                          Search
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Input */}
                <input
                  type="text"
                  className="flex-1 flex min-w-0 bg-transparent px-4 py-2.5 outline-none text-black font-medium placeholder-gray-400"
                  placeholder={
                    mode === "Transcribe"
                      ? "Enter the URL or upload the video/audio..."
                      : "Ask anything about this video..."
                  }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      mode === "Transcribe" ? handleStartTranscribe() : handleSendMessage();
                    }
                  }}
                />

                {/* Right side buttons */}
                <div className="flex items-center gap-3 pr-1 shrink-0">
                  {mode === "Transcribe" ? (
                    <>
                      {status === "progress" && (
                        <span className="text-sm text-gray-500 font-bold animate-pulse px-2">
                          Processing...
                        </span>
                      )}
                      <button
                        onClick={handleStartTranscribe}
                        disabled={status === "progress"}
                        className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-full text-sm font-medium transition-all"
                      >
                        Start
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleSendMessage}
                      className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-full text-sm font-medium transition-all"
                    >
                      Send
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Transcription Area */}
          <div 
            className={`transition-all duration-500 ease-in-out flex flex-col overflow-hidden border-l border-black bg-gray-100 shrink-0 ${
              showTranscription 
                ? "w-[30%] px-8 py-4" 
                : "w-16 px-2 py-4 items-center"
            }`}
          >
            <div className={`flex items-center ${showTranscription ? "justify-between" : "justify-center"} mb-6 w-full`}>
              {showTranscription && (
                <h3 className="text-xs font-semibold text-black uppercase tracking-widest min-w-max">
                  Transcription
                </h3>
              )}
              <button
                onClick={() => setShowTranscription(!showTranscription)}
                className="text-black hover:bg-gray-100 p-1.5 rounded-md transition-all"
                title={showTranscription ? "Hide Transcription" : "Show Transcription"}
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className={`transition-transform duration-500 ${showTranscription ? '' : 'rotate-180'}`}
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
            
            <div className={`flex-1 overflow-y-auto flex flex-col min-w-[300px] transition-opacity duration-300 ${showTranscription ? "opacity-100" : "opacity-0 hidden"} pr-2`}>
              {transcription ? (
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap font-medium">{transcription}</div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-lg font-medium italic">
                  Transcribe a video to see text here...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
