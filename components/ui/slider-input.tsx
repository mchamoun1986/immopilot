'use client';

import { useState, useCallback, useRef, useEffect } from "react";

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
  debounceMs?: number;
}

export function SliderInput({
  label, value, min, max, step = 1, suffix, onChange, debounceMs = 400,
}: SliderInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const [editing, setEditing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!editing) setLocalValue(value);
  }, [value, editing]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const debouncedChange = useCallback(
    (v: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onChange(v), debounceMs);
    },
    [onChange, debounceMs]
  );

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setLocalValue(v);
    debouncedChange(v);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value) || 0;
    setLocalValue(v);
    debouncedChange(v);
  };

  const pct = max > min ? ((localValue - min) / (max - min)) * 100 : 0;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {editing ? (
          <input
            type="number"
            value={localValue}
            min={min}
            max={max}
            step={step}
            onChange={handleInput}
            onBlur={() => setEditing(false)}
            autoFocus
            aria-label={`Saisir ${label}`}
            className="w-28 rounded-lg border border-[var(--bleu-action)] px-2 py-1 text-right text-sm font-bold text-[var(--bleu-marine)] focus:outline-none"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            aria-label={`Modifier ${label}`}
            className="text-sm font-bold text-[var(--bleu-marine)] hover:text-[var(--bleu-action)]"
          >
            {Math.round(localValue).toLocaleString("fr-FR")}{suffix ? ` ${suffix}` : ""}
          </button>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={localValue}
        onChange={handleSlider}
        aria-label={label}
        className="w-full cursor-pointer accent-[var(--bleu-action)]"
        style={{
          background: `linear-gradient(to right, var(--bleu-action) ${pct}%, #e2e8f0 ${pct}%)`,
        }}
      />
      <div className="mt-0.5 flex justify-between text-[10px] text-gray-400">
        <span>{min.toLocaleString("fr-FR")}{suffix ? ` ${suffix}` : ""}</span>
        <span>{max.toLocaleString("fr-FR")}{suffix ? ` ${suffix}` : ""}</span>
      </div>
    </div>
  );
}
