import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "./utils";

// Boton que se usa en toda la app

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-colors outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFAD60]/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-[#FFAD60] to-[#F5923E] text-white hover:opacity-[0.92]",
        secondary:
          "border border-[#FFAD60] bg-transparent text-[#F5923E] hover:bg-[#FFF4E8]",
        tertiary:
          "border border-[#E4E4E4] bg-transparent text-[#575757] hover:border-[#FFAD60] hover:text-[#F5923E]",
        destructive: "bg-[#FF2244] text-white hover:bg-[#D32F4B]",
        destructiveOutline:
          "border border-[#FCE3E6] bg-[#FCE3E6] text-[#FF2244] hover:bg-[#FF2244] hover:text-white hover:border-[#FF2244]",
        link: "text-[#F5923E] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2.5",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-[15px]",
        icon: "h-9 w-9 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
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
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
