"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EnhancedButtonProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  hasContent: boolean;
  onEnhancingStateChange?: (isEnhancing: boolean) => void;
  onShowAuthModal: () => void;
  onShimmerChange?: (shimmer: boolean) => void; // NEW PROP
}

export default function EnhancedButton({
  textareaRef,
  hasContent,
  onEnhancingStateChange,
  onShowAuthModal,
  onShimmerChange,
}: EnhancedButtonProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [meetsCharLimit, setMeetsCharLimit] = useState(false);
  const [isAlreadyEnhanced, setIsAlreadyEnhanced] = useState(false);
  const [enhancedText, setEnhancedText] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Character count logic (unchanged)
  useEffect(() => {
    const checkCharLimit = () => {
      if (!textareaRef.current) return;
      // Support both textarea and contenteditable div
      const text = (textareaRef.current as any).value !== undefined
        ? (textareaRef.current as any).value || ''
        : textareaRef.current.textContent || '';
      const charCount = text.length;
      setMeetsCharLimit(charCount >= 100 && charCount <= 1000);
      if (enhancedText !== null) {
        setIsAlreadyEnhanced(text === enhancedText);
      }
    };
    checkCharLimit();
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener("input", checkCharLimit);
      return () => textarea.removeEventListener("input", checkCharLimit);
    }
  }, [textareaRef, enhancedText]);

  // --- Typewriter effect and AI stream logic from previous code ---
  // Silver typewriter effect - improved for smoother animation and scrolling
  const silverTypewriterEffect = (text: string, element: HTMLTextAreaElement | HTMLDivElement) => {
    // Defensive: don't call API with empty prompt
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return;
    }
    // Get enhanced text from API with validation
    const enhancePromptAsync = async (prompt: string) => {
      try {
        const response = await fetch("/api/enhance-prompt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to enhance prompt");
        }
        const data = await response.json();
        return data.enhancedPrompt;
      } catch (error) {
        console.error("Error:", error);
        return fallbackEnhancePrompt(prompt);
      }
    };

    let typedText = "";
    let enhancedText = "";
    let isStreaming = false;
    let charIndex = 0;
    const streamSpeed = 12;
    let lastNewlineIndex = -1;

    enhancePromptAsync(text).then((result) => {
      enhancedText = result;
      setEnhancedText(result);
      if (!isStreaming) {
        startStreaming();
      }
    });

    function startStreaming() {
      isStreaming = true;
      if (onShimmerChange) onShimmerChange(true); // START shimmer
      streamNextChar();
    }

    function streamNextChar() {
      if (charIndex < enhancedText.length) {
        const currentChar = enhancedText.charAt(charIndex);
        typedText += currentChar;
        const isNewline = currentChar === "\n";
        if (isNewline) {
          lastNewlineIndex = charIndex;
        }
        // Update the actual textarea or contenteditable div value
        if ('value' in element) {
          // textarea
          (element as HTMLTextAreaElement).value = typedText;
        } else {
          // contenteditable div
          (element as HTMLElement).textContent = typedText;
        }
        // Trigger input event to resize textarea and maintain proper sizing
        const event = new Event("input", { bubbles: true });
        element.dispatchEvent(event);
        // Smooth auto-scroll to bottom
        if ('scrollTo' in element && 'scrollHeight' in element) {
          element.scrollTo({
            top: (element as any).scrollHeight,
            behavior: "smooth",
          });
        }
        charIndex++;
        const randomVariation = Math.random() * 5 - 2.5;
        const adjustedSpeed = streamSpeed + randomVariation;
        const delay = isNewline || enhancedText.charAt(charIndex - 1) === "." ? adjustedSpeed * 3 : adjustedSpeed;
        setTimeout(streamNextChar, delay);
      } else {
        setTimeout(() => {
          // Finalize value
          if ('value' in element) {
            (element as HTMLTextAreaElement).value = enhancedText;
          } else {
            (element as HTMLElement).textContent = enhancedText;
          }
          const event = new Event("input", { bubbles: true });
          element.dispatchEvent(event);
          if ('scrollTo' in element && 'scrollHeight' in element) {
            element.scrollTo({
              top: (element as any).scrollHeight,
              behavior: "smooth",
            });
          }
          setIsEnhancing(false);
          setIsAlreadyEnhanced(true);
          if (onShimmerChange) onShimmerChange(false); // END shimmer
        }, 300);
      }
    }
  };

  // Defensive fallback for undefined/null prompt
  function fallbackEnhancePrompt(prompt: string | undefined | null): string {
    if (!prompt || typeof prompt !== 'string') return '';
    // Example fallback: just return the prompt lowercased
    return prompt.toLowerCase();
  }

  // Main Enhance logic
  const handleEnhance = async () => {
    if (!hasContent || isEnhancing || !meetsCharLimit || isAlreadyEnhanced) return;
    const textarea = textareaRef.current;
    if (!textarea) return;
    const text = (textarea as any).value !== undefined
      ? (textarea as any).value || ''
      : textarea.textContent || '';
    if (!text || typeof text !== "string" || text.trim().length === 0) return;
    
    // Trigger shimmer effect immediately
    if (onShimmerChange) onShimmerChange(true);
    setIsEnhancing(true);
    setIsAnimating(true);
    if (buttonRef.current) {
      buttonRef.current.classList.add("enhance-button-sparkle");
    }
    
    // Apply shimmer effect to specific text
    silverTypewriterEffect(text, textarea);
    
    // Keep shimmer effect active for a bit longer to make it more noticeable
    const shimmerDuration = 2000; // 2 seconds
    setTimeout(() => {
      if (onShimmerChange) {
        onShimmerChange(false);
      }
    }, shimmerDuration);
    
    // Cleanup animations and effects
    const cleanup = () => {
      setIsAnimating(false);
      if (buttonRef.current) {
        buttonRef.current.classList.remove("enhance-button-sparkle");
      }
    };

    // Set timeout for animation cleanup
    const timeoutId = setTimeout(cleanup, 4000);

    // Cleanup on component unmount or error
    return () => {
      clearTimeout(timeoutId);
      cleanup();
    };
  };

  // Tooltip logic (unchanged)
  const getTooltipContent = () => {
    if (!hasContent) return "Enter some text to enhance";
    if (isEnhancing) return "Enhancing your prompt...";
    if (isAlreadyEnhanced) return "This prompt is already enhanced";
    if (!meetsCharLimit) {
      const text = textareaRef.current?.value || "";
      const charCount = text.length;
      if (charCount < 100) return "Prompt is too short. Min length is 100 characters.";
      if (charCount > 1000) return "Prompt is too long. Max length is 1000 characters.";
    }
    return "Click to enhance prompt";
  };

  useEffect(() => {
    if (onEnhancingStateChange) onEnhancingStateChange(isEnhancing);
  }, [isEnhancing, onEnhancingStateChange]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            ref={buttonRef}
            onClick={handleEnhance}
            className={`focus-visible:ring-offset-background inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap text-nowrap border font-medium outline-none ring-blue-600 transition-[background,border-color,color,transform,opacity,box-shadow] focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:ring-0 [&>svg]:pointer-events-none [&>svg]:size-4 [&_svg]:shrink-0 hover:bg-gray-200 dark:hover:bg-gray-800 focus-visible:bg-gray-200 dark:focus-visible:bg-gray-800 border-transparent bg-transparent text-gray-900 dark:text-white hover:border-transparent focus:border-transparent focus-visible:border-transparent disabled:border-transparent disabled:bg-transparent disabled:text-gray-400 px-3 text-sm has-[>kbd]:gap-2 has-[>svg]:px-2 has-[>kbd]:pr-[6px] group size-7 rounded-md ${
              isEnhancing ? "enhance-button-sparkle" : ""
            }`}
            data-loading={isEnhancing ? "true" : "false"}
            disabled={!hasContent || isEnhancing || !meetsCharLimit || isAlreadyEnhanced}
            type="button"
            aria-label="Enhance prompt"
          >
            {/* SVG Icon unchanged */}
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
  );
}
