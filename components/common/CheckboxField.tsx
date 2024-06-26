import React from "react";
import { Label } from "../ui/label";

interface Props<T> {
  value?: T;
  title: string;
  checked: boolean;
  handleChange: (value: T) => void;
  children?: React.ReactNode;
  className?: string;
  child?: boolean;
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
    <div className={`flex items-center my-3 gap-2 ${className}`}>
      <input
        type="checkbox"
        value={value as string | number}
        checked={checked}
        className="w-[22px] h-[22px] border-gray-300 border-2 checked:bg-main rounded-md appearance-none checked:border-none peer
        checked:before:content-['✓'] checked:before:absolute checked:before:text-white checked:before:text-2xl checked:before:font-bold
        checked:flex checked:items-center checked:justify-center"
        onChange={() => handleChange(value!)}
      />
      <Label
        htmlFor={title}
        className={` peer-checked:text-blue-500  ${
          child ? "font-medium text-base" : "font-semibold text-lg"
        }`}
      >
        {title}
      </Label>
      {children}
    </div>
  );
};

export default CheckboxField;
