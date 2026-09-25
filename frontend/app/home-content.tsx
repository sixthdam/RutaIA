"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Zap, Shield, Users } from "lucide-react";


export default function HomePageContent() {
  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        heroRef.current?.querySelectorAll(".hero__content > *") ?? [],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
      );

      if (featuresRef.current) {
        gsap.fromTo(
          featuresRef.current.querySelectorAll(".feature") ?? [],
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: featuresRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      if (stepsRef.current) {
        gsap.fromTo(
          stepsRef.current.querySelectorAll(".step") ?? [],
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: stepsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      return () => {
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    }, [heroRef, featuresRef, stepsRef]);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: <Zap className="w-5 h-5" aria-hidden="true" />,
      title: "Recomendaciones IA",
      desc: "Algoritmos avanzados analizan tu perfil y consulta en lenguaje natural",
    },
    {
      icon: <Shield className="w-5 h-5" aria-hidden="true" />,
      title: "Fuentes verificadas",
      desc: "Cada recomendación incluye sus fuentes con nivel de similitud calculado",
    },
    {
      icon: <Users className="w-5 h-5" aria-hidden="true" />,
      title: "Perfil personalizado",
      desc: "Adaptamos resultados a tu experiencia, área de interés y objetivos",
    },
  ];

  const steps = [
    { number: 1, title: "Regístrate", desc: "Crea tu cuenta indicando tu nivel de experiencia y área de interés" },
    { number: 2, title: "Haz tu consulta", desc: "Escribe en lenguaje natural qué tipo de curso buscas" },
    { number: 3, title: "Recibe recomendaciones", desc: "Obtén cursos sugeridos con fuentes y nivel de similitud" },
    { number: 4, title: "Califica y mejora", desc: "Valora las recomendaciones para afinar futuras sugerencias" },
  ];

  return (
    <>
      <section ref={heroRef} className="hero" aria-labelledby="hero-title">
        <div className="container">
          <div className="hero__content">
            <h1 id="hero-title" className="hero__title">
              Tu guía inteligente para elegir cursos
            </h1>
            <p className="hero__subtitle">
              RutaIA analiza tus intereses y experiencia para recomendarte los mejores cursos
              adaptados a tu perfil. Haz una consulta en lenguaje natural y recibe recomendaciones
              personalizadas con fuentes verificadas.
            </p>
            <div className="hero__actions">
              <Link href="/register" className="btn btn--primary btn--lg flex items-center gap-2">
                Comenzar ahora
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link href="/catalog" className="btn btn--outline btn--lg">
                Explorar catálogo
              </Link>
            </div>
          </div>
          <div ref={featuresRef} className="hero__features" role="list" aria-label="Características principales">
            {features.map((feature, index) => (
              <article key={index} className="feature" role="listitem">
                <div className="feature__icon" aria-hidden="true">
                  {feature.icon}
                </div>
                <h3 className="feature__title">{feature.title}</h3>
                <p className="feature__desc">{feature.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section ref={stepsRef} className="section--how" aria-labelledby="how-title">
        <div className="container">
          <h2 id="how-title" className="section__title">¿Cómo funciona?</h2>
          <ol className="steps" role="list">
            {steps.map((step) => (
              <li key={step.number} className="step">
                <span className="step__number" aria-hidden="true">{step.number}</span>
                <div className="step__content">
                  <h3 className="step__title">{step.title}</h3>
                  <p className="step__desc">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-20 bg-[var(--color-bg-alt)]" aria-labelledby="cta-title">
        <div className="container text-center">
          <h2 id="cta-title" className="section__title">¿Listo para encontrar tu curso ideal?</h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-8">
            Únete a miles de estudiantes que ya han encontrado su ruta de aprendizaje perfecta con RutaIA.
          </p>
          <Link href="/register" className="btn btn--primary btn--lg inline-flex items-center gap-2">
            Crear cuenta gratis
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}