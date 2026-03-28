"use client";

interface ChipSelectorProps<T extends string> {
  label: string;
  options: readonly { value: T; label: string; description?: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function ChipSelector<T extends string>({ label, options, value, onChange }: ChipSelectorProps<T>) {
  return (
    <fieldset>
      <legend className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                isSelected
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
              aria-pressed={isSelected}
              title={option.description}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
