import * as React from "react"

import { cn } from "@/lib/utils.js"

const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-2xl border-2 border-white/20 bg-background/50 backdrop-blur-sm px-4 py-2 text-base transition-all duration-300 shadow-sm placeholder:text-muted-foreground/50 hover:border-primary/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-medium",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
