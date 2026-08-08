import SocialLinks from "@/components/social-links";
import SiteHeader from "@/components/site-header";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center px-8 md:px-16 lg:px-32 py-8">
      <div className="w-full border border-border rounded-lg overflow-hidden">
        <div className="bg-surface flex items-center gap-1.5 px-3 py-2">
          <span className="w-2.5 h-2.5 rounded-full bg-muted" />
          <span className="w-2.5 h-2.5 rounded-full bg-muted" />
          <span className="w-2.5 h-2.5 rounded-full bg-muted" />
        </div>
        <div className="p-7">
          <SiteHeader />

          <h1 className="text-[28px] font-medium mb-3 tracking-tight">
            hey, I&apos;m Rileigh
          </h1>
          <p className="text-sm leading-relaxed text-muted mb-6 max-w-[440px]">
            I build things and write about them here. currently tracking a few habits I&apos;m trying to stick with.
          </p>

          <div className="flex items-center gap-4 mb-6">
            <SocialLinks />
            <a
              href="/resume.pdf"
              className="text-xs px-3 py-1.5 rounded-md border border-border text-muted hover:text-foreground hover:border-foreground transition-colors"
            >
              resume
            </a>
          </div>

          <div className="border border-border rounded-lg p-4 mb-5">
            <p className="text-xs text-muted mb-1">latest post</p>
            <p className="text-sm leading-snug">
              Placeholder for latest post. I&apos;m not sure what I want to write about yet, but I&apos;ll figure that out eventually.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
