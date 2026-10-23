// Turning a YYYY-MM-DD value into the date text people type, and back, in
// the order and separator the locale uses (14.06.2025 in Norwegian,
// 06/14/2025 in US English).

type Part = 'day' | 'month' | 'year'

export interface DatePattern {
  order: Part[]
  separator: string
}

export function datePattern(locale: string): DatePattern {
  const parts = new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).formatToParts(new Date(2025, 11, 31))
  const order = parts.filter((part): part is Intl.DateTimeFormatPart & { type: Part } => ['day', 'month', 'year'].includes(part.type)).map((part) => part.type)
  const separator = parts.find((part) => part.type === 'literal')?.value.trim() || '.'
  return { order, separator }
}

export function formatDateText(value: string, pattern: DatePattern): string {
  const [year, month, day] = value.split('-')
  if (!year || !month || !day) return ''
  const byPart: Record<Part, string> = { day, month, year }
  return pattern.order.map((part) => byPart[part]).join(pattern.separator)
}

// A two-digit year means the closest one that isn't in the future: in 2026,
// 25 is 2025 and 30 is 1930.
function fullYear(text: string, today: Date): number {
  const year = Number(text)
  if (text.length > 2) return year
  const century = Math.floor(today.getFullYear() / 100) * 100
  return century + year > today.getFullYear() ? century - 100 + year : century + year
}

// The YYYY-MM-DD value for typed text, or null if it isn't a real date.
// Lenient: any non-digit separates parts (14.6.25, 14/06/2025, 14-6-2025),
// and digits alone work when day and month have two digits (14062025, 140625).
export function parseDateText(text: string, pattern: DatePattern, today = new Date()): string | null {
  const trimmed = text.trim()
  if (!trimmed) return null

  let pieces = trimmed.split(/\D+/).filter(Boolean)
  if (pieces.length === 1 && (trimmed.length === 8 || trimmed.length === 6)) {
    const yearLength = trimmed.length - 4
    let position = 0
    pieces = pattern.order.map((part) => {
      const length = part === 'year' ? yearLength : 2
      const piece = trimmed.slice(position, position + length)
      position += length
      return piece
    })
  }
  if (pieces.length !== 3) return null

  const byPart = Object.fromEntries(pattern.order.map((part, index) => [part, pieces[index]])) as Record<Part, string>
  if (byPart.day.length > 2 || byPart.month.length > 2 || ![2, 4].includes(byPart.year.length)) return null

  const year = fullYear(byPart.year, today)
  const month = Number(byPart.month)
  const day = Number(byPart.day)
  const date = new Date(year, month - 1, day)
  // Rejects 31.02 and the like, which Date would roll over into March.
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null

  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}
