"use client"
import Image from "next/image";
import Link from "next/link";
import Authentication from "./_components/Authentication";
import { Button } from "@/components/ui/button";
import { auth } from "@/configs/firebaseConfig";
import ProfileAvatar from "./_components/ProfileAvatar";
import { useAuthContext } from "./provider";

export default function Home() {
  // const user = auth?.currentUser;
  // console.log(user)
  const user = useAuthContext();
  console.log(user?.user)
  return (
    <div className="min-h-screen-patched bg-background flex w-full">      <main className="min-h-screen-patched relative flex-1">
        <div className="flex min-h-screen flex-col items-center justify-center">
          <header className="fixed left-0 top-0 z-50 w-full bg-background">
            <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
              <nav className="flex h-14 items-center justify-between">
                <Link
                  href="/"
                  className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
                  style={{ marginLeft: '0' }}
                >
                  <Image
                    src={'/logo.svg'}
                    alt='Apollo logo'
                    width={28}
                    height={28}
                    className='w-7 h-7'
                    priority
                  />
                </Link>

                <div className="flex gap-2 ml-auto">
                  {!user?.user?.email ? (
                    <>
                      <Authentication>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-neutral-200 border-neutral-700 hover:bg-neutral-800 font-medium"
                        >
                          Sign In
                        </Button>
                      </Authentication>
                      <Authentication>
                        <Button
                          size="sm"
                          className="bg-white text-neutral-900 hover:bg-neutral-100 font-medium"
                        >
                          Sign Up
                        </Button>
                      </Authentication>
                    </>
                  ) : (
                    <Authentication>
                      <Button
                        size="sm"
                        className="bg-white text-neutral-900 hover:bg-neutral-100 font-medium"
                      >
                        Sign Out
                      </Button>
                    </Authentication>
                  )}
                </div>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-col items-center justify-center gap-6 max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-48 mx-auto flex w-full flex-col gap-4 pt-32 lg:pt-48">
            {/* Hero Section */}            
            <div className="flex flex-col items-center gap-[0.3] sm:gap-1 text-center">
              <div className="max-w-2xl">
                <h1 className="font-heading text-pretty text-center text-[29px] font-semibold tracking-tighter text-gray-900 sm:text-[32px] md:text-[46px] dark:text-neutral-200">
                  What can I help you with?
                </h1>
              </div>              
              <div className="mt-2 w-full max-w-3xl px-4">
                <div className="group/form-container content-center relative mx-auto w-full max-w-[49rem]">
                  <div id="prompt-actions"></div>
                  <div className="relative z-10 flex w-full flex-col">
                    <div className="rounded-b-xl peer-has-[.banner]:bg-gray-100">
                      <form className="focus-within:border-alpha-600 bg-background-subtle border-alpha-400 relative rounded-xl border shadow-[0_2px_2px_rgba(0,0,0,0.04),0_8px_8px_-8px_rgba(0,0,0,0.04)] transition-shadow">
                        <div className="@container/textarea bg-background-subtle relative z-10 grid min-h-[100px] rounded-xl">
                          <label className="sr-only" htmlFor="chat-main-textarea">Chat Input</label>
                          <textarea 
                            data-enhancing="false" 
                            id="chat-main-textarea" 
                            name="content" 
                            placeholder="Ask Apollo to build…" 
                            spellCheck="false" 
                            className="resize-none overflow-auto data-[enhancing=true]:text-shimmer data-[enhancing=true]:animate-shimmer-text w-full flex-1 bg-transparent p-3 pb-1.5 text-sm outline-none ring-0 placeholder:text-gray-500"
                            autoComplete="off"
                            data-1p-ignore="true"
                            data-dashlane-disabled-on-field="true"
                            style={{ height: '42px', minHeight: '42px', maxHeight: '384px' }}
                          />
                          <div className="flex items-center gap-2 p-3">
                            <div className="flex gap-1">
                              <div className="shrink-1 min-w-0 grow-0">
                                <button className="focus:border-alpha-400 focus-visible:border-alpha-400 disabled:border-alpha-300 border-alpha-400 hover:border-alpha-400 focus-visible:ring-offset-background aria-disabled:border-alpha-300 shrink-0 cursor-pointer select-none items-center whitespace-nowrap text-nowrap border font-medium outline-none ring-blue-600 focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:ring-0 has-[:focus-visible]:ring-2 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:bg-gray-100 aria-disabled:text-gray-400 aria-disabled:ring-0 [&>svg]:pointer-events-none [&>svg]:size-4 [&_svg]:shrink-0 focus:bg-gray-100 focus-visible:bg-gray-100 px-3 has-[>kbd]:gap-2 has-[>svg]:px-2 has-[>kbd]:pr-[6px] flex h-7 max-w-[200px] justify-start gap-0.5 rounded-md border-none bg-gray-100 pl-2 pr-1.5 text-[13px] transition-colors hover:bg-gray-200 hover:text-gray-900 text-gray-500" aria-label="Select project">
                                  <span>No project selected</span>
                                  <svg data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{ color: 'currentcolor' }}>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12.0607 6.74999L11.5303 7.28032L8.7071 10.1035C8.31657 10.4941 7.68341 10.4941 7.29288 10.1035L4.46966 7.28032L3.93933 6.74999L4.99999 5.68933L5.53032 6.21966L7.99999 8.68933L10.4697 6.21966L11 5.68933L12.0607 6.74999Z" fill="currentColor" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div className="ml-auto flex items-center gap-1">
                              <div className="flex items-center gap-2" style={{ opacity: 1, willChange: 'opacity' }}>
                                <span className="flex items-center justify-center" tabIndex={-1} data-state="closed">
                                  <button className="focus-visible:ring-offset-background inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap text-nowrap border font-medium outline-none ring-blue-600 transition-[background,border-color,color,transform,opacity,box-shadow] focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:ring-0 has-[:focus-visible]:ring-2 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:ring-0 [&>svg]:pointer-events-none [&>svg]:size-4 [&_svg]:shrink-0 hover:bg-alpha-200 focus-visible:bg-alpha-200 border-transparent bg-transparent text-gray-900 hover:border-transparent focus:border-transparent focus:bg-transparent focus-visible:border-transparent disabled:border-transparent disabled:bg-transparent disabled:text-gray-400 aria-disabled:border-transparent aria-disabled:bg-transparent aria-disabled:text-gray-400 px-3 text-sm has-[>kbd]:gap-2 has-[>svg]:px-2 has-[>kbd]:pr-[6px] group size-7 rounded-md" disabled data-loading="false" type="button">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M12.8281 1C12.8281 2.10747 11.7632 3.17235 10.6558 3.17235C11.7632 3.17235 12.8281 4.23724 12.8281 5.34471C12.8281 4.23724 13.893 3.17235 15.0005 3.17235C13.893 3.17235 12.8281 2.10747 12.8281 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                      <path d="M13 12C13 12.5098 12.5098 13 12 13C12.5098 13 13 13.4902 13 14C13 13.4902 13.4902 13 14 13C13.4902 13 13 12.5098 13 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                      <path d="M5.10285 3.89648C5.10285 5.98837 3.0914 7.99982 0.999512 7.99982C3.0914 7.99982 5.10285 10.0113 5.10285 12.1032C5.10285 10.0113 7.1143 7.99982 9.20619 7.99982C7.1143 7.99982 5.10285 5.98837 5.10285 3.89648Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </button>
                                </span>
                              </div>
                              <input className="sr-only" data-enable-grammarly="false" data-gramm="false" data-gramm_editor="false" type="file" multiple />
                              <button className="focus-visible:ring-offset-background inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap text-nowrap border font-medium outline-none ring-blue-600 transition-[background,border-color,color,transform,opacity,box-shadow] focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:ring-0 has-[:focus-visible]:ring-2 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:bg-gray-100 aria-disabled:text-gray-400 aria-disabled:ring-0 [&>svg]:pointer-events-none [&>svg]:size-4 [&_svg]:shrink-0 disabled:border-alpha-400 text-background aria-disabled:border-alpha-400 border-gray-900 bg-gray-900 hover:border-gray-700 hover:bg-gray-700 focus:border-gray-700 focus:bg-gray-700 focus-visible:border-gray-700 focus-visible:bg-gray-700 px-3 text-sm has-[>kbd]:gap-2 has-[>svg]:px-2 has-[>kbd]:pr-[6px] ml-1 size-7 rounded-md" disabled data-testid="prompt-form-send-button" type="submit">
                                <svg data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{ color: 'currentcolor' }}>
                                  <path fillRule="evenodd" clipRule="evenodd" d="M8.70711 1.39644C8.31659 1.00592 7.68342 1.00592 7.2929 1.39644L2.21968 6.46966L1.68935 6.99999L2.75001 8.06065L3.28034 7.53032L7.25001 3.56065V14.25V15H8.75001V14.25V3.56065L12.7197 7.53032L13.25 8.06065L14.3107 6.99999L13.7803 6.46966L8.70711 1.39644Z" fill="currentColor" />
                                </svg>
                                <span className="sr-only">Send Message</span>
                              </button>
                            </div>
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
              </a>              <a className="group flex flex-col justify-center hover:bg-gray-50 rounded-xl p-4 md:p-7 dark:hover:bg-neutral-800" href="#">
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
              src={'/Wireframetocode.png'}
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
