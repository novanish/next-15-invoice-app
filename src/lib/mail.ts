import { MailtrapClient } from "mailtrap";

export const mailClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN!,
});

function getSender() {
  return { email: process.env.EMAIL_FROM!, name: process.env.EMAIL_FROM_NAME! };
}

interface EmailOptions {
  to: Array<{ email: string; name?: string }>;
  inoviceData: Record<
    "clientName" | "invoiceNumber" | "dueDate" | "totalAmount",
    string
  >;
}

export async function sendInvoiceCreatedEmail({
  inoviceData,
  to,
}: EmailOptions) {
  await mailClient.send({
    from: getSender(),
    subject: "Invoice created",
    text: "Your invoice has been created",
    category: "invoice-created",
    to,

    template_uuid: "c21f0735-0a7c-4e72-9009-2ded2dd4746a",
    template_variables: {
      ...inoviceData,
      inoviceLink: "https://example.com/invoice/1",
    },
  });
}
