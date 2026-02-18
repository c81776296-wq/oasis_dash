import React from 'react';
import { Task, Status } from '../types';
import {
    Activity,
    FileText,
    Bookmark,
    Folder,
    LayoutList,
    ChevronRight,
    Plus,
    ArrowUpRight,
    MoreHorizontal,
    Clock,
    ExternalLink,
    Users,
    Flag,
    Calendar
} from 'lucide-react';
import { STATUS_COLORS } from '../constants';

interface OverviewProps {
    tasks: Task[];
}

const Overview: React.FC<OverviewProps> = ({ tasks }) => {
    // Real data summaries
    const statusCounts = tasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
    }, {} as Record<Status, number>);

    const totalTasks = tasks.length;
    const recentTasks = tasks.slice(0, 3);

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-black p-6 space-y-6">
            {/* Top Bar Actions */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-[#2c2c2e] rounded-lg text-xs font-bold shadow-sm flex items-center gap-2">
                        <Plus size={14} /> Add Channel
                    </button>
                </div>
                <div className="flex gap-2 items-center text-xs text-gray-500 font-medium">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-[#1c1c1e] border border-gray-200 dark:border-[#2c2c2e] rounded-lg">
                        <Clock size={14} /> Refreshed: 1 hour ago
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-[#1c1c1e] border border-gray-200 dark:border-[#2c2c2e] rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-black animate-pulse" /> Auto refresh: On
                    </div>
                    <button className="px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">Customize</button>
                    <button className="px-3 py-1.5 bg-black text-white rounded-lg font-bold">Add card</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Recent Card */}
                <div className="bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-[#2c2c2e] rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[300px]">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">Recent</span>
                        <MoreHorizontal size={14} className="text-gray-400" />
                    </div>
                    <div className="p-4 flex-1 space-y-3">
                        {recentTasks.map(task => (
                            <div key={task.id} className="group flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                                <LayoutList size={14} className="text-gray-400" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">{task.title}</p>
                                    <p className="text-[10px] text-gray-500">• in Dubai</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Docs Card */}
                <div className="bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-[#2c2c2e] rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[300px]">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">Docs</span>
                        <MoreHorizontal size={14} className="text-gray-400" />
                    </div>
                    <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-xl flex items-center justify-center">
                            <FileText size={24} className="text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500 font-medium whitespace-pre">There are no Docs in this location yet.</p>
                        <button className="px-4 py-2 bg-primary hover:bg-primary-hover active:bg-primary-hover text-white text-[10px] font-bold rounded-lg transition-colors shadow-sm">Add a Doc</button>
                    </div>
                </div>

                {/* Bookmarks Card */}
                <div className="bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-[#2c2c2e] rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[300px]">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">Bookmarks</span>
                        <MoreHorizontal size={14} className="text-gray-400" />
                    </div>
                    <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-xl flex items-center justify-center relative">
                            <Bookmark size={24} className="text-gray-400" />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-white/5 rounded-full flex items-center justify-center shadow-sm">
                                <Plus size={10} className="text-gray-500" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 font-medium max-w-[200px]">Bookmarks make it easy to save Oasis items or any URL from around the web.</p>
                        <button className="px-4 py-2 bg-primary hover:bg-primary-hover active:bg-primary-hover text-white text-[10px] font-bold rounded-lg transition-colors shadow-sm">Add Bookmark</button>
                    </div>
                </div>
            </div>

            {/* Folders Section */}
            <div className="bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-[#2c2c2e] rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[300px]">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">Folders</span>
                    <MoreHorizontal size={14} className="text-gray-400" />
                </div>
                <div className="p-12 flex-1 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center">
                        <Folder size={32} className="text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Add new Folder to your Space</p>
                    <button className="px-6 py-2 bg-primary hover:bg-primary-hover active:bg-primary-hover text-white text-[10px] font-bold rounded-lg transition-colors shadow-sm">Add Folder</button>
                </div>
            </div>

            {/* Lists Section - Real List Data */}
            <div className="bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-[#2c2c2e] rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">Lists</span>
                    <MoreHorizontal size={14} className="text-gray-400" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-white/5">
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Color</th>
                                <th className="px-6 py-3">Progress</th>
                                <th className="px-6 py-3">Start</th>
                                <th className="px-6 py-3">End</th>
                                <th className="px-6 py-3">Priority</th>
                                <th className="px-6 py-3">Owner</th>
                                <th className="px-6 py-3"><Plus size={14} /></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {Array.from(new Set(tasks.flatMap(t => t.tags))).map(listName => {
                                const listTasks = tasks.filter(t => t.tags.includes(listName));
                                const doneCount = listTasks.filter(t => t.status === 'COMPLETED').length;
                                const totalCount = listTasks.length;

                                return (
                                    <tr key={listName} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <Activity size={14} className="text-gray-400" />
                                            <span className="text-xs font-bold text-gray-900 dark:text-gray-100 group-hover:text-black transition-colors">{listName}</span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-400">-</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-32 h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-black rounded-full"
                                                        style={{ width: `${(doneCount / (totalCount || 1)) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-500">{doneCount}/{totalCount}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><Clock size={14} className="text-gray-300 dark:text-gray-700" /></td>
                                        <td className="px-6 py-4"><Calendar size={14} className="text-gray-300 dark:text-gray-700" /></td>
                                        <td className="px-6 py-4"><Flag size={14} className="text-gray-300 dark:text-gray-700" /></td>
                                        <td className="px-6 py-4">
                                            <div className="w-5 h-5 rounded-full border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
                                                <Users size={10} className="text-gray-400" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"></td>
                                    </tr>
                                );
                            })}
                            <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                                <td colSpan={8} className="px-6 py-3 flex items-center gap-2 text-gray-400 text-xs font-bold">
                                    <Plus size={14} /> NEW LIST
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                {/* Resources Card */}
                <div className="bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-[#2c2c2e] rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[350px]">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">Resources</span>
                        <MoreHorizontal size={14} className="text-gray-400" />
                    </div>
                    <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-full h-48 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-2xl flex flex-col items-center justify-center text-gray-400 space-y-2">
                            <ArrowUpRight size={32} strokeWidth={1.5} />
                            <p className="text-xs font-medium">Drop files here or <span className="text-black underline cursor-pointer">attach</span></p>
                        </div>
                    </div>
                </div>

                {/* Workload by Status Card - Visualization */}
                <div className="bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-[#2c2c2e] rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[350px]">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">Workload by Status</span>
                        <MoreHorizontal size={14} className="text-gray-400" />
                    </div>
                    <div className="p-8 flex-1 flex items-center justify-center relative">
                        <div className="w-56 h-56 rounded-full border-[24px] border-gray-200 dark:border-gray-800/50 flex items-center justify-center relative">
                            <div className="absolute inset-x-0 h-[24px] top-1/2 -mt-[12px] bg-gray-500/40 rounded-full" style={{ clipPath: 'polygon(50% 50%, 0 0, 100% 0)' }}></div>
                            {/* Simplified SVG Representation of the Pie Chart */}
                            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="20" className="text-gray-400/30" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="20" strokeDasharray="180 251.2" className="text-gray-500" />
                            </svg>
                        </div>
                        <div className="absolute right-12 space-y-4">
                            {Object.entries(statusCounts).map(([status, count]) => (
                                <div key={status} className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[status as Status] || 'bg-gray-400'}`} />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">{status} {count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
