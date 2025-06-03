import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Input,
  Button,
  message,
  Space,
} from "antd";
import { SearchOutlined, EyeOutlined, PrinterOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useGetAllCustomersQuery } from "../../redux/api/customer/customerApi";



const CustomerList = () => {
  const { data, isLoading } = useGetAllCustomersQuery({});
  console.log('all customer', data);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  // 👇 Memoize to prevent infinite loops
  const allCustomers = useMemo(() => data?.Data?.data || [], [data]);
  const meta = data?.Data?.meta;

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return allCustomers;
    return allCustomers.filter((customer: any) =>
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allCustomers]);

  const handleDetails = (id: string) => {
    navigate(`/customer/details/${id}`);
  };

  const handlePrint = () => {
    window.print(); // triggers print dialog
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      render: (_: any, record: any, index: number) => index + 1,
    },
    {
      title: "Joining Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) =>
        createdAt ? new Date(createdAt).toLocaleDateString() : "N/A",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => handleDetails(record.id)}
        />
      ),
    },
  ];

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
          placeholder="Search Customers..."
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
        dataSource={filteredCustomers}
        rowKey={(record: any) => record.id || record.email}
        loading={isLoading}
        pagination={{
          current: meta?.page || 1,
          pageSize: meta?.limit || 10,
          total: meta?.total || 0,
          showTotal: (total) =>
            `Showing ${filteredCustomers.length} of ${total}`,
        }}
        bordered
      />
    </div>
  );
};

export default CustomerList;
