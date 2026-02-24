import React from "react";
import Layout from "@/components/Layout";

export default function HelpPage() {
  return (
    <Layout>
      <h2>Help</h2>

      <h3>CSV Template</h3>
      <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 10 }}>
        <div style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
          title,description,department,priority,requesterName,assignee{"\n"}
          Fix printer,Printer in room 204 not working,IT,HIGH,Seher,John{"\n"}
          Replace light bulb,Light bulb in hallway flickering,FACILITIES,LOW,Seher,
        </div>
      </div>

      <h3 style={{ marginTop: 16 }}>Statuses + Allowed Transitions</h3>
      <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 10 }}>
        <div>NEW → IN_PROGRESS</div>
        <div>IN_PROGRESS → BLOCKED or DONE</div>
        <div>BLOCKED → IN_PROGRESS</div>
        <div>DONE → no transitions</div>
      </div>
    </Layout>
  );
}