import Link from "next/link";
import LogoFull from "./LogoFull";
import LogoCompact from "./LogoCompact";

export default function Logo({
  variant = "header",
}: {
  variant?: "header" | "footer";
}) {
  if (variant === "footer") {
    return (
      <Link href="/" aria-label="Return to the front page" className="wrap footer" scroll={false}>
        <LogoCompact />
      </Link>
    );
  }

  return (
    <Link href="/" aria-label="Return to the front page" className="wrap header" scroll={false}>
      <LogoCompact />
      <LogoFull />
    </Link>
  );
}
