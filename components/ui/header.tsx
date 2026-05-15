'use client';

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/parcours", label: "Parcours" },
    { href: "/dossiers", label: "Mes dossiers" },
    { href: "/outils", label: "Outils" },
  ];

  return (
    <header className="border-b border-[var(--gris-border)] bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-extrabold text-[var(--bleu-marine)]">
          Immo<span className="text-[var(--rouge-francais)]">Pilot</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden gap-6 text-sm text-[var(--bleu-marine)] md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[var(--bleu-secondaire)]">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger button */}
        <button
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
        >
          <span className={`block h-0.5 w-6 bg-[var(--bleu-marine)] transition-transform duration-200 ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-6 bg-[var(--bleu-marine)] transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-[var(--bleu-marine)] transition-transform duration-200 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="border-t border-[var(--gris-border)] bg-white px-4 py-3 md:hidden">
          <ul className="flex flex-col gap-3 text-sm text-[var(--bleu-marine)]">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-md px-2 py-3 hover:text-[var(--bleu-secondaire)]"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
