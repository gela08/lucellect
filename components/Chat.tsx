"use client";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, RefreshCcw, Send, Loader2 } from "lucide-react";
import { MODELS, Chat, Message } from "@/types/chat";
import { copyCleanText } from "@/lib/cleanText";

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// IMPORTANT: You must import the KaTeX CSS for the signs to render
import 'katex/dist/katex.min.css';

export default function ChatWindow({ chat, onUpdate }: { chat: Chat, onUpdate: (c: Chat) => void }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: Date.now() };
    const updatedChat = { ...chat, messages: [...chat.messages, userMsg] };
    onUpdate(updatedChat);
    const currentInput = input;
    setInput("");
    setLoading(true);

    const aiMsgId = (Date.now() + 1).toString();
    let accumulatedContent = "";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: updatedChat.messages, model: chat.modelId }),
      });

      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(line => line.trim() !== "");

        for (const line of lines) {
          if (line.includes("[DONE]")) break;
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              const text = data.choices[0]?.delta?.content || "";
              accumulatedContent += text;

              onUpdate({
                ...updatedChat,
                messages: [
                  ...updatedChat.messages,
                  { id: aiMsgId, role: 'assistant', content: accumulatedContent, timestamp: Date.now() }
                ]
              });
            } catch (e) { }
          }
        }
      }
    } catch (error) {
      console.error("Stream error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col bg-[#09090b] text-zinc-100 h-screen">
      {/* Header - Simple & Minimal */}
      <div className="px-6 py-4 border-b border-white/5 bg-[#09090b]/50 backdrop-blur-md flex justify-between items-center shrink-0">
        <span className="text-sm font-medium tracking-tight opacity-50">Lucellect v1.0</span>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto w-full px-6 py-10 space-y-12">
          {chat.messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className="w-full">

                {/* User Message */}
                {m.role === 'user' ? (
                  <div className="bg-zinc-100 text-zinc-900 px-5 py-2.5 rounded-2xl font-medium shadow-sm ml-auto w-fit max-w-[80%]">
                    {m.content}
                  </div>
                ) : (
                  /* Assistant Message with Math Support */
                  <div className="relative group w-full">
                    <div className="prose prose-invert prose-lucellect max-w-none">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm, remarkMath]} 
                        rehypePlugins={[rehypeKatex]}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>

                    {/* Minimalist Action Bar */}
                    <div className="mt-6 flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => copyCleanText(m.content)}
                        className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                      >
                        <Copy size={14} /> Copy
                      </button>
                      <button className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                        <RefreshCcw size={14} /> Regenerate
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-zinc-500 text-sm animate-pulse">
              <Loader2 size={16} className="animate-spin" />
              <span>Thinking...</span>
            </div>
          )}

          <div ref={scrollRef} className="h-20" />
        </div>
      </div>

      {/* Floating Input Area */}
      <div className="p-6 bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent shrink-0">
        <div className="max-w-3xl mx-auto relative group">
          <form onSubmit={sendMessage}>
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask Lucellect anything..."
              className="w-full bg-zinc-900/80 border border-white/10 rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all resize-none shadow-2xl text-zinc-100"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-3 bottom-3 p-2.5 bg-white text-black rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
        <p className="text-[10px] text-center text-zinc-600 mt-4 tracking-tight">
          Lucellect can make mistakes. Check important info.
        </p>
      </div>
    </main>
  );
}