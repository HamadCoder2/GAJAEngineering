import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, ArrowUpDown, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DataTable({ rows, columns }) {
  const [q, setQ] = useState("");
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(columns[0]?.key ?? "id");
  const [asc, setAsc] = useState(true);

  const filtered = useMemo(
    () =>
      rows
        .filter((r) =>
          Object.values(r).some((v) =>
            String(v).toLowerCase().includes(q.toLowerCase())
          )
        )
        .sort(
          (a, b) =>
            String(a[sort] ?? "").localeCompare(
              String(b[sort] ?? ""),
              undefined,
              { numeric: true }
            ) * (asc ? 1 : -1)
        ),
    [rows, q, sort, asc]
  );

  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const shown = filtered.slice(
    (Math.min(page, pages) - 1) * size,
    Math.min(page, pages) * size
  );

  return (
    <div>
      <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <label className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
          Show{" "}
          <select
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPage(1);
            }}
            className="h-9 rounded-md border border-input bg-background px-2 text-foreground"
          >
            <option>5</option>
            <option>10</option>
            <option>25</option>
          </select>
        </label>
        <label className="relative block">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <input
            aria-label="Search records"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search records"
            className="h-9 w-40 rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-64"
          />
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="whitespace-nowrap px-3 py-3 font-bold text-primary"
                >
                  <button
                    className="flex items-center gap-2"
                    onClick={() => {
                      if (sort === c.key) setAsc(!asc);
                      else {
                        setSort(c.key);
                        setAsc(true);
                      }
                    }}
                  >
                    {c.label}
                    <ArrowUpDown className="size-3 text-muted-foreground" />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border/70 transition-colors hover:bg-muted/50"
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className="whitespace-nowrap px-3 py-3 text-foreground"
                  >
                    {c.render ? c.render(row) : String(row[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && (
          <div className="grid place-items-center py-16 text-center text-muted-foreground">
            <Inbox className="mb-3 size-8" />
            <p>No records found</p>
          </div>
        )}
      </div>
      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-sm text-muted-foreground">
        <span className="truncate">
          Showing {shown.length ? (page - 1) * size + 1 : 0}–
          {Math.min(page * size, filtered.length)} of {filtered.length}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft />
          </Button>
          <span className="min-w-16 text-center">
            {page} / {pages}
          </span>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next page"
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
