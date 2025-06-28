import {  useState } from "react";
import {
  Table,
  Input,
  Switch,
  Space,
  Typography,
  Rate,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import { useGetAdminFeedbackQuery, useUpdateReviewMutation } from "../../redux/api/feedback/feedbackApi";
import { toast } from "sonner";

const { Text } = Typography;

const ReviewList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const { data, isLoading, refetch } = useGetAdminFeedbackQuery({ 
    searchTerm, 
    page: pagination.current, 
    limit: pagination.pageSize 
  });

  const [updateReview] = useUpdateReviewMutation();

  const allReviews = data?.data?.data || [];
  const meta = data?.data?.meta;

  const handleTableChange = (pagination: any) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const handleTogglePublish = async (checked: boolean, record: any) => {
    try {
      await updateReview({
        id: record.id,
        isPublished: checked,
      }).unwrap();
      toast.success(`Review ${checked ? "published" : "unpublished"} successfully`);
      refetch(); // Refresh the data after update
    } catch (error) {
      toast.error("Failed to update publish status");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Reset to first page when searching
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const columns = [
    {
      title: "Customer",
      dataIndex: "user",
      key: "user",
      render: (user: any) => (
        <Space>
          <Text>{user?.name || "N/A"}</Text>
        </Space>
      ),
    },
    {
      title: "Review Title",
      dataIndex: "title",
      key: "title",
      render: (title: string) => <Text strong>{title}</Text>,
    },
    {
      title: "Review Text",
      dataIndex: "comment",
      key: "comment",
      render: (comment: string) => (
        <Text ellipsis={{ tooltip: comment }} style={{ maxWidth: 300 }}>
          {comment}
        </Text>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: "Published",
      dataIndex: "isPublished",
      key: "isPublished",
      render: (isPublished: boolean, record: any) => (
        <Switch
          checked={isPublished}
          onChange={(checked) => handleTogglePublish(checked, record)}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      {/* Search */}
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between" }}>
        <Input
          placeholder="Search by review title..."
          prefix={<SearchOutlined />}
          style={{ width: 300, borderColor: "#FB923C" }}
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={allReviews}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: meta?.total || 0,
          showTotal: (total) => `Total ${total} reviews`,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
        }}
        onChange={handleTableChange}
        bordered
      />
    </div>
  );
};

export default ReviewList;