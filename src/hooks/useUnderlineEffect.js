import { useEffect } from "react";

export default function useUnderlineEffect() {
  useEffect(() => {
    const underlines = [...document.querySelectorAll(".underline--magical")];

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = "running";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.8 }
    );

    underlines.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
