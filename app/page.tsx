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

export default function Home() {
  const user = useAuthContext()
  const [isScrolled, setIsScrolled] = useState(false)
  const [hasContent, setHasContent] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isMobile = useIsMobile()

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto-resize textarea based on content
  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 384)}px`
      setHasContent(textarea.value.length > 0)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log("Submitting prompt:", textareaRef.current?.value)
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
                          <textarea
                            ref={textareaRef}
                            onInput={handleTextareaInput}
                            id="chat-main-textarea"
                            name="content"
                            placeholder="Ask Apollo to build…"
                            spellCheck="false"
                            className={`resize-none overflow-auto w-full flex-1 outline-none ring-0 placeholder:text-gray-300 text-white transition-all duration-200 focus:outline-none ${isMobile ? "font-light p-3 text-sm" : "font-normal p-4 text-base"}`}
                            autoComplete="off"
                            style={{
                              height: "80px",
                              minHeight: "80px",
                              maxHeight: "384px",
                              backgroundColor: "#141415",
                              borderRadius: "inherit",
                              width: isMobile ? "100%" : undefined,
                            }}
                            aria-label="Type your request here"
                          />
                          <div className="absolute bottom-3 right-3 flex items-center">
                            {/* Enhance Button - NEW */}
                            <EnhancedButton textareaRef={textareaRef} hasContent={hasContent} />

                            {/* Submit Button */}
                            <button
                              className={`focus-visible:ring-offset-[#141415] inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap text-nowrap border font-medium outline-none ring-blue-600 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-1 [&>svg]:pointer-events-none [&>svg]:size-4 [&_svg]:shrink-0 px-3 text-sm has-[>kbd]:gap-2 has-[>svg]:px-2 has-[>kbd]:pr-[6px] ml-1 size-7 rounded-md 
                                ${
                                  hasContent
                                    ? "bg-white border-white hover:bg-gray-100 hover:border-gray-100 focus:bg-gray-100 focus:border-gray-100 scale-100 opacity-100"
                                    : "bg-[#1f1f22] border-[#5d5d64] opacity-50 scale-95 cursor-not-allowed"
                                }`}
                              disabled={!hasContent}
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
                                  hasContent ? "text-black" : "text-[#6b6b74]"
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
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 gap-3 flex justify-center">
                {user?.user?.email ? 
                  <a className="inline-flex justify-center items-center 
      gap-x-3 text-center bg-gradient-to-tl from-blue-600
       to-violet-600 hover:from-violet-600 hover:to-blue-600 border border-transparent text-white text-sm font-medium rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600 py-3 px-4 dark:focus:ring-offset-gray-800"
                    href="/dashboard">
                    Get started
                    <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                  </a>
                  : <Authentication >
                    <Button>Get Started</Button>
                  </Authentication>
                }
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
    </div>
  );
}
