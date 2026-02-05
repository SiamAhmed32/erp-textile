import React from 'react';

const Label = ({ children, className, htmlFor }: any) => {
	return (
		<label
			htmlFor={htmlFor}
			className={`font-primary text-primaryText block text-sm font-medium mb-1 ${className}`}
		>
			{children}
		</label>
	);
};

export default Label;
