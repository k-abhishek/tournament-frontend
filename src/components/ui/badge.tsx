import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded px-2.5 py-0.5 text-xs font-mono font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 uppercase tracking-wider",
  {
    variants: {
      variant: {
        default:
          "border border-line bg-surface text-snow",
        primary:
          "border border-primary/30 bg-primary/10 text-primary",
        "primary-solid":
          "border border-transparent bg-primary text-primary-foreground font-bold shadow-sm",
        secondary:
          "border border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border border-destructive/20 bg-destructive/10 text-destructive",
        outline:
          "border border-line text-fog",
        // Theme-derived action badges (resolves directly from central primary theme tokens)
        rose:
          "border border-primary/30 bg-primary/10 text-primary",
        ember:
          "border border-primary/30 bg-primary/10 text-primary",
        emerald:
          "border border-primary/30 bg-primary/10 text-primary",
        lime:
          "border border-primary/30 bg-primary/10 text-primary",
        cyan:
          "border border-cyan/25 bg-cyan/10 text-cyan",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
