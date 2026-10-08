import { cn } from "@/lib/utils";

export function StatusBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-bold",
        status === "Active" || status === "Approved"
          ? "bg-success/15 text-success"
          : status === "Pending"
          ? "bg-warning/15 text-warning"
          : status === "S3"
          ? "bg-accent text-accent-foreground"
          : "bg-destructive/15 text-destructive"
      )}
    >
      {status}
    </span>
  );
}
