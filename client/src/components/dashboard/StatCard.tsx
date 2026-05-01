import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
}

const StatCard = ({ title, value, icon }: StatCardProps) => {
  return (
    <div className="bg-[#0f0f15] p-6 rounded-lg">
      <div className="flex items-center">
        <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-gray-400">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;