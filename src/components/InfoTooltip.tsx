import { useEffect, useRef, useState, type ReactNode } from 'react'

export type InfoTooltipVariant = 'info' | 'warning' | 'success' | 'error'

// Icon + color per variant, all from the same AAA-checked tokens used
// elsewhere for badges/status (tokens.css) — so a warning InfoTooltip reads
// as the same "warning" as any other warning-colored badge in the app, not
// a one-off color choice.
const variantConfig: Record<InfoTooltipVariant, { icon: string; color: string }> = {
  info: { icon: 'i', color: 'var(--color-accent-text)' },
  warning: { icon: '!', color: 'var(--color-warning-text)' },
  success: { icon: '✓', color: 'var(--color-success-text)' },
  error: { icon: '!', color: 'var(--color-error-text)' },
}

// Small icon that reveals explanatory text in a popover on click, same
// <details>/<summary> + outside-click/Escape pattern as Menu.tsx. Click
// rather than hover deliberately — a hover-only tooltip has no equivalent
// on touch, which Menu.tsx's pattern already sidesteps. `variant` picks the
// icon glyph and color (default 'info', the original "i" circle); any
// other variant is for marking the tooltip's own subject as a warning/
// success/error at a glance, not just explaining something neutral.
export function InfoTooltip({
  label,
  variant = 'info',
  // Which side the popover opens from (same idea as Menu.tsx's `align`) —
  // 'left' (the default) anchors the popover's left edge under the icon and
  // grows rightward, which overflows the viewport for an icon that isn't
  // near the screen's left edge (e.g. one at the end of a list row). Pass
  // 'right' there instead.
  align = 'left',
  children,
}: {
  label: string
  variant?: InfoTooltipVariant
  align?: 'left' | 'right'
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDetailsElement>(null)
  const { icon, color } = variantConfig[variant]

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: PointerEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <details
      ref={ref}
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <summary
        aria-label={label}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 18,
          height: 18,
          borderRadius: '50%',
          border: `1px solid ${color}`,
          color,
          fontSize: 12,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {icon}
      </summary>
      <div
        role="tooltip"
        style={{
          position: 'absolute',
          top: '100%',
          [align]: 0,
          zIndex: 1,
          marginTop: 4,
          // min() with a viewport-relative bound, not a fixed 240px — a
          // fixed width overflowed the screen on a narrow phone regardless
          // of which side it's anchored from, once the icon itself sat
          // anywhere other than near that same edge.
          width: 'min(240px, calc(100vw - 2 * var(--space-4)))',
          padding: 'var(--space-2)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          fontSize: 13,
          fontWeight: 400,
          textAlign: 'left',
        }}
      >
        {children}
      </div>
    </details>
  )
}
