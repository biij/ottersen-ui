import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react'

// Shared modal wrapper around the native <dialog> element. Handles the
// open/close lifecycle, click-outside-to-close, and a close (X) button.
// Escape-to-close and the dimmed/blurred backdrop are native/global
// (see dialog::backdrop in base.css) — nothing to wire up for those.
// All text comes in as props, so the component works with any i18n setup.
export function Dialog({
  open,
  onClose,
  titleId,
  title,
  closeLabel,
  closeIconLabel,
  maxWidth = 360,
  children,
  actions,
  leadingActions,
}: {
  open: boolean
  onClose: () => void
  titleId: string
  title: string
  // Text of the footer's close button, e.g. t('close'). A dialog whose close
  // action discards a draft reads better as t('cancel') instead.
  closeLabel: string
  // Accessible name for the header's × icon. Defaults to closeLabel; pass a
  // generic "Close" when closeLabel is something like "Cancel".
  closeIconLabel?: string
  maxWidth?: number
  children: ReactNode
  // Extra footer buttons (e.g. a primary "Save"), rendered to the right of
  // the built-in close button.
  actions?: ReactNode
  // Footer buttons rendered to the LEFT of the built-in close button (e.g.
  // "Reset"), which reads left-to-right as "start over, then either back out
  // or confirm".
  leadingActions?: ReactNode
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // showModal() makes the background inert to clicks/focus, but doesn't stop
  // the page behind it from scrolling — lock that explicitly while open.
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  // A click lands on the <dialog> element itself (not its content) only
  // when it's on the backdrop area, since the content fills the rest.
  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) {
      onClose()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      aria-labelledby={titleId}
      style={{
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
        padding: 'var(--space-4)',
        color: 'var(--color-text)',
        background: 'var(--color-bg)',
        maxWidth,
        width: '90%',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--space-2)',
        }}
      >
        <h2 id={titleId} style={{ margin: 0 }}>
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={closeIconLabel ?? closeLabel}
          style={{
            border: 'none',
            background: 'transparent',
            color: 'var(--color-text-heading)',
            fontSize: 22,
            lineHeight: 1,
            cursor: 'pointer',
            padding: 4,
          }}
        >
          ×
        </button>
      </header>

      {children}

      <footer
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 'var(--space-2)',
          marginTop: 'var(--space-4)',
          paddingTop: 'var(--space-3)',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        {leadingActions}
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--color-border)',
            background: 'transparent',
            color: 'var(--color-text-heading)',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            cursor: 'pointer',
          }}
        >
          {closeLabel}
        </button>
        {actions}
      </footer>
    </dialog>
  )
}
