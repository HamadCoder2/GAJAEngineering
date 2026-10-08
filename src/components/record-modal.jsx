import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function RecordModal({
  open,
  onOpenChange,
  title,
  fields,
  initial,
  onSave,
}) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(initial ?? {});
    setErrors({});
  }, [initial, open]);

  function submit() {
    const shape = {};
    fields.forEach((f) => {
      let s =
        f.type === "email"
          ? z.string().trim().email("Enter a valid email")
          : f.type === "number"
          ? z.coerce.number().positive("Enter a positive amount")
          : z.string().trim().max(f.type === "textarea" ? 1000 : 180);
      if (f.required) s = s.refine((v) => String(v).length > 0, "Required");
      shape[f.key] = s;
    });

    const parsed = z.object(shape).safeParse(values);
    if (!parsed.success) {
      const next = {};
      parsed.error.issues.forEach((i) => {
        next[String(i.path[0])] = i.message;
      });
      setErrors(next);
      return;
    }
    onSave(parsed.data);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Complete the required details, then save.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2 sm:grid-cols-2">
          {fields.map((f) => (
            <label
              key={f.key}
              className={
                f.type === "textarea"
                  ? "grid gap-1.5 sm:col-span-2"
                  : "grid gap-1.5"
              }
            >
              <span className="text-sm font-semibold">
                {f.label}
                {f.required && " *"}
              </span>
              {f.type === "select" ? (
                <select
                  value={String(values[f.key] ?? "")}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [f.key]: e.target.value }))
                  }
                  className="h-10 rounded-md border border-input bg-background px-3"
                >
                  <option value="">Select</option>
                  {f.options?.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              ) : f.type === "textarea" ? (
                <textarea
                  value={String(values[f.key] ?? "")}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [f.key]: e.target.value }))
                  }
                  className="min-h-24 rounded-md border border-input bg-background p-3"
                />
              ) : (
                <input
                  type={f.type ?? "text"}
                  value={String(values[f.key] ?? "")}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [f.key]: e.target.value }))
                  }
                  className="h-10 rounded-md border border-input bg-background px-3"
                />
              )}
              {errors[f.key] && (
                <span className="text-xs text-destructive">
                  {errors[f.key]}
                </span>
              )}
            </label>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Save record</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
