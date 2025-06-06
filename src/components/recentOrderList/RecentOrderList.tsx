import React, {  useState } from "react";
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
import { SearchOutlined,  DownOutlined } from "@ant-design/icons";
import { useGetAllOrdersQuery } from "../../redux/api/order/orderApi";

const { Title } = Typography;

const RecentOrderList: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // match with backend default
  const [sortField] = useState("createdAt");

  // Query with pagination, sorting, and search
  const { data, isLoading, isError } = useGetAllOrdersQuery({
    searchTerm: searchText,
    page: currentPage,
    limit: pageSize,
    sort: sortField,
  });

  console.log('RecentOrderList data:', data);

  const orders = data?.Data?.data || [];
  const total = data?.Data?.meta?.total || 0;

  const statusColors: { [key: string]: string } = {
    Processing: "#ADD8E6",
    Delivered: "#90EE90",
    Cancel: "#FFDAB9",
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Order Time",
      dataIndex: "orderTime",
      key: "orderTime",
    },
    {
      title: "Customer Name",
      dataIndex: "email",
      key: "email",
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
    },
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
      render: () => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="1">Processing</Menu.Item>
              <Menu.Item key="2">Delivered</Menu.Item>
              <Menu.Item key="3">Cancel</Menu.Item>
            </Menu>
          }
        >
          <Button type="link">
            Action <DownOutlined />
          </Button>
        </Dropdown>
      ),
    },
    {
      title: "Invoice",
      key: "invoice",
      render: () => (
        <Button type="link" style={{ padding: 0 }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        </Button>
      ),
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
              setCurrentPage(1); // Reset page on new search
            }}
            allowClear
            className="w-full sm:w-64"
          />
          {/* <Button
            icon={<FilterOutlined />}
            style={{ backgroundColor: "#FFA500", border: "none", color: "white" }}
          /> */}
        </Space>
      </div>

      {isLoading ? (
        <p>Loading recent orders...</p>
      ) : isError ? (
        <p className="text-red-500">Failed to load recent orders.</p>
      ) : (
        <>
          <Table
            dataSource={transformedOrders}
            columns={columns}
            pagination={false}
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
        </>
      )}

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
    </div>
  );
};

export default RecentOrderList;
