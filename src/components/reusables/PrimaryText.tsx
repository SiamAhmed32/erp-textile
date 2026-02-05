import React from 'react';

const PrimaryText = ({ children, className }: any) => {
	return (
		<p
			className={`font-primary text-[16px] text-primaryText font-extralight ${className}`}
		>
			{children}
		</p>
	);
};

export default PrimaryText;
