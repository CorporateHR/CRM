import { useState } from 'react';
import { useLeads } from '../context/LeadsContext';
import { 
  BarChart3, Users, TrendingUp, DollarSign, ArrowUp, ArrowDown, 
  Clock, CheckCircle2, XCircle, Filter 
} from 'lucide-react';
import PipelineChart from '../components/PipelineChart';
import SalesForecast from '../components/SalesForecast';

export default function Dashboard() {
  const { leads } = useLeads();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('week');

  const calculateStats = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    const filterDate = timeframe === 'week' ? weekAgo : 
                       timeframe === 'month' ? monthAgo : 
                       quarterAgo;

    const recentLeads = leads.filter(lead => new Date(lead.createdAt) > filterDate);

    const totalLeads = recentLeads.length;
    const totalValue = recentLeads.reduce((sum, lead) => sum + (lead.value || 0), 0);
    const qualifiedLeads = recentLeads.filter(lead => 
      ['In Progress', 'New'].includes(lead.status)
    ).length;
    const closedLeads = recentLeads.filter(lead => lead.status === 'Converted').length;

    return { totalLeads, totalValue, qualifiedLeads, closedLeads };
  };

  const { totalLeads, totalValue, qualifiedLeads, closedLeads } = calculateStats();

  const stats = [
    {
      name: 'Total Leads',
      value: totalLeads,
      icon: Users,
      change: '+12%',
      changeColor: 'text-emerald-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      name: 'Pipeline Value',
      value: `$${totalValue.toLocaleString()}`,
      icon: DollarSign,
      change: '+8.2%',
      changeColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      name: 'Qualified Leads',
      value: qualifiedLeads,
      icon: TrendingUp,
      change: '+2.3%',
      changeColor: 'text-emerald-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      name: 'Closed Deals',
      value: closedLeads,
      icon: BarChart3,
      change: '+4.5%',
      changeColor: 'text-emerald-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600'
    },
  ];

  const leadStatusBreakdown = [
    { 
      status: 'New', 
      count: leads.filter(lead => lead.status === 'New').length,
      icon: Clock,
      color: 'text-blue-600 bg-blue-50'
    },
    { 
      status: 'In Progress', 
      count: leads.filter(lead => lead.status === 'In Progress').length,
      icon: Filter,
      color: 'text-yellow-600 bg-yellow-50'
    },
    { 
      status: 'Converted', 
      count: leads.filter(lead => lead.status === 'Converted').length,
      icon: CheckCircle2,
      color: 'text-green-600 bg-green-50'
    },
    { 
      status: 'Lost', 
      count: leads.filter(lead => lead.status === 'Lost').length,
      icon: XCircle,
      color: 'text-red-600 bg-red-50'
    }
  ];

  return (
    <div className="space-y-8 p-6 bg-gray-50">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your sales pipeline</p>
        </div>
        <div className="flex space-x-2 bg-white rounded-lg border border-gray-200 p-1">
          {(['week', 'month', 'quarter'] as const).map(period => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeframe === period 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <div className={`flex items-center ${stat.changeColor} text-sm font-medium`}>
                  <ArrowUp className="h-4 w-4 mr-1" />
                  {stat.change}
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Lead Status Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Status Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {leadStatusBreakdown.map((status) => (
            <div 
              key={status.status} 
              className="flex items-center space-x-3 p-4 rounded-lg border border-gray-100"
            >
              <div className={`p-2 rounded-full ${status.color}`}>
                <status.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{status.status}</p>
                <p className="text-xl font-bold text-gray-900">{status.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline and Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <PipelineChart />
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <SalesForecast />
        </div>
      </div>
    </div>
  );
}