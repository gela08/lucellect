export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  modelId: string;
  createdAt: number;
}

export interface Model {
  id: string;
  name: string;
  category: 'Logic' | 'Code' | 'Creative' | 'Speed' | 'Language';
}

// export const MODELS: Model[] = [
//   { id: 'google/gemini-2.5-pro', name: 'Gemini 2.0 Pro', category: 'Logic' },
//   { id: 'anthropic/claude-opus-4.6', name: 'Claude Opus 4.6', category: 'Logic' },
//   { id: 'anthropic/claude-sonnet-4.5', name: 'Claude Sonnet 4.5', category: 'Code' },
//   { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3', category: 'Creative' },
//   { id: 'google/gemini-2.0-flash-lite-001', name: 'Gemini Flash Lite', category: 'Speed' },
//   { id: 'openai/gpt-5.2-chat', name: 'GPT-5.2', category: 'Logic' },
// ];

export const MODELS: Model[] = [
    { id: 'openrouter/free', name: 'Default', category: 'Creative' },
    { id: 'intfloat/multilingual-e5-large', name: 'Multilingual-E5-Large', category: 'Language' },

  // Speed & Daily (Verified Free)
  { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash', category: 'Speed' },
  { id: 'google/gemini-2.5-pro', name: 'Gemini 2.5 Pro', category: 'Logic' },
  
  // Logic & School
  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B', category: 'Logic' },
  
  // Code & Creative
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3', category: 'Code' },
  { id: 'qwen/qwen-2.5-72b-instruct', name: 'Qwen 2.5 72B', category: 'Creative' },
    { id: 'google/gemini-2.0-flash-lite-001', name: 'Gemini Flash Lite', category: 'Speed' },

];