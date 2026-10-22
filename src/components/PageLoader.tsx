export default function PageLoader() {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center gap-3">
      <div className="flex gap-1.5">
        <span className="h-1.5 w-1.5 animate-led rounded-full bg-accent" />
        <span className="h-1.5 w-1.5 animate-led rounded-full bg-accent [animation-delay:0.2s]" />
        <span className="h-1.5 w-1.5 animate-led rounded-full bg-accent [animation-delay:0.4s]" />
      </div>
      <p className="font-mono text-[11px] uppercase tracking-widest text-ink-3">加载中</p>
    </div>
  );
}
