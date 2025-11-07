import React from "react";
import { cn } from "@/utils";

export function Avatar({ className, children }) {
  return (
    <span className={cn("relative inline-flex h-10 w-10 overflow-hidden rounded-full bg-gray-100", className)}>
      {children}
    </span>
  );
}

export function AvatarFallback({ className, children }) {
  return (
    <span className={cn("flex h-full w-full items-center justify-center text-sm font-medium text-gray-600", className)}>
      {children}
    </span>
  );
}

export default Avatar;