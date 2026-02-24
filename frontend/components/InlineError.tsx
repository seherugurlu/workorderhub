import React from "react";

export default function InlineError(props: { text?: string }) {
  if (!props.text) return null;
  return <div style={{ color: "#e11d48", fontSize: 12, marginTop: 4 }}>{props.text}</div>;
}