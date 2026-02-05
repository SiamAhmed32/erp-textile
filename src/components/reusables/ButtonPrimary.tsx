import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ButtonPrimaryProps {
	children?: React.ReactNode;
	href?: string;
	icon?: React.ReactNode;
	iconPosition?: 'left' | 'right';
	className?: string;
	iconClassName?: string;
	type?: 'button' | 'submit' | 'reset';
	onClick?: () => void;
	isLoading?: boolean;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
	children,
	href,
	icon,
	iconPosition = 'left',
	className = '',
	iconClassName = '',
	type = 'submit',
	isLoading,
	onClick,
}) => {
	const buttonContent = (
		<>
			{icon && iconPosition === 'left' && (
				<span className={iconClassName}>{icon}</span>
			)}
			{children && <span>{children}</span>}
			{icon && iconPosition === 'right' && (
				<span className={iconClassName}>{icon}</span>
			)}
		</>
	);

	const buttonClasses = `flex items-center gap-3 px-4 py-2 border border-button bg-primaryBg text-button hover:text-primaryBg hover:bg-button transition ${className}`;

	// If href is provided, render as Link with anchor tag
	if (href) {
		return (
			<Link href={href} className={buttonClasses}>
				{buttonContent}
			</Link>
		);
	}

	// Otherwise, render as button
	return (
		<button
			type={type}
			disabled={isLoading}
			onClick={onClick}
			className={cn(
				`flex items-center justify-center gap-2 px-4 py-2 bg-button text-white hover:bg-button-dark transition border-0 cursor-pointer ${className}`
			)}
		>
			{isLoading ? (
				<span className='inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
			) : (
				buttonContent
			)}
		</button>
	);
};

export default ButtonPrimary;
