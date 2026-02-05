import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

const Grid: React.FC<ContainerProps> = ({ children, className, ...props }) => {
	return (
		<div
			className={cn('grid', className)}
			{...props}>
			{children}
		</div>
	);
};

export default Grid;
