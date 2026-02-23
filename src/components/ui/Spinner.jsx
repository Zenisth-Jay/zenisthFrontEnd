// export default function Spinner({ size = 40 }) {
//   return (
//     <div
//       className="border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"
//       style={{ width: size, height: size }}
//     />
//   );
// }

// components/ui/Spinner.jsx
const Spinner = ({ size = 36, className = "" }) => {
  return (
    <div
      className={`animate-spin rounded-full border-4 border-gray-200 border-t-indigo-500 ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default Spinner;
