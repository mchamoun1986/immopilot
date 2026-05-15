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
    if (!isAffiliate) return; // Let normal navigation happen
    // Track click but let the browser handle navigation via href
    trackAffiliateClick(affiliateUrl, source, etape);
  };

  // Build the tracked URL at render time so href is always a real URL
  const displayUrl = isAffiliate
    ? buildAffiliateUrl(affiliateUrl, "click")
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
