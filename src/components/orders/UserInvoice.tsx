import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useGetUserOrderDetilsQuery } from "../../redux/api/order/orderApi";

const UserInvoice = ({ orderId }: { orderId: string }) => {
  const { data, isLoading } = useGetUserOrderDetilsQuery(orderId);
  const order = data?.data;

  const generatePDF = () => {
    if (!order) return;

    const doc = new jsPDF();

    // Set up styles
    doc.setFont("helvetica");
    doc.setTextColor(60, 60, 60);

    // Header
    doc.setFontSize(24);
    doc.setTextColor(24, 144, 255);
    doc.text("INVOICE", 105, 20, { align: "center" });

    doc.setDrawColor(24, 144, 255);
    doc.setLineWidth(0.5);
    doc.line(15, 25, 195, 25);

    // Company Info
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Bella D'or", 15, 35);
    doc.text("123 Business Street", 15, 40);
    doc.text("City, Country 10001", 15, 45);
    doc.text("bellador@company.com", 15, 50);

    // Invoice Info
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Invoice #: ${order.id}`, 130, 35);
    doc.text(`Date: ${new Date(order.orderTime).toLocaleDateString()}`, 130, 40);
    doc.text(`Status: ${order.status}`, 130, 45);

    // Customer Info
    doc.setFontSize(14);
    doc.setTextColor(24, 144, 255);
    doc.text("BILL TO", 15, 65);

    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(order.customer?.name || "Customer", 15, 72);
    doc.text(order.email || "-", 15, 78);
    doc.text(order.phone || "-", 15, 84);
    doc.text(order.address || "-", 15, 90);
    doc.text(`Zip: ${order.zipcode || 'N/A'}`, 15, 96);

    // Payment Info
    doc.setFontSize(14);
    doc.setTextColor(24, 144, 255);
    doc.text("PAYMENT INFO", 130, 65);

    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Method: ${order.method || "-"}`, 130, 72);
    doc.text(`Status: ${order.isPaid ? "PAID" : "UNPAID"}`, 130, 78);
    doc.text(`Total: $${(order.amount || 0).toFixed(2)}`, 130, 84);

    // Items Table
    autoTable(doc, {
      startY: 110,
      head: [
        [
          { content: "Product", styles: { fillColor: [24, 144, 255], textColor: 255 } },
          { content: "Size", styles: { fillColor: [24, 144, 255], textColor: 255 } },
          { content: "Color", styles: { fillColor: [24, 144, 255], textColor: 255 } },
          { content: "Price", styles: { fillColor: [24, 144, 255], textColor: 255 } },
          { content: "Qty", styles: { fillColor: [24, 144, 255], textColor: 255 } },
          { content: "Subtotal", styles: { fillColor: [24, 144, 255], textColor: 255 } }
        ]
      ],
      body: order.cartItems?.map((item: any) => [
        item.productName,
        item.size || "-",
        { content: item.color || "-", styles: { cellWidth: 20 } },
        { content: `$${(item.price ?? 0).toFixed(2)}`, styles: { halign: 'right' } },
        item.quantity ?? 0,
        { content: `$${((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}`, styles: { halign: 'right' } }
      ]) || [],
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineColor: [200, 200, 200],
        lineWidth: 0.2
      },
      headStyles: {
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 10 }
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text("Thank you for your business!", 105, finalY, { align: "center" });
    doc.setFontSize(10);
    doc.text("Terms & Conditions: Payment due within 15 days", 105, finalY + 10, { align: "center" });

    doc.save(`invoice_${order.id}.pdf`);
  };

  return (
    <Button
      type="primary"
      icon={<DownloadOutlined />}
      onClick={generatePDF}
      disabled={isLoading || !order}
      loading={isLoading}
      size="small"
    />
  );
};

export default UserInvoice;
