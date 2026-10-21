import { useEffect, useState, type ReactNode } from 'react'

// Scrolling past this many pixels before the header is allowed to hide
// avoids it flickering away from tiny, incidental scroll jitter near the top.
const HIDE_THRESHOLD_PX = 80

// Sticky top bar that hides on scroll-down and reappears on scroll-up, so it
// stays out of the way of long pages on a phone. `start` is the left-aligned
// group (logo/home link, main nav), `end` the right side (usually a Menu).
// Pass keepVisible while something anchored to it is open (e.g. the menu),
// so it never disappears out from under it.
export function AppHeader({ start, end, keepVisible = false }: { start?: ReactNode; end?: ReactNode; keepVisible?: boolean }) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastScrollY = window.scrollY

    function handleScroll() {
      const currentScrollY = window.scrollY
      const scrolledDown = currentScrollY > lastScrollY

      if (keepVisible || currentScrollY < HIDE_THRESHOLD_PX) {
        setHidden(false)
      } else {
        setHidden(scrolledDown)
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [keepVisible])

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-3)',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-bg)',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        transform: hidden && !keepVisible ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 200ms ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginRight: 'auto', minWidth: 0 }}>{start}</div>
      {end}
    </header>
  )
}
