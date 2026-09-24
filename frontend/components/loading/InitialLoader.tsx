"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface InitialLoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
}

export function InitialLoader({ isLoading, onComplete }: InitialLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading || !containerRef.current) {
      if (onComplete) onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete });

      tl.set(containerRef.current, { display: "flex" })
        .fromTo(
          logoRef.current,
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
        )
        .fromTo(
          textRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          progressRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.5, ease: "power2.inOut" },
          "-=0.3"
        );
    }, containerRef);

    return () => ctx.revert();
  }, [isLoading, onComplete]);

  if (!isLoading) return null;

  return (
    <div
      ref={containerRef}
      className="loading-overlay fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ backgroundColor: "var(--color-bg)" }}
      role="status"
      aria-label="Cargando aplicación"
      aria-live="polite"
    >
      <div
        ref={logoRef}
        className="flex flex-col items-center gap-4"
        aria-hidden="true"
      >
        <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--color-primary)" }}>
          <span className="text-2xl font-serif font-bold" style={{ color: "var(--color-text-inverse)" }}>R</span>
        </div>
        <div ref={textRef} className="text-center">
          <p className="font-serif text-xl font-medium" style={{ color: "var(--color-text)" }}>RutaIA</p>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>Tu guía inteligente de cursos</p>
        </div>
      </div>
      <div
        ref={progressRef}
        className="mt-8 w-64 h-1 rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--color-border)" }}
        aria-hidden="true"
      >
        <div
          className="w-full h-full rounded-full transform origin-left"
          style={{
            background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
            transformOrigin: "left center",
          }}
        />
      </div>
      <div className="sr-only" aria-live="polite">Cargando aplicación...</div>
    </div>
  );
}