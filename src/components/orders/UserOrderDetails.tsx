"use client"

import type React from "react"
import { useState } from "react"
import { Row, Col, Typography, Tag, Image, Button, Spin, Input, Modal, Rate, message } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import { useParams, useNavigate } from "react-router-dom"
import { useGetUserOrderDetilsQuery } from "../../redux/api/order/orderApi"
import { useAddReviewMutation } from "../../redux/api/feedback/feedbackApi"
import { toast } from "sonner"


const { Title, Text } = Typography
const { TextArea } = Input

interface CartItem {
  variantId: string
  productId: string
  productName: string
  productImageUrls: string[]
  size: string
  color: string
  quantity: number
  price: number
}

interface OrderData {
  id: string
  orderTime: string
  customerId: string
  method: string
  email: string
  address: string
  zipcode: string
  note: string
  amount: number
  phone: string
  isPaid: boolean
  cartItems: CartItem[]
  status: string
  createdAt: string
  updatedAt: string
  customer: {
    id: string
    name: string
    imageUrl: string
  }
}

const UserOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading, error } = useGetUserOrderDetilsQuery(id)

  // Review modal states
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [selectedProductName, setSelectedProductName] = useState<string>("")
  const [reviewTitle, setReviewTitle] = useState("")
  const [reviewComment, setReviewComment] = useState("")
  const [reviewRating, setReviewRating] = useState(0)

  const [addReview, { isLoading: isSubmittingReview }] = useAddReviewMutation()

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

  const handleClose = () => {
    navigate(-1) // Go back to previous page
  }

  const handleReviewClick = (productId: string, productName: string) => {
    setSelectedProductId(productId)
    setSelectedProductName(productName)
    setIsReviewModalVisible(true)
    // Reset form
    setReviewTitle("")
    setReviewComment("")
    setReviewRating(0)
  }

  const handleReviewCancel = () => {
    setIsReviewModalVisible(false)
    setSelectedProductId("")
    setSelectedProductName("")
    setReviewTitle("")
    setReviewComment("")
    setReviewRating(0)
  }

  const handleReviewSubmit = async () => {
    if (!reviewTitle || !reviewComment || reviewRating === 0) {
      message.error("Please fill in all fields and provide a rating")
      return
    }

    try {
      const res = await addReview({
        title: reviewTitle,
        comment: reviewComment,
        rating: reviewRating,
        productId: selectedProductId,
      }).unwrap()

      if(res.success){
        toast.success(res.message)
      } 
      else{
        toast.error(res.error)
      }
      
      handleReviewCancel()
    } catch (error) {
      message.error("Failed to submit review")
    }
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

      {/* Customer Info */}
      <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
        <Image
          src={orderData.customer.imageUrl}
          alt={orderData.customer.name}
          width={64}
          height={64}
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />
        <div>
          <Text strong style={{ fontSize: "16px", display: "block" }}>
            {orderData.customer.name}
          </Text>
          <Text style={{ color: "#666" }}>{orderData.email}</Text>
        </div>
      </div>

      {/* Product List */}
      <div style={{ marginBottom: "32px" }}>
        <Text strong style={{ fontSize: "16px", color: "#000", display: "block", marginBottom: "16px" }}>
          Product List
        </Text>

        <Row gutter={16}>
          {orderData.cartItems.map((item) => (
            <Col span={12} key={item.variantId}>
              <div
                style={{
                  border: "1px solid #f0f0f0",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "16px",
                }}
              >
                <Row align="middle" gutter={20}>
                  <Col>
                    <Image
                      src={item.productImageUrls[0]}
                      alt={item.productName}
                      width={100}
                      height={80}
                      style={{ borderRadius: "6px", objectFit: "cover" }}
                    />
                  </Col>
                  <Col flex="auto">
                    <div>
                      <Text strong style={{ fontSize: "18px", display: "block" }}>
                        {item.productName}
                      </Text>
                      <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                        <Tag>{item.size}</Tag>
                        <Tag>{item.color}</Tag>
                      </div>
                      <Text style={{ fontSize: "14px", color: "#666", display: "block", marginTop: "4px" }}>
                        Quantity: {item.quantity}
                      </Text>
                      <Text style={{ fontSize: "14px", color: "#666", display: "block", marginTop: "2px" }}>
                        ${item.price} each
                      </Text>
                      <Text strong style={{ fontSize: "16px", color: "#000", display: "block", marginTop: "4px" }}>
                        ${item.price * item.quantity}
                      </Text>
                    </div>
                  </Col>
                </Row>

                <div style={{ marginTop: "14px", display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="link"
                    onClick={() => handleReviewClick(item.productId, item.productName)}
                    style={{
                      padding: "4px 8px",
                      fontSize: "16px",
                      color: "#ff9248",
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
              value={orderData.id}
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
              Payment Method
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

          <div style={{ marginBottom: "24px" }}>
            <Text strong style={{ fontSize: "14px", color: "#000", display: "block", marginBottom: "8px" }}>
              Delivery Note
            </Text>
            <Input
              value={orderData.note || "N/A"}
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
              Contact Email
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
              Contact Phone
            </Text>
            <Input
              value={orderData.phone}
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
              Zip Code
            </Text>
            <Input
              value={orderData.zipcode || "N/A"}
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
              Order Status
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
        </Row>
      </div>

      {/* Review Modal */}
      <Modal
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#000", fontSize: "18px", fontWeight: "medium" }}>
              Review for {selectedProductName}
            </span>
            <CloseOutlined
              onClick={handleReviewCancel}
              style={{ color: "#ff4d4f", fontSize: "16px", cursor: "pointer" }}
            />
          </div>
        }
        open={isReviewModalVisible}
        onCancel={handleReviewCancel}
        footer={null}
        closable={false}
        width={500}
        styles={{
          header: {
            borderBottom: "none",
            paddingBottom: "16px",
          },
        }}
      >
        <div style={{ padding: "0 0 24px" }}>
          <Text style={{ fontSize: "14px", color: "#666", display: "block", marginBottom: "16px" }}>
            Your feedback helps us improve
          </Text>

          <div style={{ marginBottom: "16px" }}>
            <Text style={{ fontSize: "16px", color: "#000", display: "block", marginBottom: "8px" }}>Your rating:</Text>
            <Rate value={reviewRating} onChange={setReviewRating} style={{ fontSize: "20px", color: "#ff9248" }} />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <Input
              placeholder="Review title"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              style={{
                height: "40px",
                borderColor: "#d9d9d9",
                borderRadius: "4px",
                backgroundColor: "#f5f5f5",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <TextArea
              placeholder="Share your experience with this product"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              rows={4}
              style={{
                borderColor: "#d9d9d9",
                borderRadius: "4px",
                backgroundColor: "#f5f5f5",
                resize: "none",
              }}
            />
          </div>

          <div style={{ textAlign: "center" }}>
            <Button
              type="primary"
              onClick={handleReviewSubmit}
              loading={isSubmittingReview}
              style={{
                backgroundColor: "#ff9248",
                borderColor: "#ff9248",
                height: "40px",
                width: "120px",
                fontSize: "14px",
                fontWeight: "normal",
              }}
            >
              SUBMIT REVIEW
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default UserOrderDetails