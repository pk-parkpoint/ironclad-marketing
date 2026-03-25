import { NextResponse } from "next/server";

/**
 * Deprecated compatibility endpoint.
 *
 * The active booking wizard now keeps draft state client-side and emits
 * a single abandonment payload on exit instead of relying on server memory.
 */
export async function POST() {
  return NextResponse.json({ status: "ignored" });
}
