import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import ErrorBanner from "@/components/ErrorBanner";
import InlineError from "@/components/InlineError";
import { changeStatus, deleteWorkOrder, getWorkOrder, updateWorkOrder } from "@/services/api";
import { Priority, Status, WorkOrder } from "@/types/workorder";
import { useRouter } from "next/router";

const nextOptions = (s: Status): Status[] => {
  if (s === "NEW") return ["IN_PROGRESS"];
  if (s === "IN_PROGRESS") return ["BLOCKED", "DONE"];
  if (s === "BLOCKED") return ["IN_PROGRESS"];
  return [];
};

type EditState = {
  title: string;
  description: string;
  priority: Priority;
  assignee: string;
};

export default function WorkOrderDetailsPage() {
  const router = useRouter();
  const id = String(router.query.id || "");

  const [wo, setWo] = useState<WorkOrder | null>(null);
  const [err, setErr] = useState<{ msg: string; requestId?: string } | null>(null);

  const [edit, setEdit] = useState<EditState>({
    title: "",
    description: "",
    priority: "MEDIUM",
    assignee: ""
  });

  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) return;

    (async () => {
      const r = await getWorkOrder(id);
      if (!r.ok) return setErr({ msg: r.error.message, requestId: r.requestId });

      setWo(r.data);
      setEdit({
        title: r.data.title,
        description: r.data.description,
        priority: r.data.priority,
        assignee: r.data.assignee || ""
      });
    })();
  }, [id]);

  const allowedNext = useMemo(() => (wo ? nextOptions(wo.status) : []), [wo]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (edit.title.trim().length < 5) e.title = "Min 5 characters";
    if (edit.description.trim().length < 10) e.description = "Min 10 characters";
    setFieldErr(e);
    return Object.keys(e).length === 0;
  };

  const save = async () => {
    setErr(null);
    if (!wo) return;
    if (!validate()) return;

    const payload: Partial<WorkOrder> = {
      title: edit.title,
      description: edit.description,
      priority: edit.priority,
      assignee: edit.assignee.trim() ? edit.assignee.trim() : null
    };

    const r = await updateWorkOrder(wo.id, payload);
    if (!r.ok) return setErr({ msg: r.error.message, requestId: r.requestId });
    setWo(r.data);
  };

  const doStatus = async (s: Status) => {
    setErr(null);
    if (!wo) return;
    const r = await changeStatus(wo.id, s);
    if (!r.ok) return setErr({ msg: r.error.message, requestId: r.requestId });
    setWo(r.data);
  };

  const del = async () => {
    setErr(null);
    if (!wo) return;
    const okConfirm = window.confirm("Delete this work order?");
    if (!okConfirm) return;
    const r = await deleteWorkOrder(wo.id);
    if (!r.ok) return setErr({ msg: r.error.message, requestId: r.requestId });
    router.push("/workorders");
  };

  return (
    <Layout>
      <h2>Work Order Details</h2>
      {err ? <ErrorBanner message={err.msg} requestId={err.requestId} /> : null}

      {!wo ? (
        <div>Loading...</div>
      ) : (
        <div style={{ display: "grid", gap: 14, maxWidth: 800 }}>
          <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 10 }}>
            <div style={{ fontWeight: 700 }}>{wo.title}</div>
            <div style={{ opacity: 0.8, fontSize: 13 }}>
              {wo.department} • {wo.priority} • {wo.status}
            </div>
            <div style={{ marginTop: 8 }}>{wo.description}</div>
            <div style={{ marginTop: 8, fontSize: 13 }}>Requester: {wo.requesterName}</div>
            <div style={{ marginTop: 4, fontSize: 13 }}>Assignee: {wo.assignee || "—"}</div>
            <div style={{ marginTop: 4, fontSize: 12, opacity: 0.8 }}>Created: {wo.createdAt}</div>
            <div style={{ marginTop: 2, fontSize: 12, opacity: 0.8 }}>Updated: {wo.updatedAt}</div>
          </div>

          <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 10 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Edit (allowed fields)</div>

            <div style={{ display: "grid", gap: 10 }}>
              <div>
                <input
                  value={edit.title}
                  onChange={(e) => setEdit((x) => ({ ...x, title: e.target.value }))}
                  style={{ width: "100%", padding: 10 }}
                />
                <InlineError text={fieldErr.title} />
              </div>

              <div>
                <textarea
                  value={edit.description}
                  onChange={(e) => setEdit((x) => ({ ...x, description: e.target.value }))}
                  style={{ width: "100%", padding: 10, minHeight: 90 }}
                />
                <InlineError text={fieldErr.description} />
              </div>

              <select
                value={edit.priority}
                onChange={(e) => setEdit((x) => ({ ...x, priority: e.target.value as Priority }))}
                style={{ padding: 10 }}
              >
                {(["LOW", "MEDIUM", "HIGH"] as Priority[]).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <input
                value={edit.assignee}
                placeholder="Assignee (optional)"
                onChange={(e) => setEdit((x) => ({ ...x, assignee: e.target.value }))}
                style={{ width: "100%", padding: 10 }}
              />

              <button onClick={save} style={{ padding: 10, borderRadius: 10 }}>
                Save
              </button>
            </div>
          </div>

          <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 10 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Status Transition</div>
            {allowedNext.length === 0 ? (
              <div>No transitions allowed from {wo.status}</div>
            ) : (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {allowedNext.map((s) => (
                  <button key={s} onClick={() => doStatus(s)} style={{ padding: "8px 12px", borderRadius: 10 }}>
                    Move to {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <button
              onClick={del}
              style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #e11d48" }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}