import  { useEffect, useState } from "react";
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
  const { data, isLoading } = useGetAdminFeedbackQuery({});
  const [updateReview] = useUpdateReviewMutation();

  const allReviews = data?.data?.data || [];
  const meta = data?.data?.meta;

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReviews, setFilteredReviews] = useState(allReviews);

  useEffect(() => {
    if (searchTerm) {
      const filtered = allReviews.filter((review: any) =>
        review.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredReviews(filtered);
    } else {
      setFilteredReviews(allReviews);
    }
  }, [searchTerm, allReviews]);

  const handleTogglePublish = async (checked: boolean, record: any) => {
    try {
      await updateReview({
        id: record.id,
        isPublished: checked,
      }).unwrap();
      toast.success(`Review ${checked ? "published" : "unpublished"} successfully`);
    } catch (error) {
      toast.error("Failed to update publish status");
    }
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
          style={{ width: 300, borderColor: "#FFA500" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredReviews}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: meta?.page || 1,
          pageSize: meta?.limit || 10,
          total: meta?.total || 0,
          showTotal: (total) =>
            `Showing ${filteredReviews.length} of ${total}`,
        }}
        bordered
      />
    </div>
  );
};

export default ReviewList;
