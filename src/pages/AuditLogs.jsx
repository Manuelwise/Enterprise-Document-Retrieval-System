import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import Pagination from '../components/Pagination';
import RequestModalAudit from '../components/RequestModalAudit';
import { Link, useNavigate } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  FiArrowLeft, 
  FiClock, 
  FiFileText, 
  FiUser, 
  FiSearch, 
  FiFilter,
  FiChevronDown,
  FiCalendar,
  FiInfo,
  FiAlertCircle
} from 'react-icons/fi';

const AuditLogs = () => {
    const { token } = useAuth();
    const { userId, username } = useUser();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        action: '',
        dateRange: 'all',
        sortBy: 'newest'
    });

    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 10;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchLogsForUser = async () => {
            if (!userId) {
                setError('User ID is required');
                setLoading(false);
                return;
            }
            
            try {
                const response = await axios.get(`http://localhost:5000/api/activity/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                if (response.data?.success && Array.isArray(response.data.data)) {
                    setLogs(response.data.data);
                } else {
                    throw new Error('Invalid response format from server');
                }
            } catch (err) {
                console.error('Failed to fetch activity logs:', err);
                setError(err.response?.data?.message || 'Failed to fetch activity logs. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchLogsForUser();
    }, [userId, token]);

    const filteredLogs = logs
        .filter(log => {
            const matchesSearch = 
                log.documentTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.userId?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = !filters.action || log.action === filters.action;
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => 
            filters.sortBy === 'newest' 
                ? new Date(b.createdAt) - new Date(a.createdAt)
                : new Date(a.createdAt) - new Date(b.createdAt)
        );

    const totalFilteredPages = Math.ceil(filteredLogs.length / logsPerPage);
    const startIndex = (currentPage - 1) * logsPerPage;
    const currentLogs = filteredLogs.slice(startIndex, startIndex + logsPerPage);

    const getActionColor = (action) => {
        const colors = {
            create: theme === 'dark' ? 'bg-green-900/30 text-green-200' : 'bg-green-100 text-green-800',
            update: theme === 'dark' ? 'bg-blue-900/30 text-blue-200' : 'bg-blue-100 text-blue-800',
            delete: theme === 'dark' ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-800',
            approve: theme === 'dark' ? 'bg-purple-900/30 text-purple-200' : 'bg-purple-100 text-purple-800',
            reject: theme === 'dark' ? 'bg-orange-900/30 text-orange-200' : 'bg-orange-100 text-orange-800',
        };
        return colors[action?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    const actionTypes = [...new Set(logs.map(log => log.action))];

    const LoadingIndicator = () => (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="animate-pulse space-y-6">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-24 bg-white dark:bg-gray-800 rounded-lg shadow p-6"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const ErrorIndicator = () => (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-8">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                <FiAlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Logs</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    Retry
                </button>
            </div>
        </div>
    );

    if (loading) return <LoadingIndicator />;
    if (error) return <ErrorIndicator />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                            aria-label="Go back"
                        >
                            <FiArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Activity Logs</h1>
                            <p className="mt-1 text-gray-600 dark:text-gray-400">
                                Viewing activity for {username || 'your account'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Search logs by title, action, or user..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <select
                                    className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg pl-3 pr-10 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={filters.action}
                                    onChange={(e) => setFilters({...filters, action: e.target.value})}
                                >
                                    <option value="">All Actions</option>
                                    {actionTypes.map((action) => (
                                        <option key={action} value={action} className="bg-white dark:bg-gray-700">
                                            {action.charAt(0).toUpperCase() + action.slice(1).replace('_', ' ')}
                                        </option>
                                    ))}
                                </select>
                                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                            <div className="relative">
                                <select
                                    className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg pl-3 pr-10 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={filters.sortBy}
                                    onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                </select>
                                <FiCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                            <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Logs</div>
                            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{logs.length}</div>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                            <div className="text-sm font-medium text-green-800 dark:text-green-200">Actions Today</div>
                            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                                {logs.filter(log => 
                                    new Date(log.createdAt).toDateString() === new Date().toDateString()
                                ).length}
                            </div>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                            <div className="text-sm font-medium text-purple-800 dark:text-purple-200">Unique Users</div>
                            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                {new Set(logs.map(log => log.userId)).size}
                            </div>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg">
                            <div className="text-sm font-medium text-amber-800 dark:text-amber-200">Showing</div>
                            <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                                {currentLogs.length} of {filteredLogs.length}
                            </div>
                        </div>
                    </div>

                    {/* Logs List */}
                    <div className="space-y-4">
                        {currentLogs.length === 0 ? (
                            <div className="text-center py-12">
                                <FiInfo className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No activity logs found</h3>
                                <p className="mt-1 text-gray-500 dark:text-gray-400">
                                    {searchTerm || filters.action ? 'Try adjusting your search or filter' : 'No activity logs available yet'}
                                </p>
                            </div>
                        ) : (
                            currentLogs.map((log, index) => (
                                <div 
                                    key={index}
                                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 overflow-hidden"
                                    onClick={() => setSelectedRequest(log.requestId)}
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                                                        {log.action || 'Unknown Action'}
                                                    </span>
                                                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                                        {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <h3 className="mt-2 text-base font-medium text-gray-900 dark:text-white truncate">
                                                    {log.documentTitle || 'Untitled Document'}
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                    {log.description || 'No additional details available'}
                                                </p>
                                            </div>
                                            <div className="ml-4 flex-shrink-0">
                                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                    <FiUser className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                                    <span className="truncate">{log.userId || 'System'}</span>
                                                </div>
                                                <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                    <FiClock className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                                    <time dateTime={log.createdAt}>
                                                        {format(new Date(log.createdAt), 'MMM d, yyyy h:mm a')}
                                                    </time>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {totalFilteredPages > 1 && (
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalFilteredPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}

                {/* Request Modal */}
                {selectedRequest && (
                    <RequestModalAudit 
                        requestId={selectedRequest} 
                        onClose={() => setSelectedRequest(null)} 
                    />
                )}
            </div>
        </div>
    );
};

// Update the getActionColor function to include dark mode variants
const getActionColor = (action) => {
    const colors = {
        create: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
        update: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
        delete: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
        approve: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
        reject: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200',
    };
    return colors[action?.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
};

export default AuditLogs;