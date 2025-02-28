"use server";

import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/formatter";
import { sendInvoiceCreatedEmail } from "@/lib/mail";
import { requiredUser } from "@/lib/required-user";
import { createInvoiceSchema } from "@/schemas/invoice";
import { parseWithZod } from "@conform-to/zod";
import { InvoiceStatus } from "@prisma/client";
import { formatDate } from "date-fns";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createInvoice(_: unknown, formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: createInvoiceSchema.strip(),
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { user } = await requiredUser();
  const { id } = await db.invoice.create({
    select: { id: true },
    data: {
      userId: user.id!,
      ...submission.value,
      total:
        submission.value.invoiceItemQuantity * submission.value.invoiceItemRate,
    },
  });

  await sendInvoiceCreatedEmail({
    to: [{ email: user.email! }],
    invoiceId: id,
    inoviceData: {
      clientName: submission.value.clientName,
      invoiceNumber: submission.value.invoiceNumber.toString(),
      dueDate: formatDate(submission.value.dueDate, "yyyy-MM-dd"),
      totalAmount: formatCurrency(
        submission.value.invoiceItemQuantity * submission.value.invoiceItemRate,
        submission.value.currency
      ),
    },
  });

  redirect("/dashboard/invoices");
}

export async function editInvoice(_: unknown, formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: createInvoiceSchema.strip(),
  });
  const invoiceId = formData.get("invoiceId");
  if (!invoiceId || typeof invoiceId !== "string") {
    return null;
  }

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { user } = await requiredUser();
  const invoice = await db.invoice.update({
    select: { id: true },
    data: {
      userId: user.id!,
      ...submission.value,
      total:
        submission.value.invoiceItemQuantity * submission.value.invoiceItemRate,
    },

    where: {
      userId: user.id,
      id: invoiceId,
    },
  });

  await sendInvoiceCreatedEmail({
    to: [{ email: user.email! }],
    invoiceId: invoice.id,
    inoviceData: {
      clientName: submission.value.clientName,
      invoiceNumber: submission.value.invoiceNumber.toString(),
      dueDate: formatDate(submission.value.dueDate, "yyyy-MM-dd"),
      totalAmount: formatCurrency(
        submission.value.invoiceItemQuantity * submission.value.invoiceItemRate,
        submission.value.currency
      ),
    },
  });

  redirect("/dashboard/invoices");
}

export async function deleteInvoice(invoiceId: string) {
  const { user } = await requiredUser();
  await db.invoice.delete({
    where: {
      userId: user.id,
      id: invoiceId,
    },
  });

  revalidatePath("/dashboard/invoices");
}

export async function markAsPaid(invoiceId: string) {
  const { user } = await requiredUser();
  await db.invoice.update({
    where: {
      userId: user.id,
      id: invoiceId,
    },
    data: {
      status: InvoiceStatus.PAID,
    },
  });

  revalidatePath("/dashboard/invoices");
}
