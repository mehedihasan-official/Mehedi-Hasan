export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-500 blur-[120px]" />
        <div className="absolute bottom-0 right-1/3 h-64 w-64 rounded-full bg-accent-500 blur-[140px]" />
      </div>
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}
