import { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  Space,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import {
  useGetAllMaterialsQuery,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation,
} from "../../redux/api/material/materialApi";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const MaterialList = () => {
  const { data, isLoading } = useGetAllMaterialsQuery({});
  const [updateMaterial] = useUpdateMaterialMutation();
  const [deleteMaterial] = useDeleteMaterialMutation();

  const allMaterials = data?.data?.data || [];
  const meta = data?.data?.meta;

  const [filteredMaterials, setFilteredMaterials] = useState(allMaterials);
  const [searchTerm, setSearchTerm] = useState("");

  const [editingMaterial, setEditingMaterial] = useState<any>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (searchTerm) {
      const filtered = allMaterials.filter((mat: any) =>
        mat.materialName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMaterials(filtered);
    } else {
      setFilteredMaterials(allMaterials);
    }
  }, [searchTerm, allMaterials]);

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
        await deleteMaterial(id).unwrap();
        Swal.fire("Deleted!", "Material has been deleted.", "success");
      } catch (err: any) {
        const errorMessage =
          err?.data?.message || err?.message || "Failed to delete material";

        Swal.fire("Error", errorMessage, "error");
      }
    }
  };

  const handleEdit = (material: any) => {
    setEditingMaterial(material);
    setEditModalVisible(true);
    form.setFieldsValue({
      materialName: material.materialName,
    });
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        id: editingMaterial.id,
        materialName: values.materialName,
      };
      await updateMaterial(formData).unwrap();
      toast.success("Material updated successfully");
      setEditModalVisible(false);
      form.resetFields();
    } catch {
      toast.error("Update failed");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "materialName",
      key: "materialName",
      render: (name: string) => (
        <span style={{ textTransform: "capitalize" }}>{name}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
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
      {/* Top Controls */}
      <div
        style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}
      >
        <Input
          placeholder="Search Materials..."
          prefix={<SearchOutlined />}
          style={{ width: 250, borderColor: "#FB923C" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link to="/admin/add-material">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ backgroundColor: "#FB923C", borderColor: "#FB923C" }}
          >
            Add Material
          </Button>
        </Link>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredMaterials}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: meta?.page || 1,
          pageSize: meta?.limit || 10,
          total: meta?.total || 0,
          showTotal: (total) =>
            `Showing ${filteredMaterials.length} of ${total}`,
        }}
        bordered
      />

      {/* Edit Modal */}
      <Modal
        title="Edit Material"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleUpdate}
        okText="Update"
        okButtonProps={{
          style: { backgroundColor: "#FFA500", borderColor: "#FFA500" },
        }}
        width={500}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Material Name"
            name="materialName"
            rules={[{ required: true, message: "Please enter material name" }]}
          >
            <Input placeholder="Enter material name" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MaterialList;
