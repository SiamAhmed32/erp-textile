'use client';

import React from 'react';
import Link from 'next/link';

interface SecondaryButtonProps {
  href: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  href,
  icon,
  children,
  className = '',
}) => {
  return (
    <Link
      href={href}
      className={`
        inline-flex items-center justify-center
        min-w-[140px] h-12
        px-4 py-2
        border border-primaryText hover:border-button
        font-bold font-secondary
        bg-primaryBg text-primaryText
        hover:text-primaryBg hover:bg-button
        transition
        ${className}
      `}
    >
      {icon && <span className="mr-2 w-4 h-4">{icon}</span>}
      {children}
    </Link>
  );
};

export default SecondaryButton;
