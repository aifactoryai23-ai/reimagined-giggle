import React from "react";
import { cn } from "@/utils";

// Базовые стили — без изменений
const baseStyles =
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:pointer-events-none";

// ✳️ ДОБАВЛЕНО: новый вариант "cta"
const variants = {
  default: "bg-gray-900 text-white hover:bg-gray-800 focus-visible:outline-gray-900",
  outline: "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50",
  ghost: "text-gray-600 hover:bg-gray-100",
  destructive: "bg-red-500 text-white hover:bg-red-600 focus-visible:outline-red-500",

  // 🟦 НОВЫЙ CTA ВАРИАНТ (градиент при hover)
  cta: "bg-white text-blue-600 shadow-md transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500",
};

// Размеры — без изменений
const sizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3 text-sm",
  lg: "h-12 px-6 text-lg",
  icon: "h-10 w-10",
};

// Компонент — без структурных изменений, просто поддерживает новый variant="cta"
export const Button = React.forwardRef(function Button(
  { className, variant = "default", size = "default", type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        baseStyles,
        variants[variant] ?? variants.default, // теперь вариант "cta" будет корректно работать
        sizes[size] ?? sizes.default,
        className
      )}
      {...props}
    />
  );
});

export default Button;

