import { useMemo, useState } from "react";
import { Check, Download, Eye, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "./dashboard-shell";
import { DataTable } from "./data-table";
import { RecordModal } from "./record-modal";
import { StatusBadge } from "./status-badge";
import { useApp } from "./app-provider";

const fields = [
  { key: "number", label: "Invoice number", required: true },
  {
    key: "site",
    label: "Site",
    type: "select",
    options: ["CO", "WD001", "WD002", "WD003", "WD004", "WD005", "WD006", "WD007", "WD008"],
    required: true,
  },
  { key: "vendor", label: "Vendor", required: true },
  { key: "amount", label: "Amount (₹)", type: "number", required: true },
  { key: "date", label: "Invoice date", type: "date", required: true },
  { key: "description", label: "Description", type: "textarea" },
];

export function InvoicesPage({ role, status }) {
  const { data, add, setInvoiceStatus } = useApp();
  const [open, setOpen] = useState(false);

  const rows = useMemo(
    () => (status ? data.invoices.filter((x) => x.status === status) : data.invoices),
    [data.invoices, status]
  );

  const canReview = role !== "site_user";

  const cols = [
    { key: "number", label: "Invoice #" },
    { key: "site", label: "Site" },
    { key: "vendor", label: "Vendor" },
    {
      key: "amount",
      label: "Amount",
      render: (r) => `₹${Number(r.amount).toLocaleString("en-IN")}`,
    },
    { key: "date", label: "Date" },
    {
      key: "status",
      label: "Status",
      render: (r) => <StatusBadge status={String(r.status)} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (r) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" aria-label="View invoice">
            <Eye />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Download invoice">
            <Download />
          </Button>
          {canReview && r.status === "Pending" && (
            <>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Approve invoice"
                onClick={() => setInvoiceStatus(r.id, "Approved")}
              >
                <Check />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Reject invoice"
                onClick={() => {
                  const reason = window.prompt("Reason for rejection");
                  if (reason) setInvoiceStatus(r.id, "Rejected", reason);
                }}
              >
                <X />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardShell
      role={role}
      title={
        status
          ? `${status} invoices`
          : role === "site_user"
          ? "My invoices"
          : "Invoice review"
      }
      action={
        role === "site_user" ? (
          <Button onClick={() => setOpen(true)}>
            <Plus />
            New invoice
          </Button>
        ) : undefined
      }
    >
      <section className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-5">
        <DataTable rows={rows} columns={cols} />
      </section>
      <RecordModal
        open={open}
        onOpenChange={setOpen}
        title="Create invoice"
        fields={fields}
        onSave={(v) => add("invoices", { ...v, status: "Pending" })}
      />
    </DashboardShell>
  );
}
