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
}

const InputField = <T extends FieldValues>({
  label,
  id,
  type,
  register,
  errors,
  placeholder,
  className,
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
      <div>
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
        {errors && (
          <p className="mt-1 pl-2 text-xs text-error">{errors.message}</p>
        )}
      </div>
    </div>
  )
}

export default InputField
