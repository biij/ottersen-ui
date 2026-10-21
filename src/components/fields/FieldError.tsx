export function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} style={{ color: 'var(--color-error-text)', fontSize: 13, margin: '4px 0 0' }}>
      {message}
    </p>
  )
}
