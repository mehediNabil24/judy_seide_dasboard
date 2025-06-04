import React from "react";
import { useParams } from "react-router-dom";
import { Card, Input, Image, Button } from "antd";
// import { CheckOutlined } from "@ant-design/icons";
import { useGetSingleProductQuery } from "../../redux/api/product/productApi";


const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetSingleProductQuery(id || "");

  const product = data?.data;

  if (isLoading || !product) {
    return <div>Loading...</div>;
  }

  const customOrange = "#FFA500";

  return (
    <div style={{ padding: "20px", backgroundColor: "#fff" }}>
      <h2 style={{ color: customOrange, fontSize: "24px", marginBottom: "20px" }}>
        Product Details
      </h2>
      <Card
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "20px",
          border: "none",
          boxShadow: "none",
          backgroundColor: "#fff",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>Name</label>
              <Input
                value={product.name}
                disabled
                style={{
                  borderColor: customOrange,
                  height: "40px",
                  backgroundColor: "#fff",
                  textTransform: "capitalize",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>Price</label>
              <Input
                value={`$${product.price}`}
                disabled
                style={{
                  borderColor: customOrange,
                  height: "40px",
                  backgroundColor: "#fff",
                }}
              />
            </div>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>Description</label>
            <Input.TextArea
              value={product.description}
              disabled
              style={{
                borderColor: customOrange,
                height: "100px",
                width: "100%",
                backgroundColor: "#fff",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>Material</label>
              <Input
                value={product.material.name}
                disabled
                style={{
                  borderColor: customOrange,
                  height: "40px",
                  backgroundColor: "#fff",
                  textTransform: "capitalize",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>Quantity</label>
              <Input
                value={product.quantity}
                disabled
                style={{
                  borderColor: customOrange,
                  height: "40px",
                  backgroundColor: "#fff",
                }}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>Tag</label>
              <Input
                value={product.tags.join(", ")}
                disabled
                style={{
                  borderColor: customOrange,
                  height: "40px",
                  backgroundColor: "#fff",
                }}
              />
            </div>
            {/* <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>Published</label>
              <Switch
                defaultChecked={product.published}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CheckOutlined />}
                disabled
                style={{
                  marginLeft: "10px",
                  backgroundColor: product.published ? "#52c41a" : "#d9d9d9",
                }}
              />
            </div> */}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>Product Image</label>
            <Image
              src={product.imageUrl[0]}
              alt={product.name}
              style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "8px" }}
            />
          </div>
          <div style={{ textAlign: "right" }}>
            <Button
              style={{
                marginRight: "10px",
                backgroundColor: "#fff",
                borderColor: "#d9d9d9",
                color: "#000",
                height: "40px",
                width: "100px",
              }}
            >
              Cancel
            </Button>
            <Button
              style={{
                backgroundColor: customOrange,
                borderColor: customOrange,
                color: "#fff",
                height: "40px",
                width: "100px",
              }}
            >
              Edit Product
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductDetails;