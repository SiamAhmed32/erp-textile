import React from 'react';
type SectionHeadingProps = {
  className?: any;
  children: React.ReactNode;
};
const SectionHeading = ({ className, children }: SectionHeadingProps) => {
  return (
    <h2 className={`text-3xl font-semibold text-primaryText ${className}`}>
      {children}
    </h2>
  );
};

export default SectionHeading;
