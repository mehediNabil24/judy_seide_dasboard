"use client";

import type React from "react";
import { useState } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Avatar,
  Typography,
  Card,
  Form,
  Modal,
  Upload,
  message,
} from "antd";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../../redux/api/profile/profileApi";
import type { UploadFile } from "antd/es/upload/interface";
import { toast } from "sonner";

const { Text } = Typography;

interface ProfileData {
  name: string;
  email: string;
  contact: string | null;
  imageUrl: string | null;
  address: string | null;
}

const UserProfile: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { data } = useGetProfileQuery({});
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const profileData: ProfileData = data?.Data || {
    name: "",
    email: "",
    contact: "",
    imageUrl: "",
    address: "",
  };

  const showModal = () => {
    setIsModalVisible(true);
    form.setFieldsValue({
      name: profileData.name,
      email: profileData.email,
      contact: profileData.contact || "",
      address: profileData.address || "",
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setFileList([]);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("contact", values.contact);
      formData.append("address", values.address);

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      } else if (profileData.imageUrl) {
        formData.append("imageUrl", profileData.imageUrl);
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
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
        return false;
      }
      const isLt25M = file.size / 1024 / 1024 < 25;
      if (!isLt25M) {
        message.error("Image must be smaller than 25MB!");
        return false;
      }
      return false; // Prevent auto upload
    },
    fileList,
    onChange: ({ fileList: newFileList }: { fileList: UploadFile[] }) =>
      setFileList(newFileList),
    onRemove: () => setFileList([]),
  };

  return (
    <div style={{ padding: "20px", maxWidth: "full", margin: "0 auto" }}>
      <Card bordered={false} style={{ marginBottom: "30px", boxShadow: "none" }}>
        <Row align="middle" gutter={16}>
          <Col>
            <Avatar
              src={profileData.imageUrl || "/placeholder.png"}
              size={76}
              style={{ border: "1px solid #f0f0f0" }}
            />
          </Col>
          <Col>
            <Text strong style={{ fontSize: "20px", display: "block" }}>
              {profileData.name || "No name"}
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
                backgroundColor: "#FB923C",
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
          <Form.Item label={<span style={{ fontSize: "20px" }}>Name</span>}>
            <Input value={profileData.name} readOnly />
          </Form.Item>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label={<span style={{ fontSize: "20px" }}>Email</span>}>
                <Input value={profileData.email} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={{ fontSize: "20px" }}>Contact Number</span>}>
                <Input value={profileData.contact || "N/A"} readOnly />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label={<span style={{ fontSize: "20px" }}>Address</span>}>
            <Input value={profileData.address || "N/A"} readOnly />
          </Form.Item>
        </Form>
      </div>

      {/* Edit Modal */}
      <Modal
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#FB923C", fontSize: "18px" }}>Edit Profile</span>
            <CloseOutlined
              onClick={handleCancel}
              style={{ cursor: "pointer", color: "#FB923C" }}
            />
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        closable={false}
        width={600}
      >
        <Form form={form} layout="vertical" style={{ marginTop: "20px" }}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Image">
            <Upload.Dragger {...uploadProps}>
              <UploadOutlined style={{ fontSize: "24px", color: "#666" }} />
              <p>Drop file or click to upload</p>
            </Upload.Dragger>
            {fileList.length > 0 && (
              <div style={{ marginTop: "16px" }}>
                <img
                  src={URL.createObjectURL(fileList[0].originFileObj as File)}
                  alt="preview"
                  style={{ width: "120px", height: "80px", objectFit: "cover" }}
                />
              </div>
            )}
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Invalid email format!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Contact Number"
            name="contact"
            rules={[{ required: true, message: "Please input your contact number!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please input your address!" }]}
          >
            <Input />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              loading={isUpdating}
              onClick={handleUpdate}
              style={{ backgroundColor: "#FB923C", borderColor: "#FB923C" }}
            >
              Update Profile
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfile;
