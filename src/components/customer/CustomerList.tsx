"use client"

import { useState } from "react"
import type React from "react"
import { Table, Input, Avatar } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import { useGetAllCustomersQuery } from "../../redux/api/customer/customerApi"

interface Customer {
  id: string
  name: string
  email: string
  phone?: string | null
  address?: string | null
  imageUrl?: string
}

const CustomerList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })

  const { data, isLoading, isError} = useGetAllCustomersQuery({ 
    searchTerm: searchQuery, 
    page: pagination.current, 
    limit: pagination.pageSize 
  })

  const meta = data?.Data?.meta
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

  const handleTableChange = (newPagination: any) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    })
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    // Reset to first page when searching
    setPagination(prev => ({ ...prev, current: 1 }))
  }

  if (isError) {
    return <div>Error fetching customers.</div>
  }

  return (
    <div>
      <div style={{ marginBottom: 30, marginTop: 20 }}>
        <Input
          placeholder="Search by customer name"
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={handleSearch}
          style={{ width: 300, borderColor: "#FFA500" }}
          allowClear
        />
      </div>

      <Table
        columns={[
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
        ]}
        dataSource={customers}
        rowKey={(record: Customer) => record.id}
        loading={isLoading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: meta?.total || 0,
          showTotal: (total) => `Total ${total} customers`,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
        }}
        onChange={handleTableChange}
      />
    </div>
  )
}

export default CustomerList