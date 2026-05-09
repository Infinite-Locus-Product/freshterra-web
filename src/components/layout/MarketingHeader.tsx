import { Logo } from "@/components/ui/Logo";

export function MarketingHeader() {
  return (
    <header
      role="banner"
      className="from-header-tint bg-linear-to-b to-gray-50 px-6 py-6 md:px-10 md:py-8"
    >
      <div className="flex justify-center md:justify-start">
        <Logo
          tone="light"
          width={140}
          height={48}
          priority
          linkToHome
          className="h-8 w-[93px] md:h-12 md:w-[140px]"
        />
      </div>
    </header>
  );
}
