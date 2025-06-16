import React from "react";
import { Card, Typography, Row, Col, Spin } from "antd";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import { useGetBestSellingQuery } from "../../redux/api/overView/overviewApi";


const { Text } = Typography;

// Color palette for dynamic rendering
const COLORS = ["#f59e0b", "#10b981", "#000000", "#22c55e", "#6366f1", "#f43f5e"];

const BestSelling: React.FC = () => {
  const { data, isLoading, isError } = useGetBestSellingQuery({});

  // console.log('best selling', data);

  const renderLabel = () => (
    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
      <tspan x="50%" dy="-0.5em" fontSize={12}>
        This Week
      </tspan>
    </text>
  );

  // Extract and transform data only if API call is successful
  const pieData =
    data?.data?.map((item: any, index: number) => ({
      label: item.category,
      value: item.percentage,
      color: COLORS[index % COLORS.length],
    })) || [];

  return (
    <Card title="This Week">
      {isLoading ? (
        <Spin />
      ) : isError ? (
        <Text type="danger">Failed to load data</Text>
      ) : (
        <Row gutter={[10, 10]} align="middle">
          <Col xs={24}>
            <div style={{ width: "100%", minWidth: 100, height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={3}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {pieData.map((entry:any, index:any) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <Label content={renderLabel} position="center" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: "flex", flexDirection: "column", marginTop: 10 }}>
              {pieData.map((item:any, index:any) => (
                <Row justify="space-between" key={index} style={{ marginBottom: 8 }}>
                  <Text>{item.label}</Text>
                  <Text style={{ color: item.color }}>{item.value}%</Text>
                </Row>
              ))}
            </div>
          </Col>
        </Row>
      )}
    </Card>
  );
};

export default BestSelling;
