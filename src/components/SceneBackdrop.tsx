"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { sceneAsset, type SceneId } from "@/content/products";
import type { FluidBackdropProps } from "./desktop/FluidBackdrop";

const DESKTOP_QUERY =
  "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

type Connection = EventTarget & { saveData?: boolean };
let webGL2Available: boolean | undefined;

function supportsWebGL2() {
  if (webGL2Available !== undefined) return webGL2Available;
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2", {
      powerPreference: "low-power",
      failIfMajorPerformanceCaveat: true,
    });
    webGL2Available = Boolean(context);
    context?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webGL2Available = false;
  }
  return webGL2Available;
}

/** A small shared client gate. It imports no desktop animation or GL libraries. */
export function useDesktopEligibility() {
  const [eligible, setEligible] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    const check = () => {
      const basic = media.matches
        && !connection?.saveData
        && document.visibilityState === "visible"
        && document.documentElement.dataset.motion !== "off";
      setEligible(basic && supportsWebGL2());
    };
    const preference = new MutationObserver(check);
    preference.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    check();
    media.addEventListener("change", check);
    connection?.addEventListener("change", check);
    document.addEventListener("visibilitychange", check);
    return () => {
      preference.disconnect();
      media.removeEventListener("change", check);
      connection?.removeEventListener("change", check);
      document.removeEventListener("visibilitychange", check);
    };
  }, []);
  return eligible;
}

export function scheduleDesktopIdle(callback: () => void) {
  if (typeof window.requestIdleCallback === "function") {
    const handle = window.requestIdleCallback(callback, { timeout: 1200 });
    return () => window.cancelIdleCallback(handle);
  }
  const handle = window.setTimeout(callback, 100);
  return () => window.clearTimeout(handle);
}

interface VisibleScene {
  score: number;
  select: (active: boolean) => void;
}

const visibleScenes = new Map<symbol, VisibleScene>();
let selectedScene: symbol | undefined;

function selectVisibleScene() {
  let best: symbol | undefined;
  let score = 0;
  visibleScenes.forEach((scene, key) => {
    if (scene.score > score) {
      score = scene.score;
      best = key;
    }
  });
  // A small hysteresis avoids replacing a canvas on every boundary pixel.
  const current = selectedScene ? visibleScenes.get(selectedScene) : undefined;
  if (current && current.score > 0 && current.score >= score - 0.08) {
    best = selectedScene;
  }
  selectedScene = best;
  visibleScenes.forEach((scene, key) => scene.select(key === best));
}

export interface SceneBackdropProps {
  scene: SceneId;
  transitionKey?: string;
  className?: string;
}

export default function SceneBackdrop({
  scene,
  transitionKey,
  className = "",
}: SceneBackdropProps) {
  const host = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const [token] = useState(() => Symbol("burcu-scene"));
  const eligible = useDesktopEligibility();
  const [active, setActive] = useState(false);
  const [Fluid, setFluid] = useState<ComponentType<FluidBackdropProps> | null>(null);
  const [decoded, setDecoded] = useState<{ scene: SceneId; url: string } | null>(null);

  useEffect(() => {
    const element = host.current;
    if (!eligible || !element) {
      setActive(false);
      return;
    }
    const record: VisibleScene = { score: 0, select: setActive };
    visibleScenes.set(token, record);
    const observer = new IntersectionObserver(
      ([entry]) => {
        record.score = entry?.isIntersecting
          ? entry.intersectionRect.height / Math.max(window.innerHeight, 1)
          : 0;
        selectVisibleScene();
      },
      { threshold: Array.from({ length: 21 }, (_, index) => index / 20) },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      visibleScenes.delete(token);
      if (selectedScene === token) selectedScene = undefined;
      selectVisibleScene();
    };
  }, [eligible, token]);

  useEffect(() => {
    const photo = image.current;
    if (!eligible || !active || !photo) return;
    let cancelled = false;
    let started = false;
    let cancelIdle: (() => void) | undefined;
    const expectedUrl = new URL(sceneAsset(scene), window.location.href).href;

    const enhance = () => {
      if (started || !photo.complete || !photo.naturalWidth || photo.currentSrc !== expectedUrl) return;
      started = true;
      cancelIdle = scheduleDesktopIdle(() => {
        void (async () => {
          try {
            await photo.decode();
            if (cancelled || photo.currentSrc !== expectedUrl) return;
            // This import lives after device, visibility and decoded-photo gates.
            const module = await import("./desktop/FluidBackdrop");
            if (cancelled) return;
            setDecoded({ scene, url: expectedUrl });
            setFluid(() => module.default);
          } catch {
            // The ordinary DOM photograph remains visible on every failure.
          }
        })();
      });
    };
    photo.addEventListener("load", enhance);
    enhance();
    return () => {
      cancelled = true;
      cancelIdle?.();
      photo.removeEventListener("load", enhance);
    };
  }, [active, eligible, scene]);

  return (
    <div
      ref={host}
      className={`scene-backdrop ${className}`.trim()}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}
    >
      <picture className="scene-picture">
        <source media="(min-width: 1024px)" srcSet={sceneAsset(scene)} type="image/webp" />
        <img
          ref={image}
          src={sceneAsset(scene, true)}
          alt=""
          width={1672}
          height={941}
          loading="lazy"
          decoding="async"
          draggable={false}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      </picture>
      {eligible && active && Fluid && decoded?.scene === scene && (
        <Fluid imageUrl={decoded.url} transitionKey={transitionKey ?? scene} />
      )}
    </div>
  );
}

