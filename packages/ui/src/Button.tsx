'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, asChild, children, ...props }, ref) => {
    const Comp = asChild ? 'a' : 'button';
    
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl';

    const variants = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/25',
      secondary: 'bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50 hover:border-primary-300',
      outline: 'border-2 border-gray-200 bg-transparent hover:bg-gray-50 hover:border-primary-300 text-gray-700',
      ghost: 'hover:bg-gray-100 hover:text-primary-600 text-gray-600',
      destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/25',
      gold: 'bg-gold-500 text-white hover:bg-gold-600 shadow-lg shadow-gold-500/25',
    };

    const sizes = {
      sm: 'h-9 px-3 text-xs',
      md: 'h-11 px-5 text-sm',
      lg: 'h-13 px-7 text-base',
      icon: 'h-11 w-11',
    };

    return (
      <Comp
        ref={ref}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </Comp>
    )
  );
);

Button.displayName = 'Button';

export { Button };