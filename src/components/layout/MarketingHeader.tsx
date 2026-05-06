import { Logo } from "@/components/ui/Logo";

export function MarketingHeader() {
  return (
    <header
      role="banner"
      className="from-header-tint bg-linear-to-b to-gray-50 px-6 py-6 md:px-10 md:py-8"
    >
      <Logo
        tone="light"
        width={140}
        height={48}
        priority
        linkToHome
        className="h-8 w-auto md:h-12"
      />
    </header>
  );
}
