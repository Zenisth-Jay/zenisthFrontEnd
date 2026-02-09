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
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={name} className=" text-[#424242] text-[18px] font-medium">
        {label} <span className="text-red-500">*</span>
      </label>

      <div className="flex items-center relative">
        <div className=" absolute left-3 text-gray-400">
          {Icon && <Icon size={22} strokeWidth={2} />}
        </div>

        <input
          {...register(name, rules)}
          id={name}
          type={type}
          placeholder={placeholder}
          className=" w-full border border-gray-300 pl-10 pr-3 py-3 rounded-lg  focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-gray-400 "
        />
      </div>
    </div>
  );
};

export default InputElement;
