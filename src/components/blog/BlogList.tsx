import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Space,
  Image,
  Typography,
  Button,
  Switch,
  message,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Swal from "sweetalert2";
import {
  useDeleteBlogMutation,
  useGetAdminBlogsQuery,
} from "../../redux/api/blog/blogApi";

const { Text } = Typography;

const BlogList = () => {
  const { data, isLoading } = useGetAdminBlogsQuery({});
  const [deleteBlog] = useDeleteBlogMutation();

  const allBlogs = data?.data?.data || [];
  const meta = data?.data?.meta;

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState(allBlogs);

  useEffect(() => {
    if (searchTerm) {
      const filtered = allBlogs.filter((blog: any) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBlogs(filtered);
    } else {
      setFilteredBlogs(allBlogs);
    }
  }, [searchTerm, allBlogs]);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteBlog(id).unwrap();
        message.success("Blog deleted successfully");
      } catch (err) {
        message.error("Failed to delete blog");
      }
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (url: string) => (
        <Image
          src={url}
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
        <Text ellipsis={{ tooltip: content }} style={{ maxWidth: 300 }}>
          {content}
        </Text>
      ),
    },
    {
      title: "Publish",
      dataIndex: "isPublish",
      key: "isPublish",
      render: (isPublish: boolean) => (
        <Switch checked={isPublish} disabled />
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
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              // Navigate or open modal
              console.log("Edit Blog:", record.id);
            }}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

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
          style={{ width: 250, borderColor: "#FFA500" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Space>
         
         
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ backgroundColor: "#FFA500", borderColor: "#FFA500" }}
          >
            Add Blog
          </Button>
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
          showTotal: (total) =>
            `Showing ${filteredBlogs.length} of ${total}`,
        }}
        bordered
      />
    </div>
  );
};

export default BlogList;
