"use client"

import React, { useState } from "react"
import {
  Form,
  Input,
  InputNumber,
  Switch,
  Button,
  Select,
  Upload,
  message
} from "antd"
import {  InboxOutlined } from "@ant-design/icons"
import type { UploadFile, UploadProps } from "antd"
import { useGetCategoriesQuery } from "../../redux/api/category/categoryApi"
import { useGetAllMaterialsQuery } from "../../redux/api/material/materialApi"
import { useAddProductMutation } from "../../redux/api/product/productApi"

interface FormValues {
  name: string
  price: number
  description: string
  size?: string
  quantity: number
  categoryId: string
  materialId: string
  published?: boolean
  tags?: string
}

const AddProductPage: React.FC = () => {
  const [form] = Form.useForm<FormValues>()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])

  const [addProduct, { isLoading: addingProduct }] = useAddProductMutation()

  const { data: categorie, isLoading: categoriesLoading } = useGetCategoriesQuery({})
  const categories = categorie?.data?.data as { id: string; name: string }[] || []

  const { data: material, isLoading: materialsLoading } = useGetAllMaterialsQuery({})
  const materials = material?.data?.data as { id: string; name: string }[] || []

  const handleCancel = () => {
    form.resetFields()
    setFileList([])
    setPreviewImages([])
  }

  const handleSubmit = async (values: FormValues) => {
    if (fileList.length === 0) {
      message.error("Please upload at least one image.")
      return
    }

    try {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("price", values.price.toString())
      formData.append("description", values.description)
      formData.append("size", values.size || "")
      formData.append("quantity", values.quantity.toString())
      formData.append("categoryId", values.categoryId)
      formData.append("materialId", values.materialId)
      formData.append("published", values.published ? "true" : "false")

      const tags = values.tags
        ? values.tags.split(",").map((tag) => tag.trim())
        : []
      tags.forEach((tag) => formData.append("tags[]", tag))

      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("images", file.originFileObj)
        }
      })

      await addProduct(formData).unwrap()
      message.success("Product added successfully!")
      handleCancel()
    } catch (error) {
      console.error(error)
      message.error("Failed to add product")
    }
  }

  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    fileList,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/")
      if (!isImage) {
        message.error("Only image files allowed!")
        return Upload.LIST_IGNORE
      }

      const isLt25M = file.size / 1024 / 1024 < 25
      if (!isLt25M) {
        message.error("Image must be smaller than 25MB!")
        return Upload.LIST_IGNORE
      }

      const newFile: UploadFile = {
        uid: file.uid,
        name: file.name,
        status: "done",
        originFileObj: file,
        url: URL.createObjectURL(file),
      }

      setFileList((prev) => [...prev, newFile])
      setPreviewImages((prev) => [...prev, newFile.url!])

      return false
    },
    onRemove: (file) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid))
      setPreviewImages((prev) =>
        prev.filter((_, i) => fileList[i].uid !== file.uid)
      )
    },
    customRequest: ({ onSuccess }) => {
      if (onSuccess) {
        onSuccess("ok")
      }
    },
    showUploadList: false,
  }

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-[#FB923C] text-xl font-medium">Add Product</h1>
          
        </div>

        <Form<FormValues> form={form} layout="vertical" onFinish={handleSubmit} className="w-full">
          <div className="grid grid-cols-2 gap-6 mb-4">
            <Form.Item label="Category" name="categoryId" rules={[{ required: true }]}>
              <Select
                placeholder="Select category"
                loading={categoriesLoading}
                className="w-full h-10 border border-[#FF9B44] rounded"
              >
                {categories.map((category) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Material" name="materialId" rules={[{ required: true }]}>
              <Select
                placeholder="Select material"
                loading={materialsLoading}
                className="w-full h-10 border border-[#FF9B44] rounded"
              >
                {materials.map((material) => (
                  <Select.Option key={material.id} value={material.id}>
                    {material.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <Form.Item label="Name" name="name" rules={[{ required: true }]}>
              <Input style={{
              height: "45px",
              borderRadius: "4px",
              borderColor: "#FB923C",
              fontSize: "14px",
            }} className="w-full h-10 border border-[#FF9B44] rounded" placeholder="Product Name" />
            </Form.Item>

            <Form.Item label="Price" name="price" rules={[{ required: true }]}>
              <InputNumber style={{
              height: "45px",
              borderRadius: "4px",
              borderColor: "#FB923C",
              fontSize: "14px",
              width:"100%"
            }} className="w-full h-10 border border-[#FF9B44] rounded" placeholder="Price" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <Form.Item label="Description" name="description" rules={[{ required: true }]}>
              <Input.TextArea rows={6} style={{
             
              borderRadius: "4px",
              borderColor: "#FB923C",
              fontSize: "14px",
            }} className="w-full border border-[#FF9B44] rounded" placeholder="Product Description" />
            </Form.Item>

            <Form.Item label="Product Images" name="images">
              <div className="border border-[#FF9B44] rounded p-4">
                <Upload.Dragger {...uploadProps} className="w-full">
                  <p className="text-center">
                    <InboxOutlined className="text-gray-400 text-2xl mb-1" />
                  </p>
                  <p className="text-gray-500 text-sm">Drop files or click to browse</p>
                  <p className="text-gray-400 text-xs">JPG, PNG | Max 25MB each</p>
                </Upload.Dragger>

                <div className="flex flex-wrap gap-2 mt-4">
                  {previewImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Preview ${index}`}
                      style={{
                        height: "45px",
                        borderRadius: "4px",
                        borderColor: "#FB923C",
                        fontSize: "14px",
                      }}
                      className="w-16 h-16 object-cover border border-gray-300 rounded"
                    />
                  ))}
                </div>
              </div>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <Form.Item label="Size" name="size">
              <Input style={{
              height: "45px",
              borderRadius: "4px",
              borderColor: "#FB923C",
              fontSize: "14px",
            }} className="w-full h-10 border border-[#FF9B44] rounded" placeholder="Size" />
            </Form.Item>

            <Form.Item label="Quantity" name="quantity" rules={[{ required: true }]}>
              <InputNumber  style={{
              height: "45px",
              borderRadius: "4px",
              borderColor: "#FB923C",
              fontSize: "14px",
              width:"100%"
            }} className="w-full h-10 border border-[#FF9B44] rounded" min={0} placeholder="Quantity" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <Form.Item label="Tags" name="tags">
              <Input style={{
              height: "45px",
              borderRadius: "4px",
              borderColor: "#FB923C",
              fontSize: "14px",
            }} className="w-full h-10 border border-[#FF9B44] rounded" placeholder="e.g. Popular, Featured" />
            </Form.Item>

            <Form.Item label="Published" name="published" valuePropName="checked" initialValue={true}>
              <Switch style={{ backgroundColor: "#4CD964" }} />
            </Form.Item>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={addingProduct}
              style={{
               
                backgroundColor: "#FB923C",
                fontSize: "14px"
              }}
              className="bg-[#FF9B44] hover:bg-[#ff8a29] border-none text-white"
            >
              Add Product
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default AddProductPage
