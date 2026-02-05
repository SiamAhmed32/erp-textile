import React from 'react';
type SecondaryHeadingProps = {
	className?: any;
	children: React.ReactNode;
};
const SecondaryHeading = ({ className, children }: SecondaryHeadingProps) => {
	return (
		<h2
			className={`font-primary md:text-xl text-lg text-primaryText font-semibold leading-[38px] ${className}`}
		>
			{children}
		</h2>
	);
};

export default SecondaryHeading;
