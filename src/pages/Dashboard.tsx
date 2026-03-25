import React, { useState, useEffect } from 'react';
import { 
  Files, 
  MessageSquare, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import api from '../services/api';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalChats: 0,
    activeTenants: 0,
    processingRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/analytics/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { 
      name: 'Total Documents', 
      value: stats.totalDocuments, 
      icon: Files, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10',
      trend: '+12% from last month'
    },
    { 
      name: 'AI Conversations', 
      value: stats.totalChats, 
      icon: MessageSquare, 
      color: 'text-purple-500', 
      bg: 'bg-purple-500/10',
      trend: '+24% from last month'
    },
    { 
      name: 'Active Tenants', 
      value: stats.activeTenants, 
      icon: Users, 
      color: 'text-green-500', 
      bg: 'bg-green-500/10',
      trend: '+3 new this week'
    },
    { 
      name: 'Processing Rate', 
      value: `${stats.processingRate}%`, 
      icon: TrendingUp, 
      color: 'text-orange-500', 
      bg: 'bg-orange-500/10',
      trend: 'Optimized performance'
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-gray-400">Here's what's happening with your documents today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#111111] border border-white/10 p-6 rounded-2xl hover:border-white/20 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.trend}</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-400">{stat.name}</p>
              <p className="text-2xl font-bold">{loading ? '...' : stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Recent Activity
            </h2>
            <button className="text-sm text-blue-500 hover:text-blue-400 font-medium">View all</button>
          </div>
          <div className="divide-y divide-white/5">
            {[
              { action: 'Document Processed', target: 'Q4_Financial_Report.pdf', time: '2 mins ago', status: 'success' },
              { action: 'New Chat Session', target: 'Legal Review Assistant', time: '15 mins ago', status: 'info' },
              { action: 'Tenant Created', target: 'Acme Corp', time: '1 hour ago', status: 'success' },
              { action: 'Processing Error', target: 'Invoice_992.png', time: '3 hours ago', status: 'error' },
            ].map((item, i) => (
              <div key={i} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  item.status === 'success' ? 'bg-green-500/10 text-green-500' :
                  item.status === 'error' ? 'bg-red-500/10 text-red-500' :
                  'bg-blue-500/10 text-blue-500'
                }`}>
                  {item.status === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
                   item.status === 'error' ? <AlertCircle className="w-5 h-5" /> :
                   <FileText className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.action}</p>
                  <p className="text-xs text-gray-500 truncate">{item.target}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
              <Files className="w-5 h-5" />
              Upload Document
            </button>
            <button className="w-full bg-white/5 hover:bg-white/10 text-white p-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 border border-white/10">
              <MessageSquare className="w-5 h-5" />
              New Chat
            </button>
          </div>
          <div className="pt-6 border-t border-white/10">
            <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">API Gateway</span>
                <span className="flex items-center gap-1.5 text-xs text-green-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">AI Engine</span>
                <span className="flex items-center gap-1.5 text-xs text-green-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Storage Cluster</span>
                <span className="flex items-center gap-1.5 text-xs text-green-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
