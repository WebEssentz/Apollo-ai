"use client";
import React, { useRef, useState, forwardRef } from "react";
import "./animated-textarea.css";
import SilverTextEditor from './_components/SilverTextEditor';
import './_components/silver-text-editor.css';
import './_components/button-container.css';

interface AnimatedTextAreaProps {
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onInput?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  rows?: number;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

const AnimatedTextArea = forwardRef<HTMLDivElement, AnimatedTextAreaProps>(
  ({
    placeholder = "",
    className = "",
    id = "chat-main-textarea",
    name,
    defaultValue = "",
    onChange,
    onInput,
    onKeyDown,
    rows = 4,
    maxLength,
    required = false,
    disabled = false,
    children
  }, ref) => {    const [isFocused, setIsFocused] = useState(false);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
    const [isShimmering, setIsShimmering] = useState(false);    
    const [exitDirection, setExitDirection] = useState<'left' | 'right' | 'top' | 'bottom'>('right');
    const editorRef = useRef<HTMLDivElement>(null);
    const lastMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    // Track mouse position
    React.useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        lastMousePosition.current = { x: e.clientX, y: e.clientY };
      };

      document.addEventListener('mousemove', handleMouseMove);
      return () => document.removeEventListener('mousemove', handleMouseMove);
    }, []);

    React.useImperativeHandle(ref, () => editorRef.current as HTMLDivElement);

    const handleFocus = () => {
      setIsAnimatingOut(false);
      setIsFocused(true);
    };    const handleBlur = () => {
      setIsFocused(false);
      setIsAnimatingOut(true);
      setTimeout(() => {
        setIsAnimatingOut(false);
      }, 300); // Match the CSS transition duration
    };

    const handleChange = (value: string) => {
      if (onChange) {
        // Create a synthetic event-like object to maintain compatibility
        const syntheticEvent = {
          target: { value },
          currentTarget: { value }
        };
        onChange(syntheticEvent as any);
      }
      if (onInput) {
        onInput(value);
      }
    };    // Add shimmer state and callback to children elements
    const enhancedChildren = React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<any>, {
          isShimmering: isShimmering,
          onShimmerChange: (shimmer: boolean) => {
            setIsShimmering(shimmer);
          }
        });
      }
      return child;
    });

    return (
      <div className={`animated-border-textarea-container ${isFocused ? "focused" : ""} ${isAnimatingOut ? `animating-out from-${exitDirection}` : ""}`}>
        <div className="flex flex-col w-full">
          <SilverTextEditor
            ref={editorRef}
            id={id}
            placeholder={placeholder}
            defaultValue={defaultValue}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            disabled={disabled}
            isShimmering={isShimmering}
            className={`${className} ${children ? 'mb-0 pb-1 border-b-0 rounded-b-none' : ''}`}
          />          
          {children && ( 
            <div className="flex items-center justify-between px-1 py-2 bg-transparent w-full">
              <div className="flex gap-2">
                <div className="shrink-1 min-w-0 grow-0">
                  {/* Project selection or other left-side controls */}
                </div>
              </div>
              <div className="flex items-center [&>button]:h-11 [&>button]:w-11 [&>span]:h-11 [&>span]:w-11">
                {enhancedChildren}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

AnimatedTextArea.displayName = "AnimatedTextArea";

export default AnimatedTextArea;