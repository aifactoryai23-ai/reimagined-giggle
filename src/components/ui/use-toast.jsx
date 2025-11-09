// src/components/ui/use-toast.jsx
import * as React from "react";
import { toast as sonnerToast } from "sonner";

export function useToast() {
  const toast = React.useCallback(
    ({ title, description, variant = "default", duration = 5000 }) => {
      if (variant === "destructive") {
        sonnerToast.error(title || "Error", {
          description,
          duration,
        });
      } else {
        sonnerToast(title || "Notification", {
          description,
          duration,
        });
      }
    },
    []
  );

  return { toast };
}
