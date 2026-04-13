import { Chat } from "@/types/chat";
import { Plus, MessageSquare, Trash2, Search } from "lucide-react";

export default function Sidebar({ 
  chats, currentId, onNew, onSelect, onDelete, searchQuery, setSearchQuery 
}: any) {
  const filtered = chats.filter((c: Chat) => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-64 h-screen bg-zinc-950 text-zinc-200 flex flex-col border-r border-zinc-800">
      <div className="p-4 flex flex-col gap-4">
        <button onClick={onNew} className="flex items-center gap-2 w-full p-2 bg-zinc-100 text-black rounded-lg hover:bg-zinc-300 transition">
          <Plus size={18} /> New Chat
        </button>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 text-zinc-500" size={16} />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..." 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md py-2 pl-8 pr-2 text-sm focus:outline-none"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2">
        {filtered.map((chat: Chat) => (
          <div key={chat.id} className={`group flex items-center justify-between p-2 mb-1 rounded-md cursor-pointer transition ${currentId === chat.id ? 'bg-zinc-800' : 'hover:bg-zinc-900'}`} onClick={() => onSelect(chat.id)}>
            <div className="flex items-center gap-2 truncate">
              <MessageSquare size={14} />
              <span className="truncate text-sm">{chat.title}</span>
            </div>
            <Trash2 size={14} className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400" onClick={(e) => { e.stopPropagation(); onDelete(chat.id); }} />
          </div>
        ))}
      </div>
    </aside>
  );
}