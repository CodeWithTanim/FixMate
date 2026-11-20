import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-[#DCE5DF] bg-white px-3 py-2 text-sm text-[#152C2B] placeholder:text-[#526564]/60 focus-visible:outline-none focus-visible:border-[#18756B] focus-visible:ring-1 focus-visible:ring-[#18756B] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
