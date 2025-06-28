import {  useState } from "react"
import { Table, Input, Space, Image, Typography, Button, Switch, message, Modal, Form, DatePicker, Upload } from "antd"
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CloseOutlined,
  UploadOutlined,
} from "@ant-design/icons"
import moment from "moment"
import Swal from "sweetalert2"
import { useDeleteBlogMutation, useGetAdminBlogsQuery, useUpdateBlogMutation } from "../../redux/api/blog/blogApi"
import JoditEditor from "jodit-react"
import dayjs from "dayjs"
import { toast } from "sonner"
import { Link } from "react-router-dom"

const { Text } = Typography

interface BlogData {
  id: string
  title: string
  content: string
  imageUrl: string
  isPublish: boolean
  createdAt: string
  updatedAt: string
}

const BlogList = () => {
  const { data, isLoading, refetch } = useGetAdminBlogsQuery({})
  const [deleteBlog] = useDeleteBlogMutation()
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation()

  const allBlogs = data?.data?.data || []
  const meta = data?.data?.meta

  const [searchTerm, setSearchTerm] = useState("")
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [editingBlog, setEditingBlog] = useState<BlogData | null>(null)
  const [form] = Form.useForm()
  const [blogContent, setBlogContent] = useState("")
  const [imageFile, setImageFile] = useState<any>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const filteredBlogs = searchTerm
    ? allBlogs.filter((blog: any) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allBlogs

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    })

    if (result.isConfirmed) {
      try {
        await deleteBlog(id).unwrap()
        message.success("Blog deleted successfully")
      } catch (err) {
        message.error("Failed to delete blog")
      }
    }
  }

  const handleEdit = (blog: BlogData) => {
    setEditingBlog(blog)
    setIsEditModalVisible(true)
    setBlogContent(blog.content)
    setImagePreview(blog.imageUrl)

    form.setFieldsValue({
      title: blog.title,
      date: dayjs(blog.createdAt),
      isPublish: blog.isPublish,
    })
  }

  const handlePublishToggle = async (checked: boolean, record: BlogData) => {
    try {
      const formData = new FormData()
      formData.append("isPublish", checked.toString())
      
      // Include existing image URL if available
      if (record.imageUrl) {
        formData.append("imageUrl", record.imageUrl)
      }

      await updateBlog({ 
        id: record.id, 
        data: formData 
      }).unwrap()
      
      toast.success("Blog status updated successfully")
      refetch()
    } catch (error) {
      toast.error("Failed to update blog status")
    }
  }

  const handleCancel = () => {
    setIsEditModalVisible(false)
    setEditingBlog(null)
    setBlogContent("")
    setImageFile(null)
    setImagePreview(null)
    form.resetFields()
  }

  const handleUpdate = async () => {
    if (!editingBlog) return

    try {
      const values = await form.validateFields()
      const formData = new FormData()

      formData.append("title", values.title)
      formData.append("content", blogContent)
      formData.append("isPublish", values.isPublish.toString())

      if (values.date) {
        formData.append("createdAt", values.date.format("YYYY-MM-DD"))
      }

      if (imageFile) {
        formData.append("image", imageFile)
      }

      await updateBlog({ id: editingBlog.id, data: formData }).unwrap()
      toast.success("Blog updated successfully")
      setIsEditModalVisible(false)
      setEditingBlog(null)
      setBlogContent("")
      setImageFile(null)
      setImagePreview(null)
      form.resetFields()
    } catch (error) {
      toast.error("Failed to update blog")
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
      return false // Prevent auto upload
    },
    onRemove: () => {
      setImageFile(null)
      setImagePreview(null)
    },
  }

  const joditConfig = {
    readonly: false,
    height: 300,
    toolbar: true,
    spellcheck: true,
    language: "en",
    toolbarButtonSize: "small" as const,
    toolbarAdaptive: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    buttons: [
      "font",
      "fontsize",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "superscript",
      "subscript",
      "|",
      "align",
      "|",
      "ul",
      "ol",
      "|",
      "outdent",
      "indent",
      "|",
      "link",
      "image",
      "|",
      "hr",
      "table",
      "|",
      "undo",
      "redo",
    ],
    style: {
      font: "14px Arial, sans-serif",
    },
  }

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (url: string) => (
        <Image
          src={url || "/placeholder.svg"}
          alt="blog"
          width={80}
          height={80}
          style={{ objectFit: "cover", borderRadius: 4 }}
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title: string) => <Text strong>{title}</Text>,
    },
 {
  title: "Description",
  dataIndex: "content",
  key: "content",
  render: (content: string) => (
    <div
      style={{
        maxWidth: 300,
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  ),
}

,
    {
      title: "Publish",
      dataIndex: "isPublish",
      key: "isPublish",
      render: (isPublish: boolean, record: BlogData) => (
        <Switch 
          checked={isPublish} 
          onChange={(checked) => handlePublishToggle(checked, record)}
        />
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: 20 }}>
      {/* Top Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <Input
          placeholder="Search Blogs..."
          prefix={<SearchOutlined />}
          style={{ width: 250, borderColor: "#FB923C" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Space>
         <Link to='/admin/add-blog'>
          <Button type="primary" icon={<PlusOutlined />} style={{ backgroundColor: "#FB923C", borderColor: "#FFA500" }}>
            Add Blog
          </Button>
         </Link>
        </Space>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredBlogs}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: meta?.page || 1,
          pageSize: meta?.limit || 10,
          total: meta?.total || 0,
          showTotal: (total) => `Showing ${filteredBlogs.length} of ${total}`,
        }}
        bordered
      />

      {/* Edit Blog Modal */}
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
            <span style={{ color: "#ff9248", fontSize: "18px", fontWeight: "normal" }}>Edit Blog</span>
            <CloseOutlined onClick={handleCancel} style={{ color: "#ff9248", fontSize: "16px", cursor: "pointer" }} />
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
          <Form.Item
            label={<span style={{ fontSize: "14px", fontWeight: "normal", color: "#000" }}>Blog Title</span>}
            name="title"
            rules={[{ required: true, message: "Please input blog title!" }]}
            style={{ marginBottom: "24px" }}
          >
            <Input
              placeholder="Top jewelry brand..."
              style={{
                height: "40px",
                borderColor: "#ff9248",
                borderRadius: "4px",
              }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontSize: "14px", fontWeight: "normal", color: "#000" }}>Blog Date</span>}
            name="date"
            rules={[{ required: true, message: "Please select blog date!" }]}
            style={{ marginBottom: "24px" }}
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{
                width: "100%",
                height: "40px",
                borderColor: "#ff9248",
                borderRadius: "4px",
              }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontSize: "14px", fontWeight: "normal", color: "#000" }}>Blog Image</span>}
            style={{ marginBottom: "24px" }}
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

            {imagePreview && (
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
            label={<span style={{ fontSize: "14px", fontWeight: "normal", color: "#000" }}>Blog Description</span>}
            style={{ marginBottom: "24px" }}
          >
            <div style={{ border: "1px solid #ff9248", borderRadius: "4px", overflow: "hidden" }}>
              <JoditEditor
                value={blogContent}
                config={joditConfig}
                onBlur={(newContent) => setBlogContent(newContent)}
                onChange={() => {}}
              />
            </div>
          </Form.Item>

          <Form.Item
            label={<span style={{ fontSize: "14px", fontWeight: "normal", color: "#000" }}>Published</span>}
            name="isPublish"
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
                height: "40px",
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
                height: "40px",
                width: "120px",
                fontSize: "14px",
                fontWeight: "normal",
              }}
            >
              Update Blog
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default BlogList