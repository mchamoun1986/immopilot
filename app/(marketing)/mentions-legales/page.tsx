export default function MentionsLegalesPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-[var(--bleu-marine)]">
        Mentions légales &amp; Politique de confidentialité
      </h1>

      {/* Identité */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-[var(--bleu-marine)]">Identité</h2>
        <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4 text-sm text-gray-700 space-y-1">
          <p><strong>Nom du service :</strong> ImmoPilot</p>
          <p><strong>Statut :</strong> Service en cours de création</p>
          <p><strong>Contact :</strong> contact@immopilot.fr</p>
        </div>
      </section>

      {/* Hébergement */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-[var(--bleu-marine)]">Hébergement</h2>
        <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4 text-sm text-gray-700 space-y-1">
          <p><strong>Hébergeur :</strong> Vercel Inc.</p>
          <p><strong>Adresse :</strong> 340 Pine Street, Suite 701, San Francisco, CA 94104, USA</p>
          <p><strong>Site :</strong> vercel.com</p>
        </div>
      </section>

      {/* Données personnelles */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-[var(--bleu-marine)]">Données personnelles</h2>
        <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4 text-sm text-gray-700 space-y-3">
          <div>
            <p className="font-semibold mb-1">Données collectées</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Prénom, nom, adresse email</li>
              <li>Téléphone (optionnel, uniquement si vous le saisissez)</li>
              <li>Ville et code postal (optionnel)</li>
              <li>Données de simulation immobilière (revenus, capacité d&apos;emprunt, budget)</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">Finalité</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Vous envoyer les simulations et analyses demandées</li>
              <li>Vous mettre en relation avec des professionnels partenaires (avec votre consentement explicite)</li>
              <li>Améliorer le service ImmoPilot</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">Durée de conservation</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Leads (emails collectés) : 12 mois maximum</li>
              <li>Dossiers de projet immobilier : 24 mois ou jusqu&apos;à suppression par l&apos;utilisateur</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">Base légale</p>
            <p className="text-gray-600">
              Traitement fondé sur votre consentement explicite (art. 6(1)(a) RGPD),
              donné lors de la soumission du formulaire.
            </p>
          </div>
        </div>
      </section>

      {/* Droits */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-[var(--bleu-marine)]">Vos droits</h2>
        <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4 text-sm text-gray-700 space-y-2">
          <p>
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Droit d&apos;accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l&apos;effacement (&laquo;&nbsp;droit à l&apos;oubli&nbsp;&raquo;)</li>
            <li>Droit à la portabilité</li>
            <li>Droit d&apos;opposition au traitement</li>
          </ul>
          <p className="mt-2">
            Vous pouvez supprimer toutes vos données locales directement depuis la page{" "}
            <a href="/mes-donnees" className="text-[var(--bleu-secondaire)] underline hover:opacity-80">
              Mes données
            </a>.
          </p>
          <p>
            Pour exercer vos droits sur les données serveur ou nous contacter :&nbsp;
            <a href="mailto:contact@immopilot.fr" className="text-[var(--bleu-secondaire)] underline hover:opacity-80">
              contact@immopilot.fr
            </a>
          </p>
        </div>
      </section>

      {/* Cookies */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-[var(--bleu-marine)]">Cookies et stockage local</h2>
        <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4 text-sm text-gray-700 space-y-2">
          <p>
            ImmoPilot <strong>n&apos;utilise pas de cookies de tracking</strong>.
          </p>
          <p>
            Les données de votre projet immobilier (simulation, dossiers, progression) sont stockées
            uniquement dans le <strong>localStorage</strong> de votre navigateur, sur votre appareil.
            Elles ne sont pas transmises à nos serveurs tant que vous ne soumettez pas un formulaire.
          </p>
          <p>
            Clés localStorage utilisées par ImmoPilot : <code className="rounded bg-gray-100 px-1">immopilot_projet</code>,{" "}
            <code className="rounded bg-gray-100 px-1">immopilot_leads</code>, et clés préfixées par{" "}
            <code className="rounded bg-gray-100 px-1">immopilot_</code>.
          </p>
          <p>
            Vous pouvez tout supprimer depuis la page{" "}
            <a href="/mes-donnees" className="text-[var(--bleu-secondaire)] underline hover:opacity-80">
              Mes données
            </a>.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-[var(--bleu-marine)]">Contact</h2>
        <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4 text-sm text-gray-700">
          <p>
            Pour toute question relative à ces mentions légales ou à vos données personnelles :
          </p>
          <p className="mt-2">
            <a href="mailto:contact@immopilot.fr" className="text-[var(--bleu-secondaire)] underline hover:opacity-80">
              contact@immopilot.fr
            </a>
          </p>
        </div>
      </section>

      {/* Liens d'affiliation */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-[var(--bleu-marine)]">Liens d&apos;affiliation</h2>
        <p className="text-sm text-gray-600">
          Certains liens présents sur ImmoPilot sont des liens d&apos;affiliation (identifiés par la mention &quot;Partenaire&quot;).
          Lorsque vous cliquez sur ces liens et effectuez une action (inscription, souscription), ImmoPilot peut percevoir
          une commission de la part du partenaire.
        </p>
        <p className="text-sm text-gray-600">
          Cette commission est versée par le partenaire et ne génère aucun surcoût pour vous. Le prix que vous payez
          est strictement identique, que vous passiez par notre lien ou directement par le site du partenaire.
        </p>
        <p className="text-sm text-gray-600">
          ImmoPilot reste neutre dans ses recommandations. Les partenaires affiliés ne bénéficient d&apos;aucun
          traitement préférentiel dans nos conseils, alertes ou classements. Notre objectif est de vous guider
          au mieux, indépendamment de nos accords commerciaux.
        </p>
      </section>

      <p className="text-xs text-gray-400">
        Dernière mise à jour : mai 2026
      </p>
    </main>
  );
}
