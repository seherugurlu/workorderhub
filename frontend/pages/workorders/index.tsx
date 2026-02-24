import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import ErrorBanner from "@/components/ErrorBanner";
import { listWorkOrders } from "@/services/api";
import { WorkOrder } from "@/types/workorder";
import Link from "next/link";

type FilterKey = "status" | "department" | "priority" | "assignee" | "q";

type FiltersState = Record<FilterKey, string>;

export default function WorkOrdersPage() {
  const [items, setItems] = useState<WorkOrder[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState<FiltersState>({
    status: "",
    department: "",
    priority: "",
    assignee: "",
    q: ""
  });

  const [err, setErr] = useState<{ msg: string; requestId?: string } | null>(null);

  const load = async (p: number = page, l: number = limit) => {
    setErr(null);

    const r = await listWorkOrders({ ...filters, page: p, limit: l });

    if (!r.ok) {
      setErr({ msg: r.error.message, requestId: r.requestId });
      return;
    }

    setItems(r.data.items);
    setPage(r.data.page);
    setLimit(r.data.limit);
    setTotal(r.data.total);
  };

  useEffect(() => {
    load(1, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pages = Math.max(1, Math.ceil(total / limit));

  const filterKeys: FilterKey[] = ["status", "department", "priority", "assignee", "q"];

  return (
    <Layout>
      <h2>Work Orders</h2>
      {err ? <ErrorBanner message={err.msg} requestId={err.requestId} /> : null}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        {filterKeys.map((k) => (
          <input
            key={k}
            placeholder={k}
            value={filters[k]}
            onChange={(e) => setFilters((f) => ({ ...f, [k]: e.target.value }))}
            style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
          />
        ))}
        <button onClick={() => load(1, limit)} style={{ padding: "8px 12px", borderRadius: 8 }}>
          Apply
        </button>
      </div>

      <div style={{ border: "1px solid #ddd", borderRadius: 10, overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
            background: "#f4f4f5",
            padding: 10,
            fontWeight: 700
          }}
        >
          <div>Title</div>
          <div>Dept</div>
          <div>Priority</div>
          <div>Status</div>
          <div></div>
        </div>

        {items.map((x) => (
          <div
            key={x.id}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
              padding: 10,
              borderTop: "1px solid #eee"
            }}
          >
            <div>{x.title}</div>
            <div>{x.department}</div>
            <div>{x.priority}</div>
            <div>{x.status}</div>
            <div>
              <Link href={`/workorders/${x.id}`}>View</Link>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center" }}>
        <button disabled={page <= 1} onClick={() => load(page - 1, limit)}>
          Prev
        </button>
        <div>
          Page {page} / {pages}
        </div>
        <button disabled={page >= pages} onClick={() => load(page + 1, limit)}>
          Next
        </button>
        <select
          value={limit}
          onChange={(e) => {
            const l = Number(e.target.value);
            setLimit(l);
            load(1, l);
          }}
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </Layout>
  );
}