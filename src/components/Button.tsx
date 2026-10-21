import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { buttonStyle, type ButtonSize, type ButtonVariant } from './buttonStyle'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'prefix'> {
  variant?: ButtonVariant
  size?: ButtonSize
  // Named iconStart/iconEnd rather than prefix/suffix — ButtonHTMLAttributes
  // already declares a `prefix` attribute (the obscure RDFa one), so that
  // name would collide.
  iconStart?: ReactNode
  iconEnd?: ReactNode
  // Native <button> defaults to type="submit" inside a <form>, which is
  // rarely what a button styled through here wants (e.g. an "Add end date"
  // link inside a form — a plain <button> there would submit the form).
  // Callers opt into type="submit" explicitly instead of it being the
  // silent default.
  type?: 'button' | 'submit'
}

// The <button> counterpart to LinkButton (a styled <Link>) — same props,
// same underlying buttonStyle(), so "what does a button look like" has one
// definition regardless of whether it navigates or just does something in
// place. They stay as two thin components rather than one polymorphic
// component because the prop shape each needs (`to` vs onClick/type) is
// different enough that merging them would need an `as` prop and add
// complexity for little benefit at this app's size — revisit if that
// changes.
export function Button({ variant = 'secondary', size = 'md', iconStart, iconEnd, type = 'button', style, children, ...rest }: ButtonProps) {
  return (
    <button type={type} style={{ ...buttonStyle(variant, size), ...style }} {...rest}>
      {iconStart}
      {children}
      {iconEnd}
    </button>
  )
}
