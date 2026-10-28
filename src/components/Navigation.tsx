"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import type { Locale, SiteCopy } from "../content/copy";
import type { NavigationCopy, NavigationPageKey } from "../content/navigation-copy";
import { families, locales, products, productHref, type FamilyId } from "../content/products";

import ProductImage from "./ProductImage";
import MotionPreference from "./MotionPreference";

const LOGO = "/assets/brand/burcu-logo.webp";
const STORE = "https://fabrikasatisreyonu.com/";
const LANGUAGE_NAMES = { tr: "Türkçe", en: "English", ar: "العربية" } as const;
const FUTURE_LANGUAGES = [{ code: "DE", name: "Deutsch" }, { code: "FR", name: "Français" }, { code: "ES", name: "Español" }] as const;
type MegaMode = "corporate" | "products" | "media";
type PageKey = NavigationPageKey;
type NavigationProps = { locale: Locale; text: SiteCopy; nav: NavigationCopy };
const CORPORATE_PAGES: PageKey[] = ["about", "facilities", "quality", "food-safety", "certificates", "careers", "corporate-sales", "global"];
const LEGAL_PAGES: PageKey[] = ["sitemap", "privacy", "kvkk", "cookies"];

function ArrowIcon() { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="nav-arrow"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function CloseIcon() { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="nav-close-icon"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>; }
function ExternalIcon() { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="nav-external-icon"><path d="M14 5h5v5m0-5-9 9M9 5H5v14h14v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function pageHref(locale: Locale, page: PageKey) { return `/${locale}/${page}/`; }
function familyHref(locale: Locale, family: FamilyId) { return `/${locale}/products/family/${family}/`; }
function localeHref(pathname: string | null, locale: Locale) {
  const segments = (pathname ?? "").split("/").filter(Boolean);
  if (locales.includes(segments[0] as Locale)) segments[0] = locale;
  else return `/${locale}/`;
  return `/${segments.join("/")}/`;
}
function LanguageLinks({ locale, text, pathname, className, onNavigate }: { locale: Locale; text: SiteCopy; pathname: string | null; className: string; onNavigate?: () => void }) {
  return <nav className={className} aria-label={text.nav.language}>
    {locales.map(language => <Link key={language} href={localeHref(pathname, language)} prefetch={false} lang={language} hrefLang={language} aria-label={LANGUAGE_NAMES[language]} aria-current={locale === language ? "page" : undefined} onClick={onNavigate} className="nav-language-link" dir="ltr">{language.toUpperCase()}</Link>)}
    {FUTURE_LANGUAGES.map(language => <span key={language.code} className="nav-language-locked" aria-disabled="true" aria-label={`${language.name} — ${text.nav.soon}`} title={text.nav.soon} dir="ltr">{language.code}<span className="nav-language-status">{text.nav.soon}</span></span>)}
  </nav>;
}
function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>) {
  if (event.target !== event.currentTarget) return;
  const bounds = event.currentTarget.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
}

export function Header({ locale, text, nav }: NavigationProps) {
  const pathname = usePathname(); const id = useId();
  const desktopId = `nav-mega-${id}`; const mobileId = `nav-mobile-${id}`;
  const desktopDialog = useRef<HTMLDialogElement>(null); const mobileDialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null); const restoreFocus = useRef(true);
  const [menu, setMenu] = useState<"desktop" | "mobile" | null>(null);
  const [mode, setMode] = useState<MegaMode>("corporate"); const [activeFamily, setActiveFamily] = useState<FamilyId>("paste");
  const selectedFamily = families.find(family => family.id === activeFamily)!;
  const selectedProduct = products.find(product => product.id === selectedFamily.products[0])!;
  function openMenu(next: "desktop" | "mobile", nextMode: MegaMode = "corporate") {
    if (!menu) returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    restoreFocus.current = true; setMode(nextMode); setMenu(next);
  }
  function closeMenu(restore = true) { restoreFocus.current = restore; desktopDialog.current?.close(); mobileDialog.current?.close(); }
  function handleClosed() {
    setMenu(null);
    if (restoreFocus.current) window.requestAnimationFrame(() => { const trigger = returnFocus.current; if (trigger?.isConnected && !document.querySelector("dialog[open]")) trigger.focus({ preventScroll: true }); });
  }
  function openFilm() {
    closeMenu(false);
    window.requestAnimationFrame(() => {
      // The new dialog must return focus to a surviving header control.
      if (returnFocus.current?.isConnected) returnFocus.current.focus({ preventScroll: true });
      window.dispatchEvent(new Event("burcu:film"));
    });
  }
  useEffect(() => { const dialog = menu === "desktop" ? desktopDialog.current : menu === "mobile" ? mobileDialog.current : null; if (dialog && !dialog.open) dialog.showModal(); }, [menu]);
  useEffect(() => { desktopDialog.current?.close(); mobileDialog.current?.close(); }, [pathname]);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const onChange = () => { if (media.matches) mobileDialog.current?.close(); else desktopDialog.current?.close(); };
    media.addEventListener("change", onChange); return () => media.removeEventListener("change", onChange);
  }, []);
  const modeTitle = nav[mode]; const modeLead = mode === "corporate" ? nav.corporateLead : mode === "media" ? nav.mediaLead : nav.familyLead;
  return <header className="nav-header nav-upgraded" dir={locale === "ar" ? "rtl" : "ltr"}>
    <div className="nav-bar">
      <Link href={`/${locale}/`} prefetch={false} className="nav-logo" aria-label={text.nav.home}><img src={LOGO} alt="Burcu" width="158" height="70" /></Link>
      <nav className="nav-desktop" aria-label={text.nav.menu}>
        {(["corporate", "products", "media"] as const).map(item => <button key={item} type="button" className="nav-link nav-mega-trigger" aria-haspopup="dialog" aria-expanded={menu === "desktop" && mode === item} aria-controls={desktopId} onClick={() => openMenu("desktop", item)}>{nav[item]}<span aria-hidden="true" className="nav-plus">+</span></button>)}
        <Link href={pageHref(locale, "facilities")} prefetch={false} className="nav-link nav-facilities-link">{nav.pages.facilities}</Link>
        <a href={STORE} className="nav-link nav-store" target="_blank" rel="noopener noreferrer">{nav.store}<ExternalIcon /></a>
        <Link href={pageHref(locale, "contact")} prefetch={false} className="nav-link nav-contact-direct">{nav.contact}</Link>
      </nav>
      <div className="nav-actions"><LanguageLinks locale={locale} text={text} pathname={pathname} className="nav-languages nav-languages-desktop" /><button type="button" className="nav-mobile-trigger" aria-haspopup="dialog" aria-expanded={menu === "mobile"} aria-controls={mobileId} onClick={() => openMenu("mobile")}><span>{text.nav.menu}</span><svg viewBox="0 0 26 18" fill="none" aria-hidden="true"><path d="M1 1h24M1 9h24M1 17h24" stroke="currentColor" strokeWidth="1.5" /></svg></button></div>
    </div>
    <dialog ref={desktopDialog} id={desktopId} className="nav-mega-menu" aria-labelledby={`${desktopId}-title`} onClick={closeOnBackdrop} onClose={handleClosed} data-lenis-prevent="true">
      {menu === "desktop" && <div className={`nav-mega-content nav-mode-${mode}`}>
        <div className="nav-panel-top"><h2 id={`${desktopId}-title`} className="nav-panel-label">{modeTitle}</h2><nav className="nav-mode-switch" aria-label={text.nav.menu}>{(["corporate", "products", "media"] as const).map(item => <button key={item} type="button" className={mode === item ? "is-active" : undefined} aria-pressed={mode === item} onClick={() => setMode(item)}>{nav[item]}</button>)}</nav><button type="button" className="nav-close" aria-label={text.nav.close} onClick={() => closeMenu()}><CloseIcon /></button></div>
        <div className="nav-mega-layout">
          {mode === "products" ? <>
            <nav className="nav-family-list" aria-label={text.ui.chooseFamily}>{families.map((family, index) => <Link key={family.id} href={familyHref(locale, family.id)} prefetch={false} className={`nav-family-link${activeFamily === family.id ? " is-active" : ""}`} onMouseEnter={() => setActiveFamily(family.id)} onFocus={() => setActiveFamily(family.id)} onClick={() => closeMenu(false)}><span className="nav-family-number" aria-hidden="true" dir="ltr">0{index + 1}</span><span>{text.families[family.id].title}</span><ArrowIcon /></Link>)}</nav>
            <div className="nav-product-preview" style={{ backgroundColor: selectedFamily.accent }} data-light={selectedFamily.light}><span className="nav-product-word" aria-hidden="true">{text.families[activeFamily].word}</span><ProductImage key={selectedProduct.id} product={selectedProduct} sizes="220px" alt={text.productNames[selectedProduct.id]} width="340" height="460" className="nav-product-image" /><div className="nav-product-caption"><p>{text.productNames[selectedProduct.id]}</p><span dir="ltr">{selectedProduct.grams} g</span><Link href={productHref(locale, selectedProduct)} prefetch={false} onClick={() => closeMenu(false)} className="nav-preview-link">{text.ui.viewProduct}<ArrowIcon /></Link></div></div>
          </> : mode === "corporate" ? <>
            <nav className="nav-corporate-list" aria-label={nav.corporate}>{CORPORATE_PAGES.map((page, index) => <Link key={page} href={pageHref(locale, page)} prefetch={false} onClick={() => closeMenu(false)}><span className="nav-family-number" aria-hidden="true" dir="ltr">{String(index + 1).padStart(2, "0")}</span><span>{nav.pages[page]}</span><ArrowIcon /></Link>)}</nav>
            <Link href={pageHref(locale, "about")} prefetch={false} className="nav-editorial-preview" onClick={() => closeMenu(false)}><img src="/assets/facilities/F01.webp" alt={text.footer.sourceNote} width="1029" height="508" /><span className="nav-editorial-shade" /><div><p className="eyebrow">BURCU</p><p className="nav-editorial-heading">{nav.discover}</p><span>{nav.pages.about}<ArrowIcon /></span></div></Link>
          </> : <>
            <nav className="nav-media-list" aria-label={nav.media}><Link href={`${pageHref(locale, "media")}#brochure`} prefetch={false} onClick={() => closeMenu(false)}><span>{nav.brochure}</span><ArrowIcon /></Link><button type="button" onClick={openFilm}><span>{nav.film}</span><ArrowIcon /></button><Link href={`${pageHref(locale, "media")}#tv`} prefetch={false} onClick={() => closeMenu(false)}><span>{nav.tv}</span><ArrowIcon /></Link><Link href={pageHref(locale, "kitchen")} prefetch={false} onClick={() => closeMenu(false)}><span>{nav.pages.kitchen}</span><ArrowIcon /></Link></nav>
            <button type="button" className="nav-editorial-preview nav-media-preview" onClick={openFilm}><img src="/assets/facilities/F02.webp" alt="" width="1024" height="507" /><span className="nav-editorial-shade" /><div><p className="eyebrow">BURCU TV</p><p className="nav-editorial-heading">{nav.film}</p><span>{text.ui.play}<ArrowIcon /></span></div></button>
          </>}
        </div>
        <div className="nav-panel-bottom"><p>{modeLead}</p><Link href={pageHref(locale, mode === "products" ? "products" : mode === "corporate" ? "about" : "media")} prefetch={false} onClick={() => closeMenu(false)} className="nav-all-products">{mode === "products" ? nav.pages.products : mode === "corporate" ? nav.pages.about : nav.pages.media}<ArrowIcon /></Link></div>
      </div>}
    </dialog>
    <dialog ref={mobileDialog} id={mobileId} className="nav-mobile-drawer" aria-labelledby={`${mobileId}-title`} onClick={closeOnBackdrop} onClose={handleClosed} data-lenis-prevent="true">
      {menu === "mobile" && <div className="nav-drawer-content">
        <div className="nav-panel-top"><h2 id={`${mobileId}-title`} className="nav-panel-label">{text.nav.menu}</h2><button type="button" className="nav-close" aria-label={text.nav.close} onClick={() => closeMenu()}><CloseIcon /></button></div>
        <nav className="nav-mobile-index" aria-label={text.nav.menu}>
          <Link href={`/${locale}/`} prefetch={false} className="nav-mobile-direct" onClick={() => closeMenu(false)}>{text.nav.home}<ArrowIcon /></Link>
          <details name={`mobile-menu-${id}`} open><summary>{nav.corporate}<span aria-hidden="true">+</span></summary><div>{CORPORATE_PAGES.map(page => <Link key={page} href={pageHref(locale, page)} prefetch={false} onClick={() => closeMenu(false)}>{nav.pages[page]}</Link>)}</div></details>
          <details name={`mobile-menu-${id}`}><summary>{nav.products}<span aria-hidden="true">+</span></summary><div><Link href={pageHref(locale, "products")} prefetch={false} onClick={() => closeMenu(false)}>{nav.pages.products}</Link>{families.map(family => <Link key={family.id} href={familyHref(locale, family.id)} prefetch={false} onClick={() => closeMenu(false)}>{text.families[family.id].title}</Link>)}</div></details>
          <details name={`mobile-menu-${id}`}><summary>{nav.media}<span aria-hidden="true">+</span></summary><div><Link href={pageHref(locale, "media")} prefetch={false} onClick={() => closeMenu(false)}>{nav.pages.media}</Link><Link href={`${pageHref(locale, "media")}#brochure`} prefetch={false} onClick={() => closeMenu(false)}>{nav.brochure}</Link><button type="button" onClick={openFilm}>{nav.film}</button><Link href={`${pageHref(locale, "media")}#tv`} prefetch={false} onClick={() => closeMenu(false)}>{nav.tv}</Link><Link href={pageHref(locale, "kitchen")} prefetch={false} onClick={() => closeMenu(false)}>{nav.pages.kitchen}</Link></div></details>
          <a href={STORE} className="nav-mobile-direct" target="_blank" rel="noopener noreferrer" onClick={() => closeMenu(false)}>{nav.store}<ExternalIcon /></a><Link href={pageHref(locale, "contact")} prefetch={false} className="nav-mobile-direct" onClick={() => closeMenu(false)}>{nav.contact}<ArrowIcon /></Link>
        </nav>
        <p className="nav-mobile-language-label">{text.nav.language}</p><LanguageLinks locale={locale} text={text} pathname={pathname} className="nav-languages nav-languages-mobile" onNavigate={() => closeMenu(false)} />
      </div>}
    </dialog>
  </header>;
}

