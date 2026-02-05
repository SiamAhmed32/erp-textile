import { cn } from '@/lib/utils';
import React, { HTMLAttributes } from 'react'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string
}

const Row: React.FC<ContainerProps> = ({children, className, ...props}) => {
  return (
    <div
      className={cn('flex flex-col md:flex-row', className)}
      {...props}>
      {children}
    </div>
  )
}

export default Row