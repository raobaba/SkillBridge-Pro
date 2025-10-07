import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  name,
  className = "",
  disabled = false,
  error = "",
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  options = [], // for select dropdown
  textarea = false, // render textarea instead of input
  rows = 3, // for textarea
  showToggle = false, // external password toggle control
  isVisible = false, // external password visibility state
  onToggle, // external password toggle handler
  variant = "default", // "default" or "developer-projects"
  ...props
}) => {
  const [internalShowPassword, setInternalShowPassword] = useState(false);

  const isPassword = type === "password";
  const showPassword = showToggle ? isVisible : internalShowPassword;
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  // Styling variants
  const isDeveloperProjects = variant === "developer-projects";
  const labelClass = isDeveloperProjects 
    ? 'block text-sm font-medium text-gray-300' 
    : 'mb-1 text-sm font-medium text-gray-200';
  const containerClass = isDeveloperProjects 
    ? `space-y-2 ${className}` 
    : `flex flex-col ${className}`;

  return (
    <div className={containerClass}>
      {label && (
        <label className={labelClass}>
          {label}
        </label>
      )}
      <div className='relative w-full'>
        {LeftIcon && (
          <LeftIcon className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
        )}

        {textarea ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={`w-full px-3 py-2 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-1 focus:ring-blue-400 ${
              LeftIcon ? "pl-9" : ""
            } ${RightIcon || isPassword ? "pr-9" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            {...props}
          />
        ) : type === "select" ? (
          <>
            <select
              name={name}
              value={value}
              onChange={onChange}
              disabled={disabled}
              className={`w-full rounded-lg bg-white/10 text-white focus:outline-none transition-all duration-300 appearance-none cursor-pointer ${
                isDeveloperProjects 
                  ? 'px-4 py-3 pr-8 border border-white/20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  : 'px-3 py-2 focus:ring-1 focus:ring-blue-400'
              } ${
                LeftIcon ? "pl-9" : ""
              } ${RightIcon ? "pr-9" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              style={isDeveloperProjects ? { colorScheme: 'dark' } : {}}
              {...props}
            >
              {!isDeveloperProjects && (
                <option value='' disabled>
                  {placeholder || "Select an option"}
                </option>
              )}
              {options.map((opt) => (
                <option 
                  className={isDeveloperProjects ? "bg-slate-800 text-white" : "bg-blue-900 text-white"} 
                  key={opt.value} 
                  value={opt.value}
                >
                  {opt.label}
                </option>
              ))}
            </select>
            {isDeveloperProjects && (
              <div className='absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none'>
                <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              </div>
            )}
          </>
        ) : (
          <input
            type={inputType}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full px-3 py-2 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-1 focus:ring-blue-400 ${
              LeftIcon ? "pl-9" : ""
            } ${RightIcon || isPassword ? "pr-9" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            {...props}
          />
        )}

        {/* Right Icon or Password Toggle */}
        {isPassword ? (
          <div
            className='absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center cursor-pointer text-gray-400'
            onClick={() => {
              if (showToggle && onToggle) {
                onToggle();
              } else {
                setInternalShowPassword(!internalShowPassword);
              }
            }}
          >
            {showPassword ? (
              <EyeOff className='w-5 h-5' />
            ) : (
              <Eye className='w-5 h-5' />
            )}
          </div>
        ) : (
          RightIcon && (
            <RightIcon className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
          )
        )}
      </div>
      {error && <span className='text-red-400 text-sm mt-1'>{error}</span>}
    </div>
  );
};

export default Input;
