import { useEffect } from "react";

export default function useHighlightEffectDelay(ref, delay = 300) {
  useEffect(() => {
    if (!ref?.current) return;

    const el = ref.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              el.classList.add("highlight-delayed-active");
            }, delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, delay]);
}
