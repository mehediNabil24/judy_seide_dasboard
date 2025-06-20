import { useState, useMemo } from "react";
import {
  Table,
  Input,
  Button,
  Switch,
  Space,
  Image,
  Tag,
  Popover,
  Typography
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

const { Text } = Typography;

interface Variant {
  size: string;
  color: string;
  price: number;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string[];
  tags: string[];
  salesCount: number;
  published: boolean;
  materialId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: {
    categoryName: string;
    imageUrl: string;
  };
  material: {
    materialName: string;
  };
  variants: Variant[];
}

const ProductList = () => {
  const { data, isLoading, refetch } = useGetAllProductsQuery({});
  // console.log('all product',data);
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const allProducts: Product[] = useMemo(() => data?.data?.data || [], [data]);
  const meta = data?.data?.meta;

  const filteredProducts = useMemo(() => {
    if (searchTerm.trim()) {
      return allProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
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
      refetch();
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
      render: (urls: string[]) => (
        <Image
          src={urls?.[0]}
          alt="product"
          width={60}
          height={40}
          style={{ objectFit: "cover", borderRadius: 4 }}
          preview={{
            mask: <span>View</span>,
            src: urls?.[0]
          }}
        />
      ),
    },
    {
      title: "Price Range",
      dataIndex: "variants",
      key: "price",
      render: (variants: Variant[]) => {
        const prices = variants.map(v => v.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return min === max ? `$${min}` : `$${min} - $${max}`;
      },
    },
    {
      title: "Variants",
      dataIndex: "variants",
      key: "variants",
      render: (variants: Variant[]) => (
        <Popover 
          content={
            <div>
              {variants.map((variant, index) => (
                <div key={index} style={{ marginBottom: 8 }}>
                  <Text strong>{variant.size} ({variant.color})</Text>
                  <div>Price: ${variant.price}</div>
                  <div>Stock: {variant.quantity}</div>
                </div>
              ))}
            </div>
          }
          title="Variant Details"
          trigger="hover"
        >
          <Button type="link">{variants.length} variants</Button>
        </Popover>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: { categoryName: string }) => category.categoryName,
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags: string[]) => (
        <div style={{ maxWidth: 200 }}>
          {tags.map((tag, index) => (
            <Tag key={index} style={{ marginBottom: 4 }}>
              {tag}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "published",
      key: "published",
      render: (published: boolean, record: Product) => (
        <Switch 
          checked={published} 
          onChange={(checked) => handlePublishedChange(checked, record.id)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Product) => (
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
          placeholder="Search by name, description or tags..."
          prefix={<SearchOutlined />}
          style={{ width: 300, borderColor: "#FFA500" }}
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
          showTotal: (total) => `Total ${total} products`,
        }}
        bordered
        scroll={{ x: true }}
      />
    </div>
  );
};

export default ProductList;