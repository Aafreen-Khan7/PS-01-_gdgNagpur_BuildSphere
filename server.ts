import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for JSON parsing
app.use(express.json());

// Lazy-initialized Gemini API client
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// API: Generate structured discharge plan using Gemini
app.post("/api/generate", async (req, res) => {
  try {
    const { rawInput } = req.body;
    if (!rawInput || typeof rawInput !== "string" || rawInput.trim() === "") {
      res.status(400).json({ error: "Discharge text input (rawInput) is required." });
      return;
    }

    let ai;
    try {
      ai = getAIClient();
    } catch (keyErr: any) {
      console.error("Gemini API key error:", keyErr.message);
      res.status(500).json({
        error: "Missing API Key configuration. Please configure GEMINI_API_KEY in the Secrets / Settings panel."
      });
      return;
    }

    const prompt = `
      You are a highly compassionate clinical discharge nurse. Your job is to convert complex hospital discharge notes into a clear, patient-friendly, mobile-friendly recovery plan.
      
      Instructions:
      - Translate complex medical terminology and clinical jargon into clear, plain language that an average person (or elderly patient) can easily understand.
      - Extract all medications, dietary constraints, recovery milestones, follow-up appointments, and structured emergency symptoms (red: go to emergency, yellow: call doctor, green: normal and expected).
      - Make sure instructions and timings for medications are precise and clear.
      - Ensure you fill in every field of the schema correctly.

      Discharge Notes to process:
      "${rawInput}"
    `;

    // Using gemini-2.5-flash as it is fast and supports structured JSON schema outputs
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            aiSummary: { 
              type: "STRING", 
              description: "A highly compassionate, simple, jargon-free summary of the patient's recovery goals. 2-3 sentences max." 
            },
            medicines: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  name: { type: "STRING", description: "Standard commercial or generic brand name of the medicine" },
                  dose: { type: "STRING", description: "Dosage (e.g., 5mg, 1 tablet, 2 puffs)" },
                  timing: { type: "STRING", description: "When to take it, e.g., 'Morning & Night', 'Bedtime', 'Once Daily' or exact times if specified" },
                  instructions: { type: "STRING", description: "Special instructions like 'After food', 'On empty stomach', 'Avoid dairy'" }
                },
                required: ["name", "dose", "timing"]
              }
            },
            diet: {
              type: "ARRAY",
              items: { type: "STRING" },
              description: "Clear guidelines on foods to eat, foods to avoid, and hydration targets."
            },
            warnings: {
              type: "OBJECT",
              properties: {
                red: { 
                  type: "ARRAY", 
                  items: { type: "STRING" }, 
                  description: "CRITICAL symptoms requiring immediate emergency care or calling 911 (e.g., severe chest pain, shortness of breath)" 
                },
                yellow: { 
                  type: "ARRAY", 
                  items: { type: "STRING" }, 
                  description: "WARNING symptoms requiring calling the doctor or visiting clinic (e.g., fever above 101F, persistent nausea, swelling)" 
                },
                green: { 
                  type: "ARRAY", 
                  items: { type: "STRING" }, 
                  description: "NORMAL, expected recovery symptoms that should not cause alarm (e.g., mild fatigue, slight soreness around incision)" 
                }
              },
              required: ["red", "yellow", "green"]
            },
            followUp: { 
              type: "STRING", 
              description: "Human-friendly follow-up schedule or clinic appointments extracted from notes (e.g., 'See Dr. Mehta in 7 days at 10 AM')" 
            }
          },
          required: ["aiSummary", "medicines", "diet", "warnings", "followUp"]
        }
      }
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error("No output returned from Gemini API");
    }

    const parsedData = JSON.parse(outputText);
    res.json(parsedData);

  } catch (error: any) {
    console.error("Error generating discharge plan:", error);
    res.status(500).json({
      error: "Failed to generate discharge plan. Details: " + error.message
    });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    // Fallback all routes to SPA index.html
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
