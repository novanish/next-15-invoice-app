"use client";

import { createInvoice } from "@/actions/invoice";
import { SubmitButton } from "@/components/form/submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatter";
import { type CreateInvoice, createInvoiceSchema } from "@/schemas/invoice";
import {
  FieldMetadata,
  FormProvider,
  useField,
  useForm,
  useInputControl,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { formatDate } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useActionState } from "react";

interface Props {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
}

export function CreateInvoice({ address, email, firstName, lastName }: Props) {
  const [lastResult, action] = useActionState(createInvoice, undefined);
  const [form, fields] = useForm<CreateInvoice>({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: createInvoiceSchema,
      });
    },
    shouldValidate: "onSubmit",
    shouldRevalidate: "onBlur",
    defaultValue: {
      fromName: `${firstName} ${lastName}`,
      fromAddress: address,
      fromEmail: email,
    },
  });

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <FormProvider context={form.context}>
          <form
            id={form.id}
            action={action}
            onSubmit={form.onSubmit}
            noValidate
          >
            <div className="flex flex-col gap-1 w-fit mb-6">
              <div className="flex items-center gap-4">
                <Badge variant="secondary">Draft</Badge>
                <Input
                  name={fields.invoiceName.name}
                  key={fields.invoiceName.key}
                  defaultValue={fields.invoiceName.initialValue}
                  placeholder="Test 123"
                />
              </div>
              <p className="text-sm text-red-500">
                {fields.invoiceName.errors}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <Label>Invoice No.</Label>
                <div className="flex">
                  <span className="px-3 border border-r-0 rounded-l-md bg-muted flex items-center">
                    #
                  </span>
                  <Input
                    name={fields.invoiceNumber.name}
                    key={fields.invoiceNumber.key}
                    defaultValue={fields.invoiceNumber.initialValue}
                    className="rounded-l-none"
                    placeholder="5"
                  />
                </div>
                <p className="text-red-500 text-sm">
                  {fields.invoiceNumber.errors}
                </p>
              </div>
              <CurrencySelect field={fields.currency} />
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label>From</Label>
                <div className="space-y-2">
                  <Input
                    name={fields.fromName.name}
                    key={fields.fromName.key}
                    placeholder="Your Name"
                  />
                  <p className="text-red-500 text-sm">
                    {fields.fromName.errors}
                  </p>
                  <Input
                    placeholder="Your Email"
                    name={fields.fromEmail.name}
                    key={fields.fromEmail.key}
                  />
                  <p className="text-red-500 text-sm">
                    {fields.fromEmail.errors}
                  </p>
                  <Input
                    placeholder="Your Address"
                    name={fields.fromAddress.name}
                    key={fields.fromAddress.key}
                  />
                  <p className="text-red-500 text-sm">
                    {fields.fromAddress.errors}
                  </p>
                </div>
              </div>
              <div>
                <Label>To</Label>
                <div className="space-y-2">
                  <Input
                    name={fields.clientName.name}
                    key={fields.clientName.key}
                    defaultValue={fields.clientName.initialValue}
                    placeholder="Client Name"
                  />
                  <p className="text-red-500 text-sm">
                    {fields.clientName.errors}
                  </p>
                  <Input
                    name={fields.clientEmail.name}
                    key={fields.clientEmail.key}
                    defaultValue={fields.clientEmail.initialValue}
                    placeholder="Client Email"
                  />
                  <p className="text-red-500 text-sm">
                    {fields.clientEmail.errors}
                  </p>
                  <Input
                    name={fields.clientAddress.name}
                    key={fields.clientAddress.key}
                    defaultValue={fields.clientAddress.initialValue}
                    placeholder="Client Address"
                  />
                  <p className="text-red-500 text-sm">
                    {fields.clientAddress.errors}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <DatePicker field={fields.date} />
              <div>
                <Label>Invoice Due</Label>
                <Select
                  name={fields.dueDate.name}
                  key={fields.dueDate.key}
                  defaultValue={fields.dueDate.initialValue}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select due date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Due on Reciept</SelectItem>
                    <SelectItem value="15">Net 15</SelectItem>
                    <SelectItem value="30">Net 30</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-red-500 text-sm">{fields.dueDate.errors}</p>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-12 gap-4 mb-2 font-medium">
                <p className="col-span-6">Description</p>
                <p className="col-span-2">Quantity</p>
                <p className="col-span-2">Rate</p>
                <p className="col-span-2">Amount</p>
              </div>
              <div className="grid grid-cols-12 gap-4 mb-4">
                <div className="col-span-6">
                  <Textarea
                    name={fields.invoiceItemDescription.name}
                    key={fields.invoiceItemDescription.key}
                    defaultValue={fields.invoiceItemDescription.initialValue}
                    placeholder="Item name & description"
                  />
                  <p className="text-red-500 text-sm">
                    {fields.invoiceItemDescription.errors}
                  </p>
                </div>
                <div className="col-span-2">
                  <Input
                    name={fields.invoiceItemQuantity.name}
                    key={fields.invoiceItemQuantity.key}
                    type="number"
                    placeholder="0"
                  />
                  <p className="text-red-500 text-sm">
                    {fields.invoiceItemQuantity.errors}
                  </p>
                </div>
                <div className="col-span-2">
                  <Input
                    name={fields.invoiceItemRate.name}
                    key={fields.invoiceItemRate.key}
                    type="number"
                    placeholder="0"
                  />
                  <p className="text-red-500 text-sm">
                    {fields.invoiceItemRate.errors}
                  </p>
                </div>
                <Amount fields={fields} />
              </div>
            </div>
            <div className="flex justify-end">
              <div className="w-1/3">
                <div className="flex justify-between py-2">
                  <span>Subtotal</span>
                  <span>
                    <Total fields={fields} />
                  </span>
                </div>
                <div className="flex justify-between py-2 border-t">
                  <span>
                    Total (<Currency fields={fields} />)
                  </span>
                  <span className="font-medium underline underline-offset-2">
                    <Total fields={fields} />
                  </span>
                </div>
              </div>
            </div>
            <div>
              <Label>Note</Label>
              <Textarea
                name={fields.note.name}
                key={fields.note.key}
                defaultValue={fields.note.initialValue}
                placeholder="Add your Note/s right here..."
              />
              <p className="text-red-500 text-sm">{fields.note.errors}</p>
            </div>
            <div className="flex items-center justify-end mt-6">
              <div>
                <SubmitButton>Save</SubmitButton>
              </div>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}

