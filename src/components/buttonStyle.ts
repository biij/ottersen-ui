import type { CSSProperties } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link'
export type ButtonSize = 'md' | 'sm'

const base: CSSProperties = {
  borderRadius: 'var(--radius)',
  fontWeight: 500,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  // Centers content when a button is wider than its content (e.g. a
  // full-width button on a phone).
  justifyContent: 'center',
  gap: 6,
  textDecoration: 'none',
}

const variantStyle: Record<ButtonVariant, CSSProperties> = {
  primary: {
    border: 'none',
    background: 'var(--color-accent)',
    color: 'var(--color-accent-contrast)',
  },
  secondary: {
    border: '1px solid var(--color-border)',
    background: 'transparent',
    color: 'var(--color-text-heading)',
  },
  // No border/background at all — for low-emphasis actions (e.g. a back
  // link) that shouldn't compete with the page's primary action.
  ghost: {
    border: 'none',
    background: 'transparent',
    color: 'var(--color-accent-text)',
  },
  // An inline underlined text link, not a button-shaped control at all —
  // for secondary in-form actions (e.g. "Add end date/time") that should
  // read as plain text, not compete visually with the real submit button.
  link: {
    border: 'none',
    background: 'transparent',
    color: 'var(--color-accent-text)',
    textDecoration: 'underline',
  },
}

const sizeStyle: Record<ButtonSize, CSSProperties> = {
  md: { padding: '10px 18px', fontSize: 'inherit' },
  sm: { padding: '6px 8px', fontSize: 14 },
}

// Ghost buttons carry less horizontal padding than bordered ones at every
// size — there's no border to visually separate them from surrounding
// content, so the wider padding used for primary/secondary reads as too
// much empty space.
const ghostPadding: Record<ButtonSize, CSSProperties> = {
  md: { padding: '10px 4px' },
  sm: { padding: '6px 4px' },
}

// Link buttons have no padding at all — they read as plain inline text.
const linkPadding: Record<ButtonSize, CSSProperties> = {
  md: { padding: 0 },
  sm: { padding: 0 },
}

const variantPadding: Partial<Record<ButtonVariant, Record<ButtonSize, CSSProperties>>> = {
  ghost: ghostPadding,
  link: linkPadding,
}

// Shared look for every button-like control in the app — LinkButton (an
// actual navigation link) and Menu's dropdown trigger (AddToCalendarButton)
// both style themselves from this, so "what a ghost/secondary/primary
// button looks like" only has one definition to keep in sync.
export function buttonStyle(variant: ButtonVariant = 'secondary', size: ButtonSize = 'md'): CSSProperties {
  return {
    ...base,
    ...sizeStyle[size],
    ...variantStyle[variant],
    ...variantPadding[variant]?.[size],
  }
}
