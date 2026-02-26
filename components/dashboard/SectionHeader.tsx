"use client";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export default function SectionHeader({
  title,
  subtitle,
  children,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
      <div className="min-w-0">
        <h3 className="text-[13px] font-f1-regular text-neutral-100 uppercase tracking-wide truncate">
          {title}
        </h3>
        {subtitle && (
          <p className="text-[11px] text-neutral-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  );
}
