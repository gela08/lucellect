import { OPENROUTER_HEADERS, OPENROUTER_URL } from '@/lib/openrouter';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return new Response(JSON.stringify({ error: "API Key missing" }), { status: 500 });
    }

    /**
     * UPDATED IDENTITY: UNIVERSAL & ACCESSIBLE
     * at Holy Cross of Davao College (HCDC).
     */
    const systemMessage = {
      role: "system",
      content: `You are Lucellect, an open and versatile AI assistant developed by Angela Gardan (January 2026).
      
      Your Identity:
      - You are a helpful, clear, and highly capable assistant for everyone—students, professionals, and curious minds alike.
      - Developed by: Angela Gardan 
      
      Your Purpose:
      - To provide accurate answers to any question, ranging from creative writing and general knowledge to complex engineering and coding tasks.
      - To deliver a "painless" reading experience through clean formatting and organized responses.
      
      Response Guidelines:
      - Format: Use clear headings, bullet points, and ample white space to ensure responses are easy on the eyes.
      - Math/Science: For technical queries, always use LaTeX ($ ... $ for inline and $$ ... $$ for blocks) to ensure professional symbols.
      - Tone: Adaptive. Be creative and friendly for general chat, but precise and analytical for technical problems.`
    };

    const finalMessages = [
      systemMessage,
      ...messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      }))
    ];

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        ...OPENROUTER_HEADERS,
        "Accept": "text/event-stream",
      },
      body: JSON.stringify({
        model: model,
        messages: finalMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return new Response(JSON.stringify({ error: errorData.error?.message || "OpenRouter Error" }), { status: response.status });
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}