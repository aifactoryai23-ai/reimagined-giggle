import React from "react";
import { cn } from "@/utils";

// Основной контейнер карточки
export function Card({ className = "", children, ...props }) {
  return (
    <div
      className={cn("rounded-2xl border border-gray-200 bg-white shadow-sm", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Контент карточки (внутренняя часть)
export function CardContent({ className = "", children, ...props }) {
  return (
    <div className={cn("p-4", className)} {...props}>
      {children}
    </div>
  );
}

// Чтобы можно было импортировать и как default
export default Card;
