import React from "react";
import { cn } from "@/utils";

const variants = {
  default: "bg-gray-900 text-white",
  secondary: "bg-gray-100 text-gray-800",
  outline: "border border-gray-200 text-gray-700"
};

export function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        variants[variant] ?? variants.default,
        className
      )}
      {...props}
    />
  );
}

export default Badge;