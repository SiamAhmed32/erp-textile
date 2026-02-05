import React from 'react';
import { Flex, PrimaryText, SecondaryHeading } from './index';
import { cn } from '@/lib/utils';
type SectionTitleProps = {
	title: string;
	description: string;
	className?: string;
};
const SectionTitle = ({ title, description, className }: SectionTitleProps) => {
	return (
		<Flex
			className={cn(
				`w-full flex-col gap-2 items-center text-center ${className}`
			)}
		>
			<SecondaryHeading>{title}</SecondaryHeading>
			<PrimaryText>{description}</PrimaryText>
		</Flex>
	);
};

export default SectionTitle;
