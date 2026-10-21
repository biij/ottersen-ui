import { useEffect, useState } from 'react'

const QUERY = '(pointer: coarse)'

// True for touch-primary devices (phones/tablets), false for mouse/trackpad
// devices — used to decide between native date/time inputs (good on touch:
// OS wheel/calendar pickers, no keyboard needed) and the custom picker (only
// needed on desktop, where native inputs render in the browser/OS locale
// instead of the app's selected language).
export function useCoarsePointer(): boolean {
  const [isCoarse, setIsCoarse] = useState(() => window.matchMedia(QUERY).matches)

  useEffect(() => {
    const media = window.matchMedia(QUERY)
    const update = () => setIsCoarse(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return isCoarse
}
