import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils.js"

const badgeVariants = cva(
  "whitespace-nowrap inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-lg shadow-primary/20",
        secondary: "border-transparent bg-secondary/80 text-secondary-foreground backdrop-blur-md",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20",
        outline: "border-2 border-primary/20 bg-background/50 text-foreground backdrop-blur-sm shadow-sm hover:border-primary/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}


export { Badge, badgeVariants }
