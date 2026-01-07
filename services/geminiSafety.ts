import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis, SensorData } from "../types";

// Local Logic Fallback for Quota Issues
function getLocalSafetyAnalysis(data: SensorData): AIAnalysis {
  const isHighTemp = data.temperature > 60;
  const isExtremeTemp = data.temperature > 85;
  const isHighGas = data.gasLevel > 40;
  
  if (isExtremeTemp || data.timeLeft < 100) {
    return {
      riskLevel: "خطر انفجار (محلي)",
      recommendation: "إخلاء فوري للمنطقة وتفعيل نظام التبريد الطارئ. خطر الهروب الحراري وشيك.",
      prediction: "فشل كيميائي محتمل خلال أقل من دقيقتين."
    };
  } else if (isHighTemp || isHighGas) {
    return {
      riskLevel: "تحذير حرج (محلي)",
      recommendation: "افصل مصدر الطاقة فوراً وافحص تسرب الغاز. لا تفتح الكابينة يدوياً.",
      prediction: "تدهور الحالة مستمر بمعدل متسارع."
    };
  } else {
    return {
      riskLevel: "مستقر (محلي)",
      recommendation: "استمر في المراقبة. جميع المؤشرات ضمن النطاق التشغيلي المسموح.",
      prediction: "العمر الافتراضي المتبقي للبطارية مستقر."
    };
  }
}

export async function getSafetyAnalysis(data: SensorData): Promise<AIAnalysis> {
  // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `TELEMETRY: Temp ${data.temperature.toFixed(1)}C, Gas ${data.gasLevel.toFixed(1)}%, Stability ${data.batteryStability.toFixed(1)}%, Countdown ${data.timeLeft.toFixed(1)}s.
      MISSION: Cold data-driven safety forecast. 
      STYLE: Short. Brutal. Critical. No filler.
      FORECAST: Direct failure timing.
      LANG: Technical Egyptian Arabic.`,
      config: {
        systemInstruction: "You are the DOT Internal Logic Engine. Zero emotion. 100% telemetry based. Forecast damage directly. Be blunt. Do not waste time with pleasantries. Speak in technical Egyptian Arabic terms.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, description: "One word technical status (Egyptian Arabic)" },
            recommendation: { type: Type.STRING, description: "Brutal direct order" },
            prediction: { type: Type.STRING, description: "Direct time-based damage forecast" }
          },
          required: ["riskLevel", "recommendation", "prediction"]
        }
      }
    });

    const result = JSON.parse(response.text.trim());
    return result;
  } catch (error: any) {
    console.error("AI Analysis failed:", error);
    
    // Check for 429 Quota Error
    const isQuotaError = error.message?.includes("429") || error.status === "RESOURCE_EXHAUSTED";
    
    if (isQuotaError) {
      // Return Local Logic fallback if API fails
      console.warn("Using local logic fallback due to quota exhaustion.");
      return getLocalSafetyAnalysis(data);
    }
    
    return {
      riskLevel: "فشل في التحليل",
      recommendation: "افحص سجل الأخطاء الفنية للنظام. قم بتحديث الصفحة.",
      prediction: "بيانات غير متوفرة حالياً."
    };
  }
}