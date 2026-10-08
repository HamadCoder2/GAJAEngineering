import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  admins as seedAdmins,
  invoices as seedInvoices,
  locations as seedLocations,
  sites as seedSites,
  states as seedStates,
  users as seedUsers,
} from "@/lib/demo-data";
import { readSession } from "@/lib/session";

const defaults = {
  states: seedStates,
  locations: seedLocations,
  sites: seedSites,
  admins: seedAdmins,
  users: seedUsers,
  invoices: seedInvoices,
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [session, setSession] = useState(null);
  const [data, setData] = useState(defaults);

  useEffect(() => {
    setSession(readSession());
    try {
      const saved = localStorage.getItem("gaja-ops-data");
      if (saved) setData(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const persist = (next) => {
    setData(next);
    localStorage.setItem("gaja-ops-data", JSON.stringify(next));
  };

  const value = useMemo(
    () => ({
      session,
      setSession,
      data,
      add: (c, row) => {
        persist({ ...data, [c]: [...data[c], { ...row, id: Date.now() }] });
        toast.success("Record added");
      },
      update: (c, row) => {
        persist({
          ...data,
          [c]: data[c].map((x) => (x.id === row.id ? row : x)),
        });
        toast.success("Changes saved");
      },
      remove: (c, id) => {
        persist({ ...data, [c]: data[c].filter((x) => x.id !== id) });
        toast.success("Record deleted");
      },
      setInvoiceStatus: (id, status, reason) => {
        persist({
          ...data,
          invoices: data.invoices.map((x) =>
            x.id === id ? { ...x, status, reason: reason ?? "" } : x
          ),
        });
        toast.success(`Invoice ${status.toLowerCase()}`);
      },
    }),
    [session, data]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const v = useContext(AppContext);
  if (!v) throw new Error("useApp outside provider");
  return v;
}

export function canAccess(role, path) {
  if (!role) return false;
  return path.startsWith(`/${role.replaceAll("_", "-")}`);
}
