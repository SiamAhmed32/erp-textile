import React from "react";
import { Label } from "./index";

type Option = {
  name: string;
  _id: string;
};

type SelectBoxProps = {
  label?: string;
  name: string;
  value: string;
  onChange: any;
  options: Option[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
};

const SelectBox: React.FC<SelectBoxProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  error,
  required = false,
  disabled = false,
}) => {
  return (
    <div className="mb-4 w-full lg:w-auto lg:flex-[1_1_auto]">
      <Label htmlFor={name}>
        {label} {required && <span className="text-red-400">*</span>}
      </Label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full h-9 rounded-md border bg-transparent px-3 py-1 text-base md:text-sm shadow-xs transition-[color,box-shadow] outline-none appearance-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 ${
          error ? "border-destructive ring-destructive/20" : "border-input"
        }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt: any) => (
          <option key={opt?._id} value={opt?._id}>
            {opt?.name}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
    </div>
  );
};

export default SelectBox;
