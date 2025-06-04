import  { useState, useEffect } from "react";
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
} from "../../redux/api/product/productApi";

const ProductList = () => {
  const { data, isLoading } = useGetAllProductsQuery({});
  const [deleteProduct] = useDeleteProductMutation();
  const navigate = useNavigate();

  const allProducts = data?.data?.data || [];
  const meta = data?.data?.meta;

  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm) {
      const filtered = allProducts.filter((product: any) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(allProducts);
    }
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
      render: (published: boolean) => <Switch defaultChecked={published} />,
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
