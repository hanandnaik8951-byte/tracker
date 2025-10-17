import { GoogleGenAI, Type } from "@google/genai";
import { FoodItem } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might show a more user-friendly error.
  // Here, we assume it's set in the environment as per instructions.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const foodItemSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: 'Name of the food item' },
    calories: { type: Type.NUMBER, description: 'Estimated calories' },
    protein: { type: Type.NUMBER, description: 'Estimated protein in grams' },
    carbs: { type: Type.NUMBER, description: 'Estimated carbohydrates in grams' },
    fats: { type: Type.NUMBER, description: 'Estimated fats in grams' },
  },
  required: ['name', 'calories', 'protein', 'carbs', 'fats'],
};

export const analyzeFoodFromText = async (foodName: string): Promise<Omit<FoodItem, 'id'>[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following food description for an average serving: "${foodName}". Provide a list of food items with their estimated nutritional information (calories, protein, carbohydrates, fats). Consider both Indian and Western cuisines.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: foodItemSchema,
        },
      },
    });

    const jsonString = response.text;
    const parsed = JSON.parse(jsonString);
    // Ensure it's an array, sometimes it might return a single object
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    console.error("Error analyzing food from text:", error);
    throw new Error("Failed to analyze food. The AI might be unable to process this request.");
  }
};

export const analyzeFoodFromImage = async (base64Image: string, mimeType: string): Promise<Omit<FoodItem, 'id'>[]> => {
  const prompt = `Analyze this image of a meal. Identify each food item present. For each item, estimate its nutritional information for a standard serving size. Provide your response as a JSON object containing a single key 'foods'. The value of 'foods' should be an array of objects, where each object has the following keys: 'name' (string), 'calories' (number), 'protein' (number), 'carbs' (number), and 'fats' (number). If you cannot identify any food, return an empty array.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType } },
          { text: prompt },
        ],
      },
    });

    let textResponse = response.text.trim();
    // Clean the response to ensure it's valid JSON
    const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      textResponse = jsonMatch[1];
    }

    const parsed = JSON.parse(textResponse);
    return parsed.foods || [];
  } catch (error) {
    console.error("Error analyzing food from image:", error);
    throw new Error("Failed to analyze image. Please ensure the image is clear and contains food.");
  }
};
