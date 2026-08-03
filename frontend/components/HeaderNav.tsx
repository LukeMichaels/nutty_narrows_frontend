"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/nav-links";

export default function HeaderNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={isOpen}
        aria-controls="primary-nav"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="nav-toggle__bar" />
        <span className="nav-toggle__bar" />
        <span className="nav-toggle__bar" />
      </button>

      <nav
        id="primary-nav"
        aria-label="Primary"
        className={`nav-links flex-1${isOpen ? " is-open" : ""}`}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="nav-link"
            onClick={() => setIsOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
