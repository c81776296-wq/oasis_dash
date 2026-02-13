
import { GoogleGenAI } from "@google/genai";

// Fix: Strictly use process.env.API_KEY directly for initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTaskSummary = async (taskTitle: string, taskDescription: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize this project task in a professional and concise way for a team dashboard:
      Title: ${taskTitle}
      Description: ${taskDescription}`,
      config: {
        temperature: 0.7,
        // Fix: Recommendation is to avoid setting maxOutputTokens if not strictly required to prevent truncation
      }
    });
    // Fix: Access .text property directly (it's a getter, not a method)
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not generate summary at this time.";
  }
};

export const suggestNextSteps = async (taskTitle: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest 3 actionable sub-tasks or next steps for this project task: "${taskTitle}". Return only a plain list.`,
      config: {
        temperature: 0.5,
      }
    });
    // Fix: Access .text property directly
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "1. Review task details\n2. Consult team\n3. Execute plan";
  }
};
