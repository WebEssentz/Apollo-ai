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

  // Check if prompt is too long
  if (wordCount > 100) {
    return { valid: false, message: "Input is too long. Please limit to 100 words or less." }
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
    const modelName = "gemini-2.5-pro-preview-03-25" // Using a more stable model

    // Create the prompt for Gemini - UPDATED FOR MORE CONCISE OUTPUT
    const geminiPrompt = `
    Enhance the following prompt to make it more structured and specific, but keep it BRIEF and CONCISE (no more than 5-6 lines total):
    
    "${prompt}"
    
    Your enhanced version should:
    1. Add 3-4 specific points in a numbered list
    2. Use professional but concise language
    3. Focus only on the most important aspects
    4. Avoid unnecessary details or explanations
    
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

      // Ensure the response is not too verbose
      const lines = cleanedResponse.split("\n").filter((line) => line.trim() !== "")
      if (lines.length > 8) {
        // If too verbose, truncate to 8 lines
        const truncatedResponse = lines.slice(0, 8).join("\n")
        return Response.json({ enhancedPrompt: truncatedResponse })
      }

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

// Fallback function to enhance prompts without API - UPDATED FOR MORE CONCISE OUTPUT
function manuallyEnhancePrompt(prompt: string): string {
  // Convert to lowercase and capitalize first letter of sentences
  const formattedPrompt = prompt.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())

  // Add structure - more concise
  let enhanced = formattedPrompt.trim()

  // Extract main topic
  const topics = ["website", "app", "dashboard", "stats", "ai", "personal"]
  const foundTopic = topics.find((topic) => enhanced.includes(topic)) || ""

  // Create a more concise enhanced prompt
  if (foundTopic) {
    enhanced = `Create a ${foundTopic} with the following features:\n\n`

    // Add 3-4 key points based on the topic
    const points = []

    if (foundTopic === "website") {
      points.push("Responsive design for all devices")
      points.push("Clean, intuitive user interface")
      points.push("Fast loading and performance")
    } else if (foundTopic === "app") {
      points.push("User-friendly mobile interface")
      points.push("Core functionality: " + prompt.split(" ").slice(0, 5).join(" "))
      points.push("Offline capabilities")
    } else if (foundTopic.includes("stats") || foundTopic.includes("dashboard")) {
      points.push("Key metrics visualization")
      points.push("Data filtering options")
      points.push("Regular data updates")
    } else if (foundTopic.includes("ai")) {
      points.push("AI-powered analysis")
      points.push("Personalized recommendations")
      points.push("Learning capabilities")
    } else if (foundTopic.includes("personal")) {
      points.push("Privacy and security")
      points.push("Customization options")
      points.push("Personal data management")
    }

    // Add the points to the enhanced prompt
    points.forEach((point, index) => {
      enhanced += `${index + 1}. ${point}\n`
    })

    // Add a brief closing
    enhanced += "\nInclude design and implementation details."
  } else {
    // Generic enhancement
    enhanced = `Develop ${enhanced} with these key features:\n\n`
    enhanced += "1. User-friendly interface\n"
    enhanced += "2. Core functionality\n"
    enhanced += "3. Performance optimization\n"

    enhanced += "\nProvide implementation approach."
  }

  return enhanced
}
