import { useEffect, useState } from 'react';
import { taskAPI } from '../services/api';
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await taskAPI.getStats();
      setStats(data.data);
    } catch (error) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading statistics...</div>;
  }

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats?.total || 0,
      icon: TrendingUp,
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Completed',
      value: stats?.completed || 0,
      icon: CheckCircle2,
      bgColor: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'In Progress',
      value: stats?.inProgress || 0,
      icon: Clock,
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Pending',
      value: stats?.pending || 0,
      icon: AlertCircle,
      bgColor: 'bg-red-500',
      textColor: 'text-red-600'
    }
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.title} className="card">
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${stat.bgColor} rounded-lg p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                  <dd>
                    <div className={`text-2xl font-semibold ${stat.textColor}`}>
                      {stat.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Status Distribution</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed</span>
              <div className="flex items-center">
                <div className="w-48 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(stats?.completed / stats?.total * 100) || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{stats?.completed || 0}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">In Progress</span>
              <div className="flex items-center">
                <div className="w-48 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full" 
                    style={{ width: `${(stats?.inProgress / stats?.total * 100) || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{stats?.inProgress || 0}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending</span>
              <div className="flex items-center">
                <div className="w-48 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ width: `${(stats?.pending / stats?.total * 100) || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{stats?.pending || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">High Priority</span>
              <div className="flex items-center">
                <div className="w-48 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ width: `${(stats?.high / stats?.total * 100) || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{stats?.high || 0}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Medium Priority</span>
              <div className="flex items-center">
                <div className="w-48 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full" 
                    style={{ width: `${(stats?.medium / stats?.total * 100) || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{stats?.medium || 0}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Low Priority</span>
              <div className="flex items-center">
                <div className="w-48 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(stats?.low / stats?.total * 100) || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{stats?.low || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
