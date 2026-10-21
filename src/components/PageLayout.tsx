import type { ReactNode } from 'react'

export function PageLayout({
  children,
  maxWidth = 480,
  align = 'center',
  centerText = false,
}: {
  children: ReactNode
  maxWidth?: number
  // 'center' vertically centers content in the viewport — right for short,
  // landing-style pages (home, login). 'top' starts content below the header
  // instead, for pages with substantive content of their own.
  align?: 'center' | 'top'
  // Independent of `align` — landing/dashboard-style pages may want
  // centered headers/text, while most pages are left-aligned regardless
  // of whether its content is vertically centered or top-anchored.
  centerText?: boolean
}) {
  return (
    <main
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        textAlign: centerText ? 'center' : 'left',
        padding: 'var(--space-4)',
        // Extra bottom padding beyond the other sides — without it, a
        // page's last bit of content sits right up against the viewport
        // edge, especially on mobile where there's no footer below it.
        paddingBottom: 'var(--space-5)',
      }}
    >
      <div style={{ maxWidth, width: '100%' }}>{children}</div>
    </main>
  )
}
