import React, { useState } from "react";
import Layout from "@/components/Layout";
import ErrorBanner from "@/components/ErrorBanner";
import InlineError from "@/components/InlineError";
import { createWorkOrder } from "@/services/api";
import { Department, Priority } from "@/types/workorder";
import { useRouter } from "next/router";

type FormState = {
  title: string;
  description: string;
  department: Department;
  priority: Priority;
  requesterName: string;
  assignee: string; 
};

export default function CreateWorkOrderPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    department: "IT",
    priority: "MEDIUM",
    requesterName: "",
    assignee: ""
  });

  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});
  const [apiErr, setApiErr] = useState<{ msg: string; requestId?: string } | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.title.trim().length < 5) e.title = "Min 5 characters";
    if (form.description.trim().length < 10) e.description = "Min 10 characters";
    if (form.requesterName.trim().length < 3) e.requesterName = "Min 3 characters";
    setFieldErr(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    setApiErr(null);
    if (!validate()) return;

    const payload = {
      ...form,
      assignee: form.assignee.trim() ? form.assignee.trim() : null
    };

    const r = await createWorkOrder(payload);
    if (!r.ok) return setApiErr({ msg: r.error.message, requestId: r.requestId });

    router.push(`/workorders/${r.data.id}`);
  };

  return (
    <Layout>
      <h2>Create Work Order</h2>
      {apiErr ? <ErrorBanner message={apiErr.msg} requestId={apiErr.requestId} /> : null}

      <div style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <div>
          <input
            value={form.title}
            placeholder="Title"
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            style={{ width: "100%", padding: 10 }}
          />
          <InlineError text={fieldErr.title} />
        </div>

        <div>
          <textarea
            value={form.description}
            placeholder="Description"
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            style={{ width: "100%", padding: 10, minHeight: 90 }}
          />
          <InlineError text={fieldErr.description} />
        </div>

        <select
          value={form.department}
          onChange={(e) => setForm((f) => ({ ...f, department: e.target.value as Department }))}
          style={{ padding: 10 }}
        >
          {(["FACILITIES", "IT", "SECURITY", "HR"] as Department[]).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={form.priority}
          onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as Priority }))}
          style={{ padding: 10 }}
        >
          {(["LOW", "MEDIUM", "HIGH"] as Priority[]).map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <div>
          <input
            value={form.requesterName}
            placeholder="Requester Name"
            onChange={(e) => setForm((f) => ({ ...f, requesterName: e.target.value }))}
            style={{ width: "100%", padding: 10 }}
          />
          <InlineError text={fieldErr.requesterName} />
        </div>

        <input
          value={form.assignee}
          placeholder="Assignee (optional)"
          onChange={(e) => setForm((f) => ({ ...f, assignee: e.target.value }))}
          style={{ width: "100%", padding: 10 }}
        />

        <button onClick={submit} style={{ padding: 12, borderRadius: 10 }}>
          Create
        </button>
      </div>
    </Layout>
  );
}