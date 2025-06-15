"use client"

import { useState } from "react"
import type React from "react"
import { Table, Input, Avatar } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import {
  useGetAllCustomersQuery,
} from "../../redux/api/customer/customerApi"

interface Customer {
  id: string
  name: string
  email: string
  phone?: string | null
  address?: string | null
  imageUrl?: string
}

const CustomerList: React.FC = () => {
  const { data, isLoading, isError } = useGetAllCustomersQuery({})
  const [searchQuery, setSearchQuery] = useState("")

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "image",
      render: (imageUrl: string) => (
        <Avatar src={imageUrl} alt="Customer" shape="circle" />
      ),
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address: string | null) => address || "N/A",
    },
  ]

  if (isError) {
    return <div>Error fetching customers.</div>
  }

  const customers: Customer[] = Array.isArray(data?.Data?.data)
    ? data.Data.data.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.contact || null,
        address: user.address !== "null" ? user.address : null,
        imageUrl: user.imageUrl,
      }))
    : []

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      <div style={{ marginBottom: 30, marginTop: 20 }}>
        <Input
          placeholder="Search by customer name"
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: 300, borderColor: "#FFA500" }}
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredCustomers}
        rowKey={(record: Customer) => record.id}
        loading={isLoading}
        pagination={{
          pageSize: 10,
        }}
      />
    </div>
  )
}

export default CustomerList
