import { NextRequest, NextResponse } from "next/server";
import { submitContactForm } from "@/lib/contact-api";

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    const result = await submitContactForm(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to send message" },
      { status: 400 }
    );
  }
}
