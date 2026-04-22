import React from "react";
import clsx from "clsx";

export const Pill = ({ children, className }) => {
  return (
    <div
      className={clsx(
        "inline-flex items-center gap-2 px-5 py-1.5 rounded-full font-medium border",
        className,
      )}
    >
      {children}
    </div>
  );
};
