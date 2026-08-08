import Link from "next/link";

const navLinks = [
  { href: "/projects", label: "work" },
  { href: "/blog", label: "writing" },
  { href: "/progress", label: "trackers" },
];

export default function SiteHeader() {
  return (
    <header className="flex items-center justify-between mb-8 text-sm">
      <Link href="/" className="font-medium hover:text-muted transition-colors">
        rileigh.dev
      </Link>
      <nav className="flex gap-4 text-muted">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-foreground transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
