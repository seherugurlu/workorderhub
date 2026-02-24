import React from "react";
import Link from "next/link";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "system-ui, Arial", padding: 18, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/workorders">Work Orders</Link>
        <Link href="/workorders/create">Create</Link>
        <Link href="/data-transfer">Bulk Upload</Link>
        <Link href="/help">Help</Link>
      </div>
      {props.children}
    </div>
  );
}