import { GoogleGenAI, Type, Chat } from "@google/genai";
import { UserInput, FinancialPlanResponse, NewsResponse, NewsSource } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please set the API_KEY environment variable.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateFinancialPlan = async (userInput: UserInput): Promise<FinancialPlanResponse> => {
  const ai = getClient();
  
  // Construct the prompt content from user input
  const prompt = JSON.stringify(userInput, null, 2);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        // Defining the schema ensures strict adherence to the output format
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            recommended_plan: {
              type: Type.OBJECT,
              properties: {
                monthly_saving_amount: { type: Type.STRING },
                emergency_fund_plan: { type: Type.STRING },
                investment_plan: { type: Type.STRING },
                insurance_recommendation: { type: Type.STRING },
                govt_schemes: { 
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["monthly_saving_amount", "emergency_fund_plan", "investment_plan", "insurance_recommendation", "govt_schemes"]
            },
            explanations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["topic", "description"]
              }
            },
            steps_to_start: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            warnings: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["summary", "recommended_plan", "explanations", "steps_to_start", "warnings"]
        }
      },
    });

    const text = response.text;
    if (!text) {
        throw new Error("Empty response from Gemini");
    }
    
    return JSON.parse(text) as FinancialPlanResponse;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};

export const fetchFinancialNews = async (category: string, language: string): Promise<NewsResponse> => {
  const ai = getClient();
  
  const prompt = `Find 3-5 latest and most relevant financial news articles, government scheme updates, or economic trends in India specifically for a '${category}'. 
  Provide a concise summary of the key points. 
  Respond in the language code: '${language}'.
  Ensure the news is recent and from reliable sources.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
        // Note: responseSchema and responseMimeType are NOT allowed with googleSearch
      },
    });

    const text = response.text || "No news found.";
    
    // Extract grounding chunks (sources)
    const sources: NewsSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || "Source Link",
            url: chunk.web.uri
          });
        }
      });
    }

    // Filter duplicate sources by URL
    const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => (t.url === v.url)) === i);

    return {
      summary: text,
      sources: uniqueSources
    };

  } catch (error) {
    console.error("Error fetching news:", error);
    // Return empty state instead of crashing
    return { summary: "Unable to load news at this time.", sources: [] };
  }
};

export const createChatSession = (context: string): Chat => {
  const ai = getClient();
  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: `You are Arth Sakhi, a friendly and knowledgeable AI financial guide.
      
      YOUR ROLE:
      - Act as a mentor and guide.
      - Provide step-by-step roadmaps to achieve financial goals.
      - Explain complex concepts in very simple terms (like explaining to a beginner).
      - Be encouraging and practical.

      CONTEXT OF CURRENT USER:
      ${context}

      INSTRUCTIONS:
      - Always answer in the language requested by the user in the context (en/hi/mr).
      - If asked for a "roadmap", provide a clear, numbered list of actions over time (e.g., Month 1, Month 2-6, Year 1).
      - Keep answers concise but informative.
      - Do NOT ask for sensitive personal info like bank account numbers.`,
    },
  });
};

export const createInvestmentChatSession = (context: string): Chat => {
  const ai = getClient();
  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: `You are the 'Investment Action Expert' of Arth Sakhi. 
      Your goal is NOT to give generic advice, but to help the user EXECUTE their investment journey.
      
      CONTEXT OF USER:
      ${context}

      YOUR RESPONSIBILITIES:
      1. RECOMMEND SPECIFIC ASSETS: 
         - When asked about Mutual Funds, suggest 3 specific real-world examples (e.g., "HDFC Index Fund", "SBI Small Cap", "Parag Parikh Flexi Cap") suitable for their risk profile.
         - Mention their expense ratios and category (Large/Mid/Small cap).
         - Always add a disclaimer: "These are examples for educational purposes. Please research before investing."
      
      2. INSURANCE SELECTION:
         - Suggest specific types of policies. 
         - Compare features (e.g., "Look for Claim Settlement Ratio > 98%", "Restoration Benefit").
      
      3. STEP-BY-STEP EXECUTION:
         - Break answers into "Step 1, Step 2, Step 3".
         - Example: Step 1: Complete KYC on [Platform]. Step 2: Select [Fund Name]. Step 3: Set auto-pay.

      4. LANGUAGE:
         - Strictly reply in the user's preferred language (en/hi/mr).

      TONE: Professional, Action-Oriented, Precise.`,
    },
  });
};