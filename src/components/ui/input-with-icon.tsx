
import React from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, startIcon, endIcon, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {startIcon && (
          <div className="absolute left-3 flex items-center justify-center pointer-events-none text-gray-500">
            {startIcon}
          </div>
        )}
        <Input
          className={cn(
            "w-full",
            startIcon && "pl-10",
            endIcon && "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {endIcon && (
          <div className="absolute right-3 flex items-center justify-center pointer-events-none text-gray-500">
            {endIcon}
          </div>
        )}
      </div>
    );
  }
);

InputWithIcon.displayName = 'InputWithIcon';
