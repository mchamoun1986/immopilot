'use client';

import { trackAffiliateClick, buildAffiliateUrl } from "@/lib/affiliate-tracking";

interface AffiliateLinkProps {
  href: string;
  affiliateUrl: string | null;
  children: React.ReactNode;
  source: string;
  etape?: number;
  className?: string;
  "aria-label"?: string;
}

export function AffiliateLink({ href, affiliateUrl, children, source, etape, className, "aria-label": ariaLabel }: AffiliateLinkProps) {
  const isAffiliate = affiliateUrl !== null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isAffiliate) return;
    e.preventDefault();
    // Track click and get real subId, then navigate with tracked URL
    const subId = trackAffiliateClick(affiliateUrl, source, etape);
    const trackedUrl = buildAffiliateUrl(affiliateUrl, subId);
    window.open(trackedUrl, "_blank", "noopener,noreferrer");
  };

  // Display href with placeholder for right-click/copy — real subId injected on click
  const displayUrl = isAffiliate
    ? buildAffiliateUrl(affiliateUrl, "preview")
    : href;

  return (
    <a
      href={displayUrl}
      onClick={isAffiliate ? handleClick : undefined}
      target="_blank"
      rel={isAffiliate ? "sponsored noopener noreferrer" : "noopener noreferrer"}
      className={className}
      aria-label={ariaLabel}
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
