'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

import { FlowButton } from '@/components/ui/flow-button';
import { VideoPortal } from '@/components/ui/video-portal';

export function HeroParallax() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current?.querySelector(
      '[data-parallax-layers]',
    );
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReducedMotion) return;

    if (triggerElement) {
      const mobileFactor = window.matchMedia('(max-width: 767px)').matches
        ? 0.5
        : 1;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: '0% 0%',
          end: '100% 0%',
          scrub: 0,
        },
      });

      const layers = [
        { layer: '1', yPercent: 70 * mobileFactor },
        { layer: '2', yPercent: 55 * mobileFactor },
        { layer: '3', yPercent: 40 * mobileFactor },
        { layer: '4', yPercent: 10 * mobileFactor },
      ];

      layers.forEach((layerObj, idx) => {
        tl.to(
          triggerElement.querySelectorAll(
            `[data-parallax-layer="${layerObj.layer}"]`,
          ),
          { yPercent: layerObj.yPercent, ease: 'none' },
          idx === 0 ? undefined : '<',
        );
      });
    }

    const lenis = new Lenis();
    lenis.on('scroll', () => ScrollTrigger.update());
    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      if (triggerElement) {
        gsap.killTweensOf(triggerElement);
      }
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="parallax" ref={parallaxRef}>
      <section
        id="inicio"
        className="parallax__header"
        aria-labelledby="hero-title"
      >
        <div className="parallax__visuals">
          <div data-parallax-layers className="parallax__layers">
            <div data-parallax-layer="1" className="hero-media">
              <VideoPortal />
              <span aria-hidden="true" className="hero-grain" />
            </div>

            <div
              aria-hidden="true"
              data-parallax-layer="2"
              className="hero-atmosphere"
            >
              <span className="hero-frame" />
              <span className="hero-orbit hero-orbit--large" />
              <span className="hero-orbit hero-orbit--small" />
              <span className="hero-stitch" />
              <span className="hero-seal">
                <span>feito com</span>
                <strong>cuidado</strong>
              </span>
            </div>

            <div data-parallax-layer="3" className="hero-title-layer">
              <p className="hero-kicker">Comida caseira feita com cuidado</p>
              <h1 id="hero-title" className="hero-title">
                <span>Delícias</span>
                <em>Rosicleia</em>
              </h1>
              <p className="hero-signature">
                Da cozinha para a sua mesa, do jeitinho que uma boa receita
                merece.
              </p>
            </div>

            <div data-parallax-layer="4" className="hero-action-layer">
              <div className="hero-copy">
                <span aria-hidden="true" />
                <p>
                  Conheça o cardápio e conclua seu pedido pelo canal oficial no
                  iFood.
                </p>
              </div>
              <FlowButton
                text="Ver cardápio no iFood"
                className="hero-cta shrink-0"
              />
            </div>

            <div aria-hidden="true" className="hero-scroll-cue">
              <span>descubra</span>
              <i />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