export function Footer({ locale, text, nav }: NavigationProps) {
  const pathname = usePathname();
  return <footer className="footer-root footer-upgraded" dir={locale === "ar" ? "rtl" : "ltr"}>
    <div className="footer-main">
      <div className="footer-brand"><Link href={`/${locale}/`} prefetch={false} aria-label={text.footer.brand} className="footer-logo"><img src={LOGO} alt="Burcu" width="237" height="104" loading="lazy" /></Link><p className="footer-brand-statement">{nav.brand}</p><a href={STORE} className="footer-brand-link" target="_blank" rel="noopener noreferrer">{nav.store}<ExternalIcon /></a></div>
      <nav className="footer-index" aria-label={nav.corporate}><h2>{nav.corporate}</h2><ul>{CORPORATE_PAGES.map(page => <li key={page}><Link href={pageHref(locale, page)} prefetch={false}>{nav.pages[page]}</Link></li>)}</ul></nav>
      <nav className="footer-products footer-index" aria-label={nav.products}><h2>{nav.products}</h2><ul><li><Link href={pageHref(locale, "products")} prefetch={false}>{nav.pages.products}</Link></li>{families.map(family => <li key={family.id}><Link href={familyHref(locale, family.id)} prefetch={false}>{text.families[family.id].title}</Link></li>)}</ul></nav>
      <nav className="footer-index" aria-label={nav.media}><h2>{nav.media}</h2><ul><li><Link href={pageHref(locale, "media")} prefetch={false}>{nav.pages.media}</Link></li><li><Link href={`${pageHref(locale, "media")}#brochure`} prefetch={false}>{nav.brochure}</Link></li><li><button type="button" onClick={() => window.dispatchEvent(new Event("burcu:film"))}>{nav.film}</button></li><li><Link href={`${pageHref(locale, "media")}#tv`} prefetch={false}>{nav.tv}</Link></li><li><Link href={pageHref(locale, "kitchen")} prefetch={false}>{nav.pages.kitchen}</Link></li></ul></nav>
      <div className="footer-contact"><h2>{nav.address}</h2><a href="mailto:info@burcu.com" dir="ltr">info@burcu.com</a><a href="tel:+902664125971" dir="ltr">+90 266 412 59 71</a><Link href={pageHref(locale, "contact")} prefetch={false} className="footer-contact-link">{nav.contact}<ArrowIcon /></Link><p className="footer-language-label">{text.footer.language}</p><LanguageLinks locale={locale} text={text} pathname={pathname} className="footer-languages" /></div>
    </div>
    <nav className="footer-legal" aria-label={nav.pages.sitemap}>{LEGAL_PAGES.map(page => <Link key={page} href={pageHref(locale, page)} prefetch={false}>{nav.pages[page]}</Link>)}</nav>
    <div className="footer-bottom"><p>{text.footer.rights}</p><MotionPreference label={text.ui.motionLabel} systemPreferenceNote={text.ui.systemPreferenceNote}/><p>{text.ui.demoOnly}</p></div>
  </footer>;
}
