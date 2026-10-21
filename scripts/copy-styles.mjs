// The stylesheets ship as plain CSS (not bundled through Vite), so apps can
// import '@ottersen/ui/styles.css' and override tokens on top of it.
import { cpSync } from 'node:fs'

cpSync('src/styles', 'dist/styles', { recursive: true })
