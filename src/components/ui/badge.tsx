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
        secondary:
          "border border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border border-destructive/20 bg-destructive/10 text-destructive",
        outline: "border border-line text-fog",
        ember: "border border-ember/25 bg-ember/10 text-ember",
        lime: "border border-lime/25 bg-lime/10 text-lime",
        cyan: "border border-cyan/25 bg-cyan/10 text-cyan",
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
