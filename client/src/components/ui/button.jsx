import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils.js"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0" +
  " transition-all duration-200 active:scale-95 hover:brightness-110",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-primary-border shadow-lg shadow-primary/20 hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-destructive-foreground border border-destructive-border shadow-lg shadow-destructive/20 hover:-translate-y-0.5",
        outline:
          " border [border-color:var(--button-outline)]  shadow-xs hover:bg-primary/5 hover:border-primary/50 ",
        secondary: "border bg-secondary text-secondary-foreground border border-secondary-border shadow-sm hover:-translate-y-0.5 ",
        ghost: "border border-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "min-h-11 px-6 py-2 rounded-xl",
        sm: "min-h-9 rounded-lg px-4 text-xs",
        lg: "min-h-14 rounded-2xl px-10 text-lg",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)


const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
