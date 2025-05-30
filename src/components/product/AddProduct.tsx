"use client"

import type React from "react"
import { useState } from "react"
import { Form, Input, InputNumber, Switch, Button, Select, Upload, message } from "antd"
import { UploadOutlined, InboxOutlined } from "@ant-design/icons"
import type { UploadFile, UploadProps } from "antd"
import { useGetCategoriesQuery } from "../../redux/api/category/categoryApi"
import { useGetAllCustomerQuery } from "../../redux/api/booking/bookingApi"
import { useAddProductMutation } from "../../redux/api/product/productApi"
import { useGetAllMaterialsQuery } from "../../redux/api/material/materialApi"





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

// Mock hooks - replace with your actual implementation






const AddProductPage: React.FC = () => {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Get categories and materials
  const { data: categorie, isLoading: categoriesLoading } = useGetCategoriesQuery({})
  console.log('categories',categorie);

  const categories = categorie?.data?.data

  const { data: material, isLoading: materialsLoading } = useGetAllMaterialsQuery({})
  const materials = material?.data?.data
  console.log('materials', materials);
  const [addProduct, { isLoading: addingProduct }] = useAddProductMutation()

  const handleCancel = () => {
    form.resetFields()
    setFileList([])
    setPreviewImage(null)
  }

  const handleSubmit = async (values: any) => {
    try {
      // Transform the data as needed
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
      // Check file type
      const isImage = file.type.startsWith("image/")
      if (!isImage) {
        message.error("You can only upload image files!")
        return Upload.LIST_IGNORE
      }

      // Check file size (25MB)
      const isLt25M = file.size / 1024 / 1024 < 25
      if (!isLt25M) {
        message.error("Image must be smaller than 25MB!")
        return Upload.LIST_IGNORE
      }

      // Create a preview URL
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
        if (!previewImage) {
          setPreviewImage(reader.result as string)
        }
      }

      // Prevent automatic upload
      return false
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)

      if (newFileList.length > 0) {
        setPreviewImage(newFileList[0].url || null)
      } else {
        setPreviewImage(null)
      }
    },
    customRequest: ({ onSuccess }) => {
      if (onSuccess) {
        onSuccess("ok")
      }
    },
  }

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-[#FF9B44] text-xl font-medium">Add Product</h1>
          <button className="text-gray-400 hover:text-gray-600">
            <span className="text-xl">×</span>
          </button>
        </div>

        {/* Form */}
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="w-full">
          {/* First Row - Category and Material */}
          <div className="grid grid-cols-2 gap-6 mb-4">
            <Form.Item
              label={<span className="text-sm text-gray-800 font-medium">Category</span>}
              name="categoryId"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select placeholder="Select category" loading={categoriesLoading} className="w-full h-10">
                {categories?.map((category:any) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={<span className="text-sm text-gray-800 font-medium">Material</span>}
              name="materialId"
              rules={[{ required: true, message: "Please select a material" }]}
            >
              <Select placeholder="Select material" loading={materialsLoading} className="w-full h-10">
                {materials?.map((material:any) => (
                  <Select.Option key={material.id} value={material.id}>
                    {material.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* Second Row - Name and Price */}
          <div className="grid grid-cols-2 gap-6 mb-4">
            <Form.Item
              label={<span className="text-sm text-gray-800 font-medium">Name</span>}
              name="name"
              rules={[{ required: true, message: "Please enter product name" }]}
            >
              <Input placeholder="Product title" className="w-full h-10 border border-[#e8e8e8] rounded" />
            </Form.Item>

            <Form.Item
              label={<span className="text-sm text-gray-800 font-medium">Price</span>}
              name="price"
              rules={[{ required: true, message: "Please enter product price" }]}
            >
              <InputNumber
                placeholder="Enter Price"
                className="w-full h-10 border border-[#e8e8e8] rounded"
               
              />
            </Form.Item>
          </div>

          {/* Third Row - Description and Image */}
          <div className="grid grid-cols-2 gap-6 mb-4">
            <Form.Item
              label={<span className="text-sm text-gray-800 font-medium">Product Description</span>}
              name="description"
              rules={[{ required: true, message: "Please enter product description" }]}
            >
              <Input.TextArea
                placeholder="Product description"
                className="w-full border border-[#e8e8e8] rounded"
                rows={4}
              />
            </Form.Item>

            <Form.Item label={<span className="text-sm text-gray-800 font-medium">Product Image</span>} name="images">
              <div className="border border-[#e8e8e8] rounded p-4 flex flex-col items-center justify-center h-[120px]">
                <Upload.Dragger {...uploadProps} className="w-full" showUploadList={false}>
                  <p className="text-center">
                    <InboxOutlined className="text-gray-400 text-2xl mb-1" />
                  </p>
                  <p className="text-gray-500 text-sm">Drop file or browse</p>
                  <p className="text-gray-400 text-xs mt-1">Format: jpeg, png & Max file size: 25 MB</p>
                  <Button
                    className="mt-2 bg-[#FF9B44] text-white border-none hover:bg-[#ff8a29]"
                    icon={<UploadOutlined />}
                  >
                    Upload Files
                  </Button>
                </Upload.Dragger>
              </div>

              {/* Preview Image */}
              {previewImage && (
                <div className="mt-2">
                  <img
                    src={previewImage || "/placeholder.svg"}
                    alt="Preview"
                    className="w-16 h-16 object-cover border border-gray-200"
                  />
                </div>
              )}
            </Form.Item>
          </div>

          {/* Fourth Row - Material and Size */}
          <div className="grid grid-cols-2 gap-6 mb-4">
            <Form.Item label={<span className="text-sm text-gray-800 font-medium">Size</span>} name="size">
              <Input placeholder="Product size" className="w-full h-10 border border-[#e8e8e8] rounded" />
            </Form.Item>

            <Form.Item
              label={<span className="text-sm text-gray-800 font-medium">Quantity</span>}
              name="quantity"
              rules={[{ required: true, message: "Please enter product quantity" }]}
            >
              <InputNumber
                placeholder="Product Quantity"
                className="w-full h-10 border border-[#e8e8e8] rounded"
                min={0}
              />
            </Form.Item>
          </div>

          {/* Fifth Row - Tags and Published */}
          <div className="grid grid-cols-2 gap-6 mb-4">
            <Form.Item label={<span className="text-sm text-gray-800 font-medium">Tag</span>} name="tags">
              <Input
                placeholder="Product tag (e.g Best selling, Popular)"
                className="w-full h-10 border border-[#e8e8e8] rounded"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-sm text-gray-800 font-medium">Published</span>}
              name="published"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch
                className="bg-gray-300"
                checkedChildren=""
                unCheckedChildren=""
                style={{ backgroundColor: "#4CD964" }}
              />
            </Form.Item>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-10">
            <Button
              onClick={handleCancel}
              className="min-w-[120px] h-10 border border-[#e8e8e8] text-gray-600 hover:text-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={addingProduct}
              className="min-w-[120px] h-10 bg-[#FF9B44] border-none hover:bg-[#ff8a29]"
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
