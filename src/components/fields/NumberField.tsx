import { useState } from 'react'
import { FieldError } from './FieldError'
import { fieldStyleWithError } from './fieldStyle'
import { RequiredMark } from './RequiredMark'

export function NumberField({
  id,
  label,
  value,
  onChange,
  min = 0,
  required,
  error,
}: {
  id: string
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  required?: boolean
  error?: string
}) {
  const errorId = `${id}-error`
  // Local text mirrors the input's raw characters, separate from the
  // numeric value — lets the field sit empty mid-edit (e.g. right after
  // backspacing everything out) without every keystroke immediately
  // snapping back to a clamped number. Number('') is 0, not NaN, so
  // clamping straight off the DOM value on every change made it impossible
  // to ever replace a digit with a smaller one — backspace-to-empty
  // instantly re-filled with min before a new digit could be typed.
  const [text, setText] = useState(() => String(value))

  function handleChange(raw: string) {
    setText(raw)
    if (raw === '') return
    const next = Number(raw)
    if (!Number.isNaN(next)) onChange(Math.max(min, next))
  }

  function handleBlur() {
    // Leaving the field empty or mid-typo falls back to the last valid
    // value, not min — clearing it while adjusting shouldn't silently
    // reset a higher count back down to the minimum.
    setText(String(value))
  }

  return (
    <div>
      <label htmlFor={id}>
        {label}
        {required && <RequiredMark />}
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        required={required}
        value={text}
        onChange={(event) => handleChange(event.target.value)}
        onBlur={handleBlur}
        style={fieldStyleWithError(!!error)}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
      />
      {error && <FieldError id={errorId} message={error} />}
    </div>
  )
}
