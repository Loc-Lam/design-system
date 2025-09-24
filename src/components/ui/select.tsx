import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export interface SelectContentProps {
  children: React.ReactNode
  className?: string
}

export interface SelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

const SelectContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
  onClose?: () => void
}>({})

export function Select({ value, onValueChange, placeholder, children, className, disabled }: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(value || '')

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue)
    onValueChange?.(newValue)
    setIsOpen(false)
  }

  React.useEffect(() => {
    setSelectedValue(value || '')
  }, [value])

  return (
    <SelectContext.Provider value={{
      value: selectedValue,
      onValueChange: handleValueChange,
      onClose: () => setIsOpen(false)
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
            !selectedValue && "text-gray-500"
          )}>
            {selectedValue || placeholder}
          </span>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform text-gray-400",
            isOpen && "rotate-180"
          )} />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
              {children}
            </div>
          </>
        )}
      </div>
    </SelectContext.Provider>
  )
}

export function SelectContent({ children, className }: SelectContentProps) {
  return (
    <div className={cn("py-1", className)}>
      {children}
    </div>
  )
}

export function SelectItem({ value, children, className }: SelectItemProps) {
  const { value: selectedValue, onValueChange, onClose } = React.useContext(SelectContext)
  const isSelected = selectedValue === value

  const handleClick = () => {
    onValueChange?.(value)
    onClose?.()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "w-full text-left px-3 py-2 text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors",
        isSelected && "bg-blue-100 text-blue-700 font-medium",
        className
      )}
    >
      {children}
    </button>
  )
}