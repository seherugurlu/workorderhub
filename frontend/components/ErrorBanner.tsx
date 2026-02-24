import React from "react";

export default function ErrorBanner(props: { title?: string; message: string; requestId?: string }) {
  return (
    <div style={{ border: "1px solid #e11d48", padding: 12, borderRadius: 8, background: "#fff1f2" }}>
      <div style={{ fontWeight: 700 }}>{props.title || "Something went wrong"}</div>
      <div style={{ marginTop: 6 }}>{props.message}</div>
      {props.requestId ? <div style={{ marginTop: 6, fontSize: 12 }}>requestId: {props.requestId}</div> : null}
    </div>
  );
}