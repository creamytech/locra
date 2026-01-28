import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-stone-900 text-white shadow hover:bg-stone-800",
        secondary:
          "border-transparent bg-stone-100 text-stone-700 hover:bg-stone-200",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "border-stone-200 text-stone-600",
        edition:
          "border-gold/30 bg-gold/10 text-gold font-medium tracking-wide uppercase text-[10px]",
        coordinates:
          "border-stone-300 bg-stone-100 text-stone-600 font-mono text-[10px] tracking-wider",
        gold:
          "border-transparent bg-gold text-stone-950 font-bold tracking-wide uppercase text-[10px]",
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
