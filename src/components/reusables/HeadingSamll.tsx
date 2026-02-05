import React from 'react';
type SecondaryHeadingProps = {
    className?: any;
    children: React.ReactNode;
};
const HeadingSmall = ({ className, children }: SecondaryHeadingProps) => {
    return (
        <h2 className={`text-[16px] text-primaryText font-semibold leading-[38px] ${className}`}>
            {children}
        </h2>
    );
};

export default HeadingSmall;