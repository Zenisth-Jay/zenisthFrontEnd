import { Languages } from "lucide-react";

const TranslatingAnimation = () => {
  return (
    <div className="relative flex items-center justify-center w-44 h-44">
      {/* Outer ping ring */}
      <div className="absolute w-36 h-36 rounded-full bg-indigo-200/60 animate-ping" />

      {/* Middle pulse ring */}
      <div className="absolute w-36 h-36 rounded-full bg-indigo-300/60 animate-pulse" />

      {/* Rotating border ring */}
      <div
        style={{ animation: "spin 3s linear infinite" }}
        className="absolute w-28 h-28 rounded-full border-4 border-indigo-400 border-t-transparent animate-spin"
      />

      {/* Center circle */}
      <div className="relative w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg">
        <Languages className="text-white" size={32} />
      </div>
    </div>
  );
};

export default TranslatingAnimation;
