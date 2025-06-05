"use client"

import type React from "react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { Input, Image, Button, Modal, Form, Upload, Switch, message } from "antd"
import { CloseOutlined, UploadOutlined } from "@ant-design/icons"
import { useGetSingleProductQuery, useUpdateProductMutation } from "../../redux/api/product/productApi"

const { TextArea } = Input

interface ProductData {
  id: string
  name: string
  price: number
  description: string
  material: {
    name: string
  }
  quantity: number
  tags: string[]
  imageUrl: string[]
  published: boolean
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useGetSingleProductQuery(id || "")
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()

  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [imageFile, setImageFile] = useState<any>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const product: ProductData = data?.data

  if (isLoading || !product) {
    return <div>Loading...</div>
  }

  const customOrange = "#ff9248"

  const handleEditClick = () => {
    setIsEditModalVisible(true)
    form.setFieldsValue({
      name: product.name,
      price: product.price,
      description: product.description,
      material: product.material.name,
      quantity: product.quantity,
      tag: product.tags.join(", "),
      published: product.published,
    })
    setImagePreview(product.imageUrl[0] || null)
  }

  const handleCancel = () => {
    setIsEditModalVisible(false)
    form.resetFields()
    setImageFile(null)
    setImagePreview(null)
  }

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields()
      const formData = new FormData()

      formData.append("name", values.name)
      formData.append("price", values.price.toString())
      formData.append("description", values.description)
      formData.append("material", values.material)
      formData.append("quantity", values.quantity.toString())
      formData.append("tags", values.tag)
      formData.append("published", values.published.toString())

      if (imageFile) {
        formData.append("image", imageFile)
      }

