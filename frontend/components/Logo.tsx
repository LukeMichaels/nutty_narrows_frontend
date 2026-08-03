import Link from "next/link";

// Placeholder text wordmark — will be replaced with the real Nutty Narrows
// logo (the squirrel mark from the vending-machine illustration) once
// Phase 3 componentizes that artwork.
export default function Logo({
  variant = "header",
}: {
  variant?: "header" | "footer";
}) {
  return (
    <Link
      href="/"
      aria-label="Return to the front page"
      className={`wrap ${variant === "footer" ? "footer" : "header"}`}
    >
      Nutty Narrows
    </Link>
  );
}
