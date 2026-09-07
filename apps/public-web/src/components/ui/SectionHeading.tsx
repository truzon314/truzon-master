import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  underline?: boolean;
  showGoldBar?: boolean;
  className?: string;
}

export function SectionHeading({ title, subtitle, align = "left", underline = false, showGoldBar = false, className }: SectionHeadingProps) {
  const hasUnderline = underline || showGoldBar;
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <h2
        className={cn(
          "font-heading text-[32px] font-bold leading-tight text-navy-900",
          hasUnderline && "inline-block border-b-[3px] border-gold-400 pb-3",
          subtitle ? "mb-3" : "mb-0"
        )}
      >
        {title}
      </h2>
      {subtitle ? <p className="text-[15px] text-text-body">{subtitle}</p> : null}
    </div>
  );
}
