"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EnhanceButtonProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  hasContent: boolean
}

export default function EnhanceButton({ textareaRef, hasContent }: EnhanceButtonProps) {
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [meetsWordCount, setMeetsWordCount] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Check word count whenever textarea content changes
  useEffect(() => {
    const checkWordCount = () => {
      if (!textareaRef.current) return

      const text = textareaRef.current.value
      const wordCount = text
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(Boolean).length

      setMeetsWordCount(wordCount >= 10 && wordCount <= 100)
    }

    // Initial check
    checkWordCount()

    // Set up event listener for input changes
    const textarea = textareaRef.current
    if (textarea) {
      textarea.addEventListener("input", checkWordCount)
      return () => textarea.removeEventListener("input", checkWordCount)
    }
  }, [textareaRef])

  // Silver flash animation on words - improved for better visual effect
  const silverFlashAnimation = (element: HTMLTextAreaElement) => {
    const originalText = element.value
    const words = originalText.split(/\s+/)

    // Apply active state gradient to the form
    const form = element.closest("form")
    if (form) {
      form.classList.add("ai-generating")
    }

    // Clear the textarea
    element.value = ""

    // Create a container for the animation
    const container = document.createElement("div")
    container.className = "silver-typewriter-container"
    container.style.position = "absolute"
    container.style.top = "0"
    container.style.left = "0"
    container.style.right = "0"
    container.style.bottom = "0"
    container.style.padding = "inherit"
    container.style.backgroundColor = "#141415"
    container.style.color = "white"
    container.style.overflow = "auto"
    container.style.borderRadius = "inherit"

    // Insert the container
    element.parentNode?.insertBefore(container, element.nextSibling)

    // Flash each word with silver effect
    let wordIndex = 0
    let displayedText = ""

    function flashNextWord() {
      if (wordIndex < words.length) {
        const currentWord = words[wordIndex]
        displayedText += (wordIndex > 0 ? " " : "") + currentWord
        
        // Update container with all text, but highlight the current word
        let html = ""
        const displayedWords = displayedText.split(/\s+/)
        
        for (let i = 0; i < displayedWords.length; i++) {
          if (i === displayedWords.length - 1) {
            // Current word with flash effect
            html += `<span class="silver-flash">${displayedWords[i]}</span>`
          } else {
            // Previous words
            html += `<span>${displayedWords[i]} </span>`
          }
        }
        
        container.innerHTML = html
        
        // Auto-scroll to bottom
        container.scrollTop = container.scrollHeight
        
        wordIndex++
        setTimeout(flashNextWord, 100) // Flash duration
      } else {
        // All words flashed, now start the silver typewriter
        setTimeout(() => {
          silverTypewriterEffect(originalText, element, container)
        }, 300)
      }
    }

    // Start the flashing animation
    flashNextWord()
  }

  // Silver typewriter effect - improved for real-time streaming
  const silverTypewriterEffect = (text: string, element: HTMLTextAreaElement, container: HTMLDivElement) => {
    // Simulate API call to get enhanced text
    const enhancePromptAsync = async (prompt: string) => {
      try {
        const response = await fetch("/api/enhance-prompt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        })

        if (!response.ok) {
          throw new Error("Failed to enhance prompt")
        }

        const data = await response.json()
        return data.enhancedPrompt
      } catch (error) {
        console.error("Error:", error)
        return fallbackEnhancePrompt(prompt)
      }
    }

    // Start streaming effect
    let typedText = ""
    let enhancedText = ""
    let isStreaming = false
    let charIndex = 0
    const streamSpeed = 5 // ms between characters for near-instantaneous effect

    // Start the API call
    enhancePromptAsync(text).then((result) => {
      enhancedText = result
      if (!isStreaming) {
        startStreaming()
      }
    })

    function startStreaming() {
      isStreaming = true
      streamNextChar()
    }

    function streamNextChar() {
      if (charIndex < enhancedText.length) {
        typedText += enhancedText.charAt(charIndex)

        // Format the text for readability
        const formattedText = formatStreamedText(typedText)

        // Update the container with the typed text and a silver cursor
        container.innerHTML = `
          <div class="streamed-content">${formattedText}</div>
          <span class="silver-cursor">|</span>
        `

        // Update the actual textarea value (hidden behind the container)
        element.value = typedText

        // Trigger input event to resize textarea and maintain proper sizing
        const event = new Event("input", { bubbles: true })
        element.dispatchEvent(event)

        // Auto-scroll to bottom
        container.scrollTop = container.scrollHeight

        charIndex++
        setTimeout(streamNextChar, streamSpeed)
      } else {
        // Typing complete, remove the container and show the textarea
        setTimeout(() => {
          container.remove()
          element.value = enhancedText

          // Trigger input event one last time
          const event = new Event("input", { bubbles: true })
          element.dispatchEvent(event)

          // Remove active state gradient
          const form = element.closest("form")
          if (form) {
            form.classList.remove("ai-generating")
          }

          setIsEnhancing(false)
        }, 300)
      }
    }
  }

  // Format streamed text for better readability
  const formatStreamedText = (text: string): string => {
    // Add line breaks for numbered lists
    let formatted = text.replace(/(\d+\.\s)/g, '<br>$1')
    
    // Add line breaks after periods that end sentences (not in numbers)
    formatted = formatted.replace(/(\.\s)(?=[A-Z])/g, '$1<br>')
    
    // Add line breaks for better paragraph structure
    formatted = formatted.replace(/(\n)/g, '<br>')
    
    return formatted
  }

  const handleEnhance = async () => {
    if (!hasContent || isEnhancing || !meetsWordCount) return

    const textarea = textareaRef.current
    if (!textarea) return

    // Start animation
    setIsEnhancing(true)
    setIsAnimating(true)

    // Start the silver flash animation
    silverFlashAnimation(textarea)

    // End button animation after a delay
    setTimeout(() => {
      setIsAnimating(false)
    }, 2000)
  }

  // Fallback function to enhance prompts without API - simplified for less verbose output
  const fallbackEnhancePrompt = (prompt: string): string => {
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

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            ref={buttonRef}
            onClick={handleEnhance}
            className={`focus-visible:ring-offset-background inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap text-nowrap border font-medium outline-none ring-blue-600 transition-[background,border-color,color,transform,opacity,box-shadow] focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:ring-0 has-[:focus-visible]:ring-2 [&>svg]:pointer-events-none [&>svg]:size-4 [&_svg]:shrink-0 hover:bg-gray-200 dark:hover:bg-gray-800 focus-visible:bg-gray-200 dark:focus-visible:bg-gray-800 border-transparent bg-transparent text-gray-900 dark:text-white hover:border-transparent focus:border-transparent focus-visible:border-transparent disabled:border-transparent disabled:bg-transparent disabled:text-gray-400 px-3 text-sm has-[>kbd]:gap-2 has-[>svg]:px-2 has-[>kbd]:pr-[6px] group size-7 rounded-md ${
              isEnhancing ? "data-[loading=true]:bg-gray-100" : ""
            }`}
            data-loading={isEnhancing ? "true" : "false"}
            disabled={!hasContent || isEnhancing || !meetsWordCount}
            type="button"
            aria-label="Enhance prompt"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-colors duration-300 ${
                hasContent && !isEnhancing && meetsWordCount ? "text-gray-900 dark:text-white" : "text-gray-400"
              }`}
            >
              <path
                d="M12.8281 1C12.8281 2.10747 11.7632 3.17235 10.6558 3.17235C11.7632 3.17235 12.8281 4.23724 12.8281 5.34471C12.8281 4.23724 13.893 3.17235 15.0005 3.17235C13.893 3.17235 12.8281 2.10747 12.8281 1Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13 12C13 12.5098 12.5098 13 12 13C12.5098 13 13 13.4902 13 14C13 13.4902 13.4902 13 14 13C13.4902 13 13 12.5098 13 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.10285 3.89648C5.10285 5.98837 3.0914 7.99982 0.999512 7.99982C3.0914 7.99982 5.10285 10.0113 5.10285 12.1032C5.10285 10.0113 7.1143 7.99982 9.20619 7.99982C7.1143 7.99982 5.10285 5.98837 5.10285 3.89648Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="bg-neutral-900 text-white border-neutral-800 text-sm"
        >
          {!hasContent ? (
            "Enter some text to enhance"
          ) : !meetsWordCount ? (
            "This prompt is too short to enhance"
          ) : (
            "Click to enhance prompt"
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
