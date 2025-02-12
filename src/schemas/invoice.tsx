import { InvoiceStatus } from "@prisma/client";
import { z } from "zod";

export const createInvoiceSchema = z.object({
  invoiceName: z.string().min(1, "Invoice Name is required"),
  status: z.nativeEnum(InvoiceStatus).default(InvoiceStatus.PENDING),
  date: z.string().min(1, "Date is required"),
  dueDate: z.number().min(0, "Due Date is required"),
  fromName: z.string().min(1, "Your name is required"),
  fromEmail: z.string().email("Invalid Email address"),
  fromAddress: z.string().min(1, "Your address is required"),
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Invalid Email address"),
  clientAddress: z.string().min(1, "Client address is required"),
  currency: z.string().min(1, "Currency is required"),
  invoiceNumber: z.number().min(1, "Minimum invoice number of 1"),
  note: z.string().optional(),
  invoiceItemDescription: z.string().min(1, "Description is required"),
  invoiceItemQuantity: z.number().min(1, "Qunatity min 1"),
  invoiceItemRate: z.number().min(1, "Rate min 1"),
});

export type CreateInvoice = z.infer<typeof createInvoiceSchema>;
