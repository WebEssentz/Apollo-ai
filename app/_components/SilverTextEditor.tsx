"use client";

import React, { forwardRef, useRef, useState, useEffect, ForwardedRef } from 'react';

interface SilverTextEditorProps {
  id?: string;
  placeholder?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  disabled?: boolean;
  shimmer?: boolean;
  shimmerText?: string[];
  className?: string;
  isShimmering?: boolean; // Add this prop for shimmer state
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
    isShimmering, // Accept the prop for logic only
  }, ref) {
    const [maxHeight, setMaxHeight] = useState('75vh');
    const isMounted = useRef(false);
    const isComponentMounted = useRef(true);    const animationFrameRef = useRef<number | undefined>(undefined);
    const scrollAnimationRef = useRef<number | undefined>(undefined);
    const resizeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
      if (typeof window === 'undefined') return;

      const handleResize = () => {
        if (isComponentMounted.current) {
          const newMaxHeight = `${Math.floor(window.innerHeight * 0.75)}px`;
          setMaxHeight(newMaxHeight);
        }
      };

      // Initial height setup
      handleResize();

      window.addEventListener('resize', handleResize);

      return () => {
        isComponentMounted.current = false;
        window.removeEventListener('resize', handleResize);
        
        // Cleanup animations and timeouts
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (scrollAnimationRef.current) {
          cancelAnimationFrame(scrollAnimationRef.current);
        }
        if (resizeTimeoutRef.current) {
          clearTimeout(resizeTimeoutRef.current);
        }
      };
    }, []);

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
    };

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
      const value = (e.currentTarget as HTMLDivElement).innerText.trim();
      onChange?.(value);

      if (!value) {
        e.currentTarget.innerHTML = '';
      }

      const smoothlyAdjustHeight = (target: HTMLDivElement) => {
        if (!target) return;

        target.style.height = 'auto';
        const maxHeightPx = Math.floor(window.innerHeight * 0.75);
        const newHeight = Math.min(target.scrollHeight, maxHeightPx);
        
        const wasNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 200;
        const previousScrollTop = target.scrollTop;
        
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        
        animationFrameRef.current = requestAnimationFrame(() => {
          target.style.transition = 'height 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
          target.style.height = `${newHeight}px`;

          if (wasNearBottom && isComponentMounted.current) {
            const scrollDelta = target.scrollHeight - target.clientHeight;
            if (scrollDelta > 0) {
              const startTime = performance.now();
              const duration = 400;
              const startScrollTop = target.scrollTop;
              const targetScrollTop = Math.min(
                target.scrollHeight - target.clientHeight,
                startScrollTop + scrollDelta + 12
              );
              
              const smoothScroll = (currentTime: number) => {
                if (!isComponentMounted.current) return;
                
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeOutExpo = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
                const easeOutSpring = (t: number) => {
                  const c4 = (2 * Math.PI) / 3;
                  return t === 0
                    ? 0
                    : t === 1
                    ? 1
                    : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
                };
                
                const easedProgress = 0.9 * easeOutExpo(progress) + 0.1 * easeOutSpring(progress);
                const newScrollTop = startScrollTop + (targetScrollTop - startScrollTop) * easedProgress;
                target.scrollTop = newScrollTop;
                
                if (progress < 1) {
                  scrollAnimationRef.current = requestAnimationFrame(smoothScroll);
                }
              };
              
              if (scrollAnimationRef.current) {
                cancelAnimationFrame(scrollAnimationRef.current);
              }
              scrollAnimationRef.current = requestAnimationFrame(smoothScroll);
            }
          } else {
            target.scrollTop = previousScrollTop;
          }
        });
      };
      
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(() => {
        if (e.currentTarget) {
          smoothlyAdjustHeight(e.currentTarget);
        }
      }, 16);
    };

    const processTextWithShimmer = (text: string, shimmerTexts: string[] = [], isShimmering: boolean): React.ReactNode => {
      if (!isShimmering || !shimmerTexts.length) return text;
      
      const tempDiv = document.createElement('div');
      tempDiv.textContent = text;
      const content = tempDiv.textContent || '';
      
      let processedContent = content;
      shimmerTexts.forEach(shimmerText => {
        const regex = new RegExp(shimmerText, 'gi');
        processedContent = processedContent.replace(regex, 
          `<span class="silvery-shimmer-text">${shimmerText}</span>`);
      });
      
      return <div dangerouslySetInnerHTML={{ __html: processedContent }} />;
    };

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
        data-shimmering={isShimmering ? 'true' : undefined} // Only as data attribute
        className={`silver-editable ${shimmer ? "" : "text-white"} w-full px-4 py-3 bg-transparent outline-none whitespace-pre-wrap text-base leading-relaxed transition-colors duration-300 ${className}`}
        style={{
          minHeight: '80px',
          maxHeight,
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
          ? processTextWithShimmer(defaultValue, shimmerText, Boolean(shimmer && isShimmering))
          : defaultValue}
      </div>
    );
  }
);

SilverTextEditor.displayName = 'SilverTextEditor';

export default SilverTextEditor;
