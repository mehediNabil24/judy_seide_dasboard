import {  useMemo, useState } from "react";
import {
  Table,
  Input,
  Button,
  message,
  Dropdown,
  Menu,
  Tag,
} from "antd";
import {
  SearchOutlined,
  PrinterOutlined,
  DownOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  useGetAllOrdersQuery,
  useUpdateOrdersMutation,
} from "../../redux/api/order/orderApi";
import { toast } from "sonner";
import OrderDetailsModal from "./OrderModal";

const OrderList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data, isLoading } = useGetAllOrdersQuery({ searchTerm, page, limit });
  const [updateOrder] = useUpdateOrdersMutation();

  const allOrders = useMemo(() => data?.Data?.data || [], [data]);
  const meta = data?.Data?.meta;

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await updateOrder({ id, status }).unwrap();
      if (res?.success) {
        toast.success(`Order marked as ${status}`);
      } else {
        message.error("Failed to update order");
      }
    } catch (error) {
      toast.error("Error updating order");
      console.error(error);
    }
  };

  const handleViewDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalVisible(true);
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
        else if (status === "CANCEL") color = "red";
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
              // { key: "CANCEL", label: "Cancel" },
            ]}
          />
        );

        return (
          <div className="flex gap-2">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record.id)}
            >
              View
            </Button>
            <Dropdown overlay={menu}>
              <Button>
                Update <DownOutlined />
              </Button>
            </Dropdown>
          </div>
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
          style={{ width: 250, borderColor: "#FB923C" }}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1); // Reset to first page when search changes
          }}
        />
        <Button
          icon={<PrinterOutlined />}
          style={{
            backgroundColor: "#FB923C",
            color: "white",
            borderColor: "#FB923C",
          }}
          onClick={handlePrint}
        >
          Print / Download
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={allOrders}
        rowKey={(record: any) => record.id}
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: limit,
          total: meta?.total || 0,
          showTotal: (total) => `Showing ${allOrders.length} of ${total}`,
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
            setLimit(newPageSize);
          },
        }}
        bordered
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        orderId={selectedOrderId || ""}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </div>
  );
};

export default OrderList;
