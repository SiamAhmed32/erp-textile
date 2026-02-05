import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
	ref?: any;
}

const Box: React.FC<ContainerProps> = ({
	ref,
	children,
	className,
	...props
}) => {
	return (
		<div ref={ref} className={cn(className)} {...props}>
			{children}
		</div>
	);
};
export default Box;
