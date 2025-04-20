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
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => editorRef.current as HTMLDivElement);

    const handleFocus = () => {
      setIsAnimatingOut(false);
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
      setIsAnimatingOut(true);
      setTimeout(() => {
        setIsAnimatingOut(false);
      }, 1000);
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
    };    return (
      <div className={`animated-border-textarea-container ${isFocused ? "focused" : ""} ${isAnimatingOut ? "animating-out" : ""}`}>
        <div className="flex flex-col w-full">          <SilverTextEditor
            ref={editorRef}
            id={id}
            placeholder={placeholder}
            defaultValue={defaultValue}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            disabled={disabled}
            isShimmering={isFocused}
            className={className}
          />
          {children && (            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="flex gap-3">
                <div className="shrink-1 min-w-0 grow-0">
                  {/* Project selection or other left-side controls */}
                </div>
              </div>
              <div className="ml-auto flex items-center gap-3">
                {children}
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