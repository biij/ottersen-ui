import type { ReactNode } from 'react'
import { FieldError } from './FieldError'
import { fieldStyleWithError } from './fieldStyle'
import { RequiredMark } from './RequiredMark'

export function TextField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required,
  error,
  maxLength,
  placeholder,
  tooltip,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'tel'
  required?: boolean
  error?: string
  maxLength?: number
  placeholder?: string
  tooltip?: ReactNode
}) {
  const errorId = `${id}-error`
  const counterId = `${id}-counter`

  return (
    <div>
      <label htmlFor={id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        {label}
        {required && <RequiredMark />}
        {tooltip}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        style={fieldStyleWithError(!!error)}
        aria-invalid={!!error}
        aria-describedby={[error ? errorId : null, maxLength ? counterId : null].filter(Boolean).join(' ') || undefined}
      />
      {(error || maxLength) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
          {error ? <FieldError id={errorId} message={error} /> : <span />}
          {maxLength && (
            <p id={counterId} style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--color-accent-text)' }}>
              {value.length}/{maxLength}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
