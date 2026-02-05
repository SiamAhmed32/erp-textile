// components/FormTextarea.tsx
import React from 'react';

type FormTextareaProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  rows?: number;
  className?: string;
};

const FormTextarea = ({
  value,
  onChange,
  placeholder,
  rows = 4,
  className = '',
}: FormTextareaProps) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`border border-borderBg rounded-none focus:outline-none focus:border-transparent focus:ring-2 focus:ring-button px-4 py-3 w-full text-foreground ${className}`}
    />
  );
};

export default FormTextarea;
