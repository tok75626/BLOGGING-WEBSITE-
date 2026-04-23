import OpenAI from "openai";

const isOpenRouter = !!process.env.OPENROUTER_API_KEY;

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: isOpenRouter ? "https://openrouter.ai/api/v1" : undefined,
  defaultHeaders: isOpenRouter ? {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "X-Title": "AIBlog Platform",
  } : undefined,
});

// Using a standard model that exists on both or is mapped by OpenRouter
const DEFAULT_MODEL = isOpenRouter ? "openai/gpt-4-turbo" : "gpt-4-turbo-preview";

export async function generateTitle(topic: string) {
  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: "system",
        content: "You are a professional blog title generator. Generate a catchy, SEO-friendly title for a blog post based on the topic provided. Return ONLY the title.",
      },
      { role: "user", content: topic },
    ],
  });

  return response.choices[0].message.content?.trim();
}

export async function generateBlogContent(topic: string, tone: string, length: string) {
  const lengthMap = {
    short: "around 300 words",
    medium: "around 600 words",
    long: "over 1000 words",
  };

  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: "system",
        content: `You are an expert content creator. Write a full blog post in Markdown format. Topic: ${topic}. Tone: ${tone}. Length: ${lengthMap[length as keyof typeof lengthMap]}. Include headings, lists, and bold text for readability.`,
      },
    ],
  });

  return response.choices[0].message.content;
}

export async function generateSummary(content: string) {
  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: "system",
        content: "Summarize the following blog post in 2-3 sentences. Return ONLY the summary.",
      },
      { role: "user", content },
    ],
  });

  return response.choices[0].message.content?.trim();
}

export async function generateTags(content: string) {
  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: "system",
        content: "Extract 5-7 relevant tags from the following blog content. Return them as a comma-separated list. Return ONLY the list.",
      },
      { role: "user", content },
    ],
  });

  const tags = response.choices[0].message.content?.split(",").map(t => t.trim()) || [];
  return tags;
}
