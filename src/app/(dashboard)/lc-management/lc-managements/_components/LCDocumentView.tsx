"use client";

import React from "react";
import { LCManagement } from "./types";
import { numberToWords } from "@/utils/numberToWords";

type Props = {
  lc: LCManagement;
};

const LCDocumentView = ({ lc }: Props) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const invoice = lc.invoice;
  const order = invoice?.order;
  const buyer = order?.buyer;
  const company = order?.companyProfile;

  // Aggregate items for the table
  const renderItems = () => {
    const items: any[] = [];
    if (!order?.orderItems) return null;

    const orderItems = Array.isArray(order.orderItems)
      ? order.orderItems
      : [order.orderItems];

    orderItems.forEach((item: any) => {
      if (item.fabricId && item.fabricItem) {
        const fabric = item.fabricItem;
        const data = Array.isArray(fabric.fabricItemData)
          ? fabric.fabricItemData
          : [];
        if (data.length > 0) {
          data.forEach((d: any) => {
            items.push({
              style: fabric.styleNo || order.orderNumber,
              description: fabric.discription || "Fabric Item",
              width: fabric.width || "N/A",
              color: d.color || "N/A",
              qty: d.quantityYds || 0,
              unitPrice: d.unitPrice || 0,
              amount: d.totalAmount || 0,
            });
          });
        } else {
          items.push({
            style: fabric.styleNo || order.orderNumber,
            description: fabric.discription || "Fabric Item",
            width: fabric.width || "N/A",
            color: "N/A",
            qty: fabric.totalQuantityYds || 0,
            unitPrice: fabric.totalUnitPrice || 0,
            amount: fabric.totalAmount || 0,
          });
        }
      } else if (item.labelId && item.labelItem) {
        const label = item.labelItem;
        const data = Array.isArray(label.labelItemData)
          ? label.labelItemData
          : [];
        data.forEach((d: any) => {
          items.push({
            style: label.styleNo || order.orderNumber,
            description: d.desscription || "Label Item",
            width: "N/A",
            color: d.color || "N/A",
            qty: d.quantityPcs || d.quantityDzn || 0,
            unitPrice: d.unitPrice || 0,
            amount: d.totalAmount || 0,
          });
        });
      } else if (item.cartonId && item.cartonItem) {
        const carton = item.cartonItem;
        const data = Array.isArray(carton.cartonItemData)
          ? carton.cartonItemData
          : [];
        data.forEach((d: any) => {
          items.push({
            style: carton.orderNo || order.orderNumber,
            description: d.cartonMeasurement
              ? `Carton ${d.cartonMeasurement} ${d.cartonPly} ply`
              : "Carton Item",
            width: "N/A",
            color: "N/A",
            qty: d.cartonQty || 0,
            unitPrice: d.unitPrice || 0,
            amount: d.totalAmount || 0,
          });
        });
      }
    });

    return items.map((item, idx) => (
      <tr key={idx} className="border-b border-black text-center text-[11px]">
        <td className="border-r border-black p-1 font-bold">{item.style}</td>
        <td className="border-r border-black p-1 text-left">
          {item.description}
        </td>
        <td className="border-r border-black p-1">{item.width}</td>
        <td className="border-r border-black p-1">{item.color}</td>
        <td className="border-r border-black p-1">{item.qty}</td>
        <td className="border-r border-black p-1">
          $ {Number(item.unitPrice).toFixed(2)}
        </td>
        <td className="p-1 font-bold text-right">
          ${" "}
          {Number(item.amount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </td>
      </tr>
    ));
  };

  return (
    <div className="bg-white p-6 md:p-10 font-serif text-black border border-slate-200 shadow-xl max-w-4xl mx-auto print:shadow-none print:border-none print:p-0">
      {/* Main Header Box */}
      <div className="border-2 border-black">
        {/* Top Row */}
        <div className="grid grid-cols-2 border-b-2 border-black">
          <div className="p-3 border-r-2 border-black space-y-1">
            <p className="text-[10px] italic font-bold">
              For Account & Risk of Messers:
            </p>
            <h2 className="text-sm font-black uppercase">
              {buyer?.name || "CUSTOMER NAME"}
            </h2>
            <p className="text-[10px] leading-tight whitespace-pre-wrap">
              {buyer?.address || "CUSTOMER ADDRESS"}
            </p>
          </div>
          <div className="p-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="font-bold">Invoice No</span>
              <span className="font-bold">: {invoice?.piNumber || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Date</span>
              <span className="font-bold">: {formatDate(invoice?.date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">B B L/C No.</span>
              <span className="font-bold">: {lc.bblcNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Date of Opening</span>
              <span className="font-bold">
                : {formatDate(lc.dateOfOpening)}
              </span>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-2 border-b-2 border-black min-h-[80px]">
          <div className="p-3 border-r-2 border-black">
            <div className="flex gap-2">
              <span className="text-[11px] font-bold shrink-0">
                Notify Party :
              </span>
              <span className="text-[11px]">
                {lc.notifyParty || "Same as buyer"}
              </span>
            </div>
          </div>
          <div className="p-3 space-y-1">
            <div className="flex gap-2">
              <span className="text-[11px] font-bold shrink-0">
                L/C Issuing Bank :
              </span>
              <div className="text-[11px] uppercase space-y-0.5">
                <p className="font-bold">{lc.lcIssueBankName}</p>
                <p>{lc.lcIssueBankBranch}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-2 border-b-2 border-black min-h-[100px]">
          <div className="p-3 border-r-2 border-black">
            <div className="flex gap-2">
              <span className="text-[11px] font-bold shrink-0">
                Destination :
              </span>
              <span className="text-[11px]">
                {lc.destination || "Customers Factory"}
              </span>
            </div>
          </div>
          <div className="p-3 space-y-1.5 text-xs">
            <div className="grid grid-cols-[100px_1fr]">
              <span className="font-bold">P.I.No. & Date</span>
              <span className="font-bold">
                : {invoice?.piNumber} Date-{formatDate(invoice?.date)}
              </span>
            </div>
            <div className="grid grid-cols-[100px_1fr]">
              <span className="font-bold">Export L/C No</span>
              <span className="font-bold">
                : {lc.exportLcNo} DATED: {formatDate(lc.exportLcDate)}
              </span>
            </div>
            <div className="grid grid-cols-[100px_1fr]">
              <span className="font-bold">BIN No.</span>
              <span className="font-bold">: {lc.binNo}</span>
            </div>
            <div className="grid grid-cols-[100px_1fr]">
              <span className="font-bold">H.S Code NO</span>
              <span className="font-bold">: {lc.hsCodeNo}</span>
            </div>
          </div>
        </div>

        {/* Remarks Section */}
        <div className="p-3 border-b-2 border-black bg-slate-50/30">
          <div className="flex gap-3">
            <span className="text-xs font-bold shrink-0">Remarks :</span>
            <p className="text-[11px] leading-relaxed italic whitespace-pre-wrap">
              {lc.remarks}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-black bg-slate-100 text-[10px] font-bold text-center uppercase">
              <td className="border-r border-black p-1 w-24">Style No/Po No</td>
              <td className="border-r border-black p-1">Description</td>
              <td className="border-r border-black p-1 w-16">Width</td>
              <td className="border-r border-black p-1 w-20">Color</td>
              <td className="border-r border-black p-1 w-24">
                Quantity In Yds
              </td>
              <td className="border-r border-black p-1 w-24">
                Unit Price In US $
              </td>
              <td className="p-1 w-32 text-right">Amount In US Dollar</td>
            </tr>
          </thead>
          <tbody>
            {renderItems()}
            <tr className="border-t-2 border-black font-bold text-xs">
              <td
                colSpan={4}
                className="border-r border-black p-1 text-right italic font-black uppercase"
              >
                Total:
              </td>
              <td className="border-r border-black p-1 text-center font-black">
                {Number(
                  lc.amount > 0
                    ? lc.amount /
                        (lc.invoice?.order?.orderItems?.[0]?.fabricItem
                          ?.totalUnitPrice || 1)
                    : 0,
                ).toFixed(0)}
              </td>
              <td className="border-r border-black p-1 text-center">US $</td>
              <td className="p-1 text-right font-black">
                ${" "}
                {Number(lc.amount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Total Amount in Words */}
        <div className="p-2 border-t-2 border-black bg-slate-50 text-[11px] font-bold">
          <span>
            Total Amount (in word): US Dollar:{" "}
            {numberToWords(Number(lc.amount))}
          </span>
        </div>
      </div>

      {/* Footer Info Outside the Box */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold uppercase">
        <div className="space-y-3">
          <div className="grid grid-cols-[150px_1fr]">
            <span>CARRIER</span>
            <span>: {lc.carrier}</span>
          </div>
          <div className="grid grid-cols-[150px_1fr]">
            <span>SALES TERM</span>
            <span>: {lc.salesTerm}</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-[150px_1fr]">
            <span>TOTAL NET WEIGHT</span>
            <span>
              :{" "}
              {order?.orderItems?.[0]?.fabricItem?.totalNetWeight
                ? `${order.orderItems[0].fabricItem.totalNetWeight} KG`
                : "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-[150px_1fr]">
            <span>TOTAL GROSS WEIGHT</span>
            <span>
              :{" "}
              {order?.orderItems?.[0]?.fabricItem?.totalGrossWeight
                ? `${order.orderItems[0].fabricItem.totalGrossWeight} KG`
                : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Signature Section */}
      <div className="mt-20 flex justify-between px-10 items-end">
        <div className="text-center w-48">
          <div className="border-t border-black pt-1 uppercase text-[10px] font-bold">
            Approved By
          </div>
        </div>
        <div className="text-center w-64">
          <div className="border-t-2 border-black pt-1 uppercase text-xs font-black">
            For {company?.name || "COMPANY NAME"}
          </div>
          <div className="mt-12 uppercase text-[10px] font-bold">
            Authorized Signatory
          </div>
        </div>
      </div>
    </div>
  );
};

export default LCDocumentView;
