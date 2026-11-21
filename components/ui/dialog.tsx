"use client";

import * as React from "react";
import { X } from "lucide-react";
import { useFocusTrap } from "@/lib/useFocusTrap";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  maxWidth = "md",
}: DialogProps) {
  const containerRef = useFocusTrap(open);

  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby={description ? "dialog-description" : undefined}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      <div
        ref={containerRef}
        tabIndex={-1}
        className={`relative w-full ${maxWidthClasses[maxWidth]} rounded-3xl border border-[#DCE5DF] bg-white dark:bg-[#0E2020] p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto focus:outline-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-3 mb-3 border-b border-[#DCE5DF]/60 dark:border-[#1A3937]">
          <div>
            <h2 id="dialog-title" className="text-lg font-bold text-[#152C2B] dark:text-[#EEF8F6] tracking-tight">
              {title}
            </h2>
            {description && (
              <p id="dialog-description" className="text-xs text-[#526564] dark:text-[#8EA8A5] mt-0.5">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-1.5 text-[#526564] dark:text-[#8EA8A5] hover:bg-[#F6F5EF] dark:hover:bg-[#152C2B] hover:text-[#152C2B] dark:hover:text-[#EEF8F6] transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}
