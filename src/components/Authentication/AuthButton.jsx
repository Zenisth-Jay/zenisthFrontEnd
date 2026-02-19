const AuthButton = ({ children, type = "button", disabled }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className="w-full bg-indigo-500 text-white px-4 py-2.5 sm:py-3 rounded-lg border border-indigo-400 font-medium text-base sm:text-[18px] my-3 cursor-pointer active:scale-[0.98] transition-all duration-200 ease-out hover:bg-indigo-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400/40 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
};

export default AuthButton;
