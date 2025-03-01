import { MailtrapClient } from "mailtrap";

export const mailClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN!,
});

function getSender() {
  return { email: process.env.EMAIL_FROM!, name: process.env.EMAIL_FROM_NAME! };
}

interface EmailOptions {
  to: Array<{ email: string; name?: string }>;
  invoiceId: string;
  inoviceData: Record<
    "clientName" | "invoiceNumber" | "dueDate" | "totalAmount",
    string
  >;
}

export async function sendInvoiceCreatedEmail({
  inoviceData,
  to,
  invoiceId,
}: EmailOptions) {
  const inoviceURL = new URL(process.env.ORIGIN!);
  inoviceURL.pathname = `/app/invoices/${invoiceId}`;

  await mailClient.send({
    from: getSender(),
    to,

    template_uuid: "c21f0735-0a7c-4e72-9009-2ded2dd4746a",
    template_variables: {
      ...inoviceData,
      invoiceLink: inoviceURL.toString(),
    },
  });
}

export async function sendReminderEmail(
  to: Array<{ email: string; name?: string }>,
  invoiceNumber: string,
  invoiceAmount: string
) {
  await mailClient.send({
    from: getSender(),
    to,
    template_uuid: "5eb733fd-fd42-41e2-bef8-e15fbba53975",
    template_variables: {
      invoiceNumber,
      invoiceAmount,
    },
  });
}
