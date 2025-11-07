import React from "react";
import { cn } from "@/utils";

const base = "relative w-full rounded-xl border p-4";

const variantClasses = {
  default: "border-gray-200 bg-white text-gray-700",
  destructive: "border-red-200 bg-red-50 text-red-700"
};

export function Alert({ className, variant = "default", ...props }) {
  return (
    <div
      role="status"
      className={cn(base, variantClasses[variant] ?? variantClasses.default, className)}
      {...props}
    />
  );
}

export function AlertDescription({ className, ...props }) {
  return <div className={cn("text-sm", className)} {...props} />;
}

export default Alert;