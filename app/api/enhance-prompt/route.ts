import { GoogleGenAI } from "@google/genai"

// Validate input meets requirements
function validateInput(input: string): { valid: boolean; message?: string } {
  // Check character count (not word count)
  const charCount = input.length

  if (charCount < 100) {
    return { valid: false, message: "Input must be at least 100 characters." }
  }

  if (charCount > 1000) {
    return { valid: false, message: "Input is too long. Please limit to 1000 characters or less." }
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

    // Create the prompt for Gemini - UPDATED FOR CHARACTER LIMITS
    const geminiPrompt = `
    Enhance the following prompt to make it more structured and specific, but keep it BRIEF and CONCISE (between 100-1000 characters total):
    
    "${prompt}"
    
    Your enhanced version should:
    1. Add 3-4 specific points in a numbered list
    2. Use professional but concise language
    3. Focus only on the most important aspects
    4. Avoid unnecessary details or explanations
    5. Ensure the total character count is between 100-1000 characters
    
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

      // Ensure the response is within character limits
      if (cleanedResponse.length > 1000) {
        const truncatedResponse = cleanedResponse.substring(0, 1000)
        return Response.json({ enhancedPrompt: truncatedResponse })
      }

      // Ensure the response is not too short
      if (cleanedResponse.length < 100) {
        // Add generic closing if needed to reach minimum length
        let extendedResponse = cleanedResponse
        if (extendedResponse.length < 100) {
          extendedResponse += "\n\nPlease provide implementation details and consider best practices."
        }
        return Response.json({ enhancedPrompt: extendedResponse })
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

// Fallback function to enhance prompts without API - UPDATED FOR CHARACTER LIMITS
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

  // Ensure the enhanced prompt is within character limits
  if (enhanced.length > 1000) {
    enhanced = enhanced.substring(0, 1000)
  }

  // Ensure the enhanced prompt meets minimum character count
  if (enhanced.length < 100) {
    enhanced += "\n\nPlease provide implementation details and consider best practices."
  }

  return enhanced
}
