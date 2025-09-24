import * as React from "react"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DatePickerProps {
  date?: Date | string
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

const DatePickerContext = React.createContext<{
  currentMonth: Date
  setCurrentMonth: (date: Date) => void
  selectedDate?: Date
  onSelectDate: (date: Date) => void
}>({
  currentMonth: new Date(),
  setCurrentMonth: () => {},
  onSelectDate: () => {},
})

export function DatePicker({ date, onDateChange, placeholder = "Select date", className, disabled }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date ? (typeof date === 'string' ? new Date(date) : date) : undefined
  )

  const handleDateSelect = (newDate: Date) => {
    setSelectedDate(newDate)
    onDateChange?.(newDate)
    setIsOpen(false)
  }

  React.useEffect(() => {
    if (date) {
      const parsedDate = typeof date === 'string' ? new Date(date) : date
      setSelectedDate(parsedDate)
      setCurrentMonth(parsedDate)
    }
  }, [date])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <DatePickerContext.Provider value={{
      currentMonth,
      setCurrentMonth,
      selectedDate,
      onSelectDate: handleDateSelect
    }}>
      <div className={cn("relative", className)}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "hover:border-gray-300",
            isOpen && "ring-2 ring-blue-500 border-blue-500"
          )}
        >
          <span className={cn(
            "block truncate",
            !selectedDate && "text-gray-500"
          )}>
            {selectedDate ? formatDate(selectedDate) : placeholder}
          </span>
          <Calendar className="h-4 w-4 text-gray-400" />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg">
              <DatePickerCalendar />
            </div>
          </>
        )}
      </div>
    </DatePickerContext.Provider>
  )
}

function DatePickerCalendar() {
  const { currentMonth, setCurrentMonth, selectedDate, onSelectDate } = React.useContext(DatePickerContext)

  const today = new Date()
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const daysArray = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysArray.push(null)
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    daysArray.push(new Date(year, month, day))
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(new Date(year, month + (direction === 'next' ? 1 : -1), 1))
  }

  const isSelected = (date: Date) => {
    return selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
  }

  const isToday = (date: Date) => {
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  }

  return (
    <div className="p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => navigateMonth('prev')}
          className="rounded-lg p-1 hover:bg-blue-50 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>

        <h2 className="text-sm font-medium text-gray-900">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>

        <button
          type="button"
          onClick={() => navigateMonth('next')}
          className="rounded-lg p-1 hover:bg-blue-50 transition-colors"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {daysArray.map((date, index) => (
          <div key={index} className="aspect-square">
            {date && (
              <button
                type="button"
                onClick={() => onSelectDate(date)}
                className={cn(
                  "w-full h-full text-sm rounded-lg transition-colors flex items-center justify-center",
                  "hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500",
                  isSelected(date) && "bg-blue-500 text-white hover:bg-blue-600",
                  isToday(date) && !isSelected(date) && "bg-blue-100 text-blue-700 font-medium",
                  !isSelected(date) && !isToday(date) && "text-gray-900"
                )}
              >
                {date.getDate()}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default DatePicker