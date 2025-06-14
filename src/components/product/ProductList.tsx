import { useState, useMemo } from "react";
import {
  Table,
  Input,
  Button,
  Switch,
  Space,
  Image,
  
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
  useUpdateProductMutation,
} from "../../redux/api/product/productApi";
import { toast } from "sonner";

const ProductList = () => {
  const { data, isLoading, refetch } = useGetAllProductsQuery({});
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  // Memoize allProducts to avoid reference changes on each render
  const allProducts = useMemo(() => data?.data?.data || [], [data]);
  const meta = data?.data?.meta;

  // Filter products only when needed
  const filteredProducts = useMemo(() => {
    if (searchTerm.trim()) {
      return allProducts.filter((product: any) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return allProducts;
  }, [searchTerm, allProducts]);

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
        await deleteProduct(id).unwrap();
        Swal.fire("Deleted!", "Product has been deleted.", "success");
      } catch {
        Swal.fire("Error", "Failed to delete product", "error");
      }
    }
  };

  const handlePublishedChange = async (checked: boolean, productId: string) => {
    try {
      const formData = new FormData();
      formData.append("published", checked.toString());
      
      await updateProduct({ 
        id: productId, 
        data: formData 
      }).unwrap();
      
      toast.success("Product status updated successfully!");
      refetch(); // Refresh the product list to reflect the change
    } catch (error) {
      toast.error("Failed to update product status");
      console.error("Update error:", error);
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
      render: (url: string[]) => (
        <Image
          src={url[0]}
          alt="product"
          width={60}
          height={40}
          style={{ objectFit: "cover", borderRadius: 4 }}
          preview={false}
        />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: any) => category.name,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Published",
      dataIndex: "published",
      key: "published",
      render: (published: boolean, record: any) => (
        <Switch 
          checked={published} 
          onChange={(checked) => handlePublishedChange(checked, record.id)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<InfoCircleOutlined />}
            onClick={() => navigate(`/admin/product-list/${record.id}`)}
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <Input
          placeholder="Search Products..."
          prefix={<SearchOutlined />}
          style={{ width: 250, borderColor: "#FFA500" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ backgroundColor: "#FFA500", borderColor: "#FFA500" }}
          onClick={() => navigate("/admin/add-product")}
        >
          Add Product
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredProducts}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: meta?.page || 1,
          pageSize: meta?.limit || 10,
          total: meta?.total || 0,
          showTotal: (total) =>
            `Showing ${filteredProducts.length} of ${total}`,
        }}
        bordered
      />
    </div>
  );
};

export default ProductList;