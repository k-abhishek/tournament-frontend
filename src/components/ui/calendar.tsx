import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 font-mono bg-surface text-snow rounded-md relative", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 relative",
        month: "space-y-4",
        month_caption: "flex justify-center items-center h-8 relative",
        caption_label: "text-sm font-display uppercase tracking-wider text-snow",
        nav: "flex items-center justify-between absolute top-3 left-3 right-3 h-8 z-10 pointer-events-none",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-surface/80 p-0 opacity-70 hover:opacity-100 pointer-events-auto border-line text-fog hover:text-snow"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-surface/80 p-0 opacity-70 hover:opacity-100 pointer-events-auto border-line text-fog hover:text-snow"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "grid grid-cols-7 w-full mb-1",
        weekday:
          "text-fog font-normal text-[0.8rem] uppercase font-mono flex items-center justify-center h-9 w-9",
        week: "grid grid-cols-7 w-full mt-1",
        day: "h-9 w-9 p-0 text-center text-sm relative flex items-center justify-center focus-within:relative focus-within:z-20",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal font-mono text-snow hover:bg-ember/20 hover:text-ember transition-colors"
        ),
        selected:
          "bg-ember text-ink font-bold rounded-md [&>button]:text-ink [&>button]:font-bold [&>button]:hover:bg-ember [&>button]:hover:text-ink",
        today: "border border-ember text-ember font-semibold rounded-md [&>button]:text-ember",
        outside:
          "text-fog/30 opacity-40 [&>button]:text-fog/30",
        disabled: "text-fog/20 opacity-30 pointer-events-none",
        range_middle:
          "aria-selected:bg-ember/20 aria-selected:text-snow",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...props }) => {
          return orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" {...props} />
          ) : (
            <ChevronRight className="h-4 w-4" {...props} />
          )
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
