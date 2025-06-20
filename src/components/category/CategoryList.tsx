"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Table,
  Input,
  Button,
  Switch,
  Space,
  Image,
  Modal,
  Form,
  Upload,
  message,
  Select
} from "antd"
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
  CloseOutlined,
} from "@ant-design/icons"
import Swal from "sweetalert2"
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "../../redux/api/category/categoryApi"
import { toast } from "sonner"
import { Link } from "react-router-dom"

const CategoryList = () => {
  const { data, isLoading } = useGetCategoriesQuery({})
  const [deleteCategory] = useDeleteCategoryMutation()
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation()

  const allCategories = useMemo(() => data?.data?.data || [], [data])
  const meta = data?.data?.meta

  const [filteredCategories, setFilteredCategories] = useState(allCategories)
  const [searchTerm, setSearchTerm] = useState("")

  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [form] = Form.useForm()

  const [imageFile, setImageFile] = useState<any>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (searchTerm) {
      const filtered: any[] = allCategories.filter((cat: any) =>
        cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCategories(filtered)
    } else {
      setFilteredCategories(allCategories)
    }
  }, [searchTerm, allCategories])

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    })

    if (result.isConfirmed) {
      try {
        await deleteCategory(id).unwrap()
        Swal.fire("Deleted!", "Category has been deleted.", "success")
      } catch {
        Swal.fire("Error", "Failed to delete category", "error")
      }
    }
  }

  const handleEdit = (category: any) => {
    setEditingCategory(category)
    setEditModalVisible(true)
    form.setFieldsValue({
      categoryName: category.categoryName,
      published: category.published,
      sizes: category.sizes || [],
    })
    setImagePreview(category.imageUrl || null)
    setImageFile(null)
  }

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields()
      const publishedValue = values.published === true || values.published === "true"

      if (imageFile) {
        const formData = new FormData()
        formData.append("categoryName", values.categoryName)
        formData.append("image", imageFile)
        formData.append("published", publishedValue ? "true" : "false")
        formData.append("sizes", JSON.stringify(values.sizes))

        if (editingCategory?.imageUrl) {
          formData.append("existingImageUrl", editingCategory.imageUrl)
        }

        await updateCategory({
          id: editingCategory.id,
          updatedData: formData,
          published: publishedValue,
        }).unwrap()
      } else {
        await updateCategory({
          id: editingCategory.id,
          updatedData: {
            categoryName: values.categoryName,
            published: publishedValue,
            sizes: values.sizes,
            imageUrl: editingCategory.imageUrl,
          },
        }).unwrap()
      }

      toast.success("Category updated successfully")
      setEditModalVisible(false)
      form.resetFields()
      setImageFile(null)
      setImagePreview(null)
    } catch (error: any) {
      toast.error("Update error:", error)
      message.error(
        error?.data?.message || error?.message || "Update failed. Please try again."
      )
    }
  }

  const handleCancel = () => {
    setEditModalVisible(false)
    setImageFile(null)
    setImagePreview(null)
    form.resetFields()
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
    accept: "image/jpeg,image/png",
    maxCount: 1,
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "categoryName",
      key: "name",
      render: (name: string) => (
        <span style={{ textTransform: "capitalize" }}>{name.toLowerCase()}</span>
      ),
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "image",
      render: (url: string) => (
        <Image
          src={url || "/placeholder.svg"}
          alt="category"
          width={60}
          height={40}
          style={{ objectFit: "cover", borderRadius: 4 }}
          preview={false}
        />
      ),
    },
    {
      title: "Sizes",
      dataIndex: "sizes",
      key: "sizes",
      render: (sizes: string[]) => sizes?.join(", "),
    },
    {
      title: "Publish",
      dataIndex: "published",
      key: "published",
      render: (published: boolean, record: any) => (
        <Switch
          checked={published}
          onChange={async (checked) => {
            try {
              await updateCategory({
                id: record.id,
                updatedData: { published: checked },
              }).unwrap()
              toast.success("Status updated successfully")
            } catch (error) {
              toast.error("Failed to update status")
            }
          }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <Input
          placeholder="Search Categories..."
          prefix={<SearchOutlined />}
          style={{ width: 250, borderColor: "#FB923C" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link to="/admin/add-category">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ backgroundColor: "#FB923C", borderColor: "#FB923C" }}
          >
            Add Category
          </Button>
        </Link>
      </div>

      <Table
        columns={columns}
        dataSource={filteredCategories}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: meta?.page || 1,
          pageSize: meta?.limit || 10,
          total: meta?.total || 0,
          showTotal: (total) => `Showing ${filteredCategories.length} of ${total}`,
        }}
        bordered
      />

      <Modal
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: "24px" }}>
            <span style={{ color: "#ff9248", fontSize: "18px", fontWeight: "normal" }}>Edit Category</span>
            <CloseOutlined onClick={handleCancel} style={{ color: "#ff9248", fontSize: "16px", cursor: "pointer" }} />
          </div>
        }
        open={editModalVisible}
        onCancel={handleCancel}
        footer={null}
        closable={false}
        width={600}
      >
        <Form form={form} layout="vertical" style={{ marginTop: "20px" }}>
          <Form.Item
            label="Name"
            name="categoryName"
            rules={[{ required: true, message: "Please input category name!" }]}
          >
            <Input placeholder="Earrings" style={{ height: "45px", borderColor: "#ff9248" }} />
          </Form.Item>

          <Form.Item
            label="Sizes"
            name="sizes"
            rules={[{ required: true, message: "Please input sizes!" }]}
          >
            <Select
              mode="tags"
              placeholder="Enter sizes like S, M, L"
              tokenSeparators={[","]}
              onBlur={() => {
                const current = form.getFieldValue("sizes") || []
                const lower = current.map((s: string) => s.toLowerCase())
                form.setFieldsValue({ sizes: lower })
              }}
            />
          </Form.Item>

          <Form.Item label="Category Image">
            <Upload.Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p>Drop file or click to upload</p>
              <p>JPG/PNG, Max: 25MB</p>
            </Upload.Dragger>
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "120px", height: "80px", objectFit: "cover", marginTop: 8 }}
                />
              </div>
            )}
          </Form.Item>

          <Form.Item label="Published" name="published" valuePropName="checked">
            <Switch />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <Button onClick={handleCancel} style={{ borderColor: "#ff9248", color: "#ff9248" }}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleUpdate} loading={isUpdating} style={{ backgroundColor: "#ff9248" }}>
              Update Category
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default CategoryList
