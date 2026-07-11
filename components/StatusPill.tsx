type Variant = "muted" | "amber" | "accent" | "dark";

const STATUS_META: Record<string, { label: string; variant: Variant }> = {
  pending_payment: { label: "Awaiting payment", variant: "muted" },
  quote_requested: { label: "Quote requested", variant: "muted" },
  quoted: { label: "Quote ready — pay now", variant: "amber" },
  paid: { label: "In review", variant: "accent" },
  delivered: { label: "Delivered", variant: "dark" },
};

const VARIANT_CLASSES: Record<Variant, string> = {
  muted: "bg-black/5 text-inksoft",
  amber: "bg-[#FFF1D6] text-[#8A5A00]",
  accent: "bg-accenttint text-accenttinttext",
  dark: "bg-darkcard text-accent",
};

export default function StatusPill({ status }: { status: string }) {
  const meta = STATUS_META[status] || { label: status, variant: "muted" as Variant };
  return (
    <span className={`inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full ${VARIANT_CLASSES[meta.variant]}`}>
      {meta.label}
    </span>
  );
}
