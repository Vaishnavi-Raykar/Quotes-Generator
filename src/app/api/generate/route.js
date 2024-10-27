import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Array of quote types
    const quoteTypes = ["Motivational", "Inspirational", "Positive", "Life", "Wisdom"];
    // Get a random quote type
    const randomType = quoteTypes[Math.floor(Math.random() * quoteTypes.length)];

    const result = await model.generateContent(
      `Generate an inspiring ${randomType} quote in JSON format.
      The quote should be profound and meaningful.
      Use the following structure:
      {
        "quotetype": "${randomType}",
        "quote": "The actual quote text",
        "author": "Author of the quote or 'Unknown' if not available"
      }
      Make sure the quote is original and impactful.`
    );

    let output = await result.response.text();
    console.log("Generated output:", output);

    let generatedData;
    try {
      // Remove code block markers if present
      output = output.replace(/```json/g, "").replace(/```/g, "");
      
      // Parse the cleaned string into JSON
      generatedData = JSON.parse(output);
    } catch (jsonError) {
      console.error("Failed to parse JSON from AI response:", jsonError);
      return NextResponse.json({
        error: "Failed to generate quote in proper JSON format.",
      });
    }

    // Validate the generated JSON structure
    if (
      typeof generatedData.quotetype !== "string" ||
      typeof generatedData.quote !== "string" ||
      typeof generatedData.author !== "string"
    ) {
      return NextResponse.json({
        error: "Generated quote did not have the required fields or structure.",
      });
    }

    // Send the structured JSON response to the frontend
    return NextResponse.json({
      quotetype: generatedData.quotetype,
      quote: generatedData.quote,
      author: generatedData.author,
    });
  } catch (error) {
    console.error("Error generating quote:", error);
    return NextResponse.json({
      error: "An error occurred while generating the quote.",
    });
  }
}