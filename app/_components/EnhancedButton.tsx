"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Sparkles } from "lucide-react"

interface EnhanceButtonProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  hasContent: boolean
}

export default function EnhanceButton({ textareaRef, hasContent }: EnhanceButtonProps) {
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Typewriter effect function
  const typewriterEffect = (text: string, element: HTMLTextAreaElement) => {
    const originalText = element.value
    element.value = ""

    let i = 0
    const speed = 10 // typing speed

    function typeWriter() {
      if (i < text.length) {
        element.value += text.charAt(i)
        i++
        setTimeout(typeWriter, speed)
      } else {
        setIsEnhancing(false)
      }
    }

    // Start the typewriter effect
    typeWriter()
  }

  const handleEnhance = async () => {
    if (!hasContent || isEnhancing) return

    const textarea = textareaRef.current
    if (!textarea) return

    const originalText = textarea.value

    // Validate input
    const wordCount = originalText
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(Boolean).length
    if (wordCount < 10) {
      alert("Your prompt must be at least 10 words to enhance it.")
      return
    }

    // Start animation
    setIsEnhancing(true)
    setIsAnimating(true)

    // Replace text with skeleton loading animation
    textarea.value = "Enhancing your prompt..."
    textarea.disabled = true

    try {
      // Call the API to enhance the prompt
      const response = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: originalText }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to enhance prompt")
      }

      // Apply typewriter effect with the enhanced prompt
      setTimeout(() => {
        textarea.disabled = false
        typewriterEffect(data.enhancedPrompt, textarea)
      }, 1000)
    } catch (error) {
      console.error("Error:", error)

      // Fallback enhancement if API fails
      const fallbackEnhanced = fallbackEnhancePrompt(originalText)

      setTimeout(() => {
        textarea.disabled = false
        typewriterEffect(fallbackEnhanced, textarea)
      }, 1000)

      console.warn("Used fallback enhancement due to API error")
    }

    // End button animation after a delay
    setTimeout(() => {
      setIsAnimating(false)
      setIsEnhancing(false)
    }, 2000)
  }

  // Fallback function to enhance prompts without API
  const fallbackEnhancePrompt = (prompt: string): string => {
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

  return (
    <button
      ref={buttonRef}
      onClick={handleEnhance}
      className={`focus-visible:ring-offset-[#141415] inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap text-nowrap border font-medium outline-none ring-blue-600 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-1 [&>svg]:pointer-events-none [&>svg]:size-4 [&_svg]:shrink-0 px-3 text-sm has-[>kbd]:gap-2 has-[>svg]:px-2 has-[>kbd]:pr-[6px] ml-1 size-7 rounded-md 
        ${
          hasContent && !isEnhancing
            ? "bg-gradient-to-r from-blue-600 to-violet-600 border-transparent hover:opacity-90 focus:opacity-90 scale-100 opacity-100"
            : "bg-[#1f1f22] border-[#5d5d64] opacity-50 scale-95 cursor-not-allowed"
        }
        ${isAnimating ? "animate-sparkle" : ""}
      `}
      disabled={!hasContent || isEnhancing}
      type="button"
      aria-label="Enhance prompt"
    >
      <Sparkles
        className={`transition-colors duration-300 ${hasContent && !isEnhancing ? "text-white" : "text-[#6b6b74]"}`}
        size={16}
      />
      <span className="sr-only">Enhance Prompt</span>
    </button>
  )
}
