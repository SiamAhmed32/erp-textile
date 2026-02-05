import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

const Flex: React.FC<ContainerProps> = ({ children, className, ...props }) => {
	return (
		<div
			className={cn('flex', className)}
			{...props}>
			{children}
		</div>
	);
};

export default Flex;
