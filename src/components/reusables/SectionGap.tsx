import React from "react";
type SectionGapProps = {
  className?: any;
  children?: React.ReactNode;
};

const SectionGap = ({ className, children }: SectionGapProps) => {
  return (
    <div className={`py-sectionGapSm lg:py-sectionGapLg ${className}`}>
      {children}
    </div>
  );
};

export default SectionGap;
