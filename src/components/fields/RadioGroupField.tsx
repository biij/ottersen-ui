interface RadioGroupFieldProps<T extends string> {
  legend: string
  name: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
  // Options side by side, wrapping onto more lines when there isn't room —
  // for a few short options. Default is one option per line.
  inline?: boolean
}

export function RadioGroupField<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
  inline = false,
}: RadioGroupFieldProps<T>) {
  return (
    <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
      <legend style={{ padding: 0, marginBottom: 4 }}>{legend}</legend>
      <div style={inline ? { display: 'flex', flexWrap: 'wrap', columnGap: 'var(--space-4)' } : undefined}>
        {options.map((option) => (
          <label key={option.value} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
