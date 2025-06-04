"use client"

import type React from "react"
import { useState } from "react"
import { Row, Col, Input, Button, Avatar, Typography, Card, Form, Modal, Upload, message } from "antd"
import { EyeInvisibleOutlined, EyeTwoTone, UploadOutlined, CloseOutlined } from "@ant-design/icons"
import { useGetProfileQuery, useUpdateProfileMutation,  } from "../../redux/api/profile/profileApi"
import type { UploadFile } from "antd/es/upload/interface"
import { toast } from "sonner"

const {  Text } = Typography

interface ProfileData {
  name: string
  email: string
  contact: string
  imageUrl: string
  address: string
}

const UserProfile: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])

  // Using the provided query hook to fetch profile data
  const { data, } = useGetProfileQuery({})
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()

  // console.log('data', updateProfile)

  const profileData: ProfileData = data?.Data || {
    name: "",
    email: "",
    contact: "",
    imageUrl: "",
    address: "",
  }

  const showModal = () => {
    setIsModalVisible(true)
    form.setFieldsValue({
      name: profileData.name,
      email: profileData.email,
      contact: profileData.contact,
    })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
    setFileList([])
  }

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
  
      const formData = new FormData();
  
      // Append text fields
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("contact", values.contact);
      formData.append("address", profileData.address);
  
      if (fileList.length > 0 && fileList[0].originFileObj) {
        // Append new image file
        formData.append("image", fileList[0].originFileObj);
      } else {
        // No new image, include existing image URL or some identifier
        formData.append("imageUrl", profileData.imageUrl); // Use the correct key expected by backend
      }
  
      await updateProfile(formData).unwrap();
  
      toast.success("Profile updated successfully!");
      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Update error:", error);
    }
  };
  
  

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

  return (
    <div style={{ padding: "20px", maxWidth: "full", margin: "0 auto" }}>
      <Card bordered={false} style={{ marginBottom: "30px", boxShadow: "none" }}>
        <Row align="middle" gutter={16}>
          <Col>
            <Avatar src={profileData.imageUrl} size={76} style={{ border: "1px solid #f0f0f0" }} />
          </Col>
          <Col>
            <Text strong style={{ fontSize: "20px", display: "block" }}>
              {profileData.name}
            </Text>
            <Text type="secondary" style={{ fontSize: "16px" }}>
              {profileData.email}
            </Text>
          </Col>
          <Col flex="auto" style={{ textAlign: "right" }}>
            <Button
              type="primary"
              onClick={showModal}
              style={{
                backgroundColor: "#ff9248",
                borderColor: "#ff9248",
                height: "40px",
                width: "120px",
                fontSize: "14px",
              }}
            >
              Edit Profile
            </Button>
          </Col>
        </Row>
      </Card>

      <div style={{ borderTop: "2px solid #f0f0f0", paddingTop: "30px" }}>
        <Form layout="vertical">
          <Form.Item label={<span style={{ fontWeight: "normal", fontSize: "20px" }}>Name</span>}>
            <Input
              value={profileData.name}
              style={{
                height: "40px",
                borderRadius: "4px",
                borderColor: "#ff9248",
              }}
              readOnly
            />
          </Form.Item>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label={<span style={{ fontWeight: "normal", fontSize: "20px" }}>Email</span>}>
                <Input
                  value={profileData.email}
                  style={{
                    height: "40px",
                    borderRadius: "4px",
                    borderColor: "#ff9248",
                  }}
                  readOnly
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={{ fontWeight: "normal", fontSize: "20px" }}>Contact Number</span>}>
                <Input
                  value={profileData.contact}
                  style={{
                    height: "40px",
                    borderRadius: "4px",
                    borderColor: "#ff9248",
                  }}
                  readOnly
                />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ borderTop: "2px solid #f0f0f0", paddingTop: "20px", paddingBottom: "80px" }}>
            <Form.Item label={<span style={{ fontWeight: "normal", fontSize: "20px " }}>Password</span>}>
              <Row gutter={16}>
                <Col flex="auto">
                  <Input.Password
                    placeholder="••••••"
                    visibilityToggle={{
                      visible: passwordVisible,
                      onVisibleChange: setPasswordVisible,
                    }}
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    style={{
                      height: "40px",
                      borderRadius: "4px",
                      borderColor: "#ff9248",
                    }}
                    readOnly
                  />
                </Col>
                <Col>
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: "#ff9248",
                      borderColor: "#ff9248",
                      height: "40px",
                      width: "120px",
                      fontSize: "14px",
                    }}
                  >
                    Change
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </div>
        </Form>
      </div>

      {/* Edit Profile Modal */}
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
            <span style={{ color: "#ff9248", fontSize: "18px", fontWeight: "normal" }}>Edit Profile</span>
            <CloseOutlined onClick={handleCancel} style={{ color: "#ff9248", fontSize: "16px", cursor: "pointer" }} />
          </div>
        }
        open={isModalVisible}
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
            rules={[{ required: true, message: "Please input your name!" }]}
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

          <Form.Item label={<span style={{ fontSize: "16px", fontWeight: "normal", color: "#000" }}>Image</span>}>
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
            label={<span style={{ fontSize: "16px", fontWeight: "normal", color: "#000" }}>Email</span>}
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              placeholder="admin@email.com"
              style={{
                height: "45px",
                borderRadius: "4px",
                borderColor: "#ff9248",
                fontSize: "14px",
              }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontSize: "16px", fontWeight: "normal", color: "#000" }}>Contact Number</span>}
            name="contact"
            rules={[{ required: true, message: "Please input your contact number!" }]}
          >
            <Input
              placeholder="0123456789"
              style={{
                height: "45px",
                borderRadius: "4px",
                borderColor: "#ff9248",
                fontSize: "14px",
                marginBottom: "40px",
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
              Update Profile
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default UserProfile
