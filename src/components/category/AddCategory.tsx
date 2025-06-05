import React, { useState } from 'react';
import {
  Button,
  Upload,
  UploadProps,
  Switch,
  Form,
  Input,
  Card,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { toast } from 'sonner';
import { useAddCategoryMutation } from '../../redux/api/category/categoryApi';

type CategoryFormValues = {
  name: string;
  image: File;
  published: boolean;
};

// 🎨 Custom theme settings
const customColor = '#FB923C';
const customTextColor = '#333';

const AddCategoryPage: React.FC = () => {
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null);
  const [published, setPublished] = useState<boolean>(true);
  const [addCategory, { isLoading }] = useAddCategoryMutation();

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 25 * 1024 * 1024;

      if (!isValidType) {
        toast.error('You can only upload JPG/PNG files!');
        return Upload.LIST_IGNORE;
      }

      if (!isValidSize) {
        toast.error('Image must be smaller than 25MB!');
        return Upload.LIST_IGNORE;
      }

      setFile(file);
      return false;
    },
    showUploadList: false,
    maxCount: 1,
  };

  const handleSubmit = async (values: Omit<CategoryFormValues, 'image'>) => {
    if (!file) {
      toast.error('Please upload an image');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('image', file);
      formData.append('published', published ? 'true' : 'false');

      await addCategory(formData).unwrap();
      toast.success('Category added successfully!');
      form.resetFields();
      setFile(null);
    } catch (error) {
      toast.error('Failed to add category');
      console.error('Error adding category:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-full">
      <Card
        title={
          <span style={{ fontWeight: 600, fontSize: 20, color: customTextColor }}>
            Add Category
          </span>
        }
        bordered={false}
        style={{ boxShadow: 'none', border: 'none' }}
        headStyle={{ borderBottom: 'none', paddingBottom: 0 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ published: true }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input the category name!' }]}
          >
            <Input
              placeholder="Category title"
              size="large"
              style={{
                borderColor: customColor,
                color: customTextColor,
                boxShadow: `0 0 0 2px ${customColor}20`, // subtle focus ring
              }}
              onFocus={(e) =>
                (e.target.style.boxShadow = `0 0 0 1px ${customColor}50`)
              }
              onBlur={(e) =>
                (e.target.style.boxShadow = `0 0 0 1px ${customColor}20`)
              }
            />
          </Form.Item>

          <Form.Item label="Category Image">
  <Upload.Dragger
    {...uploadProps}
    style={{
      borderColor: customColor,
      backgroundColor: `${customColor}10`, // light tint background
      color: customTextColor,
    }}
    className="hover:border-orange-500" // Add hover effect using CSS class
  >
    <p className="ant-upload-drag-icon">
      <UploadOutlined style={{ color: customColor }} />
    </p>
    <p className="ant-upload-text" style={{ color: customTextColor }}>
      Drop file or browse
    </p>
    <p className="ant-upload-hint" style={{ color: customTextColor }}>
      Format: jpeg, .png & Max file size: 25 MB
    </p>
  </Upload.Dragger>

  {file && (
    <div className="mt-4">
      <p className="text-sm text-gray-500">Preview:</p>
      <img
        src={URL.createObjectURL(file)}
        alt="Preview"
        className="mt-1 max-h-48 rounded border border-gray-200 shadow"
      />
    </div>
  )}
</Form.Item>

          <Form.Item label="Published" name="published" valuePropName="checked">
            <Switch checked={published} onChange={setPublished} />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end space-x-4">
              <Button
                size="large"
                onClick={() => {
                  form.resetFields();
                  setFile(null);
                }}
                style={{
                  borderColor: customColor,
                  color: customColor,
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={isLoading}
                style={{
                  backgroundColor: customColor,
                  borderColor: customColor,
                }}
              >
                Add Category
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddCategoryPage;
