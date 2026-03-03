import { LCManagement } from "./types";

export const normalizeLCItems = (lc: LCManagement) => {
  const order = lc.invoice?.order;
  const orderItems = order?.orderItems || [];
  const items: any[] = [];

  const rawItems = Array.isArray(orderItems) ? orderItems : [orderItems];

  rawItems.forEach((item: any) => {
    if (item.fabricItem) {
      const fabric = item.fabricItem;
      const data = Array.isArray(fabric.fabricItemData) ? fabric.fabricItemData : [];
      
      if (data.length > 0) {
        data.forEach((d: any) => {
          items.push({
            style: fabric.styleNo || order?.orderNumber || "N/A",
            description: fabric.discription || "Fabric Item",
            width: fabric.width || "N/A",
            color: d.color || "N/A",
            qty: d.quantityYds || 0,
            unit: "Yds",
            unitPrice: d.unitPrice || 0,
            amount: d.totalAmount || 0,
          });
        });
      } else {
        items.push({
          style: fabric.styleNo || order?.orderNumber || "N/A",
          description: fabric.discription || "Fabric Item",
          width: fabric.width || "N/A",
          color: "N/A",
          qty: fabric.totalQuantityYds || 0,
          unit: "Yds",
          unitPrice: fabric.totalUnitPrice || 0,
          amount: fabric.totalAmount || 0,
        });
      }
    } else if (item.labelItem) {
      const label = item.labelItem;
      const data = Array.isArray(label.labelItemData) ? label.labelItemData : [];
      data.forEach((d: any) => {
        items.push({
          style: label.styleNo || order?.orderNumber || "N/A",
          description: d.desscription || "Label Item",
          width: "N/A",
          color: d.color || "N/A",
          qty: d.quantityPcs || d.quantityDzn || 0,
          unit: d.quantityDzn ? "Dzn" : "Pcs",
          unitPrice: d.unitPrice || 0,
          amount: d.totalAmount || 0,
        });
      });
    } else if (item.cartonItem) {
      const carton = item.cartonItem;
      const data = Array.isArray(carton.cartonItemData) ? carton.cartonItemData : [];
      data.forEach((d: any) => {
        items.push({
          style: carton.orderNo || order?.orderNumber || "N/A",
          description: d.cartonMeasurement
            ? `Carton ${d.cartonMeasurement} ${d.cartonPly} ply`
            : "Carton Item",
          width: "N/A",
          color: "N/A",
          qty: d.cartonQty || 0,
          unit: "Pcs",
          unitPrice: d.unitPrice || 0,
          amount: d.totalAmount || 0,
        });
      });
    }
  });

  return items;
};

export const formatDate = (dateString?: string) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};
