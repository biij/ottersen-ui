import { useState, type CSSProperties, type ReactNode } from 'react'
import { Dialog } from './Dialog'
import { selectFieldStyle } from './fields/fieldStyle'

export interface SettingsCategory {
  id: string
  label: string
  content: ReactNode
}

const sectionHeadingStyle: CSSProperties = {
  fontSize: 13,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  color: 'var(--color-text)',
  margin: '0 0 var(--space-3)',
}

function CategoryButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
      style={{
        padding: '8px 10px',
        borderRadius: 'var(--radius)',
        border: 'none',
        background: active ? 'var(--color-surface)' : 'transparent',
        color: active ? 'var(--color-text-heading)' : 'var(--color-text)',
        fontWeight: active ? 600 : 400,
        fontFamily: 'inherit',
        fontSize: 14,
        textAlign: 'left',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

// The settings dialog's frame: categories in a sidebar on wider screens and a
// <select> on a phone (the swap lives in base.css), and the active category's
// panel next to it. Each app passes its own categories and their content, so
// app-specific settings (account, households, children...) stay in the app.
// With a single category, the sidebar is skipped rather than showing a
// one-item nav.
export function SettingsModal({
  open,
  onClose,
  title,
  closeLabel,
  categories,
}: {
  open: boolean
  onClose: () => void
  title: string
  closeLabel: string
  categories: SettingsCategory[]
}) {
  const [selectedId, setSelectedId] = useState(categories[0]?.id)
  const active = categories.find((category) => category.id === selectedId) ?? categories[0]
  const showNav = categories.length > 1

  return (
    <Dialog open={open} onClose={onClose} titleId="settings-title" title={title} closeLabel={closeLabel} maxWidth={520}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', marginTop: 'var(--space-3)' }}>
        {showNav && (
          <>
            <nav
              className="ou-settings-category-nav"
              aria-label={title}
              style={{
                flex: '0 0 auto',
                flexDirection: 'column',
                gap: 2,
                minWidth: 120,
                paddingRight: 'var(--space-3)',
                borderRight: '1px solid var(--color-border)',
              }}
            >
              {categories.map((category) => (
                <CategoryButton key={category.id} active={category.id === active?.id} onClick={() => setSelectedId(category.id)}>
                  {category.label}
                </CategoryButton>
              ))}
            </nav>

            <select
              className="ou-settings-category-select"
              aria-label={title}
              value={active?.id}
              onChange={(event) => setSelectedId(event.target.value)}
              // selectFieldStyle sets display: 'block' inline, which would
              // always beat the class's display: none/block toggle in
              // base.css — `display: undefined` leaves the class in control.
              style={{ ...selectFieldStyle, display: undefined, marginTop: 0, flex: '1 1 100%' }}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </>
        )}

        {active && (
          <section aria-label={active.label} style={{ flex: '1 1 240px', minWidth: 0, fontSize: 14 }}>
            <h3 style={sectionHeadingStyle}>{active.label}</h3>
            {active.content}
          </section>
        )}
      </div>
    </Dialog>
  )
}
