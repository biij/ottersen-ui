import { useEffect, useState } from 'react'

// Renders nothing for the first delayMs after mounting — since every
// caller only mounts a Spinner while its own loading/submitting flag is
// true (and unmounts it the moment that flag flips back), this means a
// request that resolves quickly never shows a spinner at all, avoiding a
// flash of it for near-instant loads.
const DEFAULT_DELAY_MS = 300

// Decorative — the caller is always responsible for the actual "loading"
// announcement (e.g. a disabled button's own accessible name, or a page's
// aria-live region), not this element itself. Animation is defined in
// base.css (inline styles can't declare @keyframes) and respects
// prefers-reduced-motion there.
export function Spinner({ size = 16, delayMs = DEFAULT_DELAY_MS }: { size?: number; delayMs?: number }) {
  const [visible, setVisible] = useState(delayMs <= 0)

  useEffect(() => {
    if (delayMs <= 0) return
    const timer = setTimeout(() => setVisible(true), delayMs)
    return () => clearTimeout(timer)
  }, [delayMs])

  if (!visible) return null

  return (
    <svg className="ou-spinner" width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={3} opacity={0.25} />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
    </svg>
  )
}
