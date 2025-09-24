import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface MultiSelectOption {
  value: string
  label: string
  color?: string
  icon?: React.ReactNode
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  value?: string[]
  onValueChange?: (value: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

const MultiSelectContext = React.createContext<{
  selectedValues: string[]
  onToggleValue: (value: string) => void
  onClose: () => void
}>({
  selectedValues: [],
  onToggleValue: () => {},
  onClose: () => {},
})

export function MultiSelect({
  options,
  value = [],
  onValueChange,
  placeholder = "Select options",
  className,
  disabled
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedValues, setSelectedValues] = React.useState<string[]>(value)

  const handleToggleValue = (optionValue: string) => {
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter(v => v !== optionValue)
      : [...selectedValues, optionValue]

    setSelectedValues(newValues)
    onValueChange?.(newValues)
  }

  const handleRemoveValue = (valueToRemove: string) => {
    const newValues = selectedValues.filter(v => v !== valueToRemove)
    setSelectedValues(newValues)
    onValueChange?.(newValues)
  }

  React.useEffect(() => {
    setSelectedValues(value)
  }, [value])

  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder
    if (selectedValues.length === 1) {
      const option = options.find(opt => opt.value === selectedValues[0])
      return option?.label || selectedValues[0]
    }
    return `${selectedValues.length} selected`
  }

  const getSelectedOptions = () => {
    return selectedValues.map(value => options.find(opt => opt.value === value)).filter(Boolean) as MultiSelectOption[]
  }

  return (
    <MultiSelectContext.Provider value={{
      selectedValues,
      onToggleValue: handleToggleValue,
      onClose: () => setIsOpen(false)
    }}>
      <div className={cn("relative", className)}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "flex h-auto min-h-[2.5rem] w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "hover:border-gray-300",
            isOpen && "ring-2 ring-blue-500 border-blue-500"
          )}
        >
          <div className="flex flex-1 flex-wrap gap-1">
            {selectedValues.length === 0 ? (
              <span className="text-gray-500">{placeholder}</span>
            ) : selectedValues.length === 1 ? (
              <span className="block truncate">{getDisplayText()}</span>
            ) : (
              <>
                {getSelectedOptions().slice(0, 2).map((option) => (
                  <span
                    key={option.value}
                    className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
                  >
                    {option.color && (
                      <span className={cn("inline-block w-2 h-2 rounded-full", option.color)} />
                    )}
                    {option.label}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveValue(option.value)
                      }}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {selectedValues.length > 2 && (
                  <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                    +{selectedValues.length - 2} more
                  </span>
                )}
              </>
            )}
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform text-gray-400 ml-2 flex-shrink-0",
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
              <MultiSelectContent options={options} />
            </div>
          </>
        )}
      </div>
    </MultiSelectContext.Provider>
  )
}

function MultiSelectContent({ options }: { options: MultiSelectOption[] }) {
  const { selectedValues, onToggleValue } = React.useContext(MultiSelectContext)

  return (
    <div className="py-1">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value)

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onToggleValue(option.value)}
            className={cn(
              "w-full text-left px-3 py-2 text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors flex items-center justify-between",
              isSelected && "bg-blue-100 text-blue-700"
            )}
          >
            <div className="flex items-center gap-2">
              {option.color && (
                <span className={cn("inline-block w-2 h-2 rounded-full", option.color)} />
              )}
              {option.icon}
              <span>{option.label}</span>
            </div>
            {isSelected && (
              <Check className="h-4 w-4 text-blue-600" />
            )}
          </button>
        )
      })}
    </div>
  )
}

export default MultiSelect