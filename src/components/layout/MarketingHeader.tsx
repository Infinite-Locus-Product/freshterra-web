import { Logo } from "@/components/ui/Logo";

export function MarketingHeader() {
  return (
    <header
      role="banner"
      className="from-header-tint bg-linear-to-b to-gray-50 px-6 py-6 text-center md:px-10 md:py-8 md:text-left"
    >
      <Logo
        tone="light"
        width={140}
        height={48}
        priority
        linkToHome
        className="h-8 w-[93px] md:h-12 md:w-[140px]"
      />
    </header>
  );
}
