'use client';

import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, id, ...props }, ref) => {
        const [isFocused, setIsFocused] = useState(false);
        const inputId = id || label.toLowerCase().replace(/\s/g, '-');

        return (
            <div className="relative w-full">
                <div className="floating-input-wrapper">
                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            `w-full px-4 pt-6 pb-2 
              bg-charcoal-800/90 backdrop-blur-sm
              border rounded-lg
              text-charcoal-50 text-base
              transition-all duration-300
              focus:outline-none
              placeholder:text-transparent`,
                            isFocused || props.value
                                ? 'border-orange-600 shadow-[0_0_0_2px_rgba(234,88,12,0.2)]'
                                : 'border-charcoal-600/50',
                            error && 'border-red-500',
                            className
                        )}
                        placeholder={label}
                        onFocus={(e) => {
                            setIsFocused(true);
                            props.onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            props.onBlur?.(e);
                        }}
                        {...props}
                    />
                    <label
                        htmlFor={inputId}
                        className={cn(
                            `absolute left-4 transition-all duration-300 pointer-events-none`,
                            isFocused || props.value
                                ? 'top-2 text-xs text-orange-500 font-medium'
                                : 'top-1/2 -translate-y-1/2 text-base text-charcoal-50/50'
                        )}
                    >
                        {label}
                    </label>
                </div>
                {error && (
                    <p className="mt-1 text-sm text-red-400 animate-fade-up">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
