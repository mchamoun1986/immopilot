'use client';

import { useState, useEffect, useRef } from "react";
import type { LeadCapture, LeadSource, EtapeNumber } from "@/lib/types";
import { saveLead } from "@/lib/leads";

export interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: LeadSource;
  etape: EtapeNumber;
  titre: string;
  description: string;
  showPhone?: boolean;
  showConsent?: boolean;
  onSubmit: (lead: LeadCapture) => void;
}

export function LeadModal({
  isOpen,
  onClose,
  source,
  etape,
  titre,
  description,
  showPhone = false,
  showConsent = false,
  onSubmit,
}: LeadModalProps) {
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [ville, setVille] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [consentPartners, setConsentPartners] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Reset form when modal opens + focus trap + return focus on close
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      setEmail("");
      setNom("");
      setPrenom("");
      setTelephone("");
      setVille("");
      setCodePostal("");
      setConsentPartners(false);
      setConsentPrivacy(false);
      setErrors({});
      setSubmitted(false);
      // Move focus into dialog
      requestAnimationFrame(() => {
        const firstInput = dialogRef.current?.querySelector<HTMLElement>("input, button");
        firstInput?.focus();
      });
    } else {
      // Return focus to trigger element on close
      requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }, [isOpen]);

  // Close on Escape key + focus trap (Tab / Shift+Tab)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'input, button, textarea, select, a[href], [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = "L'email est requis.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Email invalide.";
    if (!nom.trim()) newErrors.nom = "Le nom est requis.";
    if (!prenom.trim()) newErrors.prenom = "Le prénom est requis.";
    if (!consentPrivacy) newErrors.consentPrivacy = "Vous devez accepter la politique de confidentialité.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const lead: LeadCapture = {
      email: email.trim(),
      nom: nom.trim() || null,
      prenom: prenom.trim() || null,
      telephone: showPhone && telephone.trim() ? telephone.trim() : null,
      ville: ville.trim() || null,
      code_postal: codePostal.trim() || null,
      source,
      etape,
      consent_partners: showConsent ? consentPartners : false,
    };

    saveLead(lead);
    setSubmitted(true);
    onSubmit(lead);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const inputClass = "w-full rounded-lg border border-[var(--gris-border)] px-3 py-2 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none focus:ring-2 focus:ring-[var(--bleu-secondaire)]/30";
  const errorClass = "mt-1 text-xs text-red-600";

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleOverlayClick}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto rounded-xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[var(--gris-border)] px-6 py-4">
          <div className="pr-6">
            <h2 id="lead-modal-title" className="text-base font-bold text-[var(--bleu-marine)]">
              {titre}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-gray-600">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Fermer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {submitted ? (
            <div className="py-6 text-center">
              <div className="mb-3 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="text-base font-semibold text-[var(--bleu-marine)]">
                Merci !
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Vous recevrez votre {titre.toLowerCase()} par email.
              </p>
              <button
                onClick={onClose}
                className="mt-5 rounded-lg bg-[var(--bleu-secondaire)] px-6 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Prenom + Nom */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="lead-prenom">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lead-prenom"
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    autoComplete="given-name"
                    className={inputClass}
                    placeholder="Jean"
                  />
                  {errors.prenom && <p className={errorClass}>{errors.prenom}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="lead-nom">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lead-nom"
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    autoComplete="family-name"
                    className={inputClass}
                    placeholder="Dupont"
                  />
                  {errors.nom && <p className={errorClass}>{errors.nom}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="lead-email">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="lead-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className={inputClass}
                  placeholder="jean.dupont@example.com"
                />
                {errors.email && <p className={errorClass}>{errors.email}</p>}
              </div>

              {/* Telephone (optionnel) */}
              {showPhone && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="lead-tel">
                    Téléphone <span className="text-xs text-gray-400">(optionnel)</span>
                  </label>
                  <input
                    id="lead-tel"
                    type="tel"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    autoComplete="tel"
                    className={inputClass}
                    placeholder="06 12 34 56 78"
                  />
                </div>
              )}

              {/* Ville + Code postal */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="lead-ville">
                    Ville <span className="text-xs text-gray-400">(optionnel)</span>
                  </label>
                  <input
                    id="lead-ville"
                    type="text"
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    autoComplete="address-level2"
                    className={inputClass}
                    placeholder="Lyon"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="lead-cp">
                    Code postal <span className="text-xs text-gray-400">(optionnel)</span>
                  </label>
                  <input
                    id="lead-cp"
                    type="text"
                    value={codePostal}
                    onChange={(e) => setCodePostal(e.target.value)}
                    autoComplete="postal-code"
                    className={inputClass}
                    placeholder="69001"
                  />
                </div>
              </div>

              {/* Consentements */}
              <div className="space-y-3 border-t border-[var(--gris-border)] pt-4">
                {showConsent && (
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={consentPartners}
                      onChange={(e) => setConsentPartners(e.target.checked)}
                      className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-gray-300 accent-[var(--bleu-secondaire)]"
                    />
                    <span className="text-xs text-gray-600 leading-relaxed">
                      J&apos;accepte d&apos;être mis en relation avec des professionnels partenaires
                      (courtiers, assureurs, déménageurs) sélectionnés par ImmoPilot.
                    </span>
                  </label>
                )}

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={consentPrivacy}
                    onChange={(e) => setConsentPrivacy(e.target.checked)}
                    className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-gray-300 accent-[var(--bleu-secondaire)]"
                  />
                  <span className="text-xs text-gray-600 leading-relaxed">
                    J&apos;accepte la{" "}
                    <a
                      href="/mentions-legales"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--bleu-secondaire)] underline hover:opacity-80"
                    >
                      politique de confidentialité
                    </a>{" "}
                    d&apos;ImmoPilot. <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.consentPrivacy && (
                  <p className={errorClass}>{errors.consentPrivacy}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-lg bg-[var(--bleu-secondaire)] py-2.5 text-sm font-semibold text-white hover:opacity-90 active:opacity-80"
              >
                Recevoir par email
              </button>

              <p className="text-center text-xs text-gray-400">
                Vos données sont stockées localement et ne sont jamais revendues.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
