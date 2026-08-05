import Link from "next/link";
import Logo from "./Logo";
import { NAV_LINKS, LEGAL_LINKS } from "@/lib/nav-links";

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/nuttynarrowsthriftshop/",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "FaceBook",
    href: "https://www.facebook.com/p/Nutty-Narrows-Thrift-Shop-61569094314580/",
    icon: (
      <svg viewBox="21 -2 54 100" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M73.099,15.973l-9.058,0.004c-7.102,0-8.477,3.375-8.477,8.328v10.921h16.938l-0.006,17.106H55.564v43.895H37.897V52.332 h-14.77V35.226h14.77V22.612C37.897,7.972,46.84,0,59.9,0L73.1,0.021L73.099,15.973L73.099,15.973z"></path>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-content__brand">
          <Logo variant="footer" />
          {/* <p>Longview, WA’s creative vending machines. Nostalgic thrifts, local art, and cute things.</p> */}
          <div className="social-links flex gap-2">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-content__navs">
          <nav aria-labelledby="footer-nav-explore" className="flex flex-col gap-2">
            <h2 id="footer-nav-explore" className="font-semibold uppercase tracking-wide">Info</h2>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link" scroll={false}>
                {link.label}
              </Link>
            ))}
          </nav>

          <nav aria-labelledby="footer-nav-legal" className="flex flex-col gap-2">
            <h2 id="footer-nav-legal" className="font-semibold uppercase tracking-wide">Legal</h2>
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link" scroll={false}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="copyright">
        &copy; {new Date().getFullYear()} Nutty Narrows Thrift Shop
      </div>
    </footer>
  );
}
