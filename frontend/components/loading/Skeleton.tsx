"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "card" | "course" | "stat" | "table-row";
  lines?: number;
}

const skeletonStyle = `
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .skeleton-line, .skeleton-shape { animation: none !important; opacity: 0.5; }
}
`;

const baseStyle: React.CSSProperties = {
  background: "linear-gradient(90deg, var(--color-border) 25%, var(--color-bg-muted) 50%, var(--color-border) 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite linear",
  borderRadius: "var(--radius-sm)",
};

export function Skeleton({ className = "", variant = "text", lines = 1 }: SkeletonProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const trRef = useRef<HTMLTableRowElement>(null);
  const [styleInjected, setStyleInjected] = useState(false);

  const ref = variant === "table-row" ? trRef : divRef;

  useEffect(() => {
    if (!styleInjected) {
      const style = document.createElement("style");
      style.textContent = skeletonStyle;
      style.setAttribute("data-skeleton", "true");
      document.head.appendChild(style);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStyleInjected(true);
    }
  }, [styleInjected]);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const elements = ref.current?.querySelectorAll(".skeleton-line, .skeleton-shape");
      if (elements) {
        gsap.fromTo(
          elements,
          { opacity: 0.4 },
          {
            opacity: 1,
            duration: 1,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            stagger: 0.1,
          }
        );
      }
    }, ref);
    return () => ctx.revert();
  }, [ref]);

  switch (variant) {
    case "circular":
      return (
        <div ref={divRef} className={`skeleton-shape ${className}`} style={{ ...baseStyle, width: "48px", height: "48px", borderRadius: "50%" }} aria-hidden="true" />
      );
    case "rectangular":
      return (
        <div ref={divRef} className={`skeleton-shape ${className}`} style={{ ...baseStyle, width: "100%", height: "120px", borderRadius: "var(--radius-lg)" }} aria-hidden="true" />
      );
    case "card":
      return (
        <div ref={divRef} className={`skeleton-shape ${className}`} style={{ ...baseStyle, borderRadius: "var(--radius-lg)", padding: "1.5rem" }} aria-hidden="true">
          <div className="skeleton-line" style={{ ...baseStyle, height: "24px", width: "60%", marginBottom: "0.5rem" }} />
          <div className="skeleton-line" style={{ ...baseStyle, height: "16px", width: "40%", marginBottom: "1rem" }} />
          <div className="skeleton-line" style={{ ...baseStyle, height: "16px", width: "80%", marginBottom: "0.5rem" }} />
          <div className="skeleton-line" style={{ ...baseStyle, height: "16px", width: "60%" }} />
        </div>
      );
    case "course":
      return (
        <div ref={divRef} className={`skeleton-shape ${className}`} style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }} aria-hidden="true">
          <div className="skeleton-shape" style={{ ...baseStyle, height: "140px", width: "100%", borderRadius: 0 }} />
          <div style={{ padding: "1.25rem" }}>
            <div className="skeleton-line" style={{ ...baseStyle, height: "20px", width: "30%", marginBottom: "0.5rem" }} />
            <div className="skeleton-line" style={{ ...baseStyle, height: "24px", width: "70%", marginBottom: "0.75rem" }} />
            <div className="skeleton-line" style={{ ...baseStyle, height: "16px", width: "90%", marginBottom: "0.5rem" }} />
            <div className="skeleton-line" style={{ ...baseStyle, height: "16px", width: "60%", marginBottom: "1rem" }} />
            <div className="skeleton-line" style={{ ...baseStyle, height: "14px", width: "40%" }} />
          </div>
        </div>
      );
    case "stat":
      return (
        <div ref={divRef} className={`skeleton-shape ${className}`} style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }} aria-hidden="true">
          <div className="flex items-center gap-4">
            <div className="skeleton-shape" style={{ ...baseStyle, width: "48px", height: "48px", borderRadius: "var(--radius-lg)" }} />
            <div>
              <div className="skeleton-line" style={{ ...baseStyle, height: "32px", width: "80px", marginBottom: "0.25rem" }} />
              <div className="skeleton-line" style={{ ...baseStyle, height: "14px", width: "100px" }} />
            </div>
          </div>
        </div>
      );
    case "table-row":
      return (
        <tr ref={trRef} className={className} aria-hidden="true">
          <td className="py-3 px-4"><div className="skeleton-line" style={{ ...baseStyle, height: "16px", width: "80px" }} /></td>
          <td className="py-3 px-4"><div className="skeleton-line" style={{ ...baseStyle, height: "16px", width: "200px" }} /></td>
          <td className="py-3 px-4"><div className="skeleton-line" style={{ ...baseStyle, height: "20px", width: "80px", borderRadius: "var(--radius-full)" }} /></td>
          <td className="py-3 px-4"><div className="skeleton-line" style={{ ...baseStyle, height: "14px", width: "120px" }} /></td>
          <td className="py-3 px-4"><div className="skeleton-line" style={{ ...baseStyle, height: "16px", width: "60px" }} /></td>
        </tr>
      );
    default:
      return (
        <div ref={divRef} className={className} aria-hidden="true">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className="skeleton-line"
              style={{
                ...baseStyle,
                height: "1rem",
                width: i === lines - 1 ? "60%" : "100%",
                marginBottom: i < lines - 1 ? "0.5rem" : 0,
              }}
            />
          ))}
        </div>
      );
  }
}