import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvoiceFormData, InvoiceTerms, OrderSummary } from "./types";

type Props = {
  data: InvoiceFormData;
  orders: OrderSummary[];
  terms: InvoiceTerms[];
  onChange: (field: keyof InvoiceFormData, value: any) => void;
  errors?: Partial<Record<keyof InvoiceFormData, string>>;
  disableOrder?: boolean;
};

const InvoiceForm = ({
  data,
  orders,
  terms,
  onChange,
  errors,
  disableOrder,
}: Props) => {
  return (
    <div className="space-y-6">
      <Card className="p-0 border-0 shadow-none">
        {/* <CardHeader>
                    <CardTitle>Invoice Information</CardTitle>
                </CardHeader> */}
        {/* <CardContent className="p-0 grid gap-4 md:grid-cols-2 lg:grid-cols-3"> */}
        <CardContent className="p-0 grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="piNumber">
              PI Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="piNumber"
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              value={data.piNumber}
              onChange={(e) =>
                onChange("piNumber", e.target.value.replace(/\D/g, ""))
              }
            />
            {errors?.piNumber && (
              <p className="text-xs text-destructive">{errors.piNumber}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">
              Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="date"
              type="date"
              value={data.date}
              onChange={(e) => onChange("date", e.target.value)}
            />
            {errors?.date && (
              <p className="text-xs text-destructive">{errors.date}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">
              Status <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.status}
              onValueChange={(value) => onChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {["DRAFT", "SENT", "APPROVED", "CANCELLED"].map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.status && (
              <p className="text-xs text-destructive">{errors.status}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="orderId">
              Order <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.orderId}
              onValueChange={(value) => onChange("orderId", value)}
              disabled={disableOrder}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select order" />
              </SelectTrigger>
              <SelectContent>
                {orders.map((order) => (
                  <SelectItem key={order.id} value={order.id}>
                    {order.orderNumber || order.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.orderId && (
              <p className="text-xs text-destructive">{errors.orderId}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoiceTermsId">
              Invoice Terms <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.invoiceTermsId}
              onValueChange={(value) => onChange("invoiceTermsId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select terms" />
              </SelectTrigger>
              <SelectContent>
                {terms.map((term) => (
                  <SelectItem key={term.id} value={term.id}>
                    {term.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.invoiceTermsId && (
              <p className="text-xs text-destructive">
                {errors.invoiceTermsId}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceForm;
