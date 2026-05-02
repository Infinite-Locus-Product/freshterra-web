import { ComingSoon } from "@/components/ui/coming-soon";

type Params = Promise<{ slug: string }>;

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  return <ComingSoon title={`Category: ${slug}`} hint="PLP — coming soon." />;
}
