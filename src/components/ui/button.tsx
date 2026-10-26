import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer font-mono select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 font-display uppercase tracking-wider",
        primary:
          "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 font-display uppercase tracking-wider",
        // Theme-derived action variants (resolves directly from central primary theme tokens)
        ember:
          "bg-primary text-primary-foreground font-display uppercase tracking-wide hover:bg-primary/90 shadow-md shadow-primary/25",
        rose:
          "bg-primary text-primary-foreground font-display uppercase tracking-wide hover:bg-primary/90 shadow-md shadow-primary/25",
        emerald:
          "bg-primary text-primary-foreground font-display uppercase tracking-wide hover:bg-primary/90 shadow-md shadow-primary/25",
        destructive:
          "bg-destructive/20 text-destructive border border-destructive/40 hover:bg-destructive hover:text-white shadow-sm",
        outline:
          "border border-line bg-transparent hover:bg-surface hover:text-snow text-fog hover:border-primary/40",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground text-fog hover:text-snow",
        link:
          "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded px-3 text-xs",
        lg: "h-11 rounded px-8 font-display text-base tracking-wider",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
