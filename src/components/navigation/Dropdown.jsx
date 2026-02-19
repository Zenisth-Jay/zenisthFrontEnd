import { useEffect, useRef, useState } from "react";

const Dropdown = ({ trigger, children, inPanel = false }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen((p) => !p)}>{trigger(open)}</div>

      {open && (
        <div
          className={
            inPanel
              ? "absolute right-0 top-full left-0 w-full mt-2 bg-white rounded-xl shadow-lg z-50"
              : "absolute right-0 top-full mt-2 w-54 bg-white rounded-xl shadow-lg z-50"
          }
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
