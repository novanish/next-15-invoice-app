import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/formatter";
import { sendReminderEmail } from "@/lib/mail";
import { requiredUser } from "@/lib/required-user";
import { NextResponse } from "next/server";
import { format } from "path";

interface Params {
  invoiceId: string;
}

export async function POST(
  _: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { user } = await requiredUser();
    const { invoiceId } = await params;
    const invoice = await db.invoice.findUnique({
      select: { invoiceNumber: true, total: true, currency: true },
      where: {
        id: invoiceId,
        userId: user.id,
      },
    });
    if (!invoice) {
      return NextResponse.json(
        { message: "Invoice not found" },
        { status: 404 }
      );
    }

    await sendReminderEmail(
      [{ email: user.email! }],
      invoice.invoiceNumber.toString(),
      formatCurrency(invoice.total, invoice.currency)
    );

    return NextResponse.json({ message: "OK" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to send reminder email." },
      { status: 500 }
    );
  }
}
