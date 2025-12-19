import { GoogleGenAI, Type } from "@google/genai";
import { MacroNutrients } from "../types";

// Note: In a production environment, this should be proxied through a backend.
// For this demo, we assume the environment variable is injected safely.
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

interface FoodAnalysisResult {
  name: string;
  calories: number;
  macros: MacroNutrients;
  quantity: string;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Analyzes text input to identify food and nutritional info.
 */
export const analyzeTextFood = async (text: string): Promise<FoodAnalysisResult> => {
  try {
    const model = "gemini-3-flash-preview";
    
    const response = await ai.models.generateContent({
      model,
      contents: `Analyze the following food description: "${text}". Provide the name, estimated calories, and macronutrients (protein, carbs, fat) in grams. Also estimate the quantity.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            quantity: { type: Type.STRING },
            macros: {
              type: Type.OBJECT,
              properties: {
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fat: { type: Type.NUMBER },
              },
              required: ["protein", "carbs", "fat"],
            },
            confidence: { type: Type.STRING, enum: ["high", "medium", "low"] },
          },
          required: ["name", "calories", "quantity", "macros", "confidence"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as FoodAnalysisResult;
    }
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Gemini Text Analysis Error:", error);
    throw new Error("Failed to analyze food text.");
  }
};

/**
 * Analyzes an image (base64) to identify food and nutritional info.
 * Note: gemini-2.5-flash-image does NOT support responseSchema, so we must prompt carefully for JSON.
 */
export const analyzeImageFood = async (base64Image: string): Promise<FoodAnalysisResult> => {
  try {
    // Strip header if present (data:image/jpeg;base64,)
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const model = "gemini-2.5-flash-image";
    
    const prompt = `
      Identify the food in this image. Estimate the portion size, calories, and macronutrients (protein, carbs, fat).
      Return ONLY a raw JSON object (no markdown formatting, no backticks) with the following structure:
      {
        "name": "Short descriptive name",
        "calories": number (integer),
        "quantity": "e.g. 1 bowl, 200g",
        "macros": {
          "protein": number (grams),
          "carbs": number (grams),
          "fat": number (grams)
        },
        "confidence": "high" | "medium" | "low"
      }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          { text: prompt }
        ]
      }
    });

    const text = response.text || "";
    
    // Clean up potential markdown code blocks if the model ignores the "no markdown" instruction
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      return JSON.parse(jsonStr) as FoodAnalysisResult;
    } catch (e) {
      console.error("Failed to parse JSON from image model:", text);
      throw new Error("The AI recognized the image but returned invalid data format.");
    }

  } catch (error) {
    console.error("Gemini Image Analysis Error:", error);
    throw new Error("Failed to analyze food image. Please try again or use text search.");
  }
};
