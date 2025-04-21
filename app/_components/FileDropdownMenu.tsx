import * as React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export function FileDropdownMenu({ onSelect, children }: { onSelect: (type: string) => void, children: React.ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-64 p-0 border border-neutral-800 bg-neutral-900 shadow-xl rounded-lg animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95">
        <ul className="py-2">
          <li>
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-neutral-800 transition rounded-md gap-3"
              onClick={() => onSelect("google-drive")}
            >
              {/* Google Drive SVG */}
              <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.62 8.13L24.06 21.13H44.06L36.62 8.13C36.22 7.43 35.5 7 34.7 7H18.54C17.74 7 17.02 7.43 16.62 8.13Z" fill="#2196F3"/>
                <path d="M3.94 40.87L11.38 27.87H31.38L23.94 40.87C23.54 41.57 22.82 42 22.02 42H5.86C5.06 42 4.34 41.57 3.94 40.87Z" fill="#FFC107"/>
                <path d="M44.06 21.13H24.06L31.5 34.13C31.9 34.83 32.62 35.26 33.42 35.26H41.58C42.38 35.26 43.1 34.83 43.5 34.13L44.06 33.13V21.13Z" fill="#4CAF50"/>
              </svg>
              Upload from Google Drive
            </button>
          </li>
          <li>
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-neutral-800 transition rounded-md gap-3"
              onClick={() => onSelect("onedrive")}
            >
              {/* OneDrive SVG (window.svg) */}
              <svg className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M1.5 2.5h13v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1zM0 1h16v11.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5zm3.75 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M7 4.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" fill="#666"/></svg>
              Upload from OneDrive
            </button>
          </li>
          <li>
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-neutral-800 transition rounded-md gap-3"
              onClick={() => onSelect("computer")}
            >
              {/* Paperclip SVG */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a5 5 0 0 1-7.07-7.07l9.19-9.19a3 3 0 0 1 4.24 4.24l-9.2 9.19a1 1 0 0 1-1.41-1.41l9.19-9.19"/></svg>
              Upload from Computer
            </button>
          </li>
          <li>
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-neutral-800 transition rounded-md gap-3"
              onClick={() => onSelect("figma")}
            >
              {/* Figma SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5.5" r="4.5" fill="#F24E1E"/><circle cx="12" cy="12" r="4.5" fill="#A259FF"/><circle cx="12" cy="18.5" r="4.5" fill="#1ABCFE"/><circle cx="18.5" cy="12" r="4.5" fill="#0ACF83"/><circle cx="5.5" cy="12" r="4.5" fill="#FF7262"/></svg>
              Import from Figma
            </button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}
