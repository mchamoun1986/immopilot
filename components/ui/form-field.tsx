interface FormFieldProps {
  label: string;
  htmlFor?: string;
  suffix?: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, htmlFor, suffix, error, children }: FormFieldProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor={htmlFor}>
        {label}
      </label>
      <div className="relative">
        {children}
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
