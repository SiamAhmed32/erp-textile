import React from "react";

type FormInputProps = {
  name?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  className?: string;
};

const FormInput = ({
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
}: FormInputProps) => {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base md:text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 ${className}`}
    />
  );
};

export default FormInput;
