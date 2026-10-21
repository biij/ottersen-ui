import { FieldError } from './FieldError'
import { fieldStyleWithError } from './fieldStyle'
import { RequiredMark } from './RequiredMark'

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  rows = 3,
  required,
  error,
  maxLength,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
  required?: boolean
  error?: string
  maxLength?: number
}) {
  const errorId = `${id}-error`
  const counterId = `${id}-counter`

  return (
    <div>
      <label htmlFor={id}>
        {label}
        {required && <RequiredMark />}
      </label>
      <textarea
        id={id}
        rows={rows}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={maxLength}
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
