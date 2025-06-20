"use client";

import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Switch,
  Button,
  Select,
  Upload,
  message,
  Card,
  Row,
  Col,
  Popover,
} from "antd";
import { InboxOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { useGetCategoriesQuery } from "../../redux/api/category/categoryApi";
import { useGetAllMaterialsQuery } from "../../redux/api/material/materialApi";
import { useAddProductMutation } from "../../redux/api/product/productApi";
import { toast } from "sonner";
import { ChromePicker, ColorResult } from "react-color";

interface Variant {
  size: string;
  color: string;
  price: number;
  quantity: number;
}

interface CategoryType {
  id: string;
  categoryName: string;
  sizes: string[];
}

interface FormValues {
  name: string;
  description: string;
  tags?: string;
  categoryId: string;
  materialId: string;
  published?: boolean;
  variants: Variant[];
}

const AddProductPage: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [colorPickersVisible, setColorPickersVisible] = useState<{ [key: number]: boolean }>({});
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const [addProduct, { isLoading: addingProduct }] = useAddProductMutation();
  const { data: categorie, isLoading: categoriesLoading } = useGetCategoriesQuery({});
  const categories: CategoryType[] = categorie?.data?.data || [];

  const { data: material, isLoading: materialsLoading } = useGetAllMaterialsQuery({});
  const materials = material?.data?.data || [];

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    setSelectedSizes(category?.sizes || []);
    form.setFieldsValue({ categoryId });
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setPreviewImages([]);
    setColorPickersVisible({});
    setSelectedSizes([]);
  };

  const handleSubmit = async (values: FormValues) => {
    if (fileList.length === 0) {
      message.error("Please upload at least one image.");
      return;
    }
    if (values.variants.length === 0) {
      message.error("Please add at least one variant.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("categoryId", values.categoryId);
      formData.append("materialId", values.materialId);
      formData.append("published", values.published ? "true" : "false");

      const tags = values.tags ? values.tags.split(",").map((tag) => tag.trim()) : [];
      tags.forEach((tag) => formData.append("tags[]", tag));

      formData.append("variants", JSON.stringify(values.variants));
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("images", file.originFileObj);
        }
      });

      await addProduct(formData).unwrap();
      toast.success("Product added successfully!");
      handleCancel();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product");
    }
  };

  const toggleColorPicker = (index: number) => {
    setColorPickersVisible((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleColorChange = (index: number, color: ColorResult) => {
    const variants = form.getFieldValue("variants");
    variants[index].color = color.hex;
    form.setFieldsValue({ variants });
  };

  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    fileList,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      const isLt25M = file.size / 1024 / 1024 < 25;
      if (!isImage || !isLt25M) return Upload.LIST_IGNORE;

      const newFile: UploadFile = {
        uid: file.uid,
        name: file.name,
        status: "done",
        originFileObj: file,
        url: URL.createObjectURL(file),
      };

      setFileList((prev) => [...prev, newFile]);
      setPreviewImages((prev) => [...prev, newFile.url!]);
      return false;
    },
    onRemove: (file) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
      setPreviewImages((prev) => prev.filter((_, i) => fileList[i].uid !== file.uid));
    },
    customRequest: ({ onSuccess }) => onSuccess?.("ok"),
    showUploadList: false,
  };

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="max-w-full mx-auto">
        <h1 className="text-[#FB923C] text-xl font-medium mb-8">Add Product</h1>

        <Form<FormValues>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ variants: [{}], published: true }}
        >
          <div className="grid grid-cols-2 gap-6 mb-4">
            <Form.Item label="Category" name="categoryId" rules={[{ required: true }]}> 
              <Select
                placeholder="Select category"
                loading={categoriesLoading}
                onChange={handleCategoryChange}
                className="border border-[#FB923C] h-10 rounded"
              >
                {categories.map((cat) => (
                  <Select.Option key={cat.id} value={cat.id}>{cat.categoryName}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Material" name="materialId" rules={[{ required: true }]}> 
              <Select
                placeholder="Select material"
                loading={materialsLoading}
                className="border border-[#FB923C] h-10 rounded"
              >
                {materials.map((m: { id: string; materialName: string }) => (
                  <Select.Option key={m.id} value={m.id}>{m.materialName}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <Form.Item label="Name" name="name" rules={[{ required: true }]}> 
              <Input placeholder="Product Name" style={{ height: 45, borderRadius: 4, borderColor: "#FB923C" }} />
            </Form.Item>
            <Form.Item label="Tags" name="tags"> 
              <Input placeholder="e.g. earrings, 14k, classic" style={{ height: 45, borderRadius: 4, borderColor: "#FB923C" }} /> 
            </Form.Item>
          </div>

          <Form.Item label="Description" name="description" rules={[{ required: true }]}> 
            <Input.TextArea rows={4} placeholder="Product Description" style={{ borderRadius: 4, borderColor: "#FB923C" }} />
          </Form.Item>

          <Form.Item label="Product Images" name="images">
            <Upload.Dragger {...uploadProps} style={{ borderColor: "#FB923C", borderStyle: "dashed", borderWidth: 2, borderRadius: 6, padding: 12 }}>
              <p className="text-center">
                <InboxOutlined className="text-gray-400 text-2xl mb-1" />
              </p>
              <p className="text-gray-500 text-sm">Drop files or click to browse</p>
              <p className="text-gray-400 text-xs">JPG, PNG | Max 25MB each</p>
            </Upload.Dragger>
            <div className="flex flex-wrap gap-2 mt-4">
              {previewImages.map((img, idx) => (
                <img key={idx} src={img} className="w-16 h-16 object-cover border border-yellow-400 rounded" />
              ))}
            </div>
          </Form.Item>

          <Form.List name="variants">
            {(fields, { add, remove }) => (
              <div>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Card
                    key={key}
                    title={`Variant ${index + 1}`}
                    extra={<Button danger icon={<DeleteOutlined />} onClick={() => remove(name)} />}
                    style={{ marginBottom: 16, border: "1px solid #FB923C", borderRadius: 8 }}
                    headStyle={{ borderBottom: "1px solid #FB923C", backgroundColor: "#FFF7ED" }}
                  >
                    <Row gutter={16}>
                      <Col span={6}>
                        <Form.Item {...restField} name={[name, "size"]} label="Size" rules={[{ required: true }]}> 
                          <Select placeholder="Select Size">
                            {selectedSizes.map((size) => (
                              <Select.Option key={size} value={size}>{size}</Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item {...restField} name={[name, "color"]} label="Color" rules={[{ required: true }]}> 
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <Popover
                              content={<ChromePicker color={form.getFieldValue(["variants", index, "color"]) || "#ffffff"} onChangeComplete={(color) => handleColorChange(index, color)} />}
                              trigger="click"
                              open={colorPickersVisible[index]}
                              onOpenChange={() => toggleColorPicker(index)}
                            >
                              <div style={{ width: 24, height: 24, backgroundColor: form.getFieldValue(["variants", index, "color"]) || "#fff", border: "1px solid #ccc", cursor: "pointer", marginRight: 8 }} />
                            </Popover>
                            <Input
                              value={form.getFieldValue(["variants", index, "color"])}
                              onChange={(e) => {
                                const variants = form.getFieldValue("variants");
                                variants[index].color = e.target.value;
                                form.setFieldsValue({ variants });
                              }}
                              placeholder="Hex or name"
                            />
                          </div>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item {...restField} name={[name, "price"]} label="Price" rules={[{ required: true }]}> 
                          <InputNumber style={{ width: "100%" }} min={0} placeholder="Price" />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item {...restField} name={[name, "quantity"]} label="Quantity" rules={[{ required: true }]}> 
                          <InputNumber style={{ width: "100%" }} min={0} placeholder="Qty" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => add()} block style={{ backgroundColor: "#FB923C", color: "white" }} icon={<PlusOutlined />}>Add Variant</Button>
              </div>
            )}
          </Form.List>

          <Form.Item name="published" label="Published" valuePropName="checked">
            <Switch style={{ backgroundColor: "#4CD964" }} />
          </Form.Item>

          <div className="flex justify-center gap-4 mt-8">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={addingProduct}
              className="hover:bg-[#ff8a29] border-none text-white"
              style={{ backgroundColor: "#FB923C", fontSize: "14px" }}
            >
              Add Product
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddProductPage;