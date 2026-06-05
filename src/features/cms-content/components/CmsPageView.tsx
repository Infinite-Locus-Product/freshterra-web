import Link from "next/link";

import { PageShell } from "@/components/layout/PageShell";
import { Heading } from "@/components/ui/Heading";

import type { PageContent } from "@/features/cms-content/page-content-types";

/**
 * Server-rendered renderer for a CMS page (`GET /content/pages/:slug`). Renders
 * the title + ordered content blocks. Only `richText` blocks are handled today;
 * unknown block types are skipped so new shapes never break the page.
 *
 * NOTE: `richText.html` is injected with `dangerouslySetInnerHTML`. It comes
 * from the trusted BFF/Strapi, but if editors can author arbitrary HTML this
 * should be sanitized (e.g. DOMPurify) before render — flagged as a follow-up
 * (adding that dependency needs sign-off).
 */
const PROSE_CLASS =
  "max-w-3xl text-text-secondary text-[1.0625rem] leading-7 " +
  "[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-text-primary " +
  "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-text-primary " +
  "[&_p]:mb-4 [&_a]:text-brand-600 [&_a]:underline [&_a]:underline-offset-2 " +
  "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1";

export function CmsPageView({ page }: { page: PageContent }) {
  return (
    <section className="py-8 md:py-10">
      <PageShell>
        <nav
          aria-label="Breadcrumb"
          className="text-text-secondary mb-4 flex items-center gap-2 text-sm"
        >
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span aria-hidden>›</span>
          <span className="text-text-primary">{page.title}</span>
        </nav>

        <Heading level={1} variant="h2" className="mb-6">
          {page.title}
        </Heading>

        <div className={PROSE_CLASS}>
          {page.blocks.map((block, i) =>
            block.type === "richText" && block.html ? (
              <div
                key={i}
                dangerouslySetInnerHTML={{ __html: block.html }}
              />
            ) : null,
          )}
        </div>
      </PageShell>
    </section>
  );
}

export default CmsPageView;
