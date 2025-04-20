"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EnhancedButtonProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  hasContent: boolean
  onEnhancingStateChange?: (isEnhancing: boolean) => void
  onShowAuthModal: () => void // New prop to show auth modal
}

export default function EnhancedButton({
  textareaRef,
  hasContent,
  onEnhancingStateChange,
  onShowAuthModal,
}: EnhancedButtonProps) {
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [meetsCharLimit, setMeetsCharLimit] = useState(false)
  const [isAlreadyEnhanced, setIsAlreadyEnhanced] = useState(false)
  const [enhancedText, setEnhancedText] = useState<string | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Check character count whenever textarea content changes
  useEffect(() => {
    const checkCharLimit = () => {
      if (!textareaRef.current) return

      const text = textareaRef.current.value
      const charCount = text.length

      // Update character limit state - using character count (100-1000 characters)
      setMeetsCharLimit(charCount >= 100 && charCount <= 1000)

      // Check if the content is already enhanced
      if (enhancedText !== null) {
        setIsAlreadyEnhanced(text === enhancedText)
      }
    }

    // Initial check
    checkCharLimit()

    // Set up event listener for input changes
    const textarea = textareaRef.current
    if (textarea) {
      textarea.addEventListener("input", checkCharLimit)
      return () => textarea.removeEventListener("input", checkCharLimit)
    }
  }, [textareaRef, enhancedText])

  // Notify parent component about enhancing state changes
  useEffect(() => {
    if (onEnhancingStateChange) {
      onEnhancingStateChange(isEnhancing)
    }
  }, [isEnhancing, onEnhancingStateChange])

  // Sun-kissed silver metal flash animation with enhanced effect
  const silverFlashAnimation = (element: HTMLTextAreaElement) => {
    const originalText = element.value

    // Apply active state gradient to the form with specific colors (#042f2e and #1e988a)
    const form = element.closest("form")
    if (form) {
      form.classList.add("ai-generating")
    }

    // Save original scroll position
    const originalScrollTop = element.scrollTop

    // Create a container for the animation that matches the textarea exactly
    const container = document.createElement("div")
    container.className = "silver-typewriter-container"
    container.style.position = "absolute"
    container.style.top = "0"
    container.style.left = "0"
    container.style.right = "0"
    container.style.bottom = "0"
    container.style.padding = window.getComputedStyle(element).padding
    container.style.backgroundColor = "#141415"
    container.style.color = "white"
    container.style.overflow = "auto"
    container.style.borderRadius = "inherit"
    container.style.fontSize = window.getComputedStyle(element).fontSize
    container.style.fontFamily = window.getComputedStyle(element).fontFamily
    container.style.lineHeight = window.getComputedStyle(element).lineHeight

    // Insert the container
    element.parentNode?.insertBefore(container, element.nextSibling)

    // Break text into spans for more precise animation control
    const wrappedText = originalText
      .split("\n")
      .map((line) => `<div>${line || " "}</div>`)
      .join("")

    // Add the original text with enhanced silver flash effect
    container.innerHTML = `<div class="sun-kissed-silver">${wrappedText}</div>`

    // Match the scroll position
    container.scrollTop = originalScrollTop

    // Ensure bottom content is visible
    setTimeout(() => {
      container.scrollTop = container.scrollHeight
    }, 50)

    // After the flash animation completes, start the typewriter effect
    setTimeout(() => {
      silverTypewriterEffect(originalText, element, container)
    }, 800) // Wait for flash animation to complete
  }

  // Silver typewriter effect - improved for smoother animation and scrolling
  const silverTypewriterEffect = (text: string, element: HTMLTextAreaElement, container: HTMLDivElement) => {
    // Get enhanced text from API with validation
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
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to enhance prompt")
        }

        const data = await response.json()
        return data.enhancedPrompt
      } catch (error) {
        console.error("Error:", error)
        return fallbackEnhancePrompt(prompt)
      }
    }

    // Start streaming effect with smoother animation
    let typedText = ""
    let enhancedText = ""
    let isStreaming = false
    let charIndex = 0
    const streamSpeed = 12 // Slightly faster for better UX
    let lastNewlineIndex = -1 // Track last newline for better line-by-line rendering

    // Start the API call
    enhancePromptAsync(text).then((result) => {
      enhancedText = result
      setEnhancedText(result) // Store the enhanced text for future comparison
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
        const currentChar = enhancedText.charAt(charIndex)
        typedText += currentChar

        // Check if we just added a newline character
        const isNewline = currentChar === "\n"
        if (isNewline) {
          lastNewlineIndex = charIndex
        }

        // Format text with appropriate line breaks for HTML display
        const formattedText = typedText
          .split("\n")
          .map((line) => `<div>${line || " "}</div>`)
          .join("")

        // Update the container with the typed text (no cursor)
        container.innerHTML = formattedText

        // Update the actual textarea value (hidden behind the container)
        element.value = typedText

        // Trigger input event to resize textarea and maintain proper sizing
        const event = new Event("input", { bubbles: true })
        element.dispatchEvent(event)

        // Smooth auto-scroll to bottom
        const shouldScrollToBottom =
          // Always scroll if we're near the bottom already
          container.scrollHeight - container.scrollTop - container.clientHeight < 50 ||
          // Always scroll on newline
          isNewline ||
          // Always scroll at the end
          charIndex === enhancedText.length - 1

        if (shouldScrollToBottom) {
          // Smooth scroll to bottom
          container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
          })
          element.scrollTo({
            top: element.scrollHeight,
            behavior: "smooth",
          })
        }

        charIndex++

        // Slight randomization for more natural typing feel
        const randomVariation = Math.random() * 5 - 2.5 // -2.5 to +2.5ms
        const adjustedSpeed = streamSpeed + randomVariation

        // Slight pause after periods and newlines
        const delay = isNewline || enhancedText.charAt(charIndex - 1) === "." ? adjustedSpeed * 3 : adjustedSpeed

        setTimeout(streamNextChar, delay)
      } else {
        // Typing complete, remove the container and show the textarea
        setTimeout(() => {
          container.remove()
          element.value = enhancedText

          // Trigger input event one last time
          const event = new Event("input", { bubbles: true })
          element.dispatchEvent(event)

          // Final scroll to bottom
          element.scrollTop = element.scrollHeight

          // Remove active state gradient
          const form = element.closest("form")
          if (form) {
            form.classList.remove("ai-generating")
          }

          setIsEnhancing(false)
          setIsAlreadyEnhanced(true)
        }, 300)
      }
    }
  }

  const handleEnhance = async () => {
    if (!hasContent || isEnhancing || !meetsCharLimit || isAlreadyEnhanced) return

    // Show auth modal when enhance button is clicked
    onShowAuthModal()
    return

    // // The code below will not execute due to the return above
    // // It's kept for reference in case we want to change the behavior later

    // const textarea = textareaRef.current
    // if (!textarea) return

    // // Validate content length one more time before proceeding
    // const charCount = textarea.value.length
    // if (charCount < 100 || charCount > 1000) {
    //   return
    // }

    // // Start animation
    // setIsEnhancing(true)
    // setIsAnimating(true)

    // // Apply sparkle animation to the button
    // if (buttonRef.current) {
    //   buttonRef.current.classList.add("enhance-button-sparkle")
    // }

    // // Start the silver flash animation
    // silverFlashAnimation(textarea)

    // // End button animation after the enhancement is complete (handled in the typewriter effect)
    // setTimeout(() => {
    //   setIsAnimating(false)

    //   // Remove sparkle after animation completes
    //   if (buttonRef.current) {
    //     buttonRef.current.classList.remove("enhance-button-sparkle")
    //   }
    // }, 4000) // Longer duration to match the full enhancement process
  }

  // Fallback function to enhance prompts without API
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

  // Get tooltip content based on current state
  const getTooltipContent = () => {
    if (!hasContent) {
      return "Enter some text to enhance"
    }

    if (isEnhancing) {
      return "Enhancing your prompt..."
    }

    if (isAlreadyEnhanced) {
      return "This prompt is already enhanced"
    }

    if (!meetsCharLimit) {
      const text = textareaRef.current?.value || ""
      const charCount = text.length

      if (charCount < 100) {
        return "Prompt is too short. Min length is 100 characters."
      }

      if (charCount > 1000) {
        return "Prompt is too long. Max length is 1000 characters."
      }
    }

    return "Click to enhance prompt"
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            ref={buttonRef}
            onClick={handleEnhance}
            className={`focus-visible:ring-offset-background inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap text-nowrap border font-medium outline-none ring-blue-600 transition-[background,border-color,color,transform,opacity,box-shadow] focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:ring-0 has-[:focus-visible]:ring-2 [&>svg]:pointer-events-none [&>svg]:size-4 [&_svg]:shrink-0 hover:bg-gray-200 dark:hover:bg-gray-800 focus-visible:bg-gray-200 dark:focus-visible:bg-gray-800 border-transparent bg-transparent text-gray-900 dark:text-white hover:border-transparent focus:border-transparent focus-visible:border-transparent disabled:border-transparent disabled:bg-transparent disabled:text-gray-400 px-3 text-sm has-[>kbd]:gap-2 has-[>svg]:px-2 has-[>kbd]:pr-[6px] group size-7 rounded-md ${
              isEnhancing ? "enhance-button-sparkle" : ""
            }`}
            data-loading={isEnhancing ? "true" : "false"}
            disabled={!hasContent || isEnhancing || !meetsCharLimit || isAlreadyEnhanced}
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
                hasContent && !isEnhancing && meetsCharLimit && !isAlreadyEnhanced
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-400"
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
        <TooltipContent side="top" className="bg-neutral-900 text-white border-neutral-800 text-sm">
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
