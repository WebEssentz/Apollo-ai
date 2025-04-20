"use client"
import Image from "next/image"
import type React from "react"

import Link from "next/link"
import Authentication from "./_components/Authentication"
import EnhanceButton from "./_components/EnhancedButton"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "./provider"
import { useEffect, useState, useRef } from "react"
import { useIsMobile } from "../hooks/use-mobile"
import EnhancedButton from "./_components/EnhancedButton"
import AuthModal from "./_components/AuthModal"
import AnimatedTextArea from "./AnimatedTextArea"

export default function Home() {
  const user = useAuthContext()
  const [isScrolled, setIsScrolled] = useState(false)
  const [hasContent, setHasContent] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
// type: React.RefObject<HTMLTextAreaElement>
  const isMobile = useIsMobile()
  const [charCount, setCharCount] = useState(0)
  const formRef = useRef<HTMLFormElement>(null)
  const [isEnhancing, setIsEnhancing] = useState(false)


  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  // Handle focus/blur animation for the form
  useEffect(() => {
    const form = formRef.current
    const textarea = textareaRef.current

    if (!form || !textarea) return

    const handleFocus = (e: FocusEvent) => {
      // Only trigger animation if the textarea itself is focused
      if (e.target === textarea) {
        form.classList.add("water-rush-in")
        form.classList.remove("blur-animation")
      }
    }

    const handleBlur = (e: FocusEvent) => {
      // Only trigger animation if we're not focusing another element within the form
      if (e.target === textarea) {
        form.classList.remove("water-rush-in")
        form.classList.add("blur-animation")
        setTimeout(() => {
          form.classList.remove("blur-animation")
        }, 3500) // Match the animation duration (3.5 seconds)
      }
    }

    textarea.addEventListener("focus", handleFocus)
    textarea.addEventListener("blur", handleBlur)

    return () => {
      textarea.removeEventListener("focus", handleFocus)
      textarea.removeEventListener("blur", handleBlur)
    }
  }, [])

   // Auto-resize textarea based on content and scroll to bottom
  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget
    if (textarea) {
      // Save current scroll position and selection
      const scrollTop = textarea.scrollTop
      const selectionStart = textarea.selectionStart
      const selectionEnd = textarea.selectionEnd

      // Temporarily reset height to calculate proper scrollHeight
      textarea.style.height = "auto"
      
      // Calculate new height with max height limit
      const maxHeight = 200
      const newHeight = Math.min(textarea.scrollHeight, maxHeight)
      textarea.style.height = `${newHeight}px`
      
      // If content exceeds max height, ensure proper scrolling
      if (textarea.scrollHeight > maxHeight) {
        textarea.style.overflowY = "auto"
        
        // If cursor is at the end, scroll to bottom
        if (selectionEnd === textarea.value.length) {
          textarea.scrollTop = textarea.scrollHeight
        } else {
          // Restore original scroll position
          textarea.scrollTop = scrollTop
        }
      } else {
        textarea.style.overflowY = "hidden"
      }

      // Restore selection
      textarea.setSelectionRange(selectionStart, selectionEnd)
      setHasContent(textarea.value.length > 0)
    }
  }

   // Handle key press in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Show auth modal when Enter is pressed without Shift
    if (e.key === "Enter" && !e.shiftKey && !isEnhancing) {
      e.preventDefault()
      setShowAuthModal(true)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEnhancing) {
      setShowAuthModal(true)
    }
  }

  // Handle enhancing state changes from EnhanceButton
  const handleEnhancingStateChange = (enhancingState: boolean) => {
    setIsEnhancing(enhancingState)
  }


  return (
    <div className="min-h-screen-patched bg-background flex w-full">
      <main className="min-h-screen-patched relative flex-1">
        <div className="flex min-h-screen flex-col items-center justify-center">
          {/* Header */}
          <header className={`fixed left-0 top-0 z-50 w-full bg-background transition-all duration-300`}>
            <div className="w-full">
              <nav className="flex h-16 items-center justify-between px-0">
                <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-all duration-300 pl-3">
                  <Image src={"/logo.svg"} alt="Apollo logo" width={32} height={32} className="w-8 h-8" priority />
                  <span className="font-medium text-lg hidden sm:inline-block">Apollo</span>
                </Link>

                <div className="flex items-center gap-2 pr-2">
                  {!user?.user?.email ? (
                    <>
                      <Authentication>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-transparent text-white border border-white/20 rounded-md hover:bg-white/10 font-medium"
                        >
                          Sign In
                        </Button>
                      </Authentication>
                      <Authentication>
                        <Button
                          size="sm"
                          className="bg-white text-neutral-900 hover:bg-neutral-100 font-medium rounded-md"
                        >
                          Sign Up
                        </Button>
                      </Authentication>
                    </>
                  ) : (
                    <Authentication mode="signout">
                      <Button size="sm" className="bg-white text-neutral-900 hover:bg-neutral-100 font-medium">
                        Sign Out
                      </Button>
                    </Authentication>
                  )}
                </div>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-col items-center justify-center gap-6 max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-48">
            {/* Hero Section */}
            <div className="flex flex-col items-center gap-[0.3] sm:gap-1 text-center">
              <div className="max-w-2xl">
                <h1 className="font-heading text-pretty text-center text-[29px] font-semibold tracking-tighter text-gray-900 sm:text-[32px] md:text-[46px] dark:text-neutral-200">
                  What can I help you build?
                </h1>
              </div>

              {/* Enhanced Textarea section */}
              <div className="mt-6 w-full max-w-3xl px-4 sm:px-4 md:px-6">
                <div
                  className={`group/form-container content-center relative mx-auto w-full ${isMobile ? "max-w-full px-0" : "max-w-[49rem] px-2 sm:px-0"}`}
                >
                  <div id="prompt-actions"></div>
                  <div className="relative z-10 flex w-full flex-col">
                    <div className="rounded-xl">
                      <form
                        onSubmit={handleSubmit}
                        className="relative gradient-border-animation bg-white dark:bg-[#141415] transition-all duration-300"
                      >
                        <div className="relative z-10 grid min-h-[120px] rounded-xl w-full">
                          <label className="sr-only" htmlFor="chat-main-textarea">
                            Chat Input
                          </label>                          
                          <AnimatedTextArea
                            ref={textareaRef}
                            id="chat-main-textarea"
                            name="content"
                            placeholder="Ask Apollo to build…"
                            defaultValue={""}
                            onChange={e => {
                              setHasContent(e.target.value.length > 0);
                              setCharCount(e.target.value.length);
                            }}
                            onInput={handleTextareaInput}
                            onKeyDown={handleKeyDown}
                            className={`${isMobile ? "font-light p-3 text-sm" : "font-normal p-4 text-base"}`}
                            required={false}
                            disabled={isEnhancing}
                          >
                            <div className="ml-auto flex items-center gap-1 min-h-0 h-8 px-1 pb-1 pt-0.5">
                              <EnhanceButton
                                textareaRef={textareaRef}
                                hasContent={hasContent}
                                onEnhancingStateChange={handleEnhancingStateChange}
                                onShowAuthModal={() => setShowAuthModal(true)}
                              />
                              <button
                                type="button"
                                className="focus-visible:ring-offset-background inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap text-nowrap border font-medium outline-none ring-blue-600 transition-[background,border-color,color,transform,opacity,box-shadow] focus-visible:ring-2 focus-visible:ring-offset-1 [&>svg]:pointer-events-none [&>svg]:size-4 [&_svg]:shrink-0 border-transparent hover:border-transparent focus:border-transparent focus-visible:border-transparent px-3 text-sm has-[>kbd]:gap-2 has-[>svg]:px-2 has-[>kbd]:pr-[6px] focus:bg-muted hover:text-foreground ml-[-2px] h-7 w-7 rounded-md hover:bg-neutral-800 focus-visible:bg-neutral-800"
                                onClick={() => setShowAuthModal(true)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="size-4"
                                >
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                  <polyline points="17 8 12 3 7 8" />
                                  <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                <span className="sr-only">Upload File</span>
                              </button>
                              <button
                                className={`focus-visible:ring-offset-[#141415] inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap text-nowrap border font-medium outline-none ring-blue-600 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-1 [&>svg]:pointer-events-none [&>svg]:size-4 [&_svg]:shrink-0 px-3 text-sm has-[>kbd]:gap-2 has-[>svg]:px-2 has-[>kbd]:pr-[6px] ml-1 size-7 rounded-md 
                                  ${
                                    hasContent && !isEnhancing
                                      ? "bg-white border-white hover:bg-gray-100 hover:border-gray-100 focus:bg-gray-100 focus:border-gray-100 scale-100 opacity-100"
                                      : "bg-[#1f1f22] border-[#5d5d64] opacity-50 scale-95 cursor-not-allowed"
                                  }`}
                                disabled={!hasContent || isEnhancing}
                                data-testid="prompt-form-send-button"
                                type="submit"
                              >
                                <svg
                                  data-testid="geist-icon"
                                  height="16"
                                  strokeLinejoin="round"
                                  viewBox="0 0 16 16"
                                  width="16"
                                  className={`transition-colors duration-300 ${
                                    hasContent && !isEnhancing ? "text-black" : "text-[#6b6b74]"
                                  }`}
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M8.70711 1.39644C8.31659 1.00592 7.68342 1.00592 7.2929 1.39644L2.21968 6.46966L1.68935 6.99999L2.75001 8.06065L3.28034 7.53032L7.25001 3.56065V14.25V15H8.75001V14.25V3.56065L12.7197 7.53032L13.25 8.06065L14.3107 6.99999L13.7803 6.46966L8.70711 1.39644Z"
                                    fill="currentColor"
                                  />
                                </svg>
                                <span className="sr-only">Send Message</span>
                              </button>
                            </div>
                          </AnimatedTextArea>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 gap-3 flex justify-center">
                {user?.user?.email ? (
                  <a
                    className="inline-flex justify-center items-center 
      gap-x-3 text-center bg-gradient-to-tl from-blue-600
       to-violet-600 hover:from-violet-600 hover:to-blue-600 border border-transparent text-white text-sm font-medium rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600 py-3 px-4 dark:focus:ring-offset-gray-800"
                    href="/dashboard"
                  >
                    Get started
                    <svg
                      className="flex-shrink-0 size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </a>
                ) : (
                  <Authentication>
                    <Button>Get Started</Button>
                  </Authentication>
                )}
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 items-center gap-2">
              <a className="group flex flex-col justify-center hover:bg-gray-50 rounded-xl p-4 md:p-7 dark:hover:bg-neutral-800" href="#">
                <div className="flex justify-center items-center size-12 bg-blue-600 rounded-xl">
                  <svg className="flex-shrink-0 size-6 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="10" height="14" x="3" y="8" rx="2" /><path d="M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4" /><path d="M8 18h.01" /></svg>
                </div>
                <div className="mt-5">              <h3 className="text-lg font-semibold text-white group-hover:text-gray-400">25+ templates</h3>
                  <p className="mt-1 text-neutral-400">Responsive, and mobile-first project on the web</p>
                  <span className="mt-2 inline-flex items-center gap-x-1.5 text-sm text-blue-500 decoration-2 group-hover:underline font-medium">
                    Learn more
                    <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                  </span>
                </div>
              </a>

              <a className="group flex flex-col justify-center hover:bg-gray-50 rounded-xl p-4 md:p-7 dark:hover:bg-neutral-800" href="#">
                <div className="flex justify-center items-center size-12 bg-blue-600 rounded-xl">
                  <svg className="flex-shrink-0 size-6 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" /></svg>
                </div>
                <div className="mt-5">
                  <h3 className="group-hover:text-gray-600 text-lg font-semibold text-gray-800 dark:text-white dark:group-hover:text-gray-400">Customizable</h3>
                  <p className="mt-1 text-gray-600 dark:text-neutral-400">Components are easily customized and extendable</p>
                  <span className="mt-2 inline-flex items-center gap-x-1.5 text-sm text-blue-600 decoration-2 group-hover:underline font-medium">
                    Learn more
                    <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                  </span>
                </div>
              </a>
              <a className="group flex flex-col justify-center hover:bg-gray-50 rounded-xl p-4 md:p-7 dark:hover:bg-neutral-800" href="#">
                <div className="flex justify-center items-center size-12 bg-blue-600 rounded-xl">
                  <svg className="flex-shrink-0 size-6 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                </div>
                <div className="mt-5">
                  <h3 className="group-hover:text-gray-600 text-lg font-semibold text-gray-800 dark:text-white dark:group-hover:text-gray-400">Free to Use</h3>
                  <p className="mt-1 text-gray-600 dark:text-neutral-400">Every component and plugin is well documented</p>
                  <span className="mt-2 inline-flex items-center gap-x-1.5 text-sm text-blue-600 decoration-2 group-hover:underline font-medium">
                    Learn more
                    <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                  </span>
                </div>
              </a>

              <a className="group flex flex-col justify-center hover:bg-gray-50 rounded-xl p-4 md:p-7 dark:hover:bg-neutral-800" href="#">
                <div className="flex justify-center items-center size-12 bg-blue-600 rounded-xl">
                  <svg className="flex-shrink-0 size-6 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" /><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" /></svg>
                </div>
                <div className="mt-5">
                  <h3 className="group-hover:text-gray-600 text-lg font-semibold text-gray-800 dark:text-white dark:group-hover:text-gray-400">24/7 Support</h3>
                  <p className="mt-1 text-gray-600 dark:text-neutral-400">Contact us 24 hours a day, 7 days a week</p>
                  <span className="mt-2 inline-flex items-center gap-x-1.5 text-sm text-blue-600 decoration-2 group-hover:underline font-medium">
                    Learn more
                    <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                  </span>
                </div>
              </a>

            </div>
          </div>

          {/* Image Section */}
          <div className="w-full">
            <Image
              src="/Wireframetocode.png"
              alt="image"
              width={800}
              height={900}
              className="w-full h-[300px] object-contain"
            />
          </div>
        </div>
      </main>
       {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
