import  { useMemo } from "react";
import { Table, Tag, Button, message, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useGetUserOrdersQuery, useUpdateOrdersMutation } from "../../redux/api/order/orderApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";



const UserOrderList = () => {

    const navigate = useNavigate();


    const id = useSelector((state: any) => state.user.user?.id);
  const { data, isLoading } = useGetUserOrdersQuery(id);
  const [updateOrder] = useUpdateOrdersMutation();

  const orders = useMemo(() => data?.Data?.data || [], [data]);
  const meta = data?.Data?.meta;

  const handleCancelOrder = async (id: string) => {
    try {
      const res = await updateOrder({ id, body: { status: "CANCELED" } }).unwrap();
      if (res?.success) {
        message.success("Order canceled successfully.");
      } else {
        message.error("Failed to cancel the order.");
      }
    } catch (error) {
      message.error("An error occurred while canceling.");
    }
  };

  // const handleViewDetails = (record: any) => {
  //   // You can implement a modal or redirect here
  //   console.log("Product details:", record.cartItems);
  //   message.info("Showing product details in console.");
  // };

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
      title: "Shipping Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Email",
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
        render: (_: any, record: any) => (
          <div style={{ display: "flex", gap: 8 }}>
            <Tooltip title="View Product Details">
              <Button
                shape="circle"
                icon={<EyeOutlined />}
                onClick={() => navigate(`/dashboard/order-list/${record.id}`)}
              />
            </Tooltip>
            {record.status === "PROCESSING" && (
              <Tooltip title="Cancel Order">
                <Button
                  type="primary"
                  danger
                  onClick={() => handleCancelOrder(record.id)}
                >
                  Cancel
                </Button>
              </Tooltip>
            )}
          </div>
        ),
      },
      
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>User Order List</h2>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey={(record) => record.id}
        loading={isLoading}
        pagination={{
          current: meta?.page || 1,
          pageSize: meta?.limit || 10,
          total: meta?.total || 0,
          showTotal: (total) => `Total ${total} orders`,
        }}
        bordered
      />
    </div>
  );
};

export default UserOrderList;
