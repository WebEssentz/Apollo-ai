"use client";
import React, { useRef, useState, forwardRef, useImperativeHandle } from "react";
import "./animated-textarea.css";

interface AnimatedTextAreaProps {
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onInput?: (e: React.FormEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  dataEnhancing?: boolean;
}

const AnimatedTextArea = forwardRef<HTMLTextAreaElement, AnimatedTextAreaProps>(
  (
    {
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
      children,
      dataEnhancing = false,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

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

    // No overlays, no duplicate text, shimmer is only a background animation on the textarea
    return (
      <div className={`animated-border-textarea-container ${isFocused ? "focused" : ""} ${isAnimatingOut ? "animating-out" : ""}`}>
        <div className="flex flex-col w-full">
          <textarea
            ref={el => {
              textareaRef.current = el;
              if (typeof ref === "function") ref(el);
              else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
            }}
            id={id}
            name={name}
            placeholder={placeholder}
            defaultValue={defaultValue}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onInput={onInput}
            onKeyDown={onKeyDown}
            rows={rows}
            maxLength={maxLength}
            required={required}
            disabled={disabled}
            data-enhancing={dataEnhancing}
            className={`animated-border-textarea ${className}`}
            style={{
              resize: "none",
              minHeight: "32px",
              maxHeight: "384px",
              paddingBottom: "0.25rem"
            }}
          />
          {children && (
            <div className="animated-border-textarea-children flex items-center gap-1 justify-end px-1 pb-1 pt-0.5 min-h-0 h-8">
              {children}
            </div>
          )}
        </div>
      </div>
    );
  }
);

AnimatedTextArea.displayName = "AnimatedTextArea";

export default AnimatedTextArea;
