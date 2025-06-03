import React, { useMemo, useState } from "react";
import {
  Table,
  Input,
  Button,
  message,
  Dropdown,
  Menu,
  Space,
  Tag,
} from "antd";
import { SearchOutlined, PrinterOutlined, DownOutlined } from "@ant-design/icons";
import { useGetAllOrdersQuery, useUpdateOrdersMutation } from "../../redux/api/order/orderApi";


const OrderList = () => {
  const { data, isLoading } = useGetAllOrdersQuery({});
  const [updateOrder] = useUpdateOrdersMutation();
  const [searchTerm, setSearchTerm] = useState("");

  const allOrders = useMemo(() => data?.Data?.data || [], [data]);
  const meta = data?.Data?.meta;

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return allOrders;
    return allOrders.filter((order: any) =>
      order?.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allOrders]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await updateOrder({ id, body: { status } }).unwrap();
      if (res?.success) {
        message.success(`Order marked as ${status}`);
      } else {
        message.error("Failed to update order");
      }
    } catch (error) {
      message.error("Error updating order");
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (text: string) => text.slice(0, 8) + "...",
    },
    {
      title: "Order Time",
      dataIndex: "orderTime",
      key: "orderTime",
      render: (value: string) =>
        value ? new Date(value).toLocaleString() : "N/A",
    },
    {
      title: "Customer",
      dataIndex: ["customer", "name"],
      key: "customerName",
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `$${amount}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "blue";
        if (status === "DELIVERED") color = "green";
        else if (status === "CANCELED") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => {
        const menu = (
          <Menu
            onClick={({ key }) => handleUpdateStatus(record.id, key)}
            items={[
              { key: "DELIVERED", label: "Delivered" },
              { key: "CANCELED", label: "Canceled" },
            ]}
          />
        );

        return (
          <Dropdown overlay={menu}>
            <Button>
              Update Status <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <Input
          placeholder="Search by Customer..."
          prefix={<SearchOutlined />}
          style={{ width: 250, borderColor: "#FFA500" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          icon={<PrinterOutlined />}
          style={{
            backgroundColor: "#FFA500",
            color: "white",
            borderColor: "#FFA500",
          }}
          onClick={handlePrint}
        >
          Print / Download
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey={(record: any) => record.id}
        loading={isLoading}
        pagination={{
          current: meta?.page || 1,
          pageSize: meta?.limit || 10,
          total: meta?.total || 0,
          showTotal: (total) =>
            `Showing ${filteredOrders.length} of ${total}`,
        }}
        bordered
      />
    </div>
  );
};

export default OrderList;
