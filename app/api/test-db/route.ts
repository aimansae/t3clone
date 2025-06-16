import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/mongoose";

export async function GET() {
  try {
    await connectToDB();
    return NextResponse.json({ status: "Connected to MongoDB!" });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { erros: "failed to connect to DB" },
      { status: 500 }
    );
  }
}
