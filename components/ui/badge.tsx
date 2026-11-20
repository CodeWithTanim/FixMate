import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#18756B]/10 text-[#18756B] border border-[#18756B]/20",
        petrol: "bg-[#0B3638] text-white",
        amber: "bg-[#F4B740]/20 text-amber-900 border border-[#F4B740]/40",
        blue: "bg-sky-50 text-sky-700 border border-sky-200",
        indigo: "bg-indigo-50 text-indigo-700 border border-indigo-200",
        green: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        red: "bg-rose-50 text-rose-700 border border-rose-200",
        muted: "bg-slate-100 text-slate-700 border border-slate-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
