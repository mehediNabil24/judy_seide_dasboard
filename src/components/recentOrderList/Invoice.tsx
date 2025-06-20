import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const Invoice = ({ order }: { order: any }) => {
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Order Invoice", 14, 20);

    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, 14, 30);
    doc.text(`Customer: ${order.email}`, 14, 38);
    doc.text(`Date: ${order.orderTime}`, 14, 46);
    doc.text(`Payment Method: ${order.method}`, 14, 54);
    doc.text(`Amount: ${order.amount}`, 14, 62);

    autoTable(doc, {
      head: [["Field", "Value"]],
      body: [
        ["Status", order.status],
        ["Amount", order.amount],
      ],
      startY: 70,
    });

    doc.save(`invoice_${order.id}.pdf`);
  };

  return (
    <Button
      type="link"
      icon={<DownloadOutlined />}
      onClick={generatePDF}
      title="Download Invoice"
    />
  );
};

export default Invoice;