      await updateProduct({ id: product.id, data: formData }).unwrap()
      message.success("Product updated successfully!")
      setIsEditModalVisible(false)
      form.resetFields()
      setImageFile(null)
      setImagePreview(null)
    } catch (error) {
      message.error("Failed to update product")
    }
  }

  const uploadProps = {
    beforeUpload: (file: File) => {
      const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png"
      if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!")
        return false
      }
      const isLt25M = file.size / 1024 / 1024 < 25
      if (!isLt25M) {
        message.error("Image must smaller than 25MB!")
        return false
      }
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      return false
    },
    onRemove: () => {
      setImageFile(null)
      setImagePreview(null)
    },
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
        <h2 style={{ color: customOrange, fontSize: "20px", fontWeight: "normal", margin: 0 }}>Product Details</h2>
        {/* <CloseOutlined
          style={{
            color: customOrange,
            fontSize: "16px",
            cursor: "pointer",
          }}
        /> */}
      </div>

      {/* Form Fields */}
      <div style={{ marginBottom: "32px" }}>
        {/* Name and Price Row */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
          <div style={{ flex: 1 }}>
            <label
              style={{ fontSize: "14px", fontWeight: "normal", color: "#000", display: "block", marginBottom: "8px" }}
            >
              Name
            </label>
            <Input
              value={product.name}
              readOnly
              style={{
                height: "40px",
                borderColor: customOrange,
                borderRadius: "4px",
                backgroundColor: "#fff",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label
              style={{ fontSize: "14px", fontWeight: "normal", color: "#000", display: "block", marginBottom: "8px" }}
            >
              Price
            </label>
            <Input
              value={`$${product.price}`}
              readOnly
              style={{
                height: "40px",
                borderColor: customOrange,
                borderRadius: "4px",
                backgroundColor: "#fff",
              }}
            />
          </div>
        </div>

        {/* Description and Product Image Row */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <label
              style={{ fontSize: "14px", fontWeight: "normal", color: "#000", display: "block", marginBottom: "8px" }}
            >
              Product Description
            </label>
            <TextArea
              value={product.description}
              readOnly
              rows={4}
              style={{
                borderColor: customOrange,
                borderRadius: "4px",
                backgroundColor: "#fff",
                resize: "none",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label
              style={{ fontSize: "14px", fontWeight: "normal", color: "#000", display: "block", marginBottom: "8px" }}
            >
              Product Image
            </label>
            <div
              style={{
                width: "100%",
                height: "120px",
                border: `1px solid ${customOrange}`,
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fafafa",
                overflow: "hidden",
              }}
            >
              <Image
                src={product.imageUrl[0] || "/placeholder.svg"}
                alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                preview={false}
              />
            </div>
          </div>
        </div>

        {/* Material and Quantity Row */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
          <div style={{ flex: 1 }}>
            <label
              style={{ fontSize: "14px", fontWeight: "normal", color: "#000", display: "block", marginBottom: "8px" }}
            >
              Material
            </label>
            <Input
              value={product.material.name}
              readOnly
              style={{
                height: "40px",
                borderColor: customOrange,
                borderRadius: "4px",
                backgroundColor: "#fff",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label
              style={{ fontSize: "14px", fontWeight: "normal", color: "#000", display: "block", marginBottom: "8px" }}
            >
              Quantity
            </label>
            <Input
              value={product.quantity}
              readOnly
              style={{
                height: "40px",
                borderColor: customOrange,
                borderRadius: "4px",
                backgroundColor: "#fff",
              }}
            />
          </div>
        </div>

        {/* Tag and Published Row */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
          <div style={{ flex: 1 }}>
            <label
              style={{ fontSize: "14px", fontWeight: "normal", color: "#000", display: "block", marginBottom: "8px" }}
            >
              Tag
            </label>
            <Input
              value={product.tags.join(", ")}
              readOnly
              style={{
                height: "40px",
                borderColor: customOrange,
                borderRadius: "4px",
                backgroundColor: "#fff",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label
              style={{ fontSize: "14px", fontWeight: "normal", color: "#000", display: "block", marginBottom: "8px" }}
            >
              Published
            </label>
            <Switch
              checked={product.published}
              disabled
              style={{
                backgroundColor: product.published ? "#52c41a" : "#d9d9d9",
                marginTop: "8px",
              }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <Button
          style={{
            height: "40px",
            width: "100px",
            borderColor: "#d9d9d9",
            color: "#000",
            fontSize: "14px",
          }}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={handleEditClick}
          style={{
            backgroundColor: customOrange,
            borderColor: customOrange,
            height: "40px",
            width: "120px",
            fontSize: "14px",
          }}
        >
          Edit Product
        </Button>
      </div>

      {/* Edit Modal */}
      <Modal
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingRight: "24px",
            }}
          >
            <span style={{ color: customOrange, fontSize: "18px", fontWeight: "normal" }}>Product Edit</span>
            <CloseOutlined
              onClick={handleCancel}
              style={{ color: customOrange, fontSize: "16px", cursor: "pointer" }}
            />
          </div>
        }
        open={isEditModalVisible}
        onCancel={handleCancel}
        footer={null}
        closable={false}
        width={700}
        styles={{
          header: {
            borderBottom: "none",
            paddingBottom: "16px",
          },
        }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: "20px" }}>
          {/* Name and Price Row */}
          <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
            <Form.Item
              label={<span style={{ fontSize: "14px", fontWeight: "normal", color: "#000" }}>Name</span>}
              name="name"
              style={{ flex: 1, marginBottom: 0 }}
              rules={[{ required: true, message: "Please input product name!" }]}
            >
              <Input
                placeholder="Gold Earring"
                style={{
                  height: "40px",
                  borderColor: customOrange,
                  borderRadius: "4px",
                }}
              />
            </Form.Item>
            <Form.Item
              label={<span style={{ fontSize: "14px", fontWeight: "normal", color: "#000" }}>Price</span>}
              name="price"
              style={{ flex: 1, marginBottom: 0 }}
              rules={[{ required: true, message: "Please input price!" }]}
            >
              <Input
                placeholder="$212"
                style={{
                  height: "40px",
                  borderColor: customOrange,
                  borderRadius: "4px",
                }}
              />
            </Form.Item>
          </div>

          {/* Description and Product Image Row */}
          <div style={{ display: "flex", gap: "16px", marginBottom: "16px", alignItems: "flex-start" }}>
            <Form.Item
              label={<span style={{ fontSize: "14px", fontWeight: "normal", color: "#000" }}>Product Description</span>}
              name="description"
              style={{ flex: 1, marginBottom: 0 }}
              rules={[{ required: true, message: "Please input description!" }]}
            >
              <TextArea
                placeholder="Lorem ipsum dolor sit amet consectetur..."
                rows={7}
                style={{
                  borderColor: customOrange,
                  borderRadius: "4px",
                  resize: "none",
                }}
              />
            </Form.Item>
            <div style={{ flex: 1 }}>
              <label
                style={{ fontSize: "14px", fontWeight: "normal", color: "#000", display: "block", marginBottom: "8px" }}
              >
                Product Image
              </label>
              <Upload.Dragger
                {...uploadProps}
                style={{
                  borderColor: customOrange,
                  borderRadius: "4px",
                  backgroundColor: "#fafafa",
                  height: "120px",
                }}
              >
                <div style={{ textAlign: "center", padding: "20px 10px" }}>
                  <UploadOutlined style={{ fontSize: "20px", color: "#666", marginBottom: "4px" }} />
                  <div style={{ fontSize: "12px", color: "#000", marginBottom: "2px" }}>Drop file or browse</div>
                  <div style={{ fontSize: "10px", color: "#999", marginBottom: "8px" }}>
                    Format: .jpeg, .png & Max file size: 25 MB
                  </div>
                  <Button
                    size="small"
                    style={{
                      backgroundColor: customOrange,
                      borderColor: customOrange,
                      color: "white",
                      fontSize: "10px",
                      height: "24px",
                    }}
                  >
                    Browse Files
                  </Button>
                </div>
              </Upload.Dragger>

              {imagePreview && (
                <div style={{ marginTop: "8px" }}>
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                      width: "80px",
                      height: "60px",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <CloseOutlined
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview(null)
                      }}
                      style={{
                        position: "absolute",
                        top: "2px",
                        right: "2px",
                        color: customOrange,
                        backgroundColor: "white",
                        borderRadius: "50%",
                        padding: "1px",
                        fontSize: "8px",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Material and Quantity Row */}
          <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
            <Form.Item
              label={<span style={{ fontSize: "14px", fontWeight: "normal", color: "#000" }}>Material</span>}
              name="material"
              style={{ flex: 1, marginBottom: 0 }}
              rules={[{ required: true, message: "Please input material!" }]}
            >
              <Input
                placeholder="Gold"
                style={{
                  height: "40px",
                  borderColor: customOrange,
                  borderRadius: "4px",
                }}
              />
            </Form.Item>
            <Form.Item
              label={<span style={{ fontSize: "14px", fontWeight: "normal", color: "#000" }}>Quantity</span>}
              name="quantity"
              style={{ flex: 1, marginBottom: 0 }}
              rules={[{ required: true, message: "Please input quantity!" }]}
            >
              <Input
                placeholder="99"
                style={{
                  height: "40px",
                  borderColor: customOrange,
                  borderRadius: "4px",
                }}
              />
            </Form.Item>
          </div>

          {/* Tag and Published Row */}
          <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
            <Form.Item
              label={<span style={{ fontSize: "14px", fontWeight: "normal", color: "#000" }}>Tag</span>}
              name="tag"
              style={{ flex: 1, marginBottom: 0 }}
            >
              <Input
                placeholder="Best selling"
                style={{
                  height: "40px",
                  borderColor: customOrange,
                  borderRadius: "4px",
                }}
              />
            </Form.Item>
            <Form.Item
              label={<span style={{ fontSize: "14px", fontWeight: "normal", color: "#000" }}>Published</span>}
              name="published"
              valuePropName="checked"
              style={{ flex: 1, marginBottom: 0 }}
            >
              <Switch
                style={{
                  backgroundColor: "#52c41a",
                  marginTop: "8px",
                }}
              />
            </Form.Item>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <Button
              onClick={handleCancel}
              style={{
                height: "40px",
                width: "100px",
                borderColor: customOrange,
                color: customOrange,
                fontSize: "14px",
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleUpdate}
              loading={isUpdating}
              style={{
                backgroundColor: customOrange,
                borderColor: customOrange,
                height: "40px",
                width: "120px",
                fontSize: "14px",
              }}
            >
              Update Product
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default ProductDetails
