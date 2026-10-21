// Language preference only — not a translation system. Each app does its own
// translations (react-i18next or otherwise) and uses this to decide which
// language to show, so "follow the device" behaves the same in every app.
export type Locale = 'nb' | 'en'
export type LocalePreference = 'system' | Locale

export function detectSystemLocale(): Locale {
  const lang = (navigator.language || 'en').toLowerCase()
  // nb = Bokmål, nn = Nynorsk, no = generic Norwegian — all map to nb for now.
  return lang.startsWith('nb') || lang.startsWith('nn') || lang.startsWith('no') ? 'nb' : 'en'
}

export function resolveLocale(preference: LocalePreference): Locale {
  return preference === 'system' ? detectSystemLocale() : preference
}

export interface LocalePreferenceStore {
  get: () => LocalePreference
  set: (preference: LocalePreference) => void
}

export function createLocalePreferenceStore(storageKey: string): LocalePreferenceStore {
  function get(): LocalePreference {
    try {
      const value = localStorage.getItem(storageKey)
      if (value === 'system' || value === 'nb' || value === 'en') return value
    } catch {
      // ignore — storage may be unavailable
    }
    return 'system'
  }

  function set(preference: LocalePreference) {
    try {
      localStorage.setItem(storageKey, preference)
    } catch {
      // ignore — storage may be unavailable
    }
  }

  return { get, set }
}
