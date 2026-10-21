import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

export interface MenuItem {
  key: string
  label: string
  onSelect: () => void
}

// Dropdown menu built on <details>/<summary>. Controlled (open/onOpenChange)
// so a parent like AppHeader can react to it opening/closing (e.g. to keep
// itself visible while the menu is open).
export function Menu({
  items,
  open,
  onOpenChange,
  label,
  trigger,
  align = 'right',
  triggerStyle,
}: {
  items: MenuItem[]
  open: boolean
  onOpenChange: (open: boolean) => void
  // Accessible name for the trigger and the menu, e.g. t('menu').
  label: string
  // Visible trigger content. Defaults to the label text; pass e.g. "☰" or
  // "⋯" for a compact icon trigger.
  trigger?: ReactNode
  align?: 'left' | 'right'
  // Overrides the default bordered-button look — merged over the defaults.
  triggerStyle?: CSSProperties
}) {
  const menuRef = useRef<HTMLDetailsElement>(null)

  // <details> doesn't natively close on outside click or Escape — add both.
  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onOpenChange(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onOpenChange(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onOpenChange])

  return (
    <details
      ref={menuRef}
      open={open}
      onToggle={(event) => onOpenChange(event.currentTarget.open)}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <summary
        aria-label={label}
        style={{
          cursor: 'pointer',
          padding: '6px 12px',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-heading)',
          fontSize: 18,
          lineHeight: 1,
          ...triggerStyle,
        }}
      >
        {trigger ?? label}
      </summary>
      <div
        role="menu"
        aria-label={label}
        style={{
          position: 'absolute',
          [align]: 0,
          zIndex: 2,
          marginTop: 'var(--space-2)',
          padding: 'var(--space-2)',
          minWidth: 180,
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            role="menuitem"
            onClick={() => {
              onOpenChange(false)
              item.onSelect()
            }}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius)',
              border: 'none',
              background: 'transparent',
              color: 'var(--color-text-heading)',
              fontSize: 'inherit',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </details>
  )
}
