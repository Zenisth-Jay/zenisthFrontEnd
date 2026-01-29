// const Logo = () => {
//   return (
//     <div className="flex items-center gap-2 mb-4">
//       {/* The SVG Icon */}
//       <img
//         src="/authentication/logo.svg"
//         alt="Zenisth AI Logo"
//         className="w-10 h-10 object-contain"
//       />

//       {/* The Text Group */}
//       <div className="flex items-baseline font-nunito tracking-tight">
//         <span className="text-[#4D4D4D] text-2xl font-light">Zenisth</span>
//         <span className="text-[#5A46C8] text-2xl font-light ml-1.5">AI</span>

//         <span className="text-[10px] self-start mt-1 ml-0.5 text-[#1A1A1A]">
//           ©
//         </span>
//       </div>
//     </div>
//   );
// };

// export default Logo;

const sizeMap = {
  sm: {
    icon: "w-6 h-6",
    text: "text-lg",
    gap: "gap-1.5",
  },

  nav: {
    icon: "w-8 h-8",
    text: "text-xl",
    gap: "gap-2",
  },

  md: {
    icon: "w-10 h-10",
    text: "text-2xl",
    gap: "gap-2",
  },
  lg: {
    icon: "w-14 h-14",
    text: "text-3xl",
    gap: "gap-3",
  },
};

const Logo = ({ size = "md" }) => {
  const styles = sizeMap[size];

  return (
    <div className={`flex items-center ${styles.gap}`}>
      {/* Icon */}
      <img
        src="/authentication/logo.svg"
        alt="Zenisth AI Logo"
        className={`${styles.icon} object-contain`}
      />

      {/* Text */}
      <div className="flex items-baseline font-nunito tracking-tight leading-none">
        <span className={`text-[#4D4D4D] ${styles.text} font-light`}>
          Zenisth
        </span>

        <span className={`text-[#5A46C8] ${styles.text} font-light ml-1.5`}>
          AI
        </span>

        <span className="text-[10px] self-start mt-1 ml-0.5 text-[#1A1A1A] leading-none">
          ©
        </span>
      </div>
    </div>
  );
};

export default Logo;
