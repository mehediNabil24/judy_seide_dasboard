import { useState, useMemo } from "react";
import {
  Table,
  Input,
  Button,
  Switch,
  Space,
  Image,
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { 
    data, 
    isLoading, 
    refetch 
  } = useGetAllProductsQuery({
    searchTerm: searchTerm,
    page: currentPage,
    limit: pageSize
  }, {
    refetchOnMountOrArgChange: true
  });
  
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const navigate = useNavigate();

  const allProducts: Product[] = useMemo(() => data?.data?.data || [], [data]);
  const meta = data?.data?.meta;
  console.log('meta', meta);

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
    // refetch(); // Refetch when pagination changes
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
    // refetch(); // Refetch with new search term
  };

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
        // Refetch data but maintain current pagination
        refetch();
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
      // Refetch data but maintain current pagination
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
          onChange={handleSearch}
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
        dataSource={allProducts}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: meta?.total || 0,
          showTotal: (total) => `Total ${total} products`,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        onChange={handleTableChange}
        bordered
        scroll={{ x: true }}
      />
    </div>
  );
};

export default ProductList;