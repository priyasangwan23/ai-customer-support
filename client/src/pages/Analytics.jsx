import React from 'react';
import { MessageSquare, CheckCircle, Smile, TrendingUp, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';

// Dummy static JSON data as requested
const analyticsData = {
  totalChats: 1248,
  resolvedQueries: 1102,
  userSatisfaction: 94,
  avgResponseTime: "1.4s",
  activeUsers: 84,
  escalationRate: "4.2%"
};

const StatCard = ({ title, value, icon: Icon, trend, colorClass }) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="flex flex-col p-6 rounded-2xl relative overflow-hidden bg-dashboard-card border border-dashboard-border"
  >
    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
      <Icon size={80} />
    </div>
    
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-dashboard-icon-bg backdrop-blur-md ${colorClass}`}>
        <Icon size={22} />
      </div>
      {trend && (
        <span className="flex items-center text-xs font-bold px-2.5 py-1 rounded-full text-emerald-400 bg-emerald-400/10 border border-emerald-400/20">
          <TrendingUp size={12} className="mr-1" />
          {trend}
        </span>
      )}
    </div>
    
    <div className="z-10 mt-auto">
      <h3 className="text-gray-400 font-medium text-sm mb-1 uppercase tracking-wider">{title}</h3>
      <div className="text-3xl font-bold text-gray-100 placeholder-glow">
        {value}
      </div>
    </div>
  </motion.div>
);

const Analytics = () => {
  return (
    <div className="flex-1 w-full h-full overflow-y-auto px-8 py-8 relative bg-dashboard-settings">
      {/* Background ambient glow removed for clean SaaS theme */}
        
      <header className="mb-10 z-10 relative">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold text-white mb-2"
        >
          Chatbot Analytics
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 text-sm"
        >
          Real-time insights and performance metrics for your SupportSense Assistant.
        </motion.p>
      </header>

      {/* Grid for Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl z-10 relative">
        
        <StatCard 
          title="Total Chats" 
          value={analyticsData.totalChats.toLocaleString()} 
          icon={MessageSquare} 
          trend="+12%" 
          colorClass="text-blue-500" 
        />
        
        <StatCard 
          title="Resolved Queries" 
          value={analyticsData.resolvedQueries.toLocaleString()} 
          icon={CheckCircle} 
          trend="+5%" 
          colorClass="text-blue-400" 
        />
        
        <StatCard 
          title="User Satisfaction" 
          value={`${analyticsData.userSatisfaction}%`} 
          icon={Smile} 
          colorClass="text-indigo-400" 
        />

        <StatCard 
          title="Avg Response Time" 
          value={analyticsData.avgResponseTime} 
          icon={Clock} 
          trend="-0.3s" 
          colorClass="text-blue-300" 
        />

        <StatCard 
          title="Active Users" 
          value={analyticsData.activeUsers} 
          icon={Users} 
          colorClass="text-indigo-500" 
        />

        <StatCard 
          title="Escalation Rate" 
          value={analyticsData.escalationRate} 
          icon={TrendingUp} 
          colorClass="text-slate-400" 
        />

      </div>
    </div>
  );
};

export default Analytics;
