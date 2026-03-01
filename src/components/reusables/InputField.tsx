import React from "react";
import { Label } from "./index";

type InputFieldProps = {
  label?: string;
  name: string;
  type?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  readOnly = false,
  className,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <Label htmlFor={name}>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        className={`${className} w-full h-9 rounded-md border bg-transparent px-3 py-1 text-base md:text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? "border-destructive ring-destructive/20" : "border-input"
        }`}
      />
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
