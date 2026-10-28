"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import type { Locale, SiteCopy } from "@/content/copy";
import { families, products, productHref, type Product } from "@/content/products";
import SceneBackdrop from "./SceneBackdrop";
import ProductImage from "./ProductImage";

interface Drag {
  pointerId: number;
  x: number;
  y: number;
  intent: "pending" | "horizontal" | "vertical";
}

const CONTROLS = "a, button, input, select, textarea, [role='tab']";
const INITIAL_FAMILY_INDEX = Math.max(0, families.findIndex((item) => item.id === "paste"));

function Arrow({ direction, rtl }: { direction: "previous" | "next"; rtl: boolean }) {
  const pointsRight = (direction === "next") !== rtl;
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" width="32" height="32" fill="none">
      <path
        d="M5 16h22m-9-9 9 9-9 9"
        stroke="currentColor"
        strokeWidth="1.7"
        transform={pointsRight ? undefined : "rotate(180 16 16)"}
      />
    </svg>
  );
}

export default function ProductStudio({ locale, text }: { locale: Locale; text: SiteCopy }) {
  const t = text;
  const rtl = locale === "ar";
  const [familyIndex, setFamilyIndex] = useState(INITIAL_FAMILY_INDEX);
  const currentFamilyIndex = useRef(familyIndex);
  const [skuIndex, setSkuIndex] = useState(0);
  const [packRevealed, setPackRevealed] = useState(false);
  const worldSection = useRef<HTMLElement>(null);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<Drag | null>(null);
  const tabButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const family = families[familyIndex];
  const familyProducts = family.products
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));
  const product = familyProducts[skuIndex] ?? familyProducts[0];
  const familyCopy = t.families[family.id];
  const number = String(familyIndex + 1).padStart(2, "0");
  const total = String(families.length).padStart(2, "0");

  useEffect(() => {
    const section = worldSection.current;
    if (!section) return;
    if (typeof IntersectionObserver === "undefined") {
      setPackRevealed(true);
      return;
    }
    let disposed = false;
    const observer = new IntersectionObserver(([entry]) => {
      // An edge-only intersection may report isIntersecting with zero area.
      if (disposed || !entry?.isIntersecting || entry.intersectionRatio <= 0) return;
      setPackRevealed(true);
      observer.disconnect();
    }, { threshold: [0, 0.001] });
    observer.observe(section);
    return () => {
      disposed = true;
      observer.disconnect();
    };
  }, []);

  const applyFamily = useCallback((index: number, persist = true) => {
    const next = (index + families.length) % families.length;
    currentFamilyIndex.current = next;
    setFamilyIndex(next);
    setSkuIndex(0);
    if (persist) {
      const url = new URL(window.location.href);
      url.searchParams.set("family", families[next].id);
      window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
    }
  }, []);

  useEffect(() => {
    const readFamily = () => {
      const requested = new URLSearchParams(window.location.search).get("family");
      const index = families.findIndex((item) => item.id === requested);
      applyFamily(index >= 0 ? index : INITIAL_FAMILY_INDEX, false);
    };
    const familyEvent = (event: Event) => {
      const requested = (event as CustomEvent<unknown>).detail;
      if (typeof requested !== "string") return;
      const index = families.findIndex((item) => item.id === requested);
      if (index >= 0) applyFamily(index);
    };
    readFamily();
    window.addEventListener("burcu:family", familyEvent);
    window.addEventListener("popstate", readFamily);
    return () => {
      window.removeEventListener("burcu:family", familyEvent);
      window.removeEventListener("popstate", readFamily);
    };
  }, [applyFamily]);

  const selectFamily = (index: number, focus = false) => {
    const next = (index + families.length) % families.length;
    applyFamily(next);
    if (focus) {
      const button = tabButtons.current[next];
      button?.focus({ preventScroll: true });
      button?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  };
  const navigate = (delta: number) => {
    applyFamily(currentFamilyIndex.current + delta);
  };

  const tabKeyboard = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number | undefined;
    if (event.key === "ArrowRight") next = index + (rtl ? -1 : 1);
    if (event.key === "ArrowLeft") next = index + (rtl ? 1 : -1);
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = families.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectFamily(next, true);
  };
  const panelKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const delta = event.key === "ArrowRight" ? 1 : -1;
      navigate(rtl ? -delta : delta);
    }
  };

  const resetDrag = (element: HTMLDivElement) => {
    const previous = drag.current;
    drag.current = null;
    element.style.setProperty("--studio-drag", "0px");
    setDragging(false);
    if (previous && element.hasPointerCapture(previous.pointerId)) {
      element.releasePointerCapture(previous.pointerId);
    }
  };
  const pointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    if ((event.target as Element).closest(CONTROLS)) return;
    drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, intent: "pending" };
  };
  const pointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = drag.current;
    if (!gesture || gesture.pointerId !== event.pointerId || gesture.intent === "vertical") return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (gesture.intent === "pending") {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 10) return;
      if (Math.abs(dy) > Math.abs(dx) * 1.15) {
        gesture.intent = "vertical";
        return;
      }
      if (Math.abs(dx) <= Math.abs(dy) * 1.35) return;
      gesture.intent = "horizontal";
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    event.preventDefault();
    event.currentTarget.style.setProperty("--studio-drag", `${Math.max(-70, Math.min(70, dx * 0.25))}px`);
  };
  const pointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = drag.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    const threshold = Math.max(40, Math.min(90, event.currentTarget.clientWidth * 0.13));
    const horizontal = gesture.intent === "horizontal"
      && Math.abs(dx) >= threshold
      && Math.abs(dx) > Math.abs(dy) * 1.35;
    resetDrag(event.currentTarget);
    if (horizontal) navigate((dx < 0 ? 1 : -1) * (rtl ? -1 : 1));
  };

  if (!product) return null;

  return (
    <section
      ref={worldSection}
      id="world"
      className={`product-studio ${family.light || product.id === 'P05' ? "is-light" : "is-dark"}`}
      aria-labelledby="product-studio-title"
      data-fluid-scene=""
      style={{ "--studio-accent": family.accent } as CSSProperties}
    >
      <SceneBackdrop scene={product.scene} transitionKey={product.id} />
      <header className="studio-heading" data-reveal="">
        <p className="eyebrow">{t.home.familyEyebrow}</p>
        <h2 id="product-studio-title">
          {t.home.familyTitle.map((line) => <span className="title-line" key={line}>{line}</span>)}
        </h2>
        <p>{t.home.familyLead}</p>
      </header>

      <div className="studio-family-tabs" role="tablist" aria-label={t.ui.chooseFamily} data-native-scroll="">
        {families.map((item, index) => (
          <button
            key={item.id}
            ref={(element) => { tabButtons.current[index] = element; }}
            id={`studio-tab-${item.id}`}
            className={`studio-family-tab ${index === familyIndex ? "is-active" : ""}`}
            type="button"
            role="tab"
            aria-selected={index === familyIndex}
            aria-controls="studio-scene-panel"
            tabIndex={index === familyIndex ? 0 : -1}
            onClick={() => selectFamily(index)}
            onKeyDown={(event) => tabKeyboard(event, index)}
          >
            {t.families[item.id].title}
          </button>
        ))}
      </div>

      <div
        id="studio-scene-panel"
        className={`studio-viewport ${dragging ? "is-dragging" : ""}`}
        role="tabpanel"
        aria-labelledby={`studio-tab-${family.id}`}
        tabIndex={0}
        style={{ touchAction: "pan-y" }}
        onKeyDown={panelKeyboard}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={(event) => resetDrag(event.currentTarget)}
        onLostPointerCapture={(event) => resetDrag(event.currentTarget)}
        onPointerLeave={(event) => {
          if (drag.current?.intent === "pending" || drag.current?.intent === "vertical") resetDrag(event.currentTarget);
        }}
      >
        <div className="studio-scene is-entering" data-product-id={product.id}>
          <div className="studio-liquid-wipe" key={`wipe-${product.id}`} aria-hidden="true" />
          <div className="studio-word" key={`word-${family.id}`} aria-hidden="true">{familyCopy.word}</div>
          <div className="studio-pack-position" key={`pack-${product.id}`}>
            {packRevealed && <ProductImage
              product={product}
              sizes="(max-width: 1023px) 58vw, (min-width: 1678px) 520px, 31vw"
              className="studio-pack"
              alt={t.productNames[product.id]}
              width={1024}
              height={1024}
              loading="lazy"
              decoding="async"
              draggable={false}
              onDragStart={(event) => event.preventDefault()}
            />}
            <noscript>
              <ProductImage
                product={product}
                sizes="(max-width: 1023px) 58vw, (min-width: 1678px) 520px, 31vw"
                className="studio-pack"
                alt={t.productNames[product.id]}
                width={1024}
                height={1024}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </noscript>
          </div>
          <div className="studio-description">
            <p className="studio-index" aria-hidden="true"><bdi dir="ltr">{number} / {total}</bdi></p>
            <h3 className="studio-family-name">{familyCopy.title}</h3>
            <p>{familyCopy.lead}</p>
            <p className="studio-product-name">
              {t.productNames[product.id]} <bdi dir="ltr">{product.grams} g</bdi>
            </p>
            {familyProducts.length > 1 && (
              <div className="studio-sku-tabs" role="group" aria-label={t.nav.products} data-native-scroll="">
                {familyProducts.map((item, index) => (
                  <button
                    className={`studio-sku-tab ${index === skuIndex ? "is-active" : ""}`}
                    type="button"
                    key={item.id}
                    aria-pressed={item.id === product.id}
                    onClick={() => setSkuIndex(index)}
                  >
                    {t.productNames[item.id]}
                  </button>
                ))}
              </div>
            )}
            {product.preview ? (
              <Link className="studio-cta button" href={productHref(locale, product)} prefetch={false}>
                {t.ui.viewProduct}<Arrow direction="next" rtl={rtl} />
              </Link>
            ) : (
              <>
                <button
                  className="studio-cta button"
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("burcu:detail", { detail: product.id }))}
                >
                  {t.ui.viewProduct}<Arrow direction="next" rtl={rtl} />
                </button>
                <p className="studio-preview-note">{t.ui.detailSoon}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="studio-controls">
        <button type="button" className="studio-arrow" aria-label={t.ui.previous} onClick={() => navigate(-1)}>
          <Arrow direction="previous" rtl={rtl} />
        </button>
        <span className="studio-counter" aria-hidden="true"><bdi dir="ltr">{number} / {total}</bdi></span>
        <button type="button" className="studio-arrow" aria-label={t.ui.next} onClick={() => navigate(1)}>
          <Arrow direction="next" rtl={rtl} />
        </button>
      </div>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {familyCopy.title} — {t.productNames[product.id]} <bdi dir="ltr">{product.grams} g</bdi>
      </p>
    </section>
  );
}
