import type { Metadata } from "next";
import Image from "next/image";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = {
  title: "projects | rileigh.dev",
  description: "Projects by Rileigh, including RileighOS and Nuzzy.",
};

const nuzzyScreens = [
  {
    label: "homepage",
    detail: "The starting point for creating or continuing a Nuzlocke run.",
  },
  {
    label: "run view",
    detail: "Route encounters and boss fights as a run progresses.",
  },
  {
    label: "box / graveyard",
    detail: "Where the team, boxed Pokémon, and fallen encounters are tracked.",
  },
];

function ScreenshotSlot({
  label,
  detail,
  kind = "screenshot",
  imageSrc,
}: {
  label: string;
  detail: string;
  kind?: "screenshot" | "photo";
  imageSrc?: string;
}) {
  return (
    <figure>
      <div className="relative flex aspect-video min-h-[260px] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-lg border border-border bg-surface px-6 text-center">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={detail}
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            className={kind === "photo" ? "object-cover" : "object-contain"}
          />
        ) : (
          <>
            <span aria-hidden="true" className="text-2xl text-muted/50">
              [ ]
            </span>
            <span className="text-sm">{label} {kind}</span>
            <span className="max-w-sm text-xs leading-relaxed text-muted">
              {detail}
            </span>
          </>
        )}
      </div>
      <figcaption className="mt-2 text-xs text-muted">{label}</figcaption>
    </figure>
  );
}

export default function ProjectsPage() {
  return (
    <main className="flex flex-1 justify-center px-4 py-6 sm:px-8 sm:py-10">
      <div className="w-full max-w-3xl self-start overflow-hidden rounded-lg border border-border">
        <div
          className="flex items-center gap-1.5 border-b border-border bg-surface px-3 py-2"
          aria-hidden="true"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-muted" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted" />
        </div>

        <div className="p-5 sm:p-7">
          <div className="[&>header]:flex-wrap [&>header]:gap-3">
            <SiteHeader />
          </div>
          <header className="mb-9">
            <h1 className="mb-2 text-2xl font-medium tracking-tight">
              projects
            </h1>
            <p className="text-sm text-muted">
              A few things I&apos;ve been building.
            </p>
          </header>

          <div className="space-y-12">
            <section aria-labelledby="rileighos-title">
              <div className="mb-4 flex items-baseline justify-between gap-4">
                <h2 id="rileighos-title" className="text-lg font-medium tracking-tight">
                  RileighOS
                </h2>
                <span className="shrink-0 text-xs text-muted">01 / 02</span>
              </div>

              <div className="space-y-5">
                <figure>
                  <div
                    className="aspect-video min-h-[260px] w-full overflow-hidden rounded-lg border border-border bg-[#111114]"
                    aria-label="Mock terminal output of the RileighOS today command"
                  >
                    <div className="border-b border-border bg-surface px-4 py-2 text-xs text-muted">
                      ~/rileighos — today overview
                    </div>
                    <pre className="overflow-x-auto p-4 text-[clamp(10px,1.7vw,14px)] leading-relaxed text-foreground sm:p-6">
                      {"$ rileighos today\n\ntoday 2026-09-30\ncheck-offs:\n  [x] 1 exercise (streak 4)\n  [ ] 2 read (streak 2)\ndue today:\n  [ ] 3 finish project notes\n  [ ] 4 review Canvas assignment\n\n$ _"}
                    </pre>
                  </div>
                  <figcaption className="mt-2 text-xs text-muted">
                    today overview · sample terminal output
                  </figcaption>
                </figure>

                <ScreenshotSlot
                  label="Raspberry Pi"
                  detail="A photo of the Raspberry Pi running RileighOS can go here."
                  kind="photo"
                />
              </div>

              <p className="mt-5 text-sm leading-relaxed text-muted">
                RileighOS is a self-hosted command-line productivity tool for
                todos, notes, and daily check-offs. Its &ldquo;today&rdquo;
                overview brings streaks and due tasks together from a server
                that can run on a Raspberry Pi.
              </p>
              <a
                href="https://github.com/RileighLuvsCatz/RileighOS"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block border-b border-muted text-xs hover:border-foreground hover:text-foreground"
              >
                view on GitHub ↗
              </a>
            </section>

            <section
              aria-labelledby="nuzzy-title"
              className="border-t border-border pt-10"
            >
              <div className="mb-4 flex items-baseline justify-between gap-4">
                <h2 id="nuzzy-title" className="text-lg font-medium tracking-tight">
                  Nuzzy
                </h2>
                <span className="shrink-0 text-xs text-muted">02 / 02</span>
              </div>

              <div className="space-y-5">
                {nuzzyScreens.map((screen) => (
                  <ScreenshotSlot key={screen.label} {...screen} />
                ))}
              </div>

              <p className="mt-5 text-sm leading-relaxed text-muted">
                Nuzzy is a browser-based tracker for Pokémon Nuzlocke runs. It
                helps players log encounters by route, follow boss battles, and
                keep their team, box, and graveyard organized across saved runs.
              </p>
              <a
                href="https://github.com/RileighLuvsCatz/Nuzzy"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block border-b border-muted text-xs hover:border-foreground hover:text-foreground"
              >
                view on GitHub ↗
              </a>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
