'use client';

import React from 'react';

interface TextBreakProps {
  text: string;
  breakAfter: number;
  className?: string;
}

const TextBreak: React.FC<TextBreakProps> = ({ text, breakAfter, className = '' }) => {
  const words = text.split(' ');

  if (words.length <= breakAfter) {
    return <span className={className}>{text}</span>;
  }

  const firstPart = words.slice(0, breakAfter).join(' ');
  const secondPart = words.slice(breakAfter).join(' ');

  return (
    <span className={className}>
      {firstPart}
      <br />
      {secondPart}
    </span>
  );
};

export default TextBreak;
