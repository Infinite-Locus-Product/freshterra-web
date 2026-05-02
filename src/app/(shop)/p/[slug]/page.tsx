import { ComingSoon } from "@/components/ui/coming-soon";

type Params = Promise<{ slug: string }>;

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  return <ComingSoon title={`Product: ${slug}`} hint="PDP — coming soon." />;
}
