import Link from "next/link";
import Logo from "./Logo";
import { NAV_LINKS, LEGAL_LINKS } from "@/lib/nav-links";

// TODO: swap in the real contact email/address (and any social links) once
// the business owner provides them — this is placeholder copy.
export default function Footer() {
  return (
    <footer>
      <div className="footer-content grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Logo variant="footer" />
          <p>Nutty Narrows Thrift Shop — a creative vending machine business.</p>
        </div>

        <nav aria-labelledby="footer-nav-explore" className="flex flex-col gap-2">
          <h2 id="footer-nav-explore" className="font-semibold uppercase tracking-wide">Explore</h2>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <nav aria-labelledby="footer-nav-legal" className="flex flex-col gap-2">
          <h2 id="footer-nav-legal" className="font-semibold uppercase tracking-wide">Legal Stuff</h2>
          {LEGAL_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-4">
          <h2 className="font-semibold uppercase tracking-wide">Contact</h2>
          <a href="mailto:hello@nutty-narrows.example" className="nav-link">
            hello@nutty-narrows.example
          </a>
          <address className="not-italic">
            Nutty Narrows Thrift Shop
          </address>
        </div>
      </div>

      <div className="copyright">
        &copy; {new Date().getFullYear()} Nutty Narrows Thrift Shop
      </div>
    </footer>
  );
}
