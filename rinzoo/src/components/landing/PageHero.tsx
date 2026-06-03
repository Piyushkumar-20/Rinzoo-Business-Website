import { Badge } from "@/components/ui/badge";

interface PageHeroProps {
  badge: string;
  title: React.ReactNode;
  subtitle?: string;
}

// Shared dark hero used across all inner marketing pages for a consistent look.
export function PageHero({ badge, title, subtitle }: PageHeroProps) {
  return (
    <section className="relative px-5 sm:px-8 pt-16 pb-14 sm:pt-20 sm:pb-16 overflow-hidden">
      <div className="pointer-events-none size-96 blur-3xl rounded-full bg-[#2b7fff]/15 absolute -right-24 -top-10" />
      <div className="pointer-events-none size-72 bg-[oklch(0.62_0.19_47)]/15 blur-3xl rounded-full absolute -left-20 -bottom-10" />
      <div className="relative text-center flex flex-col items-center gap-4">
        <Badge className="font-semibold rounded-full bg-neutral-800 text-[#5ea3ff] text-xs leading-4 px-3 py-1">
          {badge}
        </Badge>
        <h1 className="font-extrabold text-neutral-50 text-4xl sm:text-5xl leading-[1.05] tracking-tight max-w-3xl">
          {title}
        </h1>
        {subtitle && <p className="max-w-xl text-[#a1a1a1] text-base leading-7">{subtitle}</p>}
      </div>
    </section>
  );
}
