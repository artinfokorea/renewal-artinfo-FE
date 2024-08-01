import React from "react"
import { Label } from "../ui/label"

interface Props<T> {
  value?: T
  title: string
  checked: boolean
  handleChange: (value: T) => void
  children?: React.ReactNode
  className?: string
  child?: boolean
}

const CheckboxField = <T,>({
  value,
  title,
  checked,
  handleChange,
  children,
  className,
  child = false,
}: Props<T>) => {
  return (
    <div className={`my-3 flex items-center gap-2 ${className}`}>
      <input
        type="checkbox"
        value={value as string | number}
        checked={checked}
        className="peer h-[22px] w-[22px] appearance-none rounded-md border-2 border-silver checked:flex checked:items-center checked:justify-center checked:border-none checked:bg-main checked:before:absolute checked:before:text-2xl checked:before:font-bold checked:before:text-white checked:before:content-['✓']"
        onChange={() => handleChange(value!)}
      />
      <Label
        htmlFor={title}
        className={`text-silver peer-checked:text-blue-500 ${
          child ? "text-base font-medium" : "text-lg font-semibold"
        }`}
      >
        {title}
      </Label>
      {children}
    </div>
  )
}

export default CheckboxField
