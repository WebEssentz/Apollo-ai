"use client";

import React, { forwardRef } from 'react';

interface SilverTextEditorProps {
  id?: string;
  placeholder?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  disabled?: boolean;
  isShimmering?: boolean;
  className?: string;
}

const SilverTextEditor = forwardRef<HTMLDivElement, SilverTextEditorProps>(
  ({
    id,
    placeholder,
    defaultValue = '',
    onChange,
    onKeyDown,
    disabled,
    isShimmering,
    className = '',
  }, ref) => {
    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
    };

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
      const value = e.currentTarget.innerText.trim();
      if (onChange) {
        onChange(value);
      }
      
      // Handle empty state for placeholder
      if (!value) {
        e.currentTarget.innerHTML = '';
      }      // Smooth auto-scroll to bottom
      requestAnimationFrame(() => {
        if (e.currentTarget && e.currentTarget.scrollHeight) {
          const scrollHeight = e.currentTarget.scrollHeight;
          const clientHeight = e.currentTarget.clientHeight;
          if (scrollHeight > clientHeight) {
            e.currentTarget.scrollTo({
              top: scrollHeight,
              behavior: 'smooth'
            });
          }
        }
      });
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
        className={`w-full p-4 bg-transparent outline-none whitespace-pre-wrap break-all text-base text-white leading-relaxed ${className}`}        style={{
          minHeight: '80px',
          maxHeight: '500px',
          overflowX: 'hidden',
          overflowY: 'auto',
          caretColor: '#fff',
          textAlign: 'left',
          wordBreak: 'break-word'
        }}
        suppressContentEditableWarning={true}
      >
        {defaultValue}
      </div>
    );
  }
);

SilverTextEditor.displayName = 'SilverTextEditor';

export default SilverTextEditor;