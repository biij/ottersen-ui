# @ottersen/ui

Shared React components, design tokens and preferences for the Ottersen.tech apps (Attend, Locate, Memories). Extracted from Attend.

## What's in it

- **Styles:** design tokens (light/dark colors, spacing, radius) and base styles, in `@ottersen/ui/styles.css`
- **Components:** `AppHeader`, `Button`, `Dialog`, `InfoTooltip`, `Menu`, `PageLayout`, `SettingsModal`, `Spinner`
- **Form fields:** `TextField`, `TextAreaField`, `NumberField`, `DateField` (typed in the app's date format, or picked from a calendar), `CheckboxField`, `RadioGroupField`, `FieldError`, `RequiredMark`
- **Preferences:** `createColorSchemeStore` (light/dark/follow device) and `createLocalePreferenceStore` (nb/en/follow device)

All components take their text as props, so each app can use its own translation setup (e.g. react-i18next).

## Usage

```
npm install @ottersen/ui
```

```tsx
// main.tsx
import { createColorSchemeStore } from '@ottersen/ui'
export const colorScheme = createColorSchemeStore('myapp-color-scheme')
colorScheme.init()
```

```css
/* index.css */
@import '@ottersen/ui/styles.css';

/* App-specific overrides go below, e.g. a different accent color */
:root[data-color-scheme='light'] {
  --color-accent: #3b6e71;
}
```

```tsx
import { Button, Dialog } from '@ottersen/ui'
```

## Development

```
npm install
npm run build      # dist/: index.js, type declarations and styles
npm run dev        # rebuild on change
npm run lint
npm run typecheck
```

To try changes in an app before publishing, link this folder into the app (`npm link ../path/to/ottersen-ui` in the app) and run `npm run dev` here. The app should dedupe React in its Vite config (`resolve.dedupe: ['react', 'react-dom']`), since the linked folder has its own copy.

## Publishing

1. Bump the version in `package.json` (semver: patch for fixes, minor for new components, major for breaking changes).
2. `npm publish`. It runs typecheck, lint and build first, and asks for 2FA in the browser.
3. Commit and push the version bump, and update the version in the apps that should use it.

## Conventions

- Generic only. Anything tied to one app's features stays in that app.
- No hard-coded text: labels come in as props.
- Styles inline with CSS variables from the tokens. Only what inline styles can't express (`:hover`, media queries, keyframes) goes in `base.css`, with class names prefixed `ou-`.
- WCAG 2.2 AA, with AAA (7:1) contrast for text colors.
