import { useState, useMemo } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Info 
} from 'lucide-react';
import Tooltip from './Tooltip';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';

// Mock data generator for sales forecast
const generateMockSalesForecast = () => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return months.map((month) => {
    const baseRevenue = Math.floor(Math.random() * 100000) + 50000; // Base between 50k-150k
    const growthFactor = 1 + (Math.random() * 0.2 - 0.1); // +/- 10% variation
    const leadCount = Math.floor(Math.random() * 50) + 20; // 20-70 leads
    const conversionRate = Math.random() * 0.3 + 0.1; // 10-40%

    return {
      month,
      revenue: Math.floor(baseRevenue * growthFactor),
      leads: leadCount,
      conversionRate: Math.floor(conversionRate * 100)
    };
  });
};

export default function SalesForecast() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Generate mock sales forecast data
  const salesData = useMemo(() => generateMockSalesForecast(), []);

  const totalAnnualRevenue = salesData.reduce((sum, data) => sum + data.revenue, 0);
  const averageMonthlyRevenue = Math.floor(totalAnnualRevenue / 12);
  const averageLeads = Math.floor(salesData.reduce((sum, data) => sum + data.leads, 0) / 12);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-[250px]">
          <p className="font-bold text-gray-900 mb-2">{data.month} Forecast</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Revenue:</span> 
              ${data.revenue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Leads:</span> {data.leads}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Conversion Rate:</span> 
              {data.conversionRate}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-gray-900">Sales Forecast</h3>
            <Tooltip text="Monthly revenue projection and lead performance">
              <Info className="h-4 w-4 text-gray-500 hover:text-gray-700 cursor-help" />
            </Tooltip>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={salesData}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 5,
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#f3f4f6" 
            />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              label={{ 
                value: 'Revenue ($)', 
                angle: -90, 
                position: 'insideLeft', 
                fill: '#6b7280',
                fontSize: 10
              }}
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 10 }}
            />
            <RechartsTooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#82ca9d', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#82ca9d" 
              strokeWidth={3}
              dot={{ r: 5, fill: '#82ca9d', stroke: 'white', strokeWidth: 2 }}
              activeDot={{ r: 8, fill: '#22c55e', stroke: 'white', strokeWidth: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {isExpanded && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <p className="text-xs font-medium text-gray-900">Total Annual Revenue</p>
            <p className="text-sm font-bold text-green-600">
              ${totalAnnualRevenue.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <p className="text-xs font-medium text-gray-900">Avg. Monthly Revenue</p>
            <p className="text-sm font-bold text-blue-600">
              ${averageMonthlyRevenue.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <p className="text-xs font-medium text-gray-900">Avg. Monthly Leads</p>
            <p className="text-sm font-bold text-purple-600">
              {averageLeads}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}