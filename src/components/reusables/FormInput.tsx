import React from 'react';

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
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
}: FormInputProps) => {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`border border-borderBg rounded-none focus:outline-none focus:border-transparent focus:ring-2 focus:ring-button px-4 py-3 w-full text-foreground ${className}`}
    />
  );
};

export default FormInput;