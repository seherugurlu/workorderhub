import React, { useState } from "react";
import Layout from "@/components/Layout";
import ErrorBanner from "@/components/ErrorBanner";
import { bulkUploadCsv } from "@/services/api";

type RowError = {
  row: number;
  field?: string;
  reason: string;
};

type BulkUploadResult = {
  uploadId?: string;
  strategy?: string;
  totalRows: number;
  accepted: number;
  rejected: number;
  errors?: RowError[];
  requestId?: string; // we add this locally after success
};

export default function DataTransferPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<BulkUploadResult | null>(null);
  const [err, setErr] = useState<{ msg: string; requestId?: string } | null>(null);

  const upload = async () => {
    setErr(null);
    setResult(null);
    if (!file) return setErr({ msg: "Please choose a CSV file first" });

    const r = await bulkUploadCsv(file);
    if (!r.ok) return setErr({ msg: r.error.message, requestId: r.requestId });

    // r.data is unknown in our API typing, so we cast once to the shape we expect
    const data = r.data as Omit<BulkUploadResult, "requestId">;

    setResult({ ...data, requestId: r.requestId });
  };

  return (
    <Layout>
      <h2>Bulk Upload (CSV)</h2>

      <div style={{ marginBottom: 10, opacity: 0.9 }}>
        Required headers: title, description, department, priority, requesterName (optional: assignee)
      </div>

      {err ? <ErrorBanner message={err.msg} requestId={err.requestId} /> : null}

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
        <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button onClick={upload} style={{ padding: "8px 12px", borderRadius: 10 }}>
          Upload
        </button>
      </div>

      {result ? (
        <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 10 }}>
          <div style={{ fontWeight: 700 }}>Upload Result</div>
          <div style={{ marginTop: 8 }}>
            uploadId: {result.uploadId}
            <br />
            strategy: {result.strategy}
            <br />
            totalRows: {result.totalRows}
            <br />
            accepted: {result.accepted}
            <br />
            rejected: {result.rejected}
            <br />
            requestId: {result.requestId}
          </div>

          <div style={{ marginTop: 12, fontWeight: 700 }}>Row Errors</div>
          {result.errors?.length ? (
            <div style={{ marginTop: 8 }}>
              {result.errors.map((e: RowError, idx: number) => (
                <div
                  key={idx}
                  style={{ padding: 8, border: "1px solid #eee", borderRadius: 8, marginBottom: 6 }}
                >
                  row {e.row} • {e.field ?? "—"} • {e.reason}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ marginTop: 8 }}>No row errors</div>
          )}
        </div>
      ) : null}
    </Layout>
  );
}