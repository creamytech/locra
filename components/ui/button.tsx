import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium tracking-wide transition-all duration-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-stone-900 text-white hover:bg-stone-800 active:bg-stone-950 shadow-luxury-sm hover:shadow-luxury",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-stone-200 bg-transparent text-stone-700 hover:bg-stone-50 hover:text-stone-900 hover:border-stone-300",
        secondary:
          "bg-stone-100 text-stone-900 hover:bg-stone-200 active:bg-stone-300",
        ghost: 
          "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
        link: 
          "text-gold underline-offset-4 hover:underline p-0 h-auto",
        gold: 
          "bg-gold text-stone-950 hover:bg-gold-600 active:bg-gold-700 shadow-luxury-sm hover:shadow-gold-glow",
        // Premium luxury variants
        luxury:
          "bg-gradient-to-r from-stone-900 to-stone-800 text-white hover:from-stone-800 hover:to-stone-700 shadow-luxury hover:shadow-luxury-lg",
        "luxury-outline":
          "border-2 border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white",
        champagne:
          "bg-champagne text-stone-900 hover:bg-gold hover:text-white active:bg-gold-600 shadow-luxury-sm",
      },
      size: {
        default: "h-11 px-5 py-2.5 rounded-sm",
        sm: "h-9 px-4 text-xs rounded-sm",
        lg: "h-12 px-8 text-base rounded-sm",
        xl: "h-14 px-10 text-base rounded-sm font-medium",
        "2xl": "h-16 px-12 text-lg rounded-sm font-medium",
        icon: "h-10 w-10 rounded-sm",
        "icon-sm": "h-8 w-8 rounded-sm",
        "icon-lg": "h-12 w-12 rounded-sm",
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
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
