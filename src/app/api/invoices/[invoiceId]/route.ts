import { db } from "@/lib/db";
import { requiredUser } from "@/lib/required-user";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<Record<"invoiceId", string>>;
}

export async function GET(_: Request, { params }: Params) {
  const { invoiceId } = await params;
  const { user } = await requiredUser();

  const invoice = await db.invoice.findFirst({
    where: { id: invoiceId, userId: user.id },
  });
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  return NextResponse.json({ invoice });
}
