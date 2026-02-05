import React from 'react';
type SecondarySubHeadingProps = {
	className?: any;
	children: React.ReactNode;
};
const SecondarySubHeading = ({
	className,
	children,
}: SecondarySubHeadingProps) => {
	return (
		<h2 className={`text-[16px] text-primaryText font-normal ${className}`}>
			{children}
		</h2>
	);
};

export default SecondarySubHeading;
