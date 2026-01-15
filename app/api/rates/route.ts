import { NextResponse } from "next/server";

const RATES = [
  { client: "ONEOK", region: "TX", classification: "CWI", bill: 125, pay: 85 },
  { client: "ONEOK", region: "TX", classification: "Chief", bill: 150, pay: 105 },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const client = searchParams.get("client");
  const region = searchParams.get("region");
  const classification = searchParams.get("classification");

  let results = RATES;
  if (client) results = results.filter((r) => r.client === client);
  if (region) results = results.filter((r) => r.region === region);
  if (classification) results = results.filter((r) => r.classification === classification);

  return NextResponse.json({ results });
}
