import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import ErrorBanner from "@/components/ErrorBanner";
import { listWorkOrders } from "@/services/api";
import { WorkOrder, Status } from "@/types/workorder";
import Link from "next/link";

const statuses: Status[] = ["NEW", "IN_PROGRESS", "BLOCKED", "DONE"];

export default function DashboardPage() {
  const [items, setItems] = useState<WorkOrder[]>([]);
  const [err, setErr] = useState<{ msg: string; requestId?: string } | null>(null);

  useEffect(() => {
    (async () => {
      const r = await listWorkOrders({ page: 1, limit: 200 });
      if (!r.ok) return setErr({ msg: r.error.message, requestId: r.requestId });
      setItems(r.data.items);
    })();
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { NEW: 0, IN_PROGRESS: 0, BLOCKED: 0, DONE: 0 };
    items.forEach((x) => (c[x.status] = (c[x.status] || 0) + 1));
    return c;
  }, [items]);

  return (
    <Layout>
      <h2>Dashboard</h2>
      {err ? <ErrorBanner message={err.msg} requestId={err.requestId} /> : null}

      <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
        {statuses.map((s) => (
          <div key={s} style={{ border: "1px solid #ddd", padding: 10, borderRadius: 10, minWidth: 160 }}>
            <div style={{ fontWeight: 700 }}>{s}</div>
            <div style={{ fontSize: 28 }}>{counts[s]}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {statuses.map((s) => (
          <div key={s} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 10 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{s}</div>
            {items
              .filter((x) => x.status === s)
              .slice(0, 12)
              .map((x) => (
                <div key={x.id} style={{ border: "1px solid #eee", padding: 8, borderRadius: 8, marginBottom: 8 }}>
                  <div style={{ fontWeight: 600 }}>{x.title}</div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>{x.department} • {x.priority}</div>
                  <div style={{ marginTop: 6 }}>
                    <Link href={`/workorders/${x.id}`}>Open</Link>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </Layout>
  );
}