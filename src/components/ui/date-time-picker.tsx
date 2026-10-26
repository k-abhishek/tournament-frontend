import * as React from "react"
import { format, parseISO, isValid } from "date-fns"
import { Calendar as CalendarIcon, Clock, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface DateTimePickerProps {
  value?: string | Date | null
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick date & time",
  disabled = false,
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)

  // Parse existing value
  const parsedDate = React.useMemo(() => {
    if (!value) return undefined
    if (value instanceof Date) return isValid(value) ? value : undefined
    try {
      const d = parseISO(value)
      return isValid(d) ? d : undefined
    } catch {
      return undefined
    }
  }, [value])

  // Fallback time when no date is selected yet
  const [fallbackTime, setFallbackTime] = React.useState({ hours: "18", minutes: "00" })

  const hours = parsedDate ? parsedDate.getHours().toString().padStart(2, '0') : fallbackTime.hours
  const minutes = parsedDate ? parsedDate.getMinutes().toString().padStart(2, '0') : fallbackTime.minutes
  const selectedDate = parsedDate

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const updated = new Date(date)
      updated.setHours(parseInt(hours, 10))
      updated.setMinutes(parseInt(minutes, 10))
      updated.setSeconds(0)
      onChange(format(updated, "yyyy-MM-dd'T'HH:mm"))
    } else {
      onChange("")
    }
  }

  const handleTimeChange = (newHours: string, newMinutes: string) => {
    setFallbackTime({ hours: newHours, minutes: newMinutes })
    if (parsedDate) {
      const updated = new Date(parsedDate)
      updated.setHours(parseInt(newHours, 10))
      updated.setMinutes(parseInt(newMinutes, 10))
      updated.setSeconds(0)
      onChange(format(updated, "yyyy-MM-dd'T'HH:mm"))
    } else {
      // If no date was selected yet, default to today
      const today = new Date()
      today.setHours(parseInt(newHours, 10))
      today.setMinutes(parseInt(newMinutes, 10))
      today.setSeconds(0)
      onChange(format(today, "yyyy-MM-dd'T'HH:mm"))
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange("")
  }

  const hoursOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
  const minutesOptions = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-mono font-normal h-9 bg-background border-line text-sm",
            !selectedDate && "text-fog/50",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-ember shrink-0" />
          <span className="truncate flex-1">
            {selectedDate
              ? format(
                  new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate(),
                    parseInt(hours, 10),
                    parseInt(minutes, 10)
                  ),
                  "PPP 'at' p"
                )
              : placeholder}
          </span>
          {selectedDate && !disabled && (
            <X
              className="h-3.5 w-3.5 text-fog hover:text-snow shrink-0 ml-1.5"
              onClick={handleClear}
            />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 bg-surface border-line" align="start">
        <div className="p-1">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            autoFocus
          />

          {/* Time Selector Bar */}
          <div className="p-3 border-t border-line flex items-center justify-between gap-3 bg-background/50 rounded-b-md">
            <div className="flex items-center gap-1.5 text-xs font-mono text-fog">
              <Clock size={14} className="text-ember" />
              <span>Time:</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-20">
                <Select
                  value={hours}
                  onValueChange={(val) => handleTimeChange(val, minutes)}
                >
                  <SelectTrigger className="h-8 text-xs font-mono">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {hoursOptions.map((h) => (
                      <SelectItem key={h} value={h} className="text-xs font-mono">
                        {h}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <span className="text-fog font-mono">:</span>

              <div className="w-20">
                <Select
                  value={minutes}
                  onValueChange={(val) => handleTimeChange(hours, val)}
                >
                  <SelectTrigger className="h-8 text-xs font-mono">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {minutesOptions.map((m) => (
                      <SelectItem key={m} value={m} className="text-xs font-mono">
                        :{m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                size="sm"
                variant="ember"
                className="h-8 px-3 text-xs"
                onClick={() => setOpen(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
