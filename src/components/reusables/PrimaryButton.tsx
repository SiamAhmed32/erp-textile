'use client';

import React from 'react';
import { Button } from '../ui/button';

interface PrimaryButtonProps {
  children: React.ReactNode;
  handleClick?: () => void;
}

const PrimaryButton = ({ children, handleClick }: PrimaryButtonProps) => {
  return (
    <Button
      onClick={handleClick}
      className={`bg-secondary cursor-pointer text-white hover:bg-black/90`}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
