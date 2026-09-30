import Link from "next/link";
import SocialLinks from "@/components/social-links";
import styles from "./home.module.css";

const navLinks = [
  { href: "/projects", label: "work" },
  { href: "/blog", label: "writing" },
  { href: "/progress", label: "trackers" },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.terminal}>
        <div className={styles.chrome} aria-hidden="true">
          <span /><span /><span />
          <span className={styles.chromeLabel}>~/rileigh.dev</span>
        </div>

        <div className={styles.content}>
          <header className={styles.header}>
            <span className={styles.brand}>rileigh.dev<span className={styles.cursor}>_</span></span>
            <nav aria-label="Main navigation" className={styles.nav}>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>{link.label}</Link>
              ))}
            </nav>
          </header>

          <div className={styles.introGrid}>
            <section className={styles.intro} aria-labelledby="intro-title">
              <p className={styles.prompt}><span aria-hidden="true">&gt;</span> hello_world</p>
              <h1 id="intro-title">hey, I&apos;m Rileigh<span className={styles.accent}>.</span></h1>
              <p className={styles.description}>
                I build things and write about them here. currently tracking a few habits I&apos;m trying to stick with.
              </p>

              <div className={styles.actions}>
                <SocialLinks />
                <a href="/resume.pdf" className={styles.resume}>resume <span aria-hidden="true">↗</span></a>
              </div>
            </section>

            <aside className={styles.portrait} aria-label="Space reserved for a future illustrated portrait">
              <div className={styles.portraitTop}><span>FIG. 01</span><span>SELF-PORTRAIT</span></div>
              <div className={styles.portraitFrame}>
                <span className={styles.sigilLeft} aria-hidden="true" />
                <span className={styles.sigilRight} aria-hidden="true" />
                <div className={styles.portraitPlaceholder}>
                  <span>illustration goes here</span>
                </div>
              </div>
              <p className={styles.portraitCaption}>{"// awaiting artwork"}</p>
            </aside>
          </div>

          <div className={styles.latest}>
            <div className={styles.latestHeading}><span>writing.log</span><span>001 / pending</span></div>
            <p>
              Placeholder for latest post. I&apos;m not sure what I want to write about yet, but I&apos;ll figure that out eventually.
            </p>
          </div>
          <p className={styles.endline} aria-hidden="true">&lt;/home&gt; <span>✳</span></p>
        </div>
      </div>
    </main>
  );
}
