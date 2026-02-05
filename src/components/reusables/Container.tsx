import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

const Container: React.FC<ContainerProps> = ({
	children,
	className,
	...props
}) => {
	return (
		<div
			className={cn('container mx-auto px-[8px]', className)}
			{...props}
		>
			{children}
		</div>
	);
};

export default Container;
