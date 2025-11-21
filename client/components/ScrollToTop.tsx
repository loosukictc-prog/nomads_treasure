import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 250);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!visible) return null;

  return (
    <button
      aria-label="Scroll to top"
      onClick={scrollToTop}
      className="fixed right-4 bottom-6 z-50 inline-flex items-center justify-center h-12 w-12 rounded-full bg-earth-red text-white shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-earth-red"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
}
