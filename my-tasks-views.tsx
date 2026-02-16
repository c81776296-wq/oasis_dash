// My Tasks Full-Screen Views Component
{
    myTasksActiveView && (
        <div className="fixed inset-0 bg-white dark:bg-[#1e1e1e] z-[500] flex flex-col">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span
                        onClick={() => setMyTasksActiveView(null)}
                        className="hover:text-gray-900 dark:hover:text-white cursor-pointer"
                    >
                        My Tasks
                    </span>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white font-medium">{myTasksActiveView}</span>
                </div>
                <button
                    onClick={() => setMyTasksActiveView(null)}
                    className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
                {myTasksActiveView === 'Assigned to me' && (
                    <div className="flex items-center justify-center h-full p-8">
                        <div className="text-center space-y-4 max-w-md">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                                <Check size={32} className="text-gray-300 dark:text-gray-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                Tasks assigned to you will appear here. Learn more
                            </h3>
                            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors">
                                Browse tasks
                            </button>
                        </div>
                    </div>
                )}

                {myTasksActiveView === 'Today & Overdue' && (
                    <div className="p-8">
                        <div className="max-w-5xl mx-auto">
                            <div className="bg-white dark:bg-[#121213] border border-gray-200 dark:border-gray-700 rounded-xl p-8">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">My Work</h2>

                                <div className="flex items-center justify-center py-32">
                                    <div className="text-center space-y-4 max-w-md">
                                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                                            <Layers size={32} className="text-gray-300 dark:text-gray-600" />
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Tasks and Reminders assigned to you will show here. <span className="text-purple-600 hover:text-purple-700 cursor-pointer">Learn more</span>
                                        </p>
                                        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors inline-flex items-center gap-2">
                                            <Plus size={16} />
                                            Add task or reminder
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {myTasksActiveView === 'Personal List' && (
                    <div className="h-full flex flex-col">
                        {/* Toolbar */}
                        <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-3">
                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                    <Filter size={14} />
                                    Filter
                                </button>
                                <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                    <LayoutList size={14} />
                                    Me
                                </button>
                                <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                    <Hash size={14} />
                                    Tags
                                </button>

                                <div className="ml-auto flex items-center gap-2">
                                    <button className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                                        <Search size={16} />
                                    </button>
                                    <button className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                                        <Settings size={16} />
                                    </button>
                                    <button className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                                        <UserIcon size={16} />
                                    </button>
                                    <button className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                                        <MoreHorizontal size={16} />
                                    </button>
                                    <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg transition-colors">
                                        Add view
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Table Header */}
                        <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-2">
                            <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                                <div className="col-span-4">Name</div>
                                <div className="col-span-2">Assignee</div>
                                <div className="col-span-2">Due date</div>
                                <div className="col-span-2">Priority</div>
                                <div className="col-span-2">Date created</div>
                            </div>
                        </div>

                        {/* Add Task Row */}
                        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded hover:border-purple-500 cursor-pointer transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Add Task"
                                    className="flex-1 bg-transparent border-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Empty State */}
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center text-sm text-gray-400">
                                No tasks yet
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <FileText size={14} />
                    Draft
                </button>
            </div>
        </div>
    )
}
