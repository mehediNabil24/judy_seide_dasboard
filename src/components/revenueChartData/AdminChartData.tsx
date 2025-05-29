import { useGetChartDataQuery } from "../../redux/api/overView/overviewApi";
import AdminRevenueChart from "../revenueChart/AdminRevenueChart";



const AdminChartData = () => {
  const { data: statsData } = useGetChartDataQuery({});
  console.log('Admin Stats Data:', statsData);

  // Transform object to array
  const weeklyData = statsData?.data
    ? Object.entries(statsData.data).map(([day, value]) => ({
        day,
        sales: typeof value === 'number' ? value : 0,
        orders: 0 // Assuming no order data is provided
      }))
    : [];

  console.log('Transformed Weekly Data:', { weeklyData });

  return (
    <AdminRevenueChart
      title="Weekly Sales"
      weeklyData={weeklyData}
    />
  );
};

export default AdminChartData;