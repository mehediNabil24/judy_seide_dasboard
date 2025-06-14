"use client"

import { useState, useEffect, useMemo } from "react"
import { Table, Input, Button, Switch, Space, Image, Modal, Form, Upload, message } from "antd"
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
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      name: category.name,
      published: category.published 
    })
    setImagePreview(category.imageUrl || null)
    setImageFile(null)
  }

const handleUpdate = async () => {
  try {
    const values = await form.validateFields();
    const publishedValue = values.published === true || values.published === 'true';

    if (imageFile) {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("image", imageFile);

      if (editingCategory?.imageUrl) {
        formData.append("existingImageUrl", editingCategory.imageUrl);
      }

      // 👇 Send `published` separately through query param
      await updateCategory({
        id: editingCategory.id,
        updatedData: formData,
        published: publishedValue, // passed to query param
      }).unwrap();
    } else {
      // Send as normal JSON
      await updateCategory({
        id: editingCategory.id,
        updatedData: {
          name: values.name,
          published: publishedValue,
          imageUrl: editingCategory.imageUrl,
        },
      }).unwrap();
    }

    toast.success("Category updated successfully");
    setEditModalVisible(false);
    form.resetFields();
    setImageFile(null);
    setImagePreview(null);
  } catch (error: any) {
    toast.error("Update error:", error);
    message.error(
      error?.data?.message || error?.message || "Update failed. Please try again."
    );
  }
};


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
      return false // Prevent auto upload
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
      dataIndex: "name",
      key: "name",
      render: (name: string) => <span style={{ textTransform: "capitalize" }}>{name.toLowerCase()}</span>,
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
                updatedData: { published: checked }
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
      {/* Top Section */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <Input
          placeholder="Search Categories..."
          prefix={<SearchOutlined />}
          style={{ width: 250, borderColor: "#FB923C" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      <Link to="/admin/add-category">
        <Button  type="primary" icon={<PlusOutlined />} style={{ backgroundColor: "#FB923C", borderColor: "#FB923C" }}>
          Add Category
        </Button>
      </Link>
      </div>

      {/* Table Section */}
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
            <span style={{ color: "#ff9248", fontSize: "18px", fontWeight: "normal" }}>Edit Category</span>
            <CloseOutlined onClick={handleCancel} style={{ color: "#ff9248", fontSize: "16px", cursor: "pointer" }} />
          </div>
        }
        open={editModalVisible}
        onCancel={handleCancel}
        footer={null}
        closable={false}
        width={600}
        styles={{
          header: {
            borderBottom: "none",
            paddingBottom: "16px",
          },
        }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: "20px" }}>
          <Form.Item
            label={<span style={{ fontSize: "16px", fontWeight: "normal", color: "#000" }}>Name</span>}
            name="name"
            rules={[{ required: true, message: "Please input category name!" }]}
          >
            <Input
              placeholder="Earrings"
              style={{
                height: "45px",
                borderRadius: "4px",
                borderColor: "#ff9248",
                fontSize: "14px",
              }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontSize: "16px", fontWeight: "normal", color: "#000" }}>Category Image</span>}
          >
            <Upload.Dragger
              {...uploadProps}
              style={{
                borderColor: "#ff9248",
                borderRadius: "4px",
                backgroundColor: "#fafafa",
                padding: "40px 20px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <UploadOutlined style={{ fontSize: "24px", color: "#666", marginBottom: "8px" }} />
                <div style={{ fontSize: "16px", color: "#000", marginBottom: "4px" }}>Drop file or browse</div>
                <div style={{ fontSize: "12px", color: "#999", marginBottom: "16px" }}>
                  Format: .jpeg, .png & Max file size: 25 MB
                </div>
                <Button
                  style={{
                    backgroundColor: "#ff9248",
                    borderColor: "#ff9248",
                    color: "white",
                    fontSize: "12px",
                    height: "32px",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                  }}
                >
                  Browse Files
                </Button>
              </div>
            </Upload.Dragger>

            {(imagePreview || editingCategory?.imageUrl) && (
              <div style={{ marginTop: "16px" }}>
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: "120px",
                    height: "80px",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={imagePreview || editingCategory?.imageUrl}
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
                      top: "4px",
                      right: "4px",
                      color: "#ff9248",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      padding: "2px",
                      fontSize: "10px",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </div>
            )}
          </Form.Item>

          <Form.Item
            label={<span style={{ fontSize: "16px", fontWeight: "normal", color: "#000" }}>Published</span>}
            name="published"
            valuePropName="checked"
            style={{ marginBottom: "40px" }}
          >
            <Switch
              style={{
                backgroundColor: "#52c41a",
              }}
            />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "40px" }}>
            <Button
              onClick={handleCancel}
              style={{
                height: "45px",
                width: "120px",
                borderColor: "#ff9248",
                color: "#ff9248",
                fontSize: "14px",
                fontWeight: "normal",
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleUpdate}
              loading={isUpdating}
              style={{
                backgroundColor: "#ff9248",
                borderColor: "#ff9248",
                height: "45px",
                width: "140px",
                fontSize: "14px",
                fontWeight: "normal",
              }}
            >
              Update Category
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default CategoryList