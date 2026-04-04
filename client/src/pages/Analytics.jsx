import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, Smile, TrendingUp, Clock, Users, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend, colorClass, loading }) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="flex flex-col p-6 rounded-2xl relative overflow-hidden bg-dashboard-card border border-dashboard-border min-h-[160px]"
  >
    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
      <Icon size={80} />
    </div>
    
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-dashboard-icon-bg backdrop-blur-md ${colorClass}`}>
        <Icon size={22} />
      </div>
      {trend && !loading && (
        <span className="flex items-center text-xs font-bold px-2.5 py-1 rounded-full text-emerald-400 bg-emerald-400/10 border border-emerald-400/20">
          <TrendingUp size={12} className="mr-1" />
          {trend}
        </span>
      )}
    </div>
    
    <div className="z-10 mt-auto">
      <h3 className="text-gray-400 font-medium text-sm mb-1 uppercase tracking-wider">{title}</h3>
      {loading ? (
        <div className="h-8 w-24 bg-gray-700/50 animate-pulse rounded-lg" />
      ) : (
        <div className="text-3xl font-bold text-gray-100">
          {value}
        </div>
      )}
    </div>
  </motion.div>
);

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/analytics`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setData({
        totalChats: 0,
        totalMessages: 0,
        resolvedQueries: 0,
        userSatisfaction: 0,
        avgResponseTime: "0s",
        activeUsers: 0,
        escalationRate: "0%"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="flex-1 w-full h-full overflow-y-auto px-8 py-8 relative bg-dashboard-settings">
      <header className="flex justify-between items-start mb-10 z-10 relative">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-white mb-2 uppercase tracking-tighter"
          >
            System Analytics
          </motion.h1>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${data?.isLive ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${data?.isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${data?.isLive ? 'text-emerald-400' : 'text-amber-500'}`}>
                {data?.isLive ? 'Live DB Engine' : 'Demo State Sync'}
              </span>
            </div>
            {!data?.isLive && <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Connect Server for Live Data</span>}
          </div>
        </div>
        <button 
          onClick={fetchAnalytics}
          className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-lg shadow-blue-500/5"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl z-10 relative">
        <StatCard 
          title="Total Conversations" 
          value={data?.totalChats.toLocaleString()} 
          icon={MessageSquare} 
          trend="+12%" 
          colorClass="text-blue-500" 
          loading={loading}
        />
        
        <StatCard 
          title="Resolved Queries" 
          value={data?.resolvedQueries.toLocaleString()} 
          icon={CheckCircle} 
          trend="+5%" 
          colorClass="text-emerald-400" 
          loading={loading}
        />
        
        <StatCard 
          title="User Satisfaction" 
          value={`${data?.userSatisfaction}%`} 
          icon={Smile} 
          colorClass="text-indigo-400" 
          loading={loading}
        />

        <StatCard 
          title="Avg Inference Time" 
          value={data?.avgResponseTime} 
          icon={Clock} 
          trend="-0.3s" 
          colorClass="text-blue-300" 
          loading={loading}
        />

        <StatCard 
          title="Active Sessions" 
          value={data?.activeUsers} 
          icon={Users} 
          colorClass="text-indigo-500" 
          loading={loading}
        />

        <StatCard 
          title="Escalation Risk" 
          value={data?.escalationRate} 
          icon={TrendingUp} 
          colorClass="text-slate-400" 
          loading={loading}
        />
      </div>

      <div className="mt-12 p-8 rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
          <TrendingUp size={200} />
        </div>
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Inference Volume Distribution</h3>
        <div className="h-48 flex items-end gap-3">
          {[40, 70, 45, 90, 65, 80, 55, 95, 75, 60, 85, 50].map((h, i) => (
            <motion.div 
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.05, duration: 1 }}
              className="flex-1 bg-gradient-to-t from-blue-600/40 to-blue-400/10 rounded-t-lg border-t border-blue-400/20"
            />
          ))}
        </div>
        <div className="flex justify-between mt-4 px-2">
          <span className="text-[10px] font-bold text-slate-600 uppercase">00:00</span>
          <span className="text-[10px] font-bold text-slate-600 uppercase">12:00</span>
          <span className="text-[10px] font-bold text-slate-600 uppercase">23:59</span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
