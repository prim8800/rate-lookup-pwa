"use client";
import { useEffect, useState } from "react";

type Rate = { client: string; region: string; classification: string; bill: number; pay: number };

export default function Home() {
  const [client, setClient] = useState("");
  const [region, setRegion] = useState("");
  const [classification, setClassification] = useState("");
  const [results, setResults] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchRates() {
    setLoading(true);
    const qs = new URLSearchParams();
    if (client) qs.set("client", client);
    if (region) qs.set("region", region);
    if (classification) qs.set("classification", classification);

    const res = await fetch(`/api/rates?${qs.toString()}`);
    const data = await res.json();
    setResults(data.results ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchRates();
  }, [client, region, classification]);

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    alert("Copied");
  };

  return (
    <main style={{ padding: 16, maxWidth: 720, margin: "0 auto", fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Rate Lookup</h1>

      <div style={{ display: "grid", gap: 10 }}>
        <select value={client} onChange={(e) => setClient(e.target.value)} style={selectStyle}>
          <option value="">Client (All)</option>
          <option value="ONEOK">ONEOK</option>
        </select>

        <select value={region} onChange={(e) => setRegion(e.target.value)} style={selectStyle}>
          <option value="">Region (All)</option>
          <option value="TX">TX</option>
        </select>

        <select value={classification} onChange={(e) => setClassification(e.target.value)} style={selectStyle}>
          <option value="">Classification (All)</option>
          <option value="CWI">CWI</option>
          <option value="Chief">Chief</option>
        </select>
      </div>

      <div style={{ marginTop: 14, opacity: 0.8 }}>
        {loading ? "Loading…" : `${results.length} result(s)`}
      </div>

      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        {results.map((r, i) => (
          <div key={i} style={cardStyle}>
            <div style={{ fontWeight: 800 }}>
              {r.client} • {r.region} • {r.classification}
            </div>
            <div style={{ marginTop: 6 }}>
              Bill: <b>${r.bill}</b> &nbsp; Pay: <b>${r.pay}</b>
            </div>
            <button
              onClick={() =>
                copy(
                  `Client: ${r.client}\nRegion: ${r.region}\nClass: ${r.classification}\nBill: $${r.bill}\nPay: $${r.pay}`
                )
              }
              style={btnStyle}
            >
              Copy
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

const selectStyle: React.CSSProperties = {
  padding: 12,
  borderRadius: 14,
  border: "1px solid #e5e7eb",
  fontSize: 16,
};

const cardStyle: React.CSSProperties = {
  padding: 14,
  borderRadius: 18,
  border: "1px solid #e5e7eb",
  boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
};

const btnStyle: React.CSSProperties = {
  marginTop: 10,
  padding: "10px 12px",
  borderRadius: 14,
  border: "1px solid #111827",
  background: "#111827",
  color: "white",
  fontSize: 16,
};