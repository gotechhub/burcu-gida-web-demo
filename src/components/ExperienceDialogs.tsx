"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type MouseEvent } from "react";
import Link from "next/link";
import ProductImage from "./ProductImage";
import type { Locale, SiteCopy } from "../content/copy";
import { products, productHref, type Product, type ProductId } from "../content/products";

type Experience = { kind: "film" } | { kind: "contact" } | { kind: "detail"; product: Product };
type EnquiryPreview = { name: string; email: string; subject: string; message: string };

function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>) {
  if (event.target !== event.currentTarget) return;
  const bounds = event.currentTarget.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right
    || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
}

export function ExperienceDialogs({ locale, text }: { locale: Locale; text: SiteCopy }) {
  const id = useId();
  const titleId = `experience-title-${id}`;
  const descriptionId = `experience-description-${id}`;
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [preview, setPreview] = useState<EnquiryPreview | null>(null);

  useEffect(() => {
    function open(next: Experience) {
      // A second event updates the active experience without stacking modals.
      if (!dialog.current?.open) {
        returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      }
      video.current?.pause();
      setPreview(null);
      setExperience(next);
    }
    const openFilm = () => open({ kind: "film" });
    const openContact = () => open({ kind: "contact" });
    const openDetail = (event: Event) => {
      const product = products.find((item) => item.id === (event as CustomEvent<ProductId>).detail);
      if (product) open({ kind: "detail", product });
    };
    window.addEventListener("burcu:film", openFilm);
    window.addEventListener("burcu:contact", openContact);
    window.addEventListener("burcu:detail", openDetail);
    return () => {
      window.removeEventListener("burcu:film", openFilm);
      window.removeEventListener("burcu:contact", openContact);
      window.removeEventListener("burcu:detail", openDetail);
    };
  }, []);

  useEffect(() => {
    if (experience && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [experience]);

  function handleClose() {
    video.current?.pause();
    setExperience(null);
    setPreview(null);
    const trigger = returnFocus.current;
    window.requestAnimationFrame(() => {
      if (trigger?.isConnected && !document.querySelector("dialog[open]")) trigger.focus({ preventScroll: true });
    });
  }

  function previewEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const enquiry: EnquiryPreview = {
      name: String(values.get("name") ?? "").trim(),
      email: String(values.get("email") ?? "").trim(),
      subject: String(values.get("subject") ?? "").trim(),
      message: String(values.get("message") ?? "").trim(),
    };
    for (const name of ["name", "email", "subject", "message"] as const) {
      const field = form.elements.namedItem(name);
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
        field.setCustomValidity(enquiry[name] ? "" : text.ui.requiredField);
      }
    }
    if (!form.reportValidity()) {
      setPreview(null);
      return;
    }
    // Ephemeral React state only: no fetch, storage, email or form action.
    setPreview(enquiry);
  }

  function clearFieldValidity(event: FormEvent<HTMLFormElement>) {
    const field = event.target;
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) field.setCustomValidity("");
    setPreview(null);
  }

  const title = experience?.kind === "film" ? text.nav.film
    : experience?.kind === "detail" ? text.productNames[experience.product.id] : text.ui.contactTitle;

  return (
    <dialog ref={dialog} className={`experience-dialog${experience ? ` experience-${experience.kind}` : ""}`}
      aria-labelledby={titleId} aria-describedby={descriptionId} lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}
      onClick={closeOnBackdrop} onClose={handleClose} data-lenis-prevent="true">
      {experience && (
        <div className="dialog-content">
          <div className="dialog-top">
            <p className="dialog-eyebrow">{experience.kind === "detail" ? text.product.eyebrow : text.nav.home}</p>
            <button type="button" className="dialog-close" aria-label={experience.kind === "film" ? text.ui.closeFilm : text.nav.close}
              onClick={() => dialog.current?.close()}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </div>
          <h2 id={titleId} className="dialog-title">{title}</h2>

          {experience.kind === "film" && (
            <div className="dialog-film-body">
              <p id={descriptionId} className="dialog-disclosure">{text.ui.filmDisclosure}</p>
              <video ref={video} className="dialog-video" controls playsInline preload="none" poster="/assets/facilities/F01.webp" aria-label={text.nav.film}>
                <source src="/assets/video/burcu-concept.mp4" type="video/mp4" />
                <track kind="captions" src="/assets/video/captions/burcu-tr.vtt" srcLang="tr" label="Türkçe" default={locale === "tr"} />
                <track kind="subtitles" src="/assets/video/captions/burcu-en.vtt" srcLang="en" label="English" default={locale === "en"} />
                <track kind="subtitles" src="/assets/video/captions/burcu-ar.vtt" srcLang="ar" label="العربية" default={locale === "ar"} />
              </video>
            </div>
          )}

          {experience.kind === "detail" && (
            <div className="dialog-product-body">
              <div className="dialog-product-art"><ProductImage product={experience.product} alt={text.productNames[experience.product.id]}
                sizes="(max-width: 1023px) 60vw, 300px" className="dialog-product-image" draggable={false} /></div>
              <div className="dialog-product-copy">
                <p id={descriptionId} className="dialog-product-status">{text.families[experience.product.family].lead}</p>
                <dl className="dialog-product-facts">
                  <div><dt>{text.product.amount}</dt><dd dir="ltr">{experience.product.grams} g</dd></div>
                  <div><dt>{text.product.family}</dt><dd>{text.families[experience.product.family].title}</dd></div>
                </dl>
                <p className="dialog-label-note">{text.product.readLabel}</p>
                <Link href={productHref(locale, experience.product)} className="dialog-primary" prefetch={false} onClick={() => dialog.current?.close()}>{text.ui.viewProduct}</Link>
              </div>
            </div>
          )}

          {experience.kind === "contact" && (
            <div className="dialog-contact-body">
              <p id={descriptionId} className="dialog-lead">{text.ui.contactLead}</p>
              <form className="dialog-form" noValidate onSubmit={previewEnquiry} onInput={clearFieldValidity}>
                <div className="dialog-form-row">
                  <label htmlFor={`enquiry-name-${id}`}>{text.ui.contactName}<input id={`enquiry-name-${id}`} name="name" autoComplete="name" required maxLength={120} /></label>
                  <label htmlFor={`enquiry-email-${id}`}>{text.ui.contactEmail}<input id={`enquiry-email-${id}`} name="email" type="email" autoComplete="email" required maxLength={254} dir="ltr" /></label>
                </div>
                <label htmlFor={`enquiry-subject-${id}`}>{text.ui.contactSubject}<input id={`enquiry-subject-${id}`} name="subject" required maxLength={180} /></label>
                <label htmlFor={`enquiry-message-${id}`}>{text.ui.contactMessage}<textarea id={`enquiry-message-${id}`} name="message" required maxLength={2000} rows={4} /></label>
                <button type="submit" className="dialog-primary">{text.ui.sendPreview}<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
              </form>
              {preview && (
                <div className="dialog-request-preview">
                  <p className="dialog-preview-status" role="status" aria-live="polite">{text.ui.previewReady}</p>
                  <dl>
                    <div><dt>{text.ui.contactName}</dt><dd>{preview.name}</dd></div>
                    <div><dt>{text.ui.contactEmail}</dt><dd dir="ltr">{preview.email}</dd></div>
                    <div><dt>{text.ui.contactSubject}</dt><dd>{preview.subject}</dd></div>
                    <div><dt>{text.ui.contactMessage}</dt><dd className="dialog-preview-message">{preview.message}</dd></div>
                  </dl>
                </div>
              )}
              <div className="dialog-contact-details">
                <a href="mailto:info@burcu.com" dir="ltr">info@burcu.com</a>
                <a href="tel:+902664125971" dir="ltr">+90 266 412 59 71</a>
              </div>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}

export default ExperienceDialogs;
