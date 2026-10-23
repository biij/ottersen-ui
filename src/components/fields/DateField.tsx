import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { datePattern, formatDateText, parseDateText } from './dateText'
import { FieldError } from './FieldError'
import { fieldStyleWithError, selectFieldStyle } from './fieldStyle'
import { RequiredMark } from './RequiredMark'

export interface DateFieldLabels {
  // Accessible name of the calendar button, e.g. "Choose date".
  openCalendar: string
  previousMonth: string
  nextMonth: string
  // Accessible names of the calendar's month and year dropdowns.
  month: string
  year: string
  // Shown when the typed text isn't a date, e.g. "Write the date as dd.mm.yyyy".
  invalidDate: string
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <line x1="16" y1="3" x2="16" y2="7" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function toValue(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function fromValue(value: string): Date | null {
  const [year, month, day] = value.split('-').map(Number)
  return year && month && day ? new Date(year, month - 1, day) : null
}

function addDays(value: string, days: number): string {
  const date = fromValue(value)!
  date.setDate(date.getDate() + days)
  return toValue(date)
}

// The same day in another month, or that month's last day if it's shorter.
function addMonths(value: string, months: number): string {
  const date = fromValue(value)!
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1)
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()
  target.setDate(Math.min(date.getDate(), lastDay))
  return toValue(target)
}

// A date you can type in the app's language's format (14.06.2025 in
// Norwegian) or pick from a calendar, with the calendar's month and weekday
// names in that language too — native date inputs use the browser/OS
// locale instead, and on Android can't be typed into. Typed text is read
// leniently (14.6.25, 14/06/2025, 14062025) and tidied up on blur.
//
// `value` is YYYY-MM-DD, or '' while empty or not a valid date. `min`/`max`
// only limit the calendar; checking a typed date against them is up to the
// form. All text comes in as props.
export function DateField({
  id,
  label,
  value,
  onChange,
  locale,
  labels,
  placeholder,
  min,
  max,
  required,
  error,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  // e.g. 'nb' or 'en-GB' — decides the date format, and the month and
  // weekday names in the calendar.
  locale: string
  labels: DateFieldLabels
  // The expected format, e.g. "dd.mm.åååå" — shown in the empty field.
  placeholder?: string
  min?: string
  max?: string
  required?: boolean
  error?: string
}) {
  const pattern = datePattern(locale)
  const errorId = `${id}-error`
  const calendarId = `${id}-calendar`

  // The typed text, and the value it last produced, so a change made from
  // outside (or from the calendar) can be told apart from our own.
  const [draft, setDraft] = useState(() => formatDateText(value, pattern))
  const [emitted, setEmitted] = useState(value)
  const [seenValue, setSeenValue] = useState(value)
  const [showInvalid, setShowInvalid] = useState(false)
  if (value !== seenValue) {
    setSeenValue(value)
    if (value !== emitted) {
      setDraft(formatDateText(value, pattern))
      setEmitted(value)
      setShowInvalid(false)
    }
  }

  function emit(next: string) {
    setEmitted(next)
    if (next !== value) onChange(next)
  }

  function handleTextChange(text: string) {
    setDraft(text)
    setShowInvalid(false)
    emit(parseDateText(text, pattern) ?? '')
  }

  function handleBlur() {
    const parsed = parseDateText(draft, pattern)
    if (parsed) setDraft(formatDateText(parsed, pattern))
    else if (draft.trim()) setShowInvalid(true)
  }

  // --- Calendar ---
  const [open, setOpen] = useState(false)
  // Read once, when the field appears.
  const [todayValue] = useState(() => toValue(new Date()))
  const [focused, setFocused] = useState(value || todayValue)
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  // Set when the focused day should also get keyboard focus: on opening and
  // when moving with the keys — not when using the dropdowns or ‹ ›, which
  // would otherwise lose focus to the grid.
  const moveFocusRef = useRef(false)
  const focusedDate = fromValue(focused)!
  const viewYear = focusedDate.getFullYear()
  const viewMonth = focusedDate.getMonth()

  function openCalendar() {
    let start = value || todayValue
    if (min && start < min) start = min
    if (max && start > max) start = max
    setFocused(start)
    moveFocusRef.current = true
    setOpen(true)
  }

  function closeCalendar() {
    setOpen(false)
    buttonRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  // Keeps keyboard focus on the focused day as it moves, also across months.
  useEffect(() => {
    if (!open || !moveFocusRef.current) return
    moveFocusRef.current = false
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focused}"]`)?.focus()
  }, [open, focused])

  const outOfRange = (dateValue: string) => (min !== undefined && dateValue < min) || (max !== undefined && dateValue > max)

  function selectDay(dateValue: string) {
    if (outOfRange(dateValue)) return
    setDraft(formatDateText(dateValue, pattern))
    setShowInvalid(false)
    emit(dateValue)
    closeCalendar()
  }

  function handleGridKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, () => string> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      PageUp: () => addMonths(focused, event.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focused, event.shiftKey ? 12 : 1),
    }
    const move = moves[event.key]
    if (!move) return
    event.preventDefault()
    moveFocusRef.current = true
    setFocused(move())
  }

  function handlePopoverKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      closeCalendar()
    }
  }

  // Jumping with the month/year dropdowns keeps the day where it can.
  function showMonth(year: number, month: number) {
    const lastDay = new Date(year, month + 1, 0).getDate()
    setFocused(toValue(new Date(year, month, Math.min(focusedDate.getDate(), lastDay))))
  }

  const thisYear = Number(todayValue.slice(0, 4))
  const firstYear = Math.min(min ? Number(min.slice(0, 4)) : thisYear - 100, viewYear)
  const lastYear = Math.max(max ? Number(max.slice(0, 4)) : thisYear + 10, viewYear)
  const years = Array.from({ length: lastYear - firstYear + 1 }, (_, i) => lastYear - i)
  const monthNames = Array.from({ length: 12 }, (_, month) => new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2024, month, 1)))
  // Monday first. 1 January 2024 was a Monday.
  const weekdayNames = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(2024, 0, 1 + i)).replace(/\.$/, ''),
  )
  const fullDate = new Intl.DateTimeFormat(locale, { dateStyle: 'full' })
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const leadingBlanks = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7

  const invalidMessage = showInvalid ? labels.invalidDate : undefined
  const shownError = invalidMessage ?? error

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <label htmlFor={id}>
        {label}
        {required && <RequiredMark />}
      </label>
      <div style={{ position: 'relative', marginTop: 4 }}>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={draft}
          onChange={(event) => handleTextChange(event.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          aria-invalid={!!shownError}
          aria-describedby={shownError ? errorId : undefined}
          style={{ ...fieldStyleWithError(!!shownError), marginTop: 0, paddingRight: 48 }}
        />
        <button
          ref={buttonRef}
          type="button"
          onClick={() => (open ? closeCalendar() : openCalendar())}
          aria-label={labels.openCalendar}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? calendarId : undefined}
          style={{
            position: 'absolute',
            top: '50%',
            right: 4,
            transform: 'translateY(-50%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            padding: 0,
            border: 'none',
            borderRadius: 'var(--radius)',
            background: 'transparent',
            color: 'var(--color-text-heading)',
            cursor: 'pointer',
          }}
        >
          <CalendarIcon />
        </button>
      </div>
      {shownError && <FieldError id={errorId} message={shownError} />}

      {open && (
        <div
          id={calendarId}
          role="dialog"
          aria-label={label}
          onKeyDown={handlePopoverKeyDown}
          style={{
            position: 'absolute',
            zIndex: 10,
            right: 0,
            marginTop: 'var(--space-2)',
            padding: 'var(--space-3)',
            width: 'min(320px, 100%)',
            boxSizing: 'border-box',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', marginBottom: 'var(--space-2)' }}>
            <button type="button" onClick={() => setFocused(addMonths(focused, -1))} aria-label={labels.previousMonth} style={navButtonStyle}>
              ‹
            </button>
            <select
              aria-label={labels.month}
              value={viewMonth}
              onChange={(event) => showMonth(viewYear, Number(event.target.value))}
              style={{ ...selectFieldStyle, ...compactSelectStyle, flex: '1 1 auto' }}
            >
              {monthNames.map((name, month) => (
                <option key={month} value={month}>
                  {name}
                </option>
              ))}
            </select>
            <select
              aria-label={labels.year}
              value={viewYear}
              onChange={(event) => showMonth(Number(event.target.value), viewMonth)}
              style={{ ...selectFieldStyle, ...compactSelectStyle, flex: '0 0 auto', width: 'auto' }}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => setFocused(addMonths(focused, 1))} aria-label={labels.nextMonth} style={navButtonStyle}>
              ›
            </button>
          </div>

          <div aria-hidden="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
            {weekdayNames.map((name) => (
              <span key={name} style={{ textAlign: 'center', fontSize: 12 }}>
                {name}
              </span>
            ))}
          </div>

          {/* Roving focus: only the focused day is in the tab order, and the
              arrow keys move it (Page Up/Down for months, with Shift for years). */}
          <div ref={gridRef} onKeyDown={handleGridKeyDown} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {Array.from({ length: leadingBlanks }, (_, i) => (
              <span key={`blank-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const dateValue = toValue(new Date(viewYear, viewMonth, i + 1))
              const isSelected = dateValue === value
              const isToday = dateValue === todayValue
              const disabled = outOfRange(dateValue)
              return (
                <button
                  key={dateValue}
                  type="button"
                  data-date={dateValue}
                  tabIndex={dateValue === focused ? 0 : -1}
                  onClick={() => selectDay(dateValue)}
                  // aria-disabled rather than disabled, so the arrow keys can
                  // still move through these days.
                  aria-disabled={disabled || undefined}
                  aria-pressed={isSelected}
                  aria-current={isToday ? 'date' : undefined}
                  aria-label={fullDate.format(new Date(viewYear, viewMonth, i + 1))}
                  style={{
                    minHeight: 36,
                    padding: 0,
                    borderRadius: 'var(--radius)',
                    border: isToday ? '1px solid var(--color-accent-text)' : '1px solid transparent',
                    background: isSelected ? 'var(--color-accent)' : 'transparent',
                    color: isSelected ? 'var(--color-accent-contrast)' : 'var(--color-text-heading)',
                    fontFamily: 'inherit',
                    fontSize: 15,
                    fontWeight: isSelected ? 600 : 400,
                    cursor: disabled ? 'default' : 'pointer',
                    // Unavailable days are exempt from contrast requirements.
                    opacity: disabled ? 0.4 : 1,
                  }}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

const navButtonStyle: CSSProperties = {
  flex: '0 0 auto',
  width: 32,
  height: 32,
  padding: 0,
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius)',
  background: 'transparent',
  color: 'var(--color-text-heading)',
  fontSize: 18,
  lineHeight: 1,
  cursor: 'pointer',
}

const compactSelectStyle: CSSProperties = {
  marginTop: 0,
  minWidth: 0,
  padding: '4px 24px 4px 6px',
  fontSize: 15,
}
