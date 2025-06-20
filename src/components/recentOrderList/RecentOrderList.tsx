import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Typography,
  Pagination,
  Dropdown,
  Menu,
} from "antd";
import {
  SearchOutlined,
  DownOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  useGetAllOrdersQuery,
  useUpdateOrdersMutation,
} from "../../redux/api/order/orderApi";
import { toast } from "sonner";
import { debounce } from "lodash";
import OrderDetailsModal from "../orders/OrderModal";
import Invoice from "./Invoice";


const { Title } = Typography;

const RecentOrderList: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [sortField] = useState("createdAt");

  const debouncedSetSearch = useMemo(
    () =>
      debounce((val: string) => {
        setDebouncedSearch(val);
      }, 500),
    []
  );

  const handleViewDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalVisible(true);
  };

  useEffect(() => {
    debouncedSetSearch(searchText);
  }, [searchText, debouncedSetSearch]);

  const { data, isLoading, refetch } = useGetAllOrdersQuery({
    searchTerm: debouncedSearch,
    page: currentPage,
    limit: pageSize,
    sort: sortField,
  });

  const [updateOrderStatus] = useUpdateOrdersMutation();

  const orders = data?.Data?.data || [];
  const total = data?.Data?.meta?.total || 0;

  const statusColors: { [key: string]: string } = {
    Processing: "#ADD8E6",
    Delivered: "#90EE90",
    Cancel: "#FFDAB9",
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus({ id: orderId, status }).unwrap();
      toast.success(`Order ${orderId} marked as ${status}`);
      refetch();
    } catch (error) {
      toast.error("Failed to update order status");
      console.error(error);
    }
  };

  const columns = [
    { title: "Order ID", dataIndex: "id", key: "id" },
    { title: "Order Time", dataIndex: "orderTime", key: "orderTime" },
    { title: "Customer Name", dataIndex: "email", key: "email" },
    { title: "Method", dataIndex: "method", key: "method" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span
          style={{
            backgroundColor: statusColors[status] || "#ADD8E6",
            padding: "5px 10px",
            borderRadius: "15px",
            color: "#333",
            fontSize: "12px",
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => {
        const { id, status } = record;
        return (
          <Space>
            {status === "PROCESSING" && (
              <Dropdown
                overlay={
                  <Menu onClick={({ key }) => handleStatusChange(id, key)}>
                    <Menu.Item key="DELIVERED">DELIVERED</Menu.Item>
                  </Menu>
                }
              >
                <Button type="link">
                  Action <DownOutlined />
                </Button>
              </Dropdown>
            )}
            <Button
              type="link"
              onClick={() => handleViewDetails(id)}
              icon={<EyeOutlined />}
              title="View Details"
            />
          </Space>
        );
      },
    },
    {
      title: "Invoice",
      key: "invoice",
      render: (_: any, record: any) => <Invoice orderId={record.id} />
,
    },
  ];

  const transformedOrders = orders.map((order: any, index: number) => ({
    key: order.id || index.toString(),
    id: order.id,
    orderTime: order.orderTime?.split("T")[0] || "N/A",
    email: order?.customer?.name || "No Email",
    method: order.method || "Unknown",
    amount: `$${(order.amount || 0).toLocaleString()}`,
    status: order.status || "Processing",
  }));

  return (
    <div className="bg-white p-6 rounded shadow-md w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <Title level={4} className="!mb-0">
          Recent Order
        </Title>
        <Space>
          <Input
            placeholder="Search orders..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
            allowClear
            className="w-full sm:w-64"
          />
        </Space>
      </div>

      <Table
        dataSource={transformedOrders}
        columns={columns}
        pagination={false}
        loading={isLoading}
        rowKey="id"
        size="middle"
        bordered
        className="custom-ant-table"
      />

      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <p>
          Showing {(currentPage - 1) * pageSize + 1} -{" "}
          {(currentPage - 1) * pageSize + transformedOrders.length} of {total}
        </p>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={setCurrentPage}
          showSizeChanger={false}
        />
      </div>

      <style>
        {`
          .custom-ant-table .ant-table-thead > tr > th {
            background-color: #FFF7E6 !important;
          }
          .custom-ant-table .ant-table-tbody > tr > td {
            vertical-align: middle;
          }
        `}
      </style>

      <OrderDetailsModal
        orderId={selectedOrderId || ""}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </div>
  );
};

export default RecentOrderList;
