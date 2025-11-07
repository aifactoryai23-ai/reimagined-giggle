import React from "react";
import { cn } from "@/utils";

const TabsContext = React.createContext(null);

export function Tabs({ value, onValueChange, children, className }) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-gray-100 p-1",
        className
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ value, className, children, ...props }) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabsTrigger must be used within Tabs");
  }
  const isActive = context.value === value;
  return (
    <button
      type="button"
      onClick={() => context.onValueChange?.(value)}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium transition-colors",
        isActive ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-900",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Tabs;