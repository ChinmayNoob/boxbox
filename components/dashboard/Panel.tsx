type PanelProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Panel({ children, className = "" }: PanelProps) {
  return (
    <div
      className={`rounded-lg border border-[rgba(244,29,0,0.12)] bg-[#0d1117]/80 backdrop-blur-sm p-3 ${className}`}
    >
      {children}
    </div>
  );
}
