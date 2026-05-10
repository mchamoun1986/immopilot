'use client';

import { trackAffiliateClick, buildAffiliateUrl } from "@/lib/affiliate-tracking";

interface AffiliateLinkProps {
  href: string;
  affiliateUrl: string | null;
  children: React.ReactNode;
  source: string;
  etape?: number;
  className?: string;
}

export function AffiliateLink({ href, affiliateUrl, children, source, etape, className }: AffiliateLinkProps) {
  const isAffiliate = affiliateUrl !== null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isAffiliate) return; // Let normal navigation happen

    e.preventDefault();
    const subId = trackAffiliateClick(affiliateUrl, source, etape);
    const finalUrl = buildAffiliateUrl(affiliateUrl, subId);
    window.open(finalUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <a
      href={isAffiliate ? "#" : href}
      onClick={isAffiliate ? handleClick : undefined}
      target="_blank"
      rel={isAffiliate ? "sponsored noopener noreferrer" : "noopener noreferrer"}
      className={className}
    >
      {children}
      {isAffiliate && (
        <span className="ml-1.5 inline-block rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-medium text-gray-400">
          Partenaire
        </span>
      )}
    </a>
  );
}