interface DateFieldProps {
  field: FieldMetadata<string, CreateInvoice, Array<string>>;
}

function CurrencySelect({ field }: DateFieldProps) {
  const input = useInputControl(field);

  return (
    <div>
      <Label>Currency</Label>
      <Select
        defaultValue="USD"
        value={input.value}
        onValueChange={input.change}
        name={field.name}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="USD">United States Dollar -- USD</SelectItem>
          <SelectItem value="EUR">Euro -- EUR</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-red-500 text-sm">{field.errors}</p>
    </div>
  );
}

function DatePicker({ field }: DateFieldProps) {
  const input = useInputControl(field);

  return (
    <div>
      <div>
        <Label>Date</Label>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[280px] text-left justify-start"
          >
            <CalendarIcon />
            {input.value ? (
              formatDate(input.value, "MMM dd, yyyy")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            selected={new Date(input.value!)}
            onSelect={(date) => {
              input.change(date?.toISOString());
            }}
            mode="single"
            fromDate={new Date()}
          />
        </PopoverContent>
      </Popover>
      <p className="text-red-500 text-sm">{field.errors}</p>
    </div>
  );
}

interface TotalProps {
  fields: ReturnType<typeof useForm<CreateInvoice>>[1];
}

function useTotal(fields: ReturnType<typeof useForm<CreateInvoice>>[1]) {
  const [rateInput] = useField(fields.invoiceItemRate.name);
  const [quantityInput] = useField(fields.invoiceItemQuantity.name);
  const total = Number(rateInput.value) * Number(quantityInput.value);

  return total || 0;
}

function useCurrency(fields: ReturnType<typeof useForm<CreateInvoice>>[1]) {
  const [currencyInput] = useField(fields.currency.name);

  return currencyInput.value;
}

function Total({ fields }: TotalProps) {
  const currency = useCurrency(fields);
  return formatCurrency(useTotal(fields), currency);
}

function Currency({ fields }: TotalProps) {
  return useCurrency(fields);
}

function Amount({ fields }: TotalProps) {
  const total = useTotal(fields);
  const currency = useCurrency(fields);

  return (
    <div className="col-span-2">
      <Input value={formatCurrency(total, currency)} disabled />
    </div>
  );
}
