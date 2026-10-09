import { ChevronDown } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/utils'

const controlStyles =
  'w-full rounded-md border border-zinc-300 bg-white px-3.5 text-[15px] text-zinc-900 shadow-xs transition-colors placeholder:text-zinc-400 hover:border-zinc-400 focus-visible:border-brand-600 focus-visible:ring-3 focus-visible:ring-brand-600/15 focus-visible:outline-none disabled:opacity-60 aria-invalid:border-red-600 aria-invalid:ring-red-600/15'

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(controlStyles, 'h-11', className)} {...props} />
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={cn(controlStyles, 'min-h-32 py-2.5', className)} {...props} />
}

export function Select({ className, children, ...props }: ComponentProps<'select'>) {
  return (
    <div className="relative">
      <select className={cn(controlStyles, 'h-11 appearance-none pr-10', className)} {...props}>
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-zinc-500"
      />
    </div>
  )
}

type FieldProps = {
  id: string
  label: string
  required?: boolean
  hint?: ReactNode
  error?: string
  className?: string
  children: ReactNode
}

/** Label + control + hint/error. Give the control `{...describedBy(id, error)}`. */
export function Field({ id, label, required, hint, error, className, children }: FieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="block text-sm font-medium text-zinc-800">
        {label}
        {required && (
          <span aria-hidden className="text-brand-700">
            {' '}
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-700">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-xs text-zinc-500">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

/** ARIA wiring for a control inside <Field>. */
export function describedBy(id: string, error?: string, hasHint = false) {
  return {
    id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${id}-error` : hasHint ? `${id}-hint` : undefined,
  }
}
