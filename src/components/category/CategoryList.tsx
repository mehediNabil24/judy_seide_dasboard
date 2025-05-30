import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Switch,
  Space,
  Image,
  Modal,
  Form,
  Upload,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "../../redux/api/category/categoryApi";

const CategoryList = () => {
  const { data, isLoading } = useGetCategoriesQuery({});
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const allCategories = data?.data?.data || [];
  const meta = data?.data?.meta;

  const [filteredCategories, setFilteredCategories] = useState(allCategories);
  const [searchTerm, setSearchTerm] = useState("");

  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [imageFile, setImageFile] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (searchTerm) {
      const filtered = allCategories.filter((cat: any) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(allCategories);
    }
  }, [searchTerm, allCategories]);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteCategory(id).unwrap();
        Swal.fire("Deleted!", "Category has been deleted.", "success");
      } catch {
        Swal.fire("Error", "Failed to delete category", "error");
      }
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setEditModalVisible(true);
    form.setFieldsValue({ ...category });
    setImagePreview(category.imageUrl || null);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const formData: any = {
        id: editingCategory.id,
        name: values.name,
        published: values.published,
      };

      // Simulate file upload and get URL
      if (imageFile) {
        // Replace this with real upload logic if needed
        const uploadedImageUrl = URL.createObjectURL(imageFile);
        formData.imageUrl = uploadedImageUrl;
      }

      await updateCategory(formData).unwrap();
      message.success("Category updated successfully");
      setEditModalVisible(false);
      form.resetFields();
      setImageFile(null);
      setImagePreview(null);
    } catch {
      message.error("Update failed");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <span style={{ textTransform: "capitalize" }}>
          {name.toLowerCase()}
        </span>
      ),
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "image",
      render: (url: string) => (
        <Image
          src={url}
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
      render: (published: boolean) => <Switch defaultChecked={published} />,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
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
        style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}
      >
        <Input
          placeholder="Search Categories..."
          prefix={<SearchOutlined />}
          style={{ width: 250, borderColor: "#FFA500" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ backgroundColor: "#FFA500", borderColor: "#FFA500" }}
        >
          Add Category
        </Button>
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
          showTotal: (total) =>
            `Showing ${filteredCategories.length} of ${total}`,
        }}
        bordered
      />

      {/* Edit Modal */}
      <Modal
        title="Edit Category"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setImageFile(null);
          setImagePreview(null);
        }}
        onOk={handleUpdate}
        okText="Update"
        okButtonProps={{ style: { backgroundColor: "#FFA500", borderColor: "#FFA500" } }}
        width={600}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item label="Upload Image">
            <Upload
              beforeUpload={(file) => {
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
                return false;
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Choose Image</Button>
            </Upload>
            {imagePreview && (
              <Image
                src={imagePreview}
                alt="Preview"
                style={{ marginTop: 10, maxHeight: 150 }}
              />
            )}
          </Form.Item>

          <Form.Item
            label="Published"
            name="published"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryList;
