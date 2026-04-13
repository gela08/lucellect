"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/Chat";
import { Chat, MODELS } from "@/types/chat";

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("lucellect_chats");
    if (saved) {
      const parsed = JSON.parse(saved);
      setChats(parsed);
      if (parsed.length > 0) setCurrentId(parsed[0].id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lucellect_chats", JSON.stringify(chats));
  }, [chats]);

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Conversation",
      messages: [],
      modelId: MODELS[0].id,
      createdAt: Date.now(),
    };
    setChats([newChat, ...chats]);
    setCurrentId(newChat.id);
  };

  const handleUpdateChat = (updatedChat: Chat) => {
    setChats(chats.map(c => c.id === updatedChat.id ? updatedChat : c));
  };

  const handleDeleteChat = (id: string) => {
    setChats(chats.filter(c => c.id !== id));
    if (currentId === id) setCurrentId(null);
  };

  const activeChat = chats.find(c => c.id === currentId);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        chats={chats} 
        currentId={currentId} 
        onNew={handleNewChat} 
        onSelect={setCurrentId} 
        onDelete={handleDeleteChat} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      {activeChat ? (
        <ChatWindow chat={activeChat} onUpdate={handleUpdateChat} />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-zinc-900 text-zinc-500">
          <h2 className="text-2xl font-semibold mb-2">Welcome to Lucellect</h2>
          <p>Create a new chat to begin.</p>
          <button onClick={handleNewChat} className="mt-4 px-4 py-2 bg-zinc-100 text-black rounded-lg">Get Started</button>
        </div>
      )}
    </div>
  );
}