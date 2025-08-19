import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const AnalyticsDashboard = ({ analyticsData, userRole }) => {
  const conversationTrends = [
    { date: '2025-08-07', conversations: 45, resolved: 42 },
    { date: '2025-08-08', conversations: 52, resolved: 48 },
    { date: '2025-08-09', conversations: 38, resolved: 36 },
    { date: '2025-08-10', conversations: 61, resolved: 58 },
    { date: '2025-08-11', conversations: 47, resolved: 44 },
    { date: '2025-08-12', conversations: 55, resolved: 52 },
    { date: '2025-08-13', conversations: 43, resolved: 40 }
  ];

  const topIssues = [
    { category: 'Network Connectivity', count: 156, trend: '+12%' },
    { category: 'Password Reset', count: 134, trend: '-5%' },
    { category: 'Software Installation', count: 98, trend: '+8%' },
    { category: 'Email Configuration', count: 87, trend: '+3%' },
    { category: 'VPN Access', count: 76, trend: '+15%' },
    { category: 'Printer Issues', count: 65, trend: '-2%' },
    { category: 'Database Queries', count: 54, trend: '+7%' },
    { category: 'Security Alerts', count: 43, trend: '+22%' }
  ];

  const llmPerformance = [
    { name: 'Mistral', accuracy: 94.2, usage: 35 },
    { name: 'Llama', accuracy: 91.8, usage: 28 },
    { name: 'Code-Llama', accuracy: 96.1, usage: 15 },
    { name: 'Vicuna', accuracy: 89.5, usage: 12 },
    { name: 'WizardLM', accuracy: 92.3, usage: 10 }
  ];

  const categoryDistribution = [
    { name: 'Network', value: 32, color: '#10b981' },
    { name: 'Security', value: 24, color: '#3b82f6' },
    { name: 'System Admin', value: 18, color: '#8b5cf6' },
    { name: 'Hardware', value: 15, color: '#f59e0b' },
    { name: 'Software', value: 11, color: '#ef4444' }
  ];

  const userEngagement = [
    { user: 'John Smith', conversations: 89, avgRating: 4.8 },
    { user: 'Sarah Johnson', conversations: 76, avgRating: 4.6 },
    { user: 'Mike Davis', conversations: 65, avgRating: 4.9 },
    { user: 'Lisa Wilson', conversations: 58, avgRating: 4.7 },
    { user: 'David Brown', conversations: 52, avgRating: 4.5 }
  ];

  const knowledgeGaps = [
    { 
      topic: 'Azure AD Integration', 
      frequency: 23, 
      avgResolutionTime: '45 min',
      status: 'needs_documentation'
    },
    { 
      topic: 'Kubernetes Troubleshooting', 
      frequency: 18, 
      avgResolutionTime: '62 min',
      status: 'needs_documentation'
    },
    { 
      topic: 'SSL Certificate Renewal', 
      frequency: 15, 
      avgResolutionTime: '38 min',
      status: 'documented'
    },
    { 
      topic: 'Database Performance Tuning', 
      frequency: 12, 
      avgResolutionTime: '78 min',
      status: 'needs_documentation'
    }
  ];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTrendIcon = (trend) => {
    if (trend?.startsWith('+')) {
      return <Icon name="TrendingUp" size={14} className="text-green-600" />;
    } else if (trend?.startsWith('-')) {
      return <Icon name="TrendingDown" size={14} className="text-red-600" />;
    }
    return <Icon name="Minus" size={14} className="text-gray-600" />;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      needs_documentation: { color: 'bg-red-100 text-red-800', text: 'Needs Documentation' },
      documented: { color: 'bg-green-100 text-green-800', text: 'Documented' },
      in_progress: { color: 'bg-yellow-100 text-yellow-800', text: 'In Progress' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.needs_documentation;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Conversations</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="MessageSquare" size={24} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Icon name="TrendingUp" size={16} className="text-green-600 mr-1" />
            <span className="text-sm text-green-600 font-medium">+12.5%</span>
            <span className="text-sm text-gray-500 ml-1">vs last week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
              <p className="text-2xl font-bold text-gray-900">94.2%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={24} className="text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Icon name="TrendingUp" size={16} className="text-green-600 mr-1" />
            <span className="text-sm text-green-600 font-medium">+2.1%</span>
            <span className="text-sm text-gray-500 ml-1">vs last week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">2.3s</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={24} className="text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Icon name="TrendingDown" size={16} className="text-green-600 mr-1" />
            <span className="text-sm text-green-600 font-medium">-0.4s</span>
            <span className="text-sm text-gray-500 ml-1">vs last week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Icon name="Users" size={24} className="text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Icon name="TrendingUp" size={16} className="text-green-600 mr-1" />
            <span className="text-sm text-green-600 font-medium">+8</span>
            <span className="text-sm text-gray-500 ml-1">vs last week</span>
          </div>
        </div>
      </div>
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversation Trends */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Conversation Trends</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Total</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Resolved</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conversationTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  labelFormatter={(value) => formatDate(value)}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="conversations" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="resolved" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Percentage']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {categoryDistribution?.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item?.color }}
                ></div>
                <span className="text-sm text-gray-600">{item?.name}</span>
                <span className="text-sm font-medium text-gray-900 ml-auto">{item?.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Top Issues and LLM Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Issues */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Most Common Issues</h3>
          <div className="space-y-4">
            {topIssues?.map((issue, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{issue?.category}</p>
                    <p className="text-xs text-gray-500">{issue?.count} conversations</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(issue?.trend)}
                  <span className={`text-sm font-medium ${
                    issue?.trend?.startsWith('+') ? 'text-green-600' : 
                    issue?.trend?.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {issue?.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LLM Performance */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">LLM Model Performance</h3>
          <div className="space-y-4">
            {llmPerformance?.map((model, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{model?.name}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">{model?.usage}% usage</span>
                    <span className="text-sm font-medium text-green-600">{model?.accuracy}% accuracy</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${model?.accuracy}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Knowledge Gaps and User Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Knowledge Gaps */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Knowledge Gaps</h3>
            <Icon name="AlertTriangle" size={20} className="text-orange-500" />
          </div>
          <div className="space-y-4">
            {knowledgeGaps?.map((gap, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">{gap?.topic}</h4>
                  {getStatusBadge(gap?.status)}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{gap?.frequency} occurrences</span>
                  <span>Avg: {gap?.avgResolutionTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Engagement */}
        {userRole === 'admin' && (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Active Users</h3>
            <div className="space-y-4">
              {userEngagement?.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} color="white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user?.user}</p>
                      <p className="text-xs text-gray-500">{user?.conversations} conversations</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={14} className="text-yellow-500" />
                    <span className="text-sm font-medium text-gray-900">{user?.avgRating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;