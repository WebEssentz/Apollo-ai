import { GoogleGenAI } from "@google/genai"

// Validate input meets requirements
function validateInput(input: string): { valid: boolean; message?: string } {
  // Count words (excluding punctuation)
  const wordCount = input
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean).length

  if (wordCount < 10) {
    return { valid: false, message: "Input must be at least 10 words." }
  }

  // Check for vague requests
  const vaguePhrases = ["website", "app", "something", "anything", "help me"]
  const hasSpecificContext = !vaguePhrases.some(
    (phrase) =>
      input.toLowerCase().includes(phrase) &&
      input
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w === phrase).length === 1 &&
      input.length < 100,
  )

  if (!hasSpecificContext) {
    return {
      valid: false,
      message: "Please provide more specific details about what you want to build.",
    }
  }

  return { valid: true }
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    // Validate the input
    const validation = validateInput(prompt)
    if (!validation.valid) {
      return Response.json({ error: validation.message }, { status: 400 })
    }

    // Initialize Gemini with explicit API key
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyCqPKydBeOt2Woccd7y3OI8RCdubh9-9Rw"

    if (!apiKey || apiKey === "YOUR_API_KEY") {
      return Response.json({ error: "Invalid API key configuration" }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey })

    // Use a more reliable model version
    const modelName = "gemini-2.0-flash" // Using a more stable model

    // Create the prompt for Gemini
    const geminiPrompt = `
    Enhance the following prompt to make it more detailed, structured, and specific:
    
    "${prompt}"
    
    Your enhanced version should:
    1. Add specific details and examples
    2. Organize information in a numbered list
    3. Clarify any vague terms
    4. Add relevant considerations
    5. Use professional language
    
    Return ONLY the enhanced prompt with no explanations or reasoning.
    `

    try {
      // Use the correct method to generate content with better error handling
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [{ role: "user", parts: [{ text: geminiPrompt }] }],
      })

      // Check if response exists and has text
      if (!response) {
        throw new Error("No response from Gemini API")
      }

      // Get the response text safely
      let enhancedPrompt = ""

      if (response.candidates) {
        const candidates = response.candidates
        if (candidates && candidates.length > 0 && candidates[0].content) {
          const parts = candidates[0].content.parts
          if (parts && parts.length > 0) {
            // Combine all text parts
            enhancedPrompt = parts
              .filter((part) => part.text)
              .map((part) => part.text)
              .join("\n")
          }
        }
      } else if (response.text) {
        // Fallback to text property if available
        enhancedPrompt = response.text
      }

      if (!enhancedPrompt) {
        throw new Error("Could not extract text from Gemini response")
      }

      // Clean the response to remove any thinking process
      const cleanedResponse = enhancedPrompt.replace(/^Thinking Process:[\s\S]*?(Result:|Enhanced Prompt:)/i, "").trim()

      return Response.json({ enhancedPrompt: cleanedResponse })
    } catch (apiError) {
      console.error("Gemini API error:", apiError)

      // Fallback to manual enhancement if API fails
      const manuallyEnhanced = manuallyEnhancePrompt(prompt)
      return Response.json({
        enhancedPrompt: manuallyEnhanced,
        note: "Used fallback enhancement due to API issues",
      })
    }
  } catch (error) {
    console.error("Error enhancing prompt:", error)
    return Response.json({ error: "Failed to enhance prompt. Please try again." }, { status: 500 })
  }
}

// Fallback function to enhance prompts without API
function manuallyEnhancePrompt(prompt: string): string {
  // Convert to lowercase and capitalize first letter of sentences
  const formattedPrompt = prompt.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())

  // Add structure
  let enhanced = "Create a " + formattedPrompt.trim()

  // Add numbered points based on keywords
  const points = []

  if (enhanced.includes("website")) {
    points.push("Design a responsive user interface that works on mobile and desktop")
    points.push("Include intuitive navigation and user-friendly layout")
  }

  if (enhanced.includes("stats") || enhanced.includes("statistics")) {
    points.push("Display key metrics and statistics in an organized dashboard")
    points.push("Use charts and visualizations to represent data clearly")
    points.push("Allow for filtering and sorting of statistical information")
  }

  if (enhanced.includes("ai") || enhanced.includes("artificial intelligence")) {
    points.push("Implement AI-powered features for data analysis and insights")
    points.push("Create personalized recommendations based on user data")
  }

  if (enhanced.includes("personal")) {
    points.push("Ensure privacy and security for personal information")
    points.push("Include customization options to tailor the experience")
  }

  // Add the points to the enhanced prompt
  if (points.length > 0) {
    enhanced += " that includes the following features:\n\n"
    points.forEach((point, index) => {
      enhanced += `${index + 1}. ${point}\n`
    })

    // Add a closing request
    enhanced += "\nPlease provide a design concept, suggested technology stack, and implementation steps."
  }

  return enhanced
}
