const AuthButton = ({ children, type = "button" }) => {
  return (
    <button
      type={type}
      className=" w-full bg-indigo-500 text-white px-4 py-2.5 
      rounded-lg border border-[#CFD1DC] font-medium text-[18px] my-3
      cursor-pointer 
      active:scale-97 
      transition-all duration-200 ease-in-out 
      hover:bg-indigo-600 hover:shadow-md

      focus:outline-none
      focus:ring-2
      focus:ring-indigo-400/40
      "
    >
      {children}
    </button>
  );
};

export default AuthButton;
