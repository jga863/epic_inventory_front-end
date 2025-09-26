import React from 'react';

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  placeholder,
  options = [],
  className = '',
  ...props
}) => {
  const baseInputClasses = "mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200 disabled:bg-gray-50 disabled:text-gray-500";
  const errorClasses = error ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "";

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700" htmlFor={name}>
        {label}{required && '*'}
      </label>

      {type === 'select' ? (
        <select
          id={name}
          name={name}
          className={`${baseInputClasses} ${errorClasses}`}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value || option} value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          className={`${baseInputClasses} ${errorClasses}`}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          {...props}
        />
      )}

      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;