import React from "react";
import img1 from "../../assets/Vector.png"; // Placeholder image

interface MetricCardProps {
  label: string;
  value: string;
  circleColor: string; // New prop for the circle color
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  circleColor,
}) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md flex items-center justify-between gap-4">

      {/* Label and Value */}
      <div className="flex flex-col">
        <h3 className="text-sm font-medium text-gray-500 mb-5">{label}</h3>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
      {/* Colored Circle */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ backgroundColor: circleColor }}
      >
        {/* You can add an icon inside the circle if needed, like in the image */}
        <span className="text-white"><img src={img1} alt="" /></span> {/* Placeholder icon */}
      </div>
    </div>
  );
};

export default MetricCard;