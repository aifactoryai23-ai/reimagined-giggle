import { useEffect } from "react";

export default function useHighlightEffect() {
  useEffect(() => {
    const marks = document.querySelectorAll(".mark-animated");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = "running";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.8 }
    );

    marks.forEach((mark) => observer.observe(mark));

    return () => observer.disconnect();
  }, []);
}
