import { db } from "@/lib/db";
import { requiredUser } from "@/lib/required-user";
import { notFound } from "next/navigation";
import { EditInvoice } from "../_components/edit-invoice";

interface Props {
  params: Promise<{
    invoiceId: string;
  }>;
}

export default async function EditInvoicePage({ params }: Props) {
  const { invoiceId } = await params;
  const { user } = await requiredUser();
  const invoice = await db.invoice.findUnique({
    where: {
      id: invoiceId,
      userId: user.id,
    },
  });

  if (!invoice) notFound();

  return <EditInvoice invoice={invoice} />;
}
