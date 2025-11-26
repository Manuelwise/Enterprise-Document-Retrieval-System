import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import RequestModal from '../components/RequestModal';  // Update the path as needed
import adminAPI from '../services/adminAPI';
import { 
  Users, 
  FileText, 
  BarChart2,
  CheckCircle,
  AlertCircle,
  ListChecks,
  Clock,
  Activity,
  Edit,
  Truck,
  RefreshCw,
  Trash2,
  LogIn,
  XCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminStats from '../components/admin/AdminStats';
import RecentActivity from '../components/admin/RecentActivity';
import RequestCard from '../components/admin/RequestCard';

const AdminDashboard = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const [recentRequests, setRecentRequests] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  
  const [stats, setStats] = useState([
    { name: 'Total Requests', value: '0', change: '+0%', changeType: 'increase', icon: FileText },
    { name: 'Pending Requests', value: '0', change: '+0%', changeType: 'increase', icon: Clock },
    { name: 'Approved Requests', value: '0', change: '+0%', changeType: 'increase', icon: CheckCircle },
    { name: 'Rejected Requests', value: '0', change: '+0%', changeType: 'increase', icon: XCircle },
    { name: 'Dispatched Requests', value: '0', change: '+0%', changeType: 'increase', icon: Truck },
    { name: 'Returned Requests', value: '0', change: '+0%', changeType: 'increase', icon: RefreshCw },
    { name: 'Users', value: '0', change: '+0%', changeType: 'increase', icon: Users },
    { name: 'Avg. Response Time', value: '0h', change: '-0h', changeType: 'decrease', icon: Clock },
  ]);


  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock activities data (fallback)
  const mockActivities = [
    {
      id: '1',
      user: 'System',
      action: 'system_start',
      details: 'System initialized',
      time: 'Just now',
      status: 'info',
      icon: Activity
    },
    {
      id: '2',
      user: user?.name || 'Admin',
      action: 'user_login',
      details: 'User logged in',
      time: '2m ago',
      status: 'success',
      icon: LogIn
    }
  ];

 // Fetch all necessary data on component mount
  useEffect(() => {
  
const fetchDashboardData = async () => {
  try {
    setIsLoading(true);
    
    // Fetch all data in parallel
    const [
      usersResponse,
      sessionsResponse,
      activitiesResponse,
      requestCounts,
      recentRequestsResponse
    ] = await Promise.all([
      adminAPI.getAllUsers().catch(e => {
        console.error('Error fetching users:', e);
        return { data: [] };
      }),
      adminAPI.getActiveSessions().catch(e => {
        console.error('Error fetching sessions:', e);
        return { count: 0 };
      }),
      adminAPI.getActivities(5).catch(e => {
       console.error('Error fetching activities:', e);
       return { data: [] }; // Return empty array if there's an error
       }),
      // Get all request counts in a single call
      adminAPI.getRequestCounts().catch(e => {
        console.error('Error fetching request counts:', e);
        return {
          pending: 0,
          approved: 0,
          rejected: 0,
          dispatched: 0,
          returned: 0
        };
      }),
      adminAPI.getRecords().catch(e => {
        console.error('Error fetching recent requests:',e);
        return {data:[]};
      })
    ]);

   // Update stats with the counts
    setStats([
      { 
        name: 'Total Requests',
        value: (requestCounts.pending + requestCounts.approved + requestCounts.rejected).toString(),
        change: '0%',
        changeType: 'increase',
        icon: FileText
      },
      { 
        name: 'Pending Requests',
        value: requestCounts.pending.toString(),
        change: '0%',
        changeType: 'increase',
        icon: Clock
      },
      { 
        name: 'Approved Requests',
        value: requestCounts.approved.toString(),
        change: '0%',
        changeType: 'increase',
        icon: CheckCircle
      },
      { 
        name: 'Rejected Requests',
        value: requestCounts.rejected.toString(),
        change: '0%',
        changeType: 'increase',
        icon: XCircle
      },
      { 
        name: 'Dispatched Requests',
        value: requestCounts.dispatched.toString(),
        change: '0%',
        changeType: 'increase',
        icon: Truck
      },
      { 
        name: 'Returned Requests',
        value: requestCounts.returned.toString(),
        change: '0%',
        changeType: 'increase',
        icon: RefreshCw
      },
      { 
        name: 'Users',
        value: usersResponse.data?.length?.toString() || '0',
        change: '0%',
        changeType: 'increase',
        icon: Users
      },
      { 
        name: 'Avg. Response Time',
        value: '0h',
        change: '0h',
        changeType: 'decrease',
        icon: Clock
      }
    ]);

    // After setting the stats, update recentRequests
    if (recentRequestsResponse && recentRequestsResponse.data) {
      setRecentRequests(recentRequestsResponse.data);
    }

    // Process activities
    const activities = activitiesResponse.data || [];
    const formattedActivities = activities.map(activity => ({
      id: activity._id || Math.random().toString(36).substr(2, 9),
      user: activity.userId?.name || 'System',
      action: activity.action || 'Unknown action',
      details: activity.details || '',
      time: formatTimeAgo(activity.createdAt),
      status: getActivityStatus(activity.action),
      icon: getActivityIcon(activity.action)
    }));

    setRecentActivity(formattedActivities.length > 0 ? formattedActivities : mockActivities);

  } catch (error) {
    console.error('Error in dashboard data processing:', error);
    setError('Some dashboard data could not be loaded');
    toast.error('Some dashboard data could not be loaded');
  } finally {
    setIsLoading(false);
  }
};

    fetchDashboardData();
  }, [user?.name]); // Add user.name as dependency

// Helper functions
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval}y ago`;
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval}mo ago`;
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval}d ago`;
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval}h ago`;
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval}m ago`;
  
  return 'Just now';
};

const getActivityIcon = (action) => {
  if (!action) return Activity;
  
  const actionLower = action.toLowerCase();
  
  if (actionLower.includes('login') || actionLower.includes('logout')) return LogIn;
  if (actionLower.includes('create')) return FileText;
  if (actionLower.includes('update') || actionLower.includes('edit')) return Edit;
  if (actionLower.includes('delete') || actionLower.includes('remove')) return Trash2;
  if (actionLower.includes('approve') || actionLower.includes('success')) return CheckCircle;
  if (actionLower.includes('reject') || actionLower.includes('deny')) return XCircle;
  
  return Activity;
};

const getActivityStatus = (action) => {
  if (!action) return 'info';
  
  const actionLower = action.toLowerCase();
  
  // Map common action types to statuses
  if (actionLower.includes('error') || actionLower.includes('fail')) return 'error';
  if (actionLower.includes('login') || actionLower.includes('approve') || actionLower.includes('success')) return 'success';
  if (actionLower.includes('delete') || actionLower.includes('reject')) return 'error';
  if (actionLower.includes('create') || actionLower.includes('update')) return 'info';
  
  return 'info';
};


  // Quick actions for the dashboard
  const quickActions = [
    { 
      title: 'Users', 
      description: 'Manage user accounts', 
      icon: Users,
      href: '/admin/users',
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/30'
    },
    { 
      title: 'Reports', 
      description: 'View and generate reports', 
      icon: BarChart2,
      href: '/admin/reports',
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/30'
    },
    { 
      title: 'Activities', 
      description: 'View system activities', 
      icon: ListChecks,
      href: '/admin/activities',
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/30'
    },
    { 
    title: 'All Requests', 
    description: 'View all document requests', 
    icon: FileText,
    href: '/admin/requests',
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/30'
  }
  ];


const handleSelectRequest = (request) => {
  setSelectedRequest(request);
  setIsModalOpen(true);
};



  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex flex-1 overflow-hidden">

        {/* Main content */}
        <main className="flex-1 overflow-y-auto focus:outline-none bg-gray-50 dark:bg-gray-900">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
               
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
              {/* Stats */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <AdminStats stats={stats} />
              </div>
              {/* Dashboard Actions */}
              <div className="mt-6">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {quickActions.map((action, index) => (
                        <Link
                          key={index}
                          to={action.href}
                          className={`p-4 rounded-lg ${action.bgColor} hover:opacity-90 transition-opacity`}
                        >
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${action.iconColor} bg-opacity-20`}>
                              <action.icon className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                              <h3 className="text-sm font-medium text-gray-900 dark:text-white">{action.title}</h3>
                              <p className="text-xs text-gray-500 dark:text-gray-300">{action.description}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Main Content */}
              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Recent Requests */}
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Requests</h2>
                    </div>
                    <div className="p-6">
                      {isLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                        </div>
                      ) : recentRequests.length > 0 ? (
                        <div className="space-y-4">
                          {recentRequests.map((request, index) => (
                           <RequestCard
                            key={request._id || index}
                            request={request}
                            index={index}
                            onSelect={handleSelectRequest}
                          />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500 dark:text-gray-400">No recent requests found.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {isModalOpen && selectedRequest && (
                  <RequestModal 
                    request={selectedRequest} 
                    onClose={() => {
                      setIsModalOpen(false);
                      setSelectedRequest(null);
                    }} 
                  />
                )}

                {/* Recent Activity */}
                <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden h-full">
                    <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
                    </div>
                    <div className="p-6">
                      {recentActivity.length > 0 ? (
                        <RecentActivity activities={recentActivity.slice(0, 5)} />
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                          No recent activities
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;