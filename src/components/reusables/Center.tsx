import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

const Center: React.FC<ContainerProps> = ({
	children,
	className,
	...props
}) => {
	return (
		<div
			className={cn(
				'flex',
				'w-full',
				'items-center',
				'justify-center',
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
};

export default Center;
