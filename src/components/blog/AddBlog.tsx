"use client"

import type React from "react"
import { useState } from "react"
import { Form, Input, Upload, Button, Switch, message } from "antd"
import { UploadOutlined, CloseOutlined } from "@ant-design/icons"
import { useAddBlogMutation } from "../../redux/api/blog/blogApi"
import JoditEditor from "jodit-react"
import type { UploadFile } from "antd/es/upload/interface"
import { toast } from "sonner"

const AddBlog: React.FC = () => {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [content, setContent] = useState("")
  const [isPublished, setIsPublished] = useState(false)

  const [addBlog, { isLoading }] = useAddBlogMutation()

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const formData = new FormData()

      formData.append("title", values.title)
      formData.append("content", content)
      formData.append("others", "")
      formData.append("isPublish", isPublished.toString())

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj)
      }

      await addBlog(formData).unwrap()
      toast.success("Blog added successfully!")

      // Reset form
      form.resetFields()
      setContent("")
      setFileList([])
      setIsPublished(false)
    } catch (error) {
      toast.error("Failed to add blog")
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setContent("")
    setFileList([])
    setIsPublished(false)
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
      return false // Prevent auto upload
    },
    fileList,
    onChange: ({ fileList: newFileList }: { fileList: UploadFile[] }) => setFileList(newFileList),
    onRemove: () => setFileList([]),
  }

  const joditConfig = {
    readonly: false,
    placeholder: "Compose an epic...",
    height: 200,
    toolbar: true,
    spellcheck: true,
    language: "en",
    toolbarButtonSize: "middle" as const,
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

  return (
    <div style={{ padding: "24px", maxWidth: "full", margin: "0 auto" }}>
      <h2 style={{ color: "#ff9248", fontSize: "20px", fontWeight: "normal", marginBottom: "32px" }}>
        Add Blog
      </h2>

      <Form form={form} layout="vertical" style={{ marginTop: "20px" }}>
        <Form.Item
          label={<span style={{ fontSize: "16px", fontWeight: "normal", color: "#000" }}>Blog Title</span>}
          name="title"
          rules={[{ required: true, message: "Please input blog title!" }]}
          style={{ marginBottom: "24px" }}
        >
          <Input
            placeholder="Name"
            style={{
              height: "45px",
              borderRadius: "4px",
              borderColor: "#ff9248",
              fontSize: "14px",
            }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontSize: "16px", fontWeight: "normal", color: "#000" }}>Blog Image</span>}
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

          {fileList.length > 0 && (
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
                  src={URL.createObjectURL(fileList[0].originFileObj as File) || "/placeholder.svg"}
                  alt="preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <CloseOutlined
                  onClick={() => setFileList([])}
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
          label={<span style={{ fontSize: "16px", fontWeight: "normal", color: "#000" }}>Blog Description</span>}
          style={{ marginBottom: "24px" }}
        >
          <div style={{ border: "1px solid #ff9248", borderRadius: "4px", overflow: "hidden" }}>
            <JoditEditor
              value={content}
              config={joditConfig}
              onBlur={(newContent) => setContent(newContent)}
              onChange={() => {}}
            />
          </div>
        </Form.Item>

        <Form.Item
          label={<span style={{ fontSize: "16px", fontWeight: "normal", color: "#000" }}>Published</span>}
          style={{ marginBottom: "40px" }}
        >
          <Switch
            checked={isPublished}
            onChange={setIsPublished}
            style={{
              backgroundColor: isPublished ? "#52c41a" : "#d9d9d9",
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
            onClick={handleSubmit}
            loading={isLoading}
            style={{
              backgroundColor: "#ff9248",
              borderColor: "#ff9248",
              height: "45px",
              width: "120px",
              fontSize: "14px",
              fontWeight: "normal",
            }}
          >
            Add Blog
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default AddBlog
