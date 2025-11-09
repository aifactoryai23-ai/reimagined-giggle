import React from "react";
import { cn } from "@/utils";

export function Skeleton({ className, ...props }) {
  return <div className={cn("animate-pulse rounded-lg bg-gray-200", className)} {...props} />;
}

export default Skeleton;
