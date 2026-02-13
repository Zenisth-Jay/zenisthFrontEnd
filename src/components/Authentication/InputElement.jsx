import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const InputElement = ({
  label,
  name,
  type,
  register,
  placeholder,
  icon: Icon,
  rules = {},
  className = "",
}) => {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  const actualType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={name} className=" text-[#424242] text-[18px] font-medium">
        {label} <span className="text-red-500">*</span>
      </label>

      <div className="flex items-center relative">
        {/* Left Icon */}
        <div className=" absolute left-3 text-gray-400">
          {Icon && <Icon size={22} strokeWidth={2} />}
        </div>

        {/* Input */}
        <input
          {...register(name, rules)}
          id={name}
          type={actualType}
          placeholder={placeholder}
          className=" w-full border border-gray-300 pl-10 pr-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-gray-400 "
        />

        {/* Right Eye Toggle for Password */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff size={20} strokeWidth={2} />
            ) : (
              <Eye size={20} strokeWidth={2} />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputElement;
