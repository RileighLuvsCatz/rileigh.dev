import Link from "next/link";
import NowPlaying from "@/components/now-playing";

const navLinks = [
  { href: "/projects", label: "work" },
  { href: "/blog", label: "writing" },
  { href: "/progress", label: "trackers" },
];

export default function SiteHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 mb-8 text-sm">
      <Link href="/" className="font-medium hover:text-muted transition-colors">
        rileigh.dev
      </Link>
      <nav aria-label="Main navigation" className="flex items-center gap-4 text-muted">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-foreground transition-colors"
          >
            {link.label}
          </Link>
        ))}
        <NowPlaying />
      </nav>
    </header>
  );
}
