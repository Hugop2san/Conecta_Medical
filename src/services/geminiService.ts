import { GoogleGenAI, Type } from "@google/genai";
import { TriageResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const analyzeSymptoms = async (symptoms: string): Promise<TriageResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise os seguintes sintomas e recomende uma especialidade médica. 
      Sintomas: "${symptoms}"
      
      Responda APENAS em formato JSON com os campos:
      - specialty: string (ex: Clínico Geral, Cardiologista, Pediatra, Dermatologista)
      - urgency: string (low, medium, high)
      - explanation: string (breve explicação do porquê da recomendação)`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            specialty: { type: Type.STRING },
            urgency: { type: Type.STRING, enum: ["low", "medium", "high"] },
            explanation: { type: Type.STRING }
          },
          required: ["specialty", "urgency", "explanation"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as TriageResult;
  } catch (error) {
    console.error("Erro na triagem IA:", error);
    return {
      specialty: "Clínico Geral",
      urgency: "medium",
      explanation: "Não foi possível realizar uma análise precisa. Recomendamos consultar um Clínico Geral para avaliação inicial."
    };
  }
};
