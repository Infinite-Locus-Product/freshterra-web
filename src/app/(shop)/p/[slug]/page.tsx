import { permanentRedirect } from "next/navigation";

type Params = Promise<{ slug: string }>;

/**
 * Legacy PDP path. The canonical product URL is now `/product/[slug]`; this
 * 308-redirects old `/p/...` links (and any external deeplinks) there.
 */
export default async function LegacyProductRedirect({
  params,
}: Readonly<{ params: Params }>) {
  const { slug } = await params;
  permanentRedirect(`/product/${slug}`);
}
