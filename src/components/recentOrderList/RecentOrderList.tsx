import React, { useEffect, useState } from "react";
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
import { SearchOutlined, FilterOutlined, DownOutlined } from "@ant-design/icons";
import { useGetRecentShopQuery } from "../../redux/api/shop/shopApi";

const { Title } = Typography;

type Order = {
  id: string;
  orderTime: string;
  customerName: string;
  method: string;
  amount: string;
  status: string;
};

const RecentOrderList: React.FC = () => {
  const { data: apiOrders = [], isLoading, isError } = useGetRecentShopQuery({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    if (apiOrders?.data?.length > 0) {
      const mappedOrders: Order[] = apiOrders.data.map((order: any, index: number) => {
        return {
          id: order.id || index.toString(),
          orderTime: order.createdAt?.split("T")[0] || "N/A",
          customerName: order.name || "Unknown Customer",
          method: "Card", // Static as per image
          amount: "$" + (order.amount || 1234).toLocaleString(),
          status: order.status || "Processing",
        };
      });
      setOrders(mappedOrders);
    }
  }, [apiOrders]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  const filteredOrders = orders.filter((order) =>
    order.customerName.toLowerCase().includes(searchText.toLowerCase())
  );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
      dataIndex: "customerName",
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
            onChange={handleSearch}
            allowClear
            className="w-full sm:w-64"
          />
          <Button
            icon={<FilterOutlined />}
            style={{ backgroundColor: "#FFA500", border: "none", color: "white" }}
          />
        </Space>
      </div>

      {isLoading ? (
        <p>Loading recent orders...</p>
      ) : isError ? (
        <p className="text-red-500">Failed to load recent orders.</p>
      ) : (
        <>
          <Table
            dataSource={paginatedOrders}
            columns={columns}
            pagination={false}
            rowKey="id"
            size="middle"
            bordered
            className="custom-ant-table"
          />

          <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
            <p>
              Showing{" "}
              {paginatedOrders.length > 0
                ? (currentPage - 1) * pageSize + 1
                : 0}{" "}
              - {(currentPage - 1) * pageSize + paginatedOrders.length} of{" "}
              {filteredOrders.length}
            </p>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredOrders.length}
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