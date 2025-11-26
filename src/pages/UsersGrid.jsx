import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { FiSearch, FiUser, FiMail, FiClock, FiActivity } from 'react-icons/fi';
import { format } from 'date-fns';

const UsersGrid = () => {
    const { token } = useAuth();
    const { setUserId, setUsername } = useUser();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/all-users', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const usersData = Array.isArray(response.data) ? response.data : (response.data.data || []);
                setUsers(usersData);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError(`Failed to fetch users: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token]);

    const filteredUsers = Array.isArray(users) ? users.filter(user => 
        user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.role?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const getRoleBadgeColor = (role) => {
        switch(role) {
            case 'approval_officer': return 'bg-blue-100 text-blue-800';
            case 'dispatch_officer': return 'bg-green-100 text-green-800';
            case 'admin': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-12 bg-gray-200 rounded w-1/3"></div>
                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-40 bg-white rounded-lg shadow p-6"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Users</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
                    <p className="text-gray-600">View and manage all system users and their activities</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="h-5 w-5 text-gray-400 ml-100" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Search users by name, email, or role..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="text-sm text-gray-500">
                            {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredUsers.map((user) => (
                            <Link
                                key={user._id}
                                to="/admin/audit-logs"
                                onClick={() => {
                                    setUserId(user._id);
                                    setUsername(user.username);
                                }}
                                className="group block bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <FiUser className="h-6 w-6" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-lg font-medium text-gray-900 truncate group-hover:text-blue-600">
                                                {user.username}
                                            </h3>
                                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                            {user.role.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500 space-y-2">
                                        <div className="flex items-center">
                                            <FiClock className="mr-2 h-4 w-4 text-gray-400" />
                                            <span>Joined {format(new Date(user.createdAt), 'MMM d, yyyy')}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FiActivity className="mr-2 h-4 w-4 text-gray-400" />
                                            <span>Last active: {format(new Date(user.lastActivityAt || user.updatedAt), 'MMM d, yyyy')}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12">
                            <FiUser className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchTerm ? 'Try adjusting your search' : 'No users available'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UsersGrid;