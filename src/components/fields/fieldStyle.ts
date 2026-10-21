// Shared visual style for form controls (TextField, TextAreaField, DateField,
// TimeField, ...) so input styling lives in one place instead of being
// duplicated per field component.
export const fieldStyle = {
  display: 'block' as const,
  width: '100%',
  marginTop: 4,
  padding: '8px 10px',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--color-border)',
  background: 'var(--color-bg)',
  color: 'var(--color-text)',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  boxSizing: 'border-box' as const,
}

export function fieldStyleWithError(hasError: boolean) {
  return hasError ? { ...fieldStyle, borderColor: 'var(--color-error)' } : fieldStyle
}

// A <select>'s native dropdown arrow renders inside fieldStyle's normal 10px
// right padding, sitting right up against the edge with barely any breathing
// room compared to the left side — extra right padding gives it the same
// visual margin the text has on the left.
export const selectFieldStyle = {
  ...fieldStyle,
  paddingRight: 28,
}
