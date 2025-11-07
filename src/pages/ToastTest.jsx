// src/pages/ToastTest.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function ToastTest() {
  const { toast } = useToast();

  // 🧹 Убираем любые оверлеи, мешающие кликам (Vercel Live Feedback, Wordtune и др.)
  React.useEffect(() => {
    const interval = setInterval(() => {
      const overlays = [
        document.querySelector("vercel-live-feedback"),
        document.querySelector("wordtune-read-toolbar"),
      ];
      overlays.forEach((el) => {
        if (el) {
          el.style.display = "none";
          el.style.pointerEvents = "none";
        }
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gray-50">
      <h1 className="text-2xl font-semibold text-gray-800">Toast test page</h1>

      <Button
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg"
        onClick={() =>
          toast({
            title: "✅ Success toast",
            description: "Everything is working perfectly!",
            duration: 4000,
          })
        }
      >
        🟢 Show success toast
      </Button>

      <Button
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg"
        onClick={() =>
          toast({
            title: "❌ Error toast",
            description: "Something went wrong.",
            variant: "destructive",
            duration: 4000,
          })
        }
      >
        🔴 Show error toast
      </Button>
    </div>
  );
}
