"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Authentication from "./Authentication"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isMounted, setIsMounted] = useState(false)

  // Handle escape key press
  useEffect(() => {
    setIsMounted(true)
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden"
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  if (!isMounted) return null
  
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-xl bg-[#141415] p-6 shadow-xl transition-all">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
        
        {/* Logo and content */}
        <div className="flex flex-col items-center text-center">
          <Image 
            src="/logo.svg" 
            alt="Apollo logo" 
            width={48} 
            height={48} 
            className="mb-4" 
            priority 
          />
          
          <h2 className="text-xl font-semibold text-white mb-2">Welcome to Apollo</h2>
          <p className="text-gray-300 mb-6">Create an account to get started.</p>
          
          {/* Auth buttons */}
          <div className="flex flex-col w-full gap-3">
            <Authentication>
              <Button 
                className="w-full bg-white text-neutral-900 hover:bg-neutral-100 font-medium rounded-md"
              >
                Sign Up
              </Button>
            </Authentication>
            
            <Authentication>
              <Button 
                variant="outline" 
                className="w-full bg-transparent text-white border border-white/20 hover:bg-white/10 font-medium rounded-md"
              >
                Sign In
              </Button>
            </Authentication>
          </div>
        </div>
      </div>
    </div>
  )
}
