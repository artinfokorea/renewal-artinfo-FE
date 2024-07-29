import { FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Label } from "../ui/label"

interface Props<T extends FieldValues> extends React.ComponentProps<"input"> {
  label: string
  id: Path<T>
  type: string
  placeholder: string
  register: UseFormRegister<T>
  errors?: FieldError
  children?: React.ReactNode
}

const InputWithButton = <T extends FieldValues>({
  label,
  id,
  type,
  register,
  errors,
  placeholder,
  className,
  children,
  ...props
}: Props<T>) => {
  return (
    <div className="my-2 flex flex-col gap-2">
      <Label
        htmlFor={id}
        className="text-tertiary block pb-1 text-sm font-semibold"
      >
        {label}
      </Label>
      <div className="relative">
        <input
          {...register(id, { valueAsNumber: type === "number" })}
          id={id}
          type={type}
          placeholder={placeholder}
          className={cn(
            "w-full rounded border px-2 py-1.5 text-xs leading-tight text-black",
            className,
          )}
          {...props}
        />
        {children}
      </div>
    </div>
  )
}

export default InputWithButton
