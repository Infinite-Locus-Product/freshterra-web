import { ComingSoon } from "@/components/ui/coming-soon";

type Params = Promise<{ slug: string }>;

export default async function StorePage({ params }: { params: Params }) {
  const { slug } = await params;
  return (
    <ComingSoon title={`Store: ${slug}`} hint="Store detail — coming soon." />
  );
}
