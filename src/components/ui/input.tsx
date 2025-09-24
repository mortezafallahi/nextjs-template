import { cn, convertInvalidCharacter } from '@/lib/utils';
import * as React from 'react';

interface InputProps extends React.ComponentProps<'input'> {
  type?: string;
  numericOnly?: boolean;
}

function Input({
  className,
  type,
  numericOnly = false,
  onChange,
  ...props
}: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (type === 'number' || type === 'tel' || numericOnly) {
      value = convertInvalidCharacter(value).replace(/[^\d]/g, '');
    }

    const newEvent = {
      ...e,
      target: {
        ...e.target,
        value: value,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange?.(newEvent);
  };

  const inputMode =
    type === 'number' || type === 'tel' || numericOnly ? 'numeric' : undefined;

  const actualType = type === 'number' ? 'text' : type;

  return (
    <input
      type={actualType}
      inputMode={inputMode}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      onChange={handleChange}
      {...props}
    />
  );
}

export { Input };
