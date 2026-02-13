
import React from 'react';
import { Task } from '../types';
import { ChevronLeft, ChevronRight, MoreHorizontal, Plus } from 'lucide-react';
import { STATUS_COLORS } from '../constants';

interface CalendarViewProps {
  tasks: Task[];
  isDarkMode?: boolean;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, isDarkMode }) => {
  const days = Array.from({ length: 35 }, (_, i) => i - 3); // Simple mock grid starting slightly before month
  const monthName = "October 2024";

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{monthName}</h2>
            <div className="flex items-center border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
               <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors border-r border-gray-200 dark:border-gray-800 dark:text-gray-400"><ChevronLeft size={16} /></button>
               <button className="px-3 py-1 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors dark:text-gray-400">Today</button>
               <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors border-l border-gray-200 dark:border-gray-800 dark:text-gray-400"><ChevronRight size={16} /></button>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <button className="px-4 py-1.5 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors dark:text-gray-200">Month</button>
            <button className="px-4 py-1.5 text-sm font-medium text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300">Week</button>
            <button className="px-4 py-1.5 text-sm font-medium text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300">Day</button>
         </div>
      </div>

      <div className="flex-1 grid grid-cols-7 border-l border-t border-gray-100 dark:border-gray-800">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border-r border-b border-gray-100 dark:border-gray-800 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">
            {day}
          </div>
        ))}
        {days.map((day, i) => {
          const isCurrentMonth = day > 0 && day <= 31;
          const displayDay = day <= 0 ? 30 + day : (day > 31 ? day - 31 : day);
          const dayTasks = isCurrentMonth ? tasks.filter(t => new Date(t.dueDate).getDate() === day) : [];

          return (
            <div key={i} className={`min-h-[140px] p-2 border-r border-b border-gray-100 dark:border-gray-800 transition-colors hover:bg-gray-50/30 dark:hover:bg-gray-900/30 group relative flex flex-col ${!isCurrentMonth ? 'bg-gray-50/50 dark:bg-gray-900/50 opacity-40' : ''}`}>
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-semibold ${day === 24 ? 'w-6 h-6 bg-purple-600 text-white flex items-center justify-center rounded-full' : 'text-gray-500 dark:text-gray-400'}`}>
                  {displayDay}
                </span>
                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white dark:hover:bg-gray-800 rounded shadow-sm transition-opacity">
                   <Plus size={12} className="text-gray-400 dark:text-gray-600" />
                </button>
              </div>
              <div className="space-y-1 overflow-hidden">
                {dayTasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`px-2 py-1 rounded border-l-2 text-[10px] font-semibold truncate transition-all shadow-sm ${task.status === 'Complete' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-500' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-500'}`}
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
