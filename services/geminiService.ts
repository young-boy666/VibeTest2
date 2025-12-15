import { GoogleGenAI } from "@google/genai";
import { Topic } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const streamGeminiResponse = async function* (
  currentTopic: Topic,
  userQuestion: string,
  history: { role: string; text: string }[]
) {
  const client = getClient();
  if (!client) {
    yield "Error: API Key is missing. Please check your configuration.";
    return;
  }

  const systemInstruction = `
    You are an expert Machine Learning Tutor for a web guide.
    The user is currently studying the topic: "${currentTopic.title}".
    
    Context about this topic:
    ${currentTopic.description}
    ${currentTopic.content}

    Your goal is to answer the user's questions clearly, rigorously but accessibly.
    - Use Markdown for formatting.
    - Use LaTeX style formatting for math like this: $ E = mc^2 $.
    - Keep answers concise unless asked for deep detail.
    - If the user asks about a different ML topic, guide them briefly but suggest they navigate to that section if it exists.
  `;

  try {
    const model = 'gemini-2.5-flash';
    
    // Construct the chat history for the API
    // Note: The new SDK structure might strictly require role to be 'user' or 'model'
    const formattedHistory = history.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }));

    const chat = client.chats.create({
      model,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
      history: formattedHistory
    });

    const resultStream = await chat.sendMessageStream({ message: userQuestion });

    for await (const chunk of resultStream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    yield "I encountered an error while thinking. Please try again later.";
  }
};