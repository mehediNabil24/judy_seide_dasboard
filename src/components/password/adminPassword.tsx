"use client"

import type React from "react"
import { useState } from "react"
import { Input, Button, Modal, message } from "antd"
import { EyeInvisibleOutlined, EyeTwoTone, CloseOutlined } from "@ant-design/icons"
import { useChangePasswordMutation } from "../../redux/api/auth/authApi"
import { toast } from "sonner"


const AdminPasswordChange: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false)
  const [newPasswordVisible, setNewPasswordVisible] = useState(false)
  const [mainPasswordVisible, setMainPasswordVisible] = useState(false)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const [updatePassword, { isLoading }] = useChangePasswordMutation()

  const showModal = () => {
    setIsModalVisible(true)
    // Reset form fields when opening modal
    setOldPassword("")
    setNewPassword("")
    setOldPasswordVisible(false)
    setNewPasswordVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword) {
      message.error("Please fill in all fields")
      return
    }

    try {
     const res= await updatePassword({
        oldPassword,
        newPassword,
      }).unwrap()
      if(res.success){
        toast.success(res.message)
        setIsModalVisible(false)
      }else{
        toast.error(res.error)
      }

      
    } catch (error) {
      toast.error("Failed to update password")
    }
  }



  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop:'40px' }}>
        <div style={{ flex: 1 }}>
          <Input.Password
            placeholder="••••••"
            visibilityToggle={{
              visible: mainPasswordVisible,
              onVisibleChange: setMainPasswordVisible,
            }}
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            style={{
              height: "40px",
              borderColor: "#FB923C",
              borderRadius: "4px",
            }}
            readOnly
          />
        </div>
        <Button
          type="primary"
          onClick={showModal}
          style={{
            backgroundColor: "#FB923C",
            borderColor: "#ff9248",
            height: "40px",
            width: "120px",
            fontSize: "14px",
            fontWeight: "normal",
          }}
        >
          Change
        </Button>
      </div>

      <Modal
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#ff9248", fontSize: "18px", fontWeight: "normal" }}>Password Change</span>
            <CloseOutlined onClick={handleCancel} style={{ color: "#ff9248", fontSize: "16px", cursor: "pointer" }} />
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        closable={false}
        width={500}
        styles={{
          header: {
            borderBottom: "none",
            paddingBottom: "16px",
          },
          mask: {
            backgroundColor: "rgba(0, 0, 0, 0.45)",
          },
        }}
      >
        <div style={{ padding: "0 0 24px" }}>
          <div style={{ marginBottom: "24px" }}>
            <div style={{ marginBottom: "8px", fontSize: "14px", fontWeight: "normal" }}>Old Password</div>
            <Input.Password
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••"
              visibilityToggle={{
                visible: oldPasswordVisible,
                onVisibleChange: setOldPasswordVisible,
              }}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              style={{
                height: "40px",
                borderColor: "#FB923C",
                borderRadius: "4px",
              }}
            />
          </div>

          <div style={{ marginBottom: "8px" }}>
            <div style={{ marginBottom: "8px", fontSize: "14px", fontWeight: "normal" }}>New Password</div>
            <Input.Password
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••"
              visibilityToggle={{
                visible: newPasswordVisible,
                onVisibleChange: setNewPasswordVisible,
              }}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              style={{
                height: "40px",
                borderColor: "#FB923C",
                borderRadius: "4px",
              }}
            />
          </div>

          <div style={{ marginTop: "8px", marginBottom: "40px" }}>
            {/* <Button
              type="link"
              onClick={handleForgotPassword}
              style={{
                padding: 0,
                height: "auto",
                fontSize: "12px",
                color: "#666",
              }}
            >
              Forgot your password?
            </Button> */}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
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
              onClick={handleUpdatePassword}
              loading={isLoading}
              style={{
                backgroundColor: "#FB923C",
                borderColor: "#ff9248",
                height: "40px",
                width: "140px",
                fontSize: "14px",
                fontWeight: "normal",
              }}
            >
              Update Password
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AdminPasswordChange
