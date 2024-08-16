import { NextResponse } from "next/server";
import OpenAI from "openai";

// Define the system prompt
const systemPrompt = `
  You are a flashcard creator.
  Return in the following JSON format: 
  {
      "flashcards": [{
          "front": "str",
          "back": "str"
      }]
  }
`;

// Define the POST handler
export async function POST(req) {
  try {
    // Instantiate OpenAI with your API key
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Ensure you have your API key set in environment variables
    });

    // Read the request body
    const data = await req.text();

    // Create a chat completion with the OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4', // Ensure you have the correct model name
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: data },
      ],
    });

    // Parse the response from OpenAI
    const flashcards = JSON.parse(completion.choices[0].message.content);

    // Return the flashcards as JSON
    return NextResponse.json(flashcards.flashcards);
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json({ error: "Failed to generate flashcards." }, { status: 500 });
  }
}
