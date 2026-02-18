
import React from 'react';
import { Task, User } from '../types';
import { USERS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Mail, Zap, TrendingUp, MessageSquare } from 'lucide-react';

interface TeamViewProps {
  tasks: Task[];
  isDarkMode?: boolean;
}

const TeamView: React.FC<TeamViewProps> = ({ tasks, isDarkMode }) => {
  const teamStats = USERS.map(user => {
    const userTasks = tasks.filter(t => t.assignee.id === user.id);
    const completed = userTasks.filter(t => t.status === 'COMPLETED').length;
    return {
      name: user.name,
      tasks: userTasks.length,
      completed,
      workload: userTasks.length * 20, // Mock workload percentage
      user
    };
  });

  const chartTextColor = isDarkMode ? '#94a3b8' : '#64748b';
  const gridColor = isDarkMode ? '#1e293b' : '#f1f5f9';

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-white dark:bg-black min-h-full transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gray-100 dark:bg-purple-900/30 text-black dark:text-purple-400 rounded-xl"><Zap size={24} /></div>
            <span className="text-xs font-bold text-green-500 flex items-center gap-1"><TrendingUp size={12} /> +12%</span>
          </div>
          <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100">42</h4>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wider text-[10px]">Tasks completed this week</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl"><TrendingUp size={24} /></div>
            <span className="text-xs font-bold text-blue-500 flex items-center gap-1">On Track</span>
          </div>
          <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100">84%</h4>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wider text-[10px]">Sprint velocity</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl"><MessageSquare size={24} /></div>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-600">Stable</span>
          </div>
          <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100">1.2h</h4>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wider text-[10px]">Avg. response time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Workload Chart */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6">Workload Allocation</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: chartTextColor }} />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: isDarkMode ? '#1e293b' : '#f8fafc' }}
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#000000' : '#ffffff',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    color: isDarkMode ? '#f3f4f6' : '#111827'
                  }}
                />
                <Bar dataKey="tasks" radius={[6, 6, 0, 0]} barSize={40}>
                  {teamStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#7c3aed' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team List */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6">Team Members</h3>
          <div className="space-y-6">
            {teamStats.map(stat => (
              <div key={stat.user.id} className="flex items-center gap-4">
                <div className="relative">
                  <img src={stat.user.avatar} className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-800 shadow-sm" alt={stat.user.name} />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{stat.user.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{stat.user.role}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-xs font-bold text-gray-700 dark:text-gray-400">{stat.completed}/{stat.tasks} Tasks</div>
                  <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mt-1 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${stat.workload > 80 ? 'bg-red-500' : 'bg-black'}`}
                      style={{ width: `${stat.workload}%` }}
                    />
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 dark:text-gray-500 transition-colors">
                  <Mail size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamView;
