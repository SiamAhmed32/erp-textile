import React from 'react';
type PrimarySubHeadingProps = {
	className?: any;
	children: React.ReactNode;
};
const PrimarySubHeading = ({ className, children }: PrimarySubHeadingProps) => {
	return (
		<h2 className={`text-[18px] text-primaryText font-extralight ${className}`}>
			{children}
		</h2>
	);
};

export default PrimarySubHeading;
