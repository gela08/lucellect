export const OPENROUTER_HEADERS = {
  "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
  "HTTP-Referer": "http://localhost:3000", // Required by some models
  "X-Title": "Lucellect",
  "Content-Type": "application/json",
};

export const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";