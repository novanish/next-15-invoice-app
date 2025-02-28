"use client";

import { deleteInvoice, markAsPaid } from "@/actions/invoice";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InvoiceStatus } from "@prisma/client";
import {
  CheckCircle,
  DownloadCloudIcon,
  Mail,
  MoreHorizontal,
  Pencil,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Props {
  id: string;
  status: string;
}

export function InvoiceActions({ id, status }: Props) {
  const handleSendReminder = () => {
    const fetchPromise = fetch(`/api/email/${id}`, {
      method: "POST",
    });

    toast.promise(fetchPromise, {
      loading: "Sending reminder...",
      success: "Reminder sent!",
      error: "Failed to send reminder",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="secondary">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">
            Open Invoice Actions menu for invoice #{id}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/invoices/${id}`}>
            <Pencil className="size-4 mr-2" /> Edit Invoice
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/api/invoices/${id}`} target="_blank">
            <DownloadCloudIcon className="size-4 mr-2" /> Download Invoice
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSendReminder}>
          <Mail className="size-4 mr-2" /> Reminder Email
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button onClick={() => deleteInvoice(id)}>
            <Trash className="size-4 mr-2" /> Delete Invoice
          </button>
        </DropdownMenuItem>
        {status !== InvoiceStatus.PAID && (
          <DropdownMenuItem asChild>
            <button onClick={() => markAsPaid(id)}>
              <CheckCircle className="size-4 mr-2" /> Mark as Paid
            </button>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
