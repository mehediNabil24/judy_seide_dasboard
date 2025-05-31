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
import { UploadOutlined, InboxOutlined } from "@ant-design/icons"
import type { UploadFile, UploadProps } from "antd"
import { useGetCategoriesQuery } from "../../redux/api/category/categoryApi"
import { useGetAllMaterialsQuery } from "../../redux/api/material/materialApi"
import { useAddProductMutation } from "../../redux/api/product/productApi"

interface ProductFormData {
  name: string
  price: number
  description: string
  size: string
  quantity: number
  tags: string[]
  categoryId: string
  materialId: string
  images: string[]
  published: boolean
}

const AddProductPage: React.FC = () => {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [addProduct, { isLoading: addingProduct }] = useAddProductMutation()
  const [previewImages, setPreviewImages] = useState<string[]>([])

  const { data: categorie, isLoading: categoriesLoading } = useGetCategoriesQuery({})
  const categories = categorie?.data?.data

  const { data: material, isLoading: materialsLoading } = useGetAllMaterialsQuery({})
  const materials = material?.data?.data

  const handleCancel = () => {
    form.resetFields()
    setFileList([])
    setPreviewImages([])
  }

  const handleSubmit = async (values: any) => {
    try {
      const productData: ProductFormData = {
        ...values,
        tags: values.tags ? values.tags.split(",").map((tag: string) => tag.trim()) : [],
        images: fileList.map((file) => file.url || ""),
      }

      await addProduct(productData).unwrap()
      message.success("Product added successfully!")
      handleCancel()
    } catch (error) {
      message.error("Failed to add product")
      console.error(error)
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

      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const newFile = {
          uid: file.uid,
          name: file.name,
          status: "done",
          url: reader.result as string,
        } as UploadFile

        setFileList((prev) => [...prev, newFile])
        setPreviewImages((prev) => [...prev, reader.result as string])
      }

      return false
    },
    onRemove: (file) => {
      const newList = fileList.filter((f) => f.uid !== file.uid)
      const newPreviewList = previewImages.filter((_, i) => fileList[i].uid !== file.uid)
      setFileList(newList)
      setPreviewImages(newPreviewList)
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
          <h1 className="text-[#FF9B44] text-xl font-medium">Add Product</h1>
          <button className="text-gray-400 hover:text-gray-600">
            <span className="text-xl">×</span>
          </button>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSubmit} className="w-full">
          <div className="grid grid-cols-2 gap-6 mb-4">
            <Form.Item label="Category" name="categoryId" rules={[{ required: true }]}>
              <Select
                placeholder="Select category"
                loading={categoriesLoading}
                className="w-full h-10 border border-[#FF9B44] rounded"
              >
                {categories?.map((category: any) => (
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
                {materials?.map((material: any) => (
                  <Select.Option key={material.id} value={material.id}>
                    {material.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <Form.Item label="Name" name="name" rules={[{ required: true }]}>
              <Input className="w-full h-10 border border-[#FF9B44] rounded" placeholder="Product Name" />
            </Form.Item>

            <Form.Item label="Price" name="price" rules={[{ required: true }]}>
              <InputNumber className="w-full h-10 border border-[#FF9B44] rounded" placeholder="Price" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <Form.Item label="Description" name="description" rules={[{ required: true }]}>
              <Input.TextArea rows={4} className="w-full border border-[#FF9B44] rounded" placeholder="Product Description" />
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
                {/* Preview thumbnails */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {previewImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Preview ${index}`}
                      className="w-16 h-16 object-cover border border-gray-300 rounded"
                    />
                  ))}
                </div>
              </div>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <Form.Item label="Size" name="size">
              <Input className="w-full h-10 border border-[#FF9B44] rounded" placeholder="Size" />
            </Form.Item>

            <Form.Item label="Quantity" name="quantity" rules={[{ required: true }]}>
              <InputNumber className="w-full h-10 border border-[#FF9B44] rounded" min={0} placeholder="Quantity" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <Form.Item label="Tags" name="tags">
              <Input className="w-full h-10 border border-[#FF9B44] rounded" placeholder="e.g. Popular, Featured" />
            </Form.Item>

            <Form.Item label="Published" name="published" valuePropName="checked" initialValue={true}>
              <Switch style={{ backgroundColor: "#4CD964" }} />
            </Form.Item>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={addingProduct} className="bg-[#FF9B44] hover:bg-[#ff8a29] border-none text-white">
              Add Product
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default AddProductPage
