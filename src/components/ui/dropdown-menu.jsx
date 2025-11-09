import React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils";

const DropdownContext = React.createContext(null);

export function DropdownMenu({ children }) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef(null);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    function handleClick(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerRef, menuRef }}>
      {children}
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({ asChild = false, children }) {
  const context = React.useContext(DropdownContext);
  if (!context) {
    throw new Error("DropdownMenuTrigger must be used within DropdownMenu");
  }
  const child = React.Children.only(children);
  const triggerProps = {
    ref: context.triggerRef,
    onClick: (event) => {
      event.preventDefault();
      context.setOpen((prev) => !prev);
      child.props.onClick?.(event);
    },
    "aria-haspopup": "menu",
    "aria-expanded": context.open
  };

  if (asChild) {
    return React.cloneElement(child, triggerProps);
  }

  return (
    <button type="button" {...triggerProps}>
      {child}
    </button>
  );
}

export function DropdownMenuContent({ align = "start", className, children }) {
  const context = React.useContext(DropdownContext);
  if (!context) {
    throw new Error("DropdownMenuContent must be used within DropdownMenu");
  }

  if (!context.open) return null;

  const [position, setPosition] = React.useState({ top: 0, left: 0, minWidth: 0 });

  React.useLayoutEffect(() => {
    const triggerEl = context.triggerRef.current;
    if (!triggerEl) return;
    const rect = triggerEl.getBoundingClientRect();
    const offset = 8;
    const left = align === "end" ? rect.right : rect.left;
    setPosition({
      top: rect.bottom + offset + window.scrollY,
      left: left + window.scrollX,
      minWidth: rect.width
    });
  }, [context.open, align]);

  const content = (
    <div
      ref={context.menuRef}
      className={cn(
        "z-50 min-w-[12rem] rounded-xl border border-gray-200 bg-white p-2 shadow-lg",
        align === "end" ? "origin-top-right" : "origin-top-left",
        className
      )}
      style={{
        position: "absolute",
        top: position.top,
        left: align === "end" ? position.left - (position.minWidth ?? 0) : position.left,
        minWidth: Math.max(192, position.minWidth)
      }}
    >
      {children}
    </div>
  );

  if (typeof document === "undefined") {
    return content;
  }

  return createPortal(content, document.body);
}

export function DropdownMenuItem({ className, onClick, children }) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-100",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator() {
  return <div className="my-2 h-px bg-gray-100" />;
}