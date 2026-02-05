'use client';

import React from 'react';
import Link from 'next/link';

interface PrimaryButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const PrimaryButton = ({ href, children, className = '' }: PrimaryButtonProps) => {
  return (
    <Link
      href={href}
      className={`px-4 py-2 border border-button bg-button text-primaryBg hover:text-button hover:bg-primaryBg transition ${className}`}
    >
      {children}
    </Link>
  );
};

export default PrimaryButton;
