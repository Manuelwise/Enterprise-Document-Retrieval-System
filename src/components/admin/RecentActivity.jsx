import React from 'react';
import { CheckCircle, XCircle, Clock, Info } from 'lucide-react';

const statusIcons = {
  success: CheckCircle,
  error: XCircle,
  pending: Clock,
  info: Info,
};

const statusColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  pending: 'text-yellow-500',
  info: 'text-blue-500',
};

const RecentActivity = ({ activities }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {activities.map((activity) => {
          const Icon = statusIcons[activity.status] || Info;
          const iconColor = statusColors[activity.status] || 'text-gray-400';
          
          return (
            <li 
              key={activity.id} 
              className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <div className="flex items-start">
                <div className={`flex-shrink-0 mt-0.5 ${iconColor}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="ml-2 flex-1 min-w-0">
                  <p className="text-xs text-gray-900 dark:text-white truncate">
                    <span className="font-medium">{activity.user}</span>{' '}
                    <span className="text-gray-500 dark:text-gray-400">
                      {activity.action}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentActivity;