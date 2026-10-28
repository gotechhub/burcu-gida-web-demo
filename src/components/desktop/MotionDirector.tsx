"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";

export interface MotionDirectorProps {
  locale?: "tr" | "en" | "ar";
  routeKey?: string;
  smoothScroll?: boolean;
}

const DESKTOP_MOTION_QUERY =
  "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const INTERACTIVE = "a, button, input, select, textarea, [tabindex]";
const ARABIC_SCRIPT = /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff]/u;

type TrackTween = (tween: gsap.core.Tween) => gsap.core.Tween;

function revealSections(main: HTMLElement, arabic: boolean, track: TrackTween) {
  main.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
    // Parallax owns this element's transform; no reveal tween may compete.
    if (element.hasAttribute("data-parallax")) return;
    const bounds = element.getBoundingClientRect();
    const alreadyVisible = bounds.top < window.innerHeight && bounds.bottom > 0;
    const hasControls = element.matches(INTERACTIVE)
      || Boolean(element.querySelector(INTERACTIVE));
    const splitHeading = !arabic
      && !ARABIC_SCRIPT.test(element.textContent ?? "")
      && element.matches("h1, h2, h3, [data-reveal='text']")
      && !hasControls;

    // Editorial blocks arrive in a short sequence; controls remain visible and
    // usable throughout. Arabic text is always kept as complete shaped glyphs.
    const editorialLayers = [...element.children].filter((child): child is HTMLElement =>
      child instanceof HTMLElement && !child.matches(INTERACTIVE)
      && !child.querySelector(INTERACTIVE) && !child.hasAttribute("data-parallax"));
    if (!element.matches("h1, h2, h3") && editorialLayers.length > 1) {
      track(gsap.from(editorialLayers, {
        y: alreadyVisible ? 10 : 25,
        opacity: alreadyVisible ? 1 : 0,
        stagger: 0.11,
        duration: 0.78,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: alreadyVisible ? undefined : { trigger: element, start: "top 89%", once: true },
      }));
      return;
    }

    if (splitHeading) {
      SplitText.create(element, {
        type: "lines,words",
        autoSplit: true,
        aria: "auto",
        onSplit(split) {
          return track(gsap.from(split.words, {
            y: alreadyVisible ? 16 : 28,
            opacity: alreadyVisible ? 1 : 0,
            duration: 0.7,
            stagger: 0.035,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: alreadyVisible ? undefined : {
              trigger: element,
              start: "top 92%",
              once: true,
            },
          }));
        },
      });
      return;
    }

    track(gsap.from(element, {
      y: alreadyVisible ? 16 : 30,
      opacity: alreadyVisible || hasControls ? 1 : 0,
      duration: 0.7,
      ease: "power3.out",
      clearProps: "transform,opacity",
      scrollTrigger: alreadyVisible ? undefined : {
        trigger: element,
        start: "top 92%",
        once: true,
      },
    }));
  });
}

function parallaxSections(main: HTMLElement, track: TrackTween) {
  main.querySelectorAll<HTMLElement>("[data-parallax]").forEach((element) => {
    const value = element.dataset.parallax?.trim();
    const parsed = value ? Number(value) : Number.NaN;
    const amount = Number.isFinite(parsed)
      ? gsap.utils.clamp(-80, 80, parsed)
      : 28;
    if (amount === 0) return;
    track(gsap.fromTo(
      element,
      { y: -amount },
      {
        y: amount,
        ease: "none",
        scrollTrigger: {
          trigger: element.closest("section") ?? element,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.65,
          invalidateOnRefresh: true,
        },
      },
    ));
  });
}

function photographicTransitions(main: HTMLElement, track: TrackTween) {
  main.querySelectorAll<HTMLElement>("[data-media-reveal], .facility-small img, [data-facility-reveal]").forEach(element => {
    const bounds = element.getBoundingClientRect();
    if (bounds.top < window.innerHeight && bounds.bottom > 0) return;
    track(gsap.from(element, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 1.05,
      ease: "power3.inOut",
      clearProps: "clipPath",
      scrollTrigger: { trigger: element.closest("figure") ?? element, start: "top 88%", once: true },
    }));
  });

  // Only scene photographs drift. Packshots and their shadows retain physical
  // placement, and no section pins or captures page scrolling.
  main.querySelectorAll<HTMLElement>(".film-poster, [data-image-drift]").forEach(element => {
    if (element.hasAttribute("data-parallax")) return;
    track(gsap.fromTo(element, { yPercent: -2, scale: 1.06 }, {
      yPercent: 2,
      scale: 1.06,
      ease: "none",
      scrollTrigger: { trigger: element.closest("section") ?? element, start: "top bottom", end: "bottom top", scrub: 0.8, invalidateOnRefresh: true },
    }));
  });
}

/** Mount once, exclusively from the desktop eligibility-gated client loader. */
export default function MotionDirector({
  locale,
  routeKey,
  smoothScroll = true,
}: MotionDirectorProps = {}) {
  const pathname = usePathname();

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
    const media = gsap.matchMedia();

    media.add(DESKTOP_MOTION_QUERY, () => {
      const main = document.querySelector<HTMLElement>("main");
      if (!main) return;
      let disposed = false;
      let animations: gsap.Context | undefined;
      let refreshFrame = 0;
      let backgroundBlocked = false;
      const ownedTweens = new Set<gsap.core.Tween>();
      const pausedTweens = new Set<gsap.core.Tween>();
      const pausedTriggers = new Set<ScrollTrigger>();
      const arabic = locale === "ar"
        || document.documentElement.lang.startsWith("ar")
        || document.documentElement.dir === "rtl";
      const lenis = smoothScroll ? new Lenis({
        autoRaf: false,
        lerp: 0.09,
        smoothWheel: true,
        syncTouch: false,
        anchors: true,
        prevent: (node) => Boolean(node.closest(
          "[data-native-scroll], [data-lenis-prevent], dialog, [role='dialog']",
        )),
      }) : undefined;
      const updateScroll = () => ScrollTrigger.update();
      const tick = (seconds: number) => {
        if (document.visibilityState === "visible") lenis?.raf(seconds * 1000);
      };

      if (lenis) {
        lenis.on("scroll", updateScroll);
        gsap.ticker.lagSmoothing(0);
        gsap.ticker.add(tick);
      }

      const synchronizeMotion = () => {
        if (disposed) return;
        const blocked = document.visibilityState !== "visible"
          || Boolean(document.querySelector("dialog[open]"));
        if (lenis && blocked !== backgroundBlocked) {
          if (blocked) {
            gsap.ticker.remove(tick);
            lenis.stop();
          } else {
            lenis.start();
            gsap.ticker.add(tick);
          }
        }
        backgroundBlocked = blocked;
        if (blocked) {
          ownedTweens.forEach((tween) => {
            const trigger = tween.scrollTrigger;
            // A completed once-only reveal must not be re-enabled on close.
            const completedReveal = trigger?.vars.once && tween.progress() === 1;
            if (trigger && !completedReveal && !pausedTriggers.has(trigger)) {
              trigger.disable(false, false);
              pausedTriggers.add(trigger);
            }
            if (!tween.paused() && tween.progress() < 1) {
              tween.pause();
              pausedTweens.add(tween);
            }
          });
        } else {
          pausedTriggers.forEach((trigger) => trigger.enable(false, false));
          pausedTriggers.clear();
          pausedTweens.forEach((tween) => tween.resume());
          pausedTweens.clear();
        }
      };
      const track: TrackTween = (tween) => {
        ownedTweens.add(tween);
        synchronizeMotion();
        return tween;
      };
      const dialogObserver = new MutationObserver((records) => {
        const changed = records.some((record) => record.type === "attributes"
          ? record.target instanceof HTMLDialogElement
          : [...record.addedNodes, ...record.removedNodes].some((node) =>
            node instanceof Element && (node.matches("dialog") || Boolean(node.querySelector("dialog"))),
          ));
        if (changed) synchronizeMotion();
      });
      dialogObserver.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["open"],
      });
      document.addEventListener("visibilitychange", synchronizeMotion);
      synchronizeMotion();

      const refresh = () => {
        if (disposed || refreshFrame) return;
        refreshFrame = window.requestAnimationFrame(() => {
          refreshFrame = 0;
          if (!disposed) {
            lenis?.resize();
            ScrollTrigger.refresh();
          }
        });
      };
      main.addEventListener("load", refresh, true);

      const createAnimations = () => {
        if (disposed) return;
        // This explicit context also covers async document.fonts.ready setup.
        animations = gsap.context(() => {
          revealSections(main, arabic, track);
          parallaxSections(main, track);
          photographicTransitions(main, track);
        }, main);
        refresh();
      };
      void document.fonts.ready.then(createAnimations, createAnimations);

      return () => {
        disposed = true;
        if (refreshFrame) window.cancelAnimationFrame(refreshFrame);
        main.removeEventListener("load", refresh, true);
        document.removeEventListener("visibilitychange", synchronizeMotion);
        dialogObserver.disconnect();
        animations?.revert();
        ownedTweens.clear();
        pausedTweens.clear();
        pausedTriggers.clear();
        if (lenis) {
          gsap.ticker.remove(tick);
          lenis.off("scroll", updateScroll);
          lenis.destroy();
          // This is the only global smooth-scroll owner; restore GSAP defaults.
          gsap.ticker.lagSmoothing(500, 33);
        }
      };
    });

    return () => media.revert();
  }, { dependencies: [locale, pathname, routeKey, smoothScroll], revertOnUpdate: true });

  return null;
}
