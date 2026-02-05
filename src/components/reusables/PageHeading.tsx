import React from 'react';

interface PageHeadingProps {
  className?: string;
  children: React.ReactNode;
}

const PageHeading: React.FC<PageHeadingProps> = ({ className = '', children }) => {
  return (
    <h1 className={`text-primaryText lg:text-5xl text-3xl leading-snug font-semibold ${className}`}>
      {children}
    </h1>
  );
};

export default PageHeading;
