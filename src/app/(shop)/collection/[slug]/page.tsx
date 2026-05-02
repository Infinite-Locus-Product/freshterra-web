import { ComingSoon } from "@/components/ui/coming-soon";

type Params = Promise<{ slug: string }>;

export default async function CollectionPage({ params }: { params: Params }) {
  const { slug } = await params;
  return (
    <ComingSoon
      title={`Collection: ${slug}`}
      hint="Collection PLP — coming soon."
    />
  );
}
