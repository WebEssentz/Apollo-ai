"use client"
import { auth } from '@/configs/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface AuthenticationProps {
  children: React.ReactNode;
  className?: string;
  onSuccess?: (user: any) => void;
  onError?: (error: any) => void;
  mode?: 'signin' | 'signup' | 'signout';
}

function Authentication({
  children,
  className = '',
  onSuccess,
  onError,
  mode = 'signin'
}: AuthenticationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const provider = new GoogleAuthProvider();

  const handleAuthentication = () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);

    // Handle sign out
    if (mode === 'signout') {
      auth.signOut()
        .then(() => {
          console.log('Successfully signed out');
          if (onSuccess) onSuccess(null);
          window.location.reload();
        })
        .catch((error) => {
          console.error('Sign out error:', error);
          setError('Failed to sign out');
          if (onError) onError(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
      return;
    }
    
    // Handle sign in and sign up (same flow for Google Auth)
    signInWithPopup(auth, provider)
      .then((result) => {
        // Get authentication info
        const credential: any = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        
        console.log(`${mode === 'signup' ? 'Sign up' : 'Sign in'} successful:`, user);
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess(user);
        }
        
        // Reload to update UI
        window.location.reload();
      })
      .catch((error) => {
        // Handle errors
        const errorCode = error.code;
        const errorMessage = error.message;
        
        console.error(`Authentication error: ${errorCode} - ${errorMessage}`);
        
        // Set user-friendly error message
        if (errorCode === 'auth/popup-closed-by-user') {
          setError('Authentication canceled');
        } else if (errorCode === 'auth/network-request-failed') {
          setError('Network error. Please check your connection');
        } else if (errorCode === 'auth/user-disabled') {
          setError('This account has been disabled');
        } else if (errorCode === 'auth/account-exists-with-different-credential') {
          setError('Account already exists with a different sign-in method');
        } else {
          setError('Authentication failed. Please try again');
        }
        
        // Call error callback if provided
        if (onError) {
          onError(error);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  return (
    <div className={`relative inline-block ${className}`}>
      <div 
        onClick={handleAuthentication}
        className={`relative transition-all duration-300 ${
          isLoading 
            ? 'opacity-80 cursor-wait' 
            : 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
        }`}
        role="button"
        aria-busy={isLoading}
        aria-disabled={isLoading}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleAuthentication();
          }
        }}
        aria-label={
          mode === 'signin' ? 'Sign in' : 
          mode === 'signup' ? 'Sign up' : 
          'Sign out'
        }
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-white/10 backdrop-blur-[1px] rounded-md z-10 animate-fadeIn">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        )}
        {children}
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-500 animate-slideUpFade absolute left-0 right-0 text-center" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

export default Authentication;
