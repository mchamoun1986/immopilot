import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--gris-border)] bg-[var(--gris-clair)] py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-4 text-sm text-gray-500 md:flex-row md:justify-between">
          <div className="font-bold text-[var(--bleu-marine)]">
            Immo<span className="text-[var(--rouge-francais)]">Pilot</span>
          </div>
          <nav className="flex gap-4">
            <Link href="/mentions-legales" className="hover:text-[var(--bleu-secondaire)]">Mentions légales</Link>
            <Link href="/mes-donnees" className="hover:text-[var(--bleu-secondaire)]">Mes données</Link>
          </nav>
          <div>&copy; {new Date().getFullYear()} ImmoPilot. Tous droits réservés.</div>
        </div>
      </div>
    </footer>
  );
}
