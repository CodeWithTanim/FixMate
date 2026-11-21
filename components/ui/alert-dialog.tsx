"use client";

import * as React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
  variant?: "destructive" | "warning";
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  loading = false,
  variant = "destructive",
}: AlertDialogProps) {
  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange, loading]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onOpenChange(false);
        }
      }}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl border border-[#DCE5DF] bg-white p-6 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-2xl ${
              variant === "destructive" ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-700"
            }`}
          >
            {variant === "destructive" ? (
              <Trash2 className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
          </div>
          <div>
            <h3 id="alert-dialog-title" className="text-base font-bold text-[#152C2B]">
              {title}
            </h3>
            <p className="text-[11px] text-[#526564]">Confirmation required</p>
          </div>
        </div>

        <p
          id="alert-dialog-description"
          className="text-xs text-[#526564] bg-[#F6F5EF] p-3 rounded-xl border border-[#DCE5DF]/60 leading-relaxed"
        >
          {description}
        </p>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="rounded-xl border border-[#DCE5DF] px-4 py-2 text-xs font-bold text-[#526564] hover:bg-[#F6F5EF] disabled:opacity-50 transition cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-xl px-5 py-2 text-xs font-bold text-white disabled:opacity-50 transition cursor-pointer ${
              variant === "destructive"
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
