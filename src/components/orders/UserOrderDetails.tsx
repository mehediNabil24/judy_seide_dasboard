"use client"

import type React from "react"
import { Row, Col, Typography, Tag, Image, Button, Spin, Input } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import { useParams, useNavigate } from "react-router-dom"
import { useGetUserOrderDetilsQuery } from "../../redux/api/order/orderApi"

const { Title, Text } = Typography

interface CartItem {
  productId: string
  name: string
  imageUrl: string[]
  quantity: number
  price: number
  product: {
    id: string
    name: string
    price: number
    imageUrl: string[]
  }
}

interface OrderData {
  id: string
  orderTime: string
  customerId: string
  method: string
  email: string
  address: string
  amount: number
  phone: string
  isPaid: boolean
  cartItems: CartItem[]
  status: string
  createdAt: string
  updatedAt: string
}

// interface OrderResponse {
//   success: boolean
//   statusCode: number
//   message: string
//   data: OrderData
// }

const UserOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading, error } = useGetUserOrderDetilsQuery(id)

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <Spin size="large" />
      </div>
    )
  }

  if (error || !data?.success) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Text type="danger">Failed to load order details</Text>
      </div>
    )
  }

  const orderData: OrderData = data.data

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return "#52c41a"
      case "PENDING":
        return "#faad14"
      case "PROCESSING":
        return "#1890ff"
      case "CANCELLED":
        return "#ff4d4f"
      default:
        return "#d9d9d9"
    }
  }

  // const calculateSubtotal = () => {
  //   return orderData.cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  // }

  const handleClose = () => {
    navigate(-1) // Go back to previous page
  }

  return (
    <div style={{ padding: "24px", maxWidth: "full", margin: "0 auto", backgroundColor: "white" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <Title level={3} style={{ color: "#ff9248", margin: 0, fontSize: "20px", fontWeight: "normal" }}>
          Order Details
        </Title>
        <CloseOutlined
          onClick={handleClose}
          style={{
            color: "#ff9248",
            fontSize: "16px",
            cursor: "pointer",
          }}
        />
      </div>

      {/* Product List */}
      <div style={{ marginBottom: "32px" }}>
        <Text strong style={{ fontSize: "16px", color: "#000", display: "block", marginBottom: "16px" }}>
          Product List
        </Text>

        <Row gutter={16}>
          {orderData.cartItems.map((item) => (
            <Col span={12} key={item.productId}>
              <div
                style={{
                  border: "1px solid #f0f0f0",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "16px",
                }}
              >
                <Row align="middle" gutter={12}>
                  <Col>
                    <Image
                      src={item.imageUrl[0] || "/placeholder.svg"}
                      alt={item.name}
                      width={80}
                      height={80}
                      style={{ borderRadius: "6px", objectFit: "cover" }}
                    />
                  </Col>
                  <Col flex="auto">
                    <div>
                      <Text strong style={{ fontSize: "14px", display: "block" }}>
                        {item.name}
                      </Text>
                      <Text style={{ fontSize: "12px", color: "#666", display: "block", marginTop: "2px" }}>
                        Quantity: {item.quantity}
                      </Text>
                      <Text style={{ fontSize: "12px", color: "#666", display: "block", marginTop: "2px" }}>
                        ${item.price} each
                      </Text>
                      <Text strong style={{ fontSize: "16px", color: "#000", display: "block", marginTop: "4px" }}>
                        ${item.price * item.quantity}
                      </Text>
                    </div>
                  </Col>
                </Row>

                <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      backgroundColor: "#ffd700",
                      borderRadius: "50%",
                      border: "2px solid #ff9248",
                    }}
                  />
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      backgroundColor: "#c0c0c0",
                      borderRadius: "50%",
                      border: "1px solid #d9d9d9",
                    }}
                  />
                  <Text style={{ fontSize: "12px", color: "#666", marginLeft: "8px" }}>18k Gold Vermeil</Text>
                  <Button
                    type="link"
                    onClick={() => navigate(`/add-rating/${item.productId}`)}
                    style={{
                      padding: "4px 8px",
                      fontSize: "18px",
                      color: "#ff9248",
                      marginLeft: "auto",
                      height: "auto",
                      lineHeight: "1.2",
                    }}
                  >
                    Review now
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Order Information Form */}
      <Row gutter={24}>
        {/* Left Column */}
        <Col span={12}>
          <div style={{ marginBottom: "24px" }}>
            <Text strong style={{ fontSize: "14px", color: "#000", display: "block", marginBottom: "8px" }}>
              Order ID
            </Text>
            <Input
              value={orderData.id.slice(-4)} // Show last 4 characters
              readOnly
              style={{
                height: "40px",
                borderColor: "#ff9248",
                borderRadius: "4px",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <Text strong style={{ fontSize: "14px", color: "#000", display: "block", marginBottom: "8px" }}>
              Order Time
            </Text>
            <Input
              value={dayjs(orderData.orderTime).format("DD MMM YY HH:mm A")}
              readOnly
              style={{
                height: "40px",
                borderColor: "#ff9248",
                borderRadius: "4px",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <Text strong style={{ fontSize: "14px", color: "#000", display: "block", marginBottom: "8px" }}>
              Method
            </Text>
            <Input
              value={orderData.method}
              readOnly
              style={{
                height: "40px",
                borderColor: "#ff9248",
                borderRadius: "4px",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <Text strong style={{ fontSize: "14px", color: "#000", display: "block", marginBottom: "8px" }}>
              Shipping Address
            </Text>
            <Input
              value={orderData.address}
              readOnly
              style={{
                height: "40px",
                borderColor: "#ff9248",
                borderRadius: "4px",
              }}
            />
          </div>
        </Col>

        {/* Right Column */}
        <Col span={12}>
          <div style={{ marginBottom: "24px" }}>
            <Text strong style={{ fontSize: "14px", color: "#000", display: "block", marginBottom: "8px" }}>
              Email
            </Text>
            <Input
              value={orderData.email}
              readOnly
              style={{
                height: "40px",
                borderColor: "#ff9248",
                borderRadius: "4px",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <Text strong style={{ fontSize: "14px", color: "#000", display: "block", marginBottom: "8px" }}>
              Amount
            </Text>
            <Input
              value={`$${orderData.amount}`}
              readOnly
              style={{
                height: "40px",
                borderColor: "#ff9248",
                borderRadius: "4px",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <Text strong style={{ fontSize: "14px", color: "#000", display: "block", marginBottom: "8px" }}>
              Status
            </Text>
            <Input
              value={orderData.status}
              readOnly
              style={{
                height: "40px",
                borderColor: "#ff9248",
                borderRadius: "4px",
                color: getStatusColor(orderData.status),
                fontWeight: "500",
              }}
            />
          </div>

          {/* Total Amount */}
          <div style={{ textAlign: "right", marginTop: "40px" }}>
            <Text strong style={{ fontSize: "16px", color: "#000", display: "block", marginBottom: "8px" }}>
              Total Amount
            </Text>
            <Text strong style={{ fontSize: "24px", color: "#000" }}>
              ${orderData.amount}
            </Text>
          </div>
        </Col>
      </Row>

      {/* Payment Status Info */}
      <div style={{ marginTop: "32px", padding: "16px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Text strong>Payment Status:</Text>
            <Tag color={orderData.isPaid ? "#52c41a" : "#ff4d4f"} style={{ marginLeft: "8px", fontSize: "12px" }}>
              {orderData.isPaid ? "PAID" : "UNPAID"}
            </Tag>
          </Col>
          <Col>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Last Updated: {dayjs(orderData.updatedAt).format("DD/MM/YYYY HH:mm")}
            </Text>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default UserOrderDetails
