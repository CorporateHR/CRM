import { useState, useMemo } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Info 
} from 'lucide-react';
import Tooltip from './Tooltip';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';

// Mock data generator for leads
const generateMockLeads = () => {
  const stages = ['New', 'In Progress', 'Converted', 'Lost'];
  const mockLeads = [];

  for (let i = 0; i < 100; i++) {
    mockLeads.push({
      id: `lead_${i}`,
      name: `Lead ${i}`,
      status: stages[Math.floor(Math.random() * stages.length)],
      value: Math.floor(Math.random() * 50000) + 5000, // Random value between 5,000 and 55,000
      createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    });
  }

  return mockLeads;
};

export default function PipelineChart() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Generate mock leads
  const leads = useMemo(() => generateMockLeads(), []);
  
  const stages = [
    { 
      name: 'New', 
      key: 'New', 
      color: '#3B82F6', // blue-500
      description: 'Recently added leads that have not been contacted yet.'
    },
    { 
      name: 'In Progress', 
      key: 'In Progress', 
      color: '#EAB308', // yellow-500
      description: 'Leads currently being engaged and nurtured.'
    },
    { 
      name: 'Converted', 
      key: 'Converted', 
      color: '#22C55E', // green-500
      description: 'Successful leads that have been turned into customers.'
    },
    { 
      name: 'Lost', 
      key: 'Lost', 
      color: '#EF4444', // red-500
      description: 'Leads that did not result in a sale.'
    },
  ];

  const pipelineData = stages.map(stage => {
    const stageLeads = leads.filter(lead => lead.status === stage.key);
    return {
      name: stage.name,
      leadCount: stageLeads.length,
      totalValue: stageLeads.reduce((sum, lead) => sum + (lead.value || 0), 0),
      color: stage.color,
      description: stage.description
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-[250px]">
          <p className="font-bold text-gray-900 mb-2">{data.name} Stage</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Leads:</span> {data.leadCount}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Total Value:</span> 
              ${data.totalValue.toLocaleString()}
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2 italic">{data.description}</p>
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
            <h3 className="text-lg font-bold text-gray-900">Sales Pipeline</h3>
            <Tooltip text="Breakdown of leads across different stages">
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
          <BarChart
            data={pipelineData}
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
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              label={{ 
                value: 'Total Value ($)', 
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
              cursor={{ fill: 'rgba(0,0,0,0.1)' }}
            />
            <Bar 
              dataKey="totalValue" 
              name="Total Value" 
              barSize={40}
              radius={[4, 4, 0, 0]}
              fill="#8884d8" 
              activeBar={{ fill: '#82ca9d' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {isExpanded && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {pipelineData.map((stage) => (
            <div 
              key={stage.name} 
              className="p-3 bg-gray-50 rounded-lg text-center"
            >
              <div 
                className="h-1.5 w-full rounded-full mb-2" 
                style={{ backgroundColor: stage.color }}
              />
              <p className="text-xs font-medium text-gray-900">{stage.name}</p>
              <p className="text-xs text-gray-600">
                {stage.leadCount} Leads
              </p>
              <p className="text-xs text-gray-600">
                ${stage.totalValue.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}