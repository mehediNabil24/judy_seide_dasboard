"use client"

import { useState } from "react"
import type React from "react"
import { Button, Table, message, Input } from "antd"
import { EyeOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons"
import {
  useDeleteCustomerMutation,
  useGetAllCustomersQuery,
} from "../../redux/api/customer/customerApi"
import Swal from "sweetalert2"

interface Customer {
  id: string
  name: string
  email: string
  phone?: string | null
  address?: string | null
}



const CustomerList: React.FC= () => {
  const { data, isLoading, isError } = useGetAllCustomersQuery({})
  const [deleteCustomer] = useDeleteCustomerMutation()
  const [searchQuery, setSearchQuery] = useState("")

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
        await deleteCustomer(id).unwrap()
        message.success("Customer deleted successfully")
      } catch (error: any) {
        const errorMessage = error?.data?.message || "Failed to delete customer"
        message.error(errorMessage)
      }
    }
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Customer) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="text"
            icon={<EyeOutlined />}
            // onClick={() => handleDetails(record.id)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
          />
        </div>
      ),
    },
  ]

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error fetching customers.</div>
  }

  const customers: Customer[] = Array.isArray(data?.Data?.data)
    ? data.Data.data.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.contact,
        address: user.address,
      }))
    : []

  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      <div style={{ marginBottom: 30,marginTop:20 }}>
        <Input
          placeholder="Search by customer name"
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: 300,borderColor: "#FFA500" }}
          allowClear
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredCustomers}
        rowKey={(record: Customer) => record.id}
      />
    </div>
  )
}

export default CustomerList