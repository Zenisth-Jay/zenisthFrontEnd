const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none";

  const variants = {
    primary:
      "bg-indigo-600 border border-indigo-300 text-white hover:bg-indigo-700 active:bg-indigo-800 cursor-pointer",
    outline:
      "border border-gray-600 text-gray-600 hover:bg-gray-300 font-bold cursor-pointer",
    disable:
      "bg-gray-200 text-gray-400 border border-gray-200 cursor-not-allowed",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? " opacity-50 cursor-not-allowed" : ""} ${className}`}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;
