type Entry = { name: string; value: number | string; color?: string };
type Props = { active?: boolean; payload?: Entry[]; label?: string | number };

export default function ChartTooltip({ active, payload, label }: Props) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-[rgba(244,29,0,0.25)] bg-[#0a0b0f]/95 backdrop-blur-md px-2.5 py-1.5 text-[11px] shadow-xl">
      <p className="text-neutral-500 mb-1 font-mono">{label}</p>
      {payload.map((e) => (
        <div key={e.name} className="flex items-center gap-1.5">
          {e.color && (
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: e.color }}
            />
          )}
          <span className="text-neutral-400">{e.name}</span>
          <span className="text-neutral-100 font-mono ml-auto pl-3">{e.value}</span>
        </div>
      ))}
    </div>
  );
}
