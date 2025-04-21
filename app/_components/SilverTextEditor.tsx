"use client";

import React, { forwardRef } from 'react';

interface SilverTextEditorProps {
  id?: string;
  placeholder?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  disabled?: boolean;
  shimmer?: boolean;
  shimmerText?: string[]; // Add this new prop to specify which text should shimmer
  className?: string;
}

const SilverTextEditor = forwardRef<HTMLDivElement, SilverTextEditorProps>(
  function SilverTextEditor({
    id,
    placeholder,
    defaultValue = '',
    onChange,
    onKeyDown,
    disabled,
    shimmer = false,
    shimmerText,
    className = '',
  }, ref) {// Store refs for cleanup
    const animationFrameRef = React.useRef<number | undefined>(undefined);
    const scrollAnimationRef = React.useRef<number | undefined>(undefined);
    const resizeTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
    const isComponentMounted = React.useRef(true);    // Handle window resize and cleanup
    React.useEffect(() => {
      isComponentMounted.current = true;
      
      const handleResize = () => {
        if (isComponentMounted.current) {
          const maxHeight = Math.floor(window.innerHeight * 0.75);
          if (ref && 'current' in ref && ref.current) {
            ref.current.style.maxHeight = `${maxHeight}px`;
          }
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        isComponentMounted.current = false;
        window.removeEventListener('resize', handleResize);
        
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = undefined;
        }
        if (scrollAnimationRef.current) {
          cancelAnimationFrame(scrollAnimationRef.current);
          scrollAnimationRef.current = undefined;
        }
        if (resizeTimeoutRef.current) {
          clearTimeout(resizeTimeoutRef.current);
          resizeTimeoutRef.current = undefined;
        }
      };
    }, []);

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
    };const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
      const value = (e.currentTarget as HTMLDivElement).innerText.trim();
      if (onChange && value !== undefined) {
        onChange(value);
      }

      // Handle empty state for placeholder
      if (!value) {
        e.currentTarget.innerHTML = '';
      }

      // Ultra-smooth dynamic height adjustment and scrolling
      const smoothlyAdjustHeight = (target: HTMLDivElement) => {
        if (!target) return;

        // First pass: measure the content
        target.style.height = 'auto';
        const maxHeight = Math.floor(window.innerHeight * 0.75); // Increased max height
        const newHeight = Math.min(target.scrollHeight, maxHeight);
        
        // More sensitive bottom detection
        const wasNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 200;
        const previousScrollTop = target.scrollTop;
        const previousHeight = target.clientHeight;
        
        // Apply height change with ultra-smooth transition
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        
        animationFrameRef.current = requestAnimationFrame(() => {
          target.style.transition = 'height 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
          target.style.height = `${newHeight}px`;            // Enhanced intelligent scrolling with safety checks and improved smoothness
          if (wasNearBottom && isComponentMounted.current) {
            const scrollDelta = target.scrollHeight - previousHeight;
            if (scrollDelta > 0) {              // Professional butter-smooth scroll animation
              const startTime = performance.now();
              const duration = 400; // Slightly faster for more responsiveness
              const startScrollTop = target.scrollTop;
              const targetScrollTop = Math.min(
                target.scrollHeight - target.clientHeight,
                startScrollTop + scrollDelta + 12 // Smaller offset for more natural feel
              );
              
              const smoothScroll = (currentTime: number) => {
                if (!isComponentMounted.current) return;
                
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Enhanced easing function for natural movement
                const easeOutExpo = (t: number) => {
                  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
                };
                
                // Optimized spring-like bouncy easing
                const easeOutSpring = (t: number) => {
                  const c4 = (2 * Math.PI) / 3;
                  return t === 0
                    ? 0
                    : t === 1
                    ? 1
                    : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
                };                
                // Enhanced easing blend for ultra-smooth scrolling
                const easedProgress = Math.max(0, Math.min(1, 
                  0.9 * easeOutExpo(progress) + 0.1 * easeOutSpring(progress)
                ));
                
                const newScrollTop = startScrollTop + (targetScrollTop - startScrollTop) * easedProgress;
                target.scrollTop = newScrollTop;
                
                if (progress < 1) {
                  scrollAnimationRef.current = requestAnimationFrame(smoothScroll);
                }
              };
              
              if (scrollAnimationRef.current) cancelAnimationFrame(scrollAnimationRef.current);
              scrollAnimationRef.current = requestAnimationFrame(smoothScroll);
            }
          } else {
            // Maintain relative scroll position for mid-content editing
            target.scrollTop = previousScrollTop;
          }
        });
      };
      
      // Optimized debouncing for better performance
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(() => {
        if (e.currentTarget) {
          smoothlyAdjustHeight(e.currentTarget);
        }
      }, 16); // Aligned with 60fps refresh rate
    };

    function processTextWithShimmer(text: string, shimmerTexts: string[], isShimmering: boolean) {
      if (!isShimmering || !shimmerTexts.length) return text;
      
      // Create a temporary div to work with the HTML content
      const tempDiv = document.createElement('div');
      tempDiv.textContent = text;
      const content = tempDiv.textContent || '';
      
      // Replace each shimmer text with a span that has the shimmer class
      let processedContent = content;
      shimmerTexts.forEach(shimmerText => {
        const regex = new RegExp(shimmerText, 'gi');
        processedContent = processedContent.replace(regex, 
          `<span class="silvery-shimmer-text">${shimmerText}</span>`);
      });
      
      return <div dangerouslySetInnerHTML={{ __html: processedContent }} />;
    }

    return (
      <div
        ref={ref}
        id={id}
        contentEditable={!disabled}
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={onKeyDown}
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        data-shimmer={shimmer}
        className={`silver-editable ${shimmer ? "" : "text-white"} w-full px-4 py-3 bg-transparent outline-none whitespace-pre-wrap text-base leading-relaxed transition-colors duration-300 ${className}`}
        style={{
          minHeight: '80px',
          maxHeight: `${Math.floor(window.innerHeight * 0.75)}px`,
          overflowX: 'hidden',
          overflowY: 'auto',
          caretColor: '#fff',
          textAlign: 'left',
          wordBreak: 'break-word',
          wordWrap: 'break-word',
          position: 'relative',
          borderRadius: '0.75rem',
          transition: 'height 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
        suppressContentEditableWarning={true}
      >
        {defaultValue && shimmerText && shimmerText.length > 0 
          ? processTextWithShimmer(defaultValue, shimmerText, shimmer)
          : defaultValue}
      </div>
    );
  }
);

SilverTextEditor.displayName = 'SilverTextEditor';

export default SilverTextEditor;
