import { NextResponse } from "next/server";
import retosData from "@/data/retos.json";

export async function GET() {
  return NextResponse.json(retosData);
}
