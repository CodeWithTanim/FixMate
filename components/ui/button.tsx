import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-[#18756B] text-white hover:bg-[#135d55] shadow-xs",
        petrol: "bg-[#0B3638] text-white hover:bg-[#072527] shadow-xs",
        amber: "bg-[#F4B740] text-[#152C2B] hover:bg-[#d99f30] font-bold shadow-xs",
        outline: "border border-[#DCE5DF] bg-white text-[#152C2B] hover:bg-[#F6F5EF]",
        ghost: "text-[#152C2B] hover:bg-[#DCE5DF]/40",
        destructive: "bg-rose-600 text-white hover:bg-rose-700 shadow-xs",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
