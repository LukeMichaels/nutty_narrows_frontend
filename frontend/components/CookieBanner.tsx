"use client";

import { useCookieConsent } from "@/lib/cookie-consent-context";

export default function CookieBanner() {
  const { hasChosen, acceptAll, rejectNonEssential } = useCookieConsent();

  if (hasChosen) {
    return null;
  }

  return (
    <div role="region" aria-label="Cookie consent" className="cookie-banner">
      <p className="cookie-banner__text">
        We use cookies and, with your consent, basic analytics to understand
        how visitors use the site. See our{" "}
        <a href="/cookie-policy">Cookie Policy</a> for details.
      </p>

      <div className="cookie-banner__actions">
        <button
          type="button"
          onClick={acceptAll}
          className="cookie-banner__button cookie-banner__button--primary"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={rejectNonEssential}
          className="cookie-banner__button"
        >
          Reject Non-Essential
        </button>
      </div>
    </div>
  );
}
