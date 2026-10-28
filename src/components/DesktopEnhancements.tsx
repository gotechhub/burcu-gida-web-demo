"use client";

import { useEffect, useState, type ComponentType } from "react";
import type { Locale } from "@/content/copy";
import type { MotionDirectorProps } from "./desktop/MotionDirector";
import { scheduleDesktopIdle, useDesktopEligibility } from "./SceneBackdrop";

export default function DesktopEnhancements({ locale }: { locale: Locale }) {
  const eligible = useDesktopEligibility();
  const [Director, setDirector] = useState<ComponentType<MotionDirectorProps> | null>(null);

  useEffect(() => {
    if (!eligible) return;
    let cancelled = false;
    const cancelIdle = scheduleDesktopIdle(() => {
      void (async () => {
        try {
          const firstPhoto = document.querySelector<HTMLImageElement>("main picture img");
          if (firstPhoto?.complete && firstPhoto.naturalWidth) {
            await firstPhoto.decode().catch(() => undefined);
          }
          if (cancelled) return;
          const module = await import("./desktop/MotionDirector");
          if (!cancelled) setDirector(() => module.default);
        } catch {
          // Optional motion must never prevent rendering or native scrolling.
        }
      })();
    });
    return () => {
      cancelled = true;
      cancelIdle();
    };
  }, [eligible]);

  return eligible && Director ? <Director locale={locale} /> : null;
}

