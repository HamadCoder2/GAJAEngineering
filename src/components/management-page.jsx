import { useState } from "react";
import { KeyRound, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DashboardShell } from "./dashboard-shell";
import { DataTable } from "./data-table";
import { RecordModal } from "./record-modal";
import { StatusBadge } from "./status-badge";
import { useApp } from "./app-provider";

const config = {
  states: {
    title: "Manage states",
    singular: "State",
    fields: [
      { key: "name", label: "State name", required: true },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["Active", "Inactive"],
        required: true,
      },
    ],
    columns: [
      { key: "name", label: "State name" },
      {
        key: "status",
        label: "Status",
        render: (r) => <StatusBadge status={String(r.status)} />,
      },
    ],
  },
  locations: {
    title: "Manage locations",
    singular: "Location",
    fields: [
      { key: "name", label: "Location", required: true },
      {
        key: "state",
        label: "State",
        type: "select",
        options: ["Telangana", "Andhra Pradesh", "Karnataka", "Maharashtra"],
        required: true,
      },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["Active", "Inactive"],
        required: true,
      },
    ],
    columns: [
      { key: "name", label: "Location" },
      { key: "state", label: "State" },
      {
        key: "status",
        label: "Status",
        render: (r) => <StatusBadge status={String(r.status)} />,
      },
    ],
  },
  sites: {
    title: "Manage sites",
    singular: "Site",
    fields: [
      { key: "code", label: "Site code", required: true },
      { key: "name", label: "Site name", required: true },
      { key: "location", label: "Location", required: true },
      { key: "state", label: "State", required: true },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["Active", "Inactive"],
        required: true,
      },
    ],
    columns: [
      { key: "code", label: "Site code" },
      { key: "name", label: "Site name" },
      { key: "location", label: "Location" },
      { key: "state", label: "State" },
    ],
  },
  admins: {
    title: "Manage site admins",
    singular: "Site admin",
    fields: [
      { key: "name", label: "Full name", required: true },
      { key: "phone", label: "Phone", type: "tel", required: true },
      { key: "employee", label: "Employee ID", required: true },
      { key: "email", label: "Email", type: "email", required: true },
      { key: "assigned", label: "Assigned site", required: true },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["Active", "Inactive"],
        required: true,
      },
    ],
    columns: [
      { key: "name", label: "User name" },
      { key: "phone", label: "Phone" },
      { key: "employee", label: "Emp ID" },
      { key: "email", label: "Email" },
      { key: "assigned", label: "Assigned site" },
      {
        key: "status",
        label: "Status",
        render: (r) => <StatusBadge status={String(r.status)} />,
      },
    ],
  },
  users: {
    title: "Manage site users",
    singular: "Site user",
    fields: [
      { key: "name", label: "Full name", required: true },
      { key: "phone", label: "Phone", type: "tel", required: true },
      { key: "employee", label: "Employee ID", required: true },
      { key: "email", label: "Email", type: "email", required: true },
      { key: "assigned", label: "Assigned site", required: true },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["Active", "Inactive"],
        required: true,
      },
    ],
    columns: [
      { key: "name", label: "User name" },
      { key: "phone", label: "Phone" },
      { key: "employee", label: "Emp ID" },
      { key: "email", label: "Email" },
      { key: "assigned", label: "Assigned site" },
      {
        key: "status",
        label: "Status",
        render: (r) => <StatusBadge status={String(r.status)} />,
      },
    ],
  },
};

export function ManagementPage({ role, collection }) {
  const { data, add, update, remove } = useApp();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [step, setStep] = useState(1);
  const c = config[collection];

  const cols = [
    { key: "id", label: "S.No" },
    ...c.columns,
    {
      key: "actions",
      label: "Actions",
      render: (r) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Edit ${c.singular}`}
            onClick={() => {
              setEditing(r);
              setOpen(true);
            }}
          >
            <Pencil />
          </Button>
          {collection === "admins" || collection === "users" ? (
            <Button variant="ghost" size="icon" aria-label="Reset password">
              <KeyRound />
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Delete ${c.singular}`}
            onClick={() => {
              setStep(1);
              setDeleting(r);
            }}
          >
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardShell
      role={role}
      title={c.title}
      action={
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus />
          Add {c.singular}
        </Button>
      }
    >
      <section className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-5">
        <DataTable rows={data[collection]} columns={cols} />
      </section>
      <RecordModal
        open={open}
        onOpenChange={setOpen}
        title={`${editing ? "Edit" : "Add"} ${c.singular}`}
        fields={c.fields}
        initial={editing}
        onSave={(v) =>
          editing
            ? update(collection, { ...editing, ...v })
            : add(collection, v)
        }
      />
      <AlertDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {step === 1
                ? `Delete this ${c.singular.toLowerCase()}?`
                : "Final confirmation"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {step === 1
                ? "This record will be removed."
                : "Are you absolutely sure? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {step === 1 ? (
              <Button variant="destructive" onClick={() => setStep(2)}>
                Continue
              </Button>
            ) : (
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  if (deleting) remove(collection, deleting.id);
                  setDeleting(null);
                }}
              >
                Yes, delete
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  );
}
