import { cn, convertInvalidCharacter } from '@/lib/utils';
import * as React from 'react';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  customPrefix?: React.ReactNode;
  textareaClassName?: string;
  inputMode?:
    | 'none'
    | 'text'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal'
    | 'search';
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      customPrefix,
      textareaClassName,
      inputMode,
      onChange,
      ...props
    },
    ref
  ) => {
    const id = React.useId();

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = convertInvalidCharacter(e.target.value);

      const newEvent = {
        ...e,
        target: {
          ...e.target,
          value: value,
        },
      } as React.ChangeEvent<HTMLTextAreaElement>;

      onChange?.(newEvent);
    };

    return (
      <div
        className={cn(
          'border-input bg-background focus-within:border-ring focus-within:ring-ring/50 has-[textarea:invalid]:ring-destructive/20 dark:has-[textarea:invalid]:ring-destructive/40 has-[textarea:invalid]:border-destructive relative flex w-full flex-col items-start justify-center rounded-md border text-sm shadow-xs transition-[color,box-shadow] outline-none focus-within:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
      >
        {customPrefix && (
          <label htmlFor={id} className="text-foreground block ps-2 pt-2 pl-3">
            {customPrefix}
          </label>
        )}

        <textarea
          id={id}
          inputMode={inputMode}
          className={cn(
            'placeholder:text-foreground/70 flex field-sizing-content w-full resize-none bg-transparent py-2 ps-3 outline-none disabled:cursor-not-allowed',
            textareaClassName
          )}
          onChange={handleChange}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
