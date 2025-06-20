"use client"

import type React from "react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { Input, Image, Button, Modal, Form, Upload, Switch, message, Checkbox, Tag, Typography, InputNumber, Spin } from "antd"
import { CloseOutlined, UploadOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons"
import { useGetSingleProductQuery, useUpdateProductMutation } from "../../redux/api/product/productApi"
import { toast } from "sonner"

const { TextArea } = Input
const { Text } = Typography

interface Variant {
  id: string
  size: string
  color: string
  price: number
  quantity: number
  createdAt: string
  updatedAt: string
}

interface ProductData {
  id: string
  name: string
  description: string
  imageUrl: string[]
  tags: string[]
  published: boolean
  materialId: string
  categoryId: string
  createdAt: string
  updatedAt: string
  category: {
    id: string
    categoryName: string
    imageUrl: string
  }
  material: {
    id: string
    materialName: string
  }
  variants: Variant[]
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useGetSingleProductQuery(id || "")
  // console.log('produict',data);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()

  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [imagesToKeep, setImagesToKeep] = useState<string[]>([])

  const product: ProductData = data?.data

  if (isLoading || !product) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
      <Spin size="large" tip="Loading product..." />
    </div>
  );
}
  const customOrange = "#ff9248"

  const handleEditClick = () => {
    setIsEditModalVisible(true)
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      material: product.material.materialName,
      tag: product.tags.join(", "),
      published: product.published,
      variants: product.variants
    })
    setImagePreviews(product.imageUrl || [])
    setImagesToKeep(product.imageUrl || [])
  }

  const handleCancel = () => {
    setIsEditModalVisible(false)
    form.resetFields()
    setImageFiles([])
    setImagePreviews([])
    setImagesToKeep([])
  }

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields()
      const formData = new FormData()

      formData.append("name", values.name)
      formData.append("description", values.description)
      formData.append("material", values.material)
      formData.append("tags", values.tag)
      formData.append("published", values.published.toString())

      // Append all new images
      imageFiles.forEach(file => {
        formData.append("images", file)
      })

      // Append the URLs of images to keep as JSON string
      if (imagesToKeep.length > 0) {
        formData.append("imageUrlsToKeep", JSON.stringify(imagesToKeep))
      }

      // Append variants if modified
      if (values.variants) {
        formData.append("variants", JSON.stringify(values.variants))
      }

      await updateProduct({ 
        id: product.id, 
        data: formData 
      }).unwrap()
      toast.success("Product updated successfully!")
      setIsEditModalVisible(false)
    } catch (error: any) {
      let errorMessage = "Failed to update product"
      
      if (error?.data?.message) {
        errorMessage = error.data.message
      } else if (error?.error) {
        errorMessage = error.error
      }

      toast.error(errorMessage)
      console.error("Update error:", error)
    }
  }

  const handleImageToggle = (imageUrl: string, checked: boolean) => {
    if (checked) {
      setImagesToKeep(prev => [...prev, imageUrl])
    } else {
      setImagesToKeep(prev => prev.filter(url => url !== imageUrl))
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
      setImageFiles(prev => [...prev, file])
      setImagePreviews(prev => [...prev, URL.createObjectURL(file)])
      return false
    },
    multiple: true,
  }

  const getPriceRange = () => {
    if (!product.variants || product.variants.length === 0) return "N/A"
    const prices = product.variants.map(v => v.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return min === max ? `$${min}` : `$${min} - $${max}`
  }

  const getTotalQuantity = () => {
    if (!product.variants || product.variants.length === 0) return 0
    return product.variants.reduce((sum, variant) => sum + variant.quantity, 0)
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
              Price Range
            </label>
            <Input
              value={getPriceRange()}
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
              Product Images
            </label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {product.imageUrl.map((img, index) => (
                <div
                  key={index}
                  style={{
                    width: "80px",
                    height: "80px",
                    border: `1px solid ${customOrange}`,
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={img}
                    alt={`Product ${index + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    preview={{
                      mask: <span>View</span>,
                    }}
                  />
                </div>
              ))}
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
              value={product.material.materialName}
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
              Total Quantity
            </label>
            <Input
              value={getTotalQuantity()}
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

        {/* Variants */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{ fontSize: "14px", fontWeight: "normal", color: "#000", display: "block", marginBottom: "8px" }}
          >
            Variants
          </label>
          <div style={{ border: `1px solid ${customOrange}`, borderRadius: "4px", padding: "16px" }}>
            {product.variants.map((variant, index) => (
              <div key={variant.id} style={{ marginBottom: index < product.variants.length - 1 ? "16px" : 0, paddingBottom: index < product.variants.length - 1 ? "16px" : 0, borderBottom: index < product.variants.length - 1 ? "1px dashed #d9d9d9" : "none" }}>
                <div style={{ display: "flex", gap: "16px", marginBottom: "8px" }}>
                  <div style={{ flex: 1 }}>
                    <Text strong>Size:</Text> {variant.size}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text strong>Color:</Text> {variant.color}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <Text strong>Price:</Text> ${variant.price}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text strong>Quantity:</Text> {variant.quantity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tag and Published Row */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
          <div style={{ flex: 1 }}>
            <label
              style={{ fontSize: "14px", fontWeight: "normal", color: "#000", display: "block", marginBottom: "8px" }}
            >
              Tags
            </label>
            <div style={{ minHeight: "40px", border: `1px solid ${customOrange}`, borderRadius: "4px", backgroundColor: "#fff", padding: "8px" }}>
              {product.tags.map((tag, index) => (
                <Tag key={index} style={{ marginBottom: "4px" }}>{tag}</Tag>
              ))}
            </div>
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
          {/* Name and Description Row */}
          <div style={{ marginBottom: "16px" }}>
            <Form.Item
              label={<span style={{ fontSize: "14px", fontWeight: "normal", color: "#000" }}>Name</span>}
              name="name"
              rules={[{ required: true, message: "Please input product name!" }]}
            >
              <Input
                placeholder="Product name"
                style={{
                  height: "40px",
                  borderColor: customOrange,
                  borderRadius: "4px",
                }}
              />
            </Form.Item>
          </div>

          <Form.Item
            label={<span style={{ fontSize: "14px", fontWeight: "normal", color: "#000" }}>Description</span>}
            name="description"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <TextArea
              placeholder="Product description"
              rows={4}
              style={{
                borderColor: customOrange,
                borderRadius: "4px",
                resize: "none",
              }}
            />
          </Form.Item>

          {/* Images */}
          <Form.Item
            label={<span style={{ fontSize: "14px", fontWeight: "normal", color: "#000" }}>Product Images</span>}
          >
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
                <div style={{ fontSize: "12px", color: "#000", marginBottom: "2px" }}>Drop files or browse</div>
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

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
              {imagePreviews.map((preview, index) => {
                const isExistingImage = index < product.imageUrl.length
                const isChecked = imagesToKeep.includes(preview) || 
                                (isExistingImage && !imagesToKeep.some(url => product.imageUrl.includes(url)))
                
                return (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      width: "80px",
                      height: "80px",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={preview}
                      alt={`preview-${index}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    {isExistingImage && (
                      <Checkbox
                        checked={isChecked}
                        onChange={(e) => handleImageToggle(preview, e.target.checked)}
                        style={{
                          position: "absolute",
                          top: "2px",
                          left: "2px",
                          zIndex: 1,
                        }}
                      />
                    )}
                    <CloseOutlined
                      onClick={() => {
                        setImagePreviews(prev => prev.filter((_, i) => i !== index))
                        if (index >= product.imageUrl.length) {
                          setImageFiles(prev => prev.filter((_, i) => i !== (index - product.imageUrl.length)))
                        } else {
                          setImagesToKeep(prev => prev.filter(url => url !== preview))
                        }
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
                )
              })}
            </div>
          </Form.Item>

          {/* Material and Published */}
          <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
            <Form.Item
              label={<span style={{ fontSize: "14px", fontWeight: "normal", color: "#000" }}>Material</span>}
              name="material"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Please input material!" }]}
            >
              <Input
                placeholder="Material"
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
              style={{ flex: 1 }}
            >
              <Switch
                style={{
                  backgroundColor: "#52c41a",
                  marginTop: "8px",
                }}
              />
            </Form.Item>
          </div>

          {/* Tags */}
          <Form.Item
            label={<span style={{ fontSize: "14px", fontWeight: "normal", color: "#000" }}>Tags (comma separated)</span>}
            name="tag"
          >
            <Input
              placeholder="tag1, tag2, tag3"
              style={{
                height: "40px",
                borderColor: customOrange,
                borderRadius: "4px",
              }}
            />
          </Form.Item>

          {/* Variants */}
          <Form.List name="variants">
            {(fields, { add, remove }) => (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label style={{ fontSize: "14px", fontWeight: "normal", color: "#000" }}>Variants</label>
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Add Variant
                  </Button>
                </div>
                
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} style={{ border: `1px solid ${customOrange}`, borderRadius: "4px", padding: "16px", marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
                      <Button
                        danger
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                      />
                    </div>
                    <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                      <Form.Item
                        {...restField}
                        name={[name, 'size']}
                        label="Size"
                        style={{ flex: 1 }}
                        rules={[{ required: true, message: "Please input size!" }]}
                      >
                        <Input placeholder="Size" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'color']}
                        label="Color"
                        style={{ flex: 1 }}
                        rules={[{ required: true, message: "Please input color!" }]}
                      >
                        <Input placeholder="Color" />
                      </Form.Item>
                    </div>
                    <div style={{ display: "flex", gap: "16px" }}>
                      <Form.Item
                        {...restField}
                        name={[name, 'price']}
                        label="Price"
                        style={{ flex: 1 }}
                        rules={[{ required: true, message: "Please input price!" }]}
                      >
                        <InputNumber placeholder="Price" style={{ width: '100%' }} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'quantity']}
                        label="Quantity"
                        style={{ flex: 1 }}
                        rules={[{ required: true, message: "Please input quantity!" }]}
                      >
                        <InputNumber placeholder="Quantity" style={{ width: '100%' }} />
                      </Form.Item>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Form.List>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
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