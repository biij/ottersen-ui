export type ColorSchemePreference = 'system' | 'light' | 'dark'
export type ColorScheme = 'light' | 'dark'

export interface ColorSchemeStore {
  // Applies the stored preference (default: follow the OS) and keeps it in
  // sync if the OS setting changes while "system" is active. Returns a
  // cleanup function.
  init: () => () => void
  get: () => ColorSchemePreference
  set: (preference: ColorSchemePreference) => void
}

const DARK_QUERY = '(prefers-color-scheme: dark)'

function resolve(preference: ColorSchemePreference, media: MediaQueryList): ColorScheme {
  return preference === 'system' ? (media.matches ? 'dark' : 'light') : preference
}

function apply(scheme: ColorScheme) {
  document.documentElement.dataset.colorScheme = scheme
}

// One store per app, keyed by the app's own storage key (e.g.
// 'memories-color-scheme'), so apps sharing an origin in development don't
// overwrite each other's preference. Persisted to localStorage only
// (device-local) — an app with accounts can sync it on top of this.
export function createColorSchemeStore(storageKey: string): ColorSchemeStore {
  function get(): ColorSchemePreference {
    try {
      const value = localStorage.getItem(storageKey)
      if (value === 'system' || value === 'light' || value === 'dark') return value
    } catch {
      // ignore — storage may be unavailable
    }
    return 'system'
  }

  function set(preference: ColorSchemePreference) {
    try {
      localStorage.setItem(storageKey, preference)
    } catch {
      // ignore — storage may be unavailable
    }
    apply(resolve(preference, window.matchMedia(DARK_QUERY)))
  }

  function init() {
    const media = window.matchMedia(DARK_QUERY)
    const update = () => apply(resolve(get(), media))
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }

  return { init, get, set }
}
