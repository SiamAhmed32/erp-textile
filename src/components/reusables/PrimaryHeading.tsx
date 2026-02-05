import React from 'react';

const PrimaryHeading = ({ className, children }: any) => {
	// text shadow : 0 0 0.625rem rgba(0, 0, 0, 0.45);
	return (
		<h1
			className={`text-white text-[2rem] sm:text-[2.5rem] lg:text-[3rem] font-semibold leading-[54px] ${className}`}
		>
			{children}
		</h1>
	);
};

export default PrimaryHeading;
