import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Transaction } from "../types";
import { MOCK_TRANSACTIONS } from "../constants";

// Initialize the Gemini Client
// In a real app, strict error handling for missing API key would be here.
// But we assume the environment is set up correctly as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are VasPay AI, an advanced, secure, and helpful financial assistant for the VasPay Digital Wallet in Nepal.
Your goal is to help users manage their finances, detect fraud, and provide insights.
You have access to the user's transaction history context provided in the prompt.
Currency is Nepalese Rupee (NPR).

Capabilities:
1. Analyze spending patterns.
2. Detect anomalies or potential fraud in provided transactions.
3. Suggest budgeting tips based on local Nepalese context (e.g., Dashain expenses, local utility costs).
4. Be polite, professional, and concise.

If the user asks about their balance or recent transactions, use the provided context to answer.
If the user asks to perform an action (like "Send money"), explain that this is a demo environment and simulate the confirmation step.
`;

export const getFinancialAdvice = async (
  userQuery: string,
  transactionContext: Transaction[]
): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    
    // Prepare context string
    const contextStr = JSON.stringify(transactionContext.slice(0, 10));
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: `Context: User's recent transactions: ${contextStr}. \n\n User Query: ${userQuery}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "I'm sorry, I couldn't process that request right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the VasPay AI brain. Please try again later.";
  }
};

export const detectFraudRisk = async (transaction: Transaction): Promise<{risk: 'low'|'medium'|'high', reason: string}> => {
  try {
    const model = 'gemini-3-flash-preview';
    const response: GenerateContentResponse = await ai.models.generateContent({
        model,
        contents: `Analyze this transaction for fraud risk in a Nepal context: ${JSON.stringify(transaction)}. Return only JSON in format: {"risk": "low"|"medium"|"high", "reason": "string"}.`,
        config: { responseMimeType: "application/json" }
    });
    
    const text = response.text;
    if (text) {
        return JSON.parse(text);
    }
    return { risk: 'low', reason: 'Analysis failed, defaulted to low.' };
  } catch (e) {
      return { risk: 'low', reason: 'Service unavailable' };
  }
}
