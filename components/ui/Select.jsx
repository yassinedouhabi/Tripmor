import { forwardRef } from "react";

const Select = forwardRef(function Select(
  { label, error, options = [], placeholder, className = "", ...props },
  ref
) {
  return (
    <div>
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

export default Select;
