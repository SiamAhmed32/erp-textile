import React from 'react';

const PrimaryHeading = ({ className, children }: any) => {
	// text shadow : 0 0 0.625rem rgba(0, 0, 0, 0.45);
	return (
		<h1
			className={` text-secondary text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] font-semibold  ${className}`}
		>
			{children}
		</h1>
	);
};

export default PrimaryHeading;
