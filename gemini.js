import { GoogleGenerativeAI } from "@google/generative-ai";
import { promises as fs } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// 1. Configuration
const api_key = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(api_key);
const generationConfig = { temperature: 0.4, topP: 1, topK: 32, maxOutputTokens: 4096 };

// 2. Initialise Model for vision-based generation
const model = genAI.getGenerativeModel({ model: "gemini-pro-vision", generationConfig });

// 3. Generate Content with Image Input
async function generateContent() {
  try {
    // Load image
    const imagePath = 'image.jpeg';
    const imageData = await fs.readFile("download.jpeg");
    const imageBase64 = imageData.toString('base64');

    // Define parts
    const parts = [
      { text: "Describe what the people are doing in this image:\n" },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64
        }
      },
    ];

    // Generate content using both text and image input
    const result = await model.generateContent({ contents: [{ role: "user", parts }] });
    const response = await result.response;
    console.log(response.text());
  } catch (error) {
    console.error('Error generating content:', error);
  }
}

// Run the function
generateContent();