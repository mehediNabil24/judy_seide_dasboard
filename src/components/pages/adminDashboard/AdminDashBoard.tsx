


import { useGetMetricStatsQuery } from "../../../redux/api/overView/overviewApi";
import BestSelling from "../../bestSelling/BestSelling";
import MetricCard from "../../MetricCard/MetricCard";
import RecentOrderList from "../../recentOrderList/RecentOrderList";
import AdminChartData from "../../revenueChartData/AdminChartData";
const AdminDashboard = () => {
    const { data, isLoading, error } = useGetMetricStatsQuery({});
    console.log('metric Stats Data:', data);

    const metrics = data ? [
        {
            label: 'Today Orders',
            value: data?.data?.todayOrders || "0", // Static value from the image
            circleColor: '#FF8C38', // Orange color from the image
        },
        {
            label: 'This Month Orders',
            value: data?.data?.monthOrders, // Static value from the image
            circleColor: '#FFD700', // Yellow color from the image
        },
        {
            label: 'This Month Sales',
            value: data?.data?.monthSales, // Static value from the image
            circleColor: '#000000', // Black color from the image
        },
        {
            label: 'Total Sales',
            value: data?.data?.totalSales, // Static value from the image
            circleColor: '#00C4B4', // Teal color from the image
        },
    ] : [];

    return (
        <div>
            <div>
                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
                    {isLoading && <p>Loading metrics...</p>}
                    {error && <p>Failed to load statistics.</p>}
                    {!isLoading && !error && metrics.map((metric, index) => (
                        <MetricCard key={index} {...metric} />
                    ))}
                </div>
            </div>

            {/* Revenue + Top Destinations */}
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mt-4">
                <div className="lg:col-span-4 shadow-md rounded-xl">
                    <AdminChartData />
                </div>
                <div className="lg:col-span-2 shadow-md rounded-xl h-full">
                    <BestSelling />
                </div>
            </div>

            {/* Bookings Table */}
            <div className="grid grid-cols-6 gap-4 mt-4">
                <div className="col-span-6 shadow-md rounded-xl">
                    <RecentOrderList />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
