// Visual-only marker for required fields. The native `required` attribute on
// the input itself is what screen readers announce — this span is decorative,
// so sighted users get the same cue without duplicating it for assistive tech.
export function RequiredMark() {
  return (
    <span aria-hidden="true" style={{ color: 'var(--color-accent-text)' }}>
      {' '}
      *
    </span>
  )
}
