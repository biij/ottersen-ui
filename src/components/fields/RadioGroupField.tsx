interface RadioGroupFieldProps<T extends string> {
  legend: string
  name: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}

export function RadioGroupField<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
}: RadioGroupFieldProps<T>) {
  return (
    <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
      <legend style={{ padding: 0, marginBottom: 4 }}>{legend}</legend>
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
    </fieldset>
  )
}
