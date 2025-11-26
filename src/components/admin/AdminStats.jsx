import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const AdminStats = ({ stats = [] }) => {
  // Helper function to format the value based on the stat name
  const formatValue = (stat) => {
    // If value is already a string, return it directly
    if (typeof stat.value === 'string') {
      return stat.value;
    }
    
    // For numeric values, convert to string
    if (typeof stat.value === 'number') {
      return stat.value.toString();
    }
    
    // For undefined or null values, return '0'
    return '0';
  };

  // Helper to determine if the change is positive or negative
  const getChangeType = (change) => {
    if (change === undefined || change === null) return 'neutral';
    
    const changeStr = String(change);
    if (changeStr.startsWith('+') || changeStr === '0%') {
      return 'increase';
    } else if (changeStr.startsWith('-')) {
      return 'decrease';
    }
    return 'neutral';
  };

  // Get the appropriate icon color based on the stat type
  const getIconBgColor = (statName) => {
    switch(statName) {
      case 'Pending Requests':
        return 'bg-yellow-500';
      case 'Approved Requests':
        return 'bg-green-500';
      case 'Rejected Requests':
        return 'bg-red-500';
      case 'Dispatched Requests':
        return 'bg-blue-500';
      case 'Returned Requests':
        return 'bg-purple-500';
      case 'Total Requests':
        return 'bg-indigo-500';
      case 'Users':
        return 'bg-pink-500';
      case 'Avg. Response Time':
        return 'bg-cyan-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const changeType = getChangeType(stat.change);
          const iconBgColor = getIconBgColor(stat.name);
          const displayValue = formatValue(stat);
          
          return (
            <div
              key={stat.name || index}
              className="relative bg-white dark:bg-gray-800 pt-5 px-4 pb-6 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700"
            >
              <dt className="flex flex-col">
                <div className={`absolute ${iconBgColor} rounded-md p-3`}>
                  {stat.icon && (
                    <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  )}
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 dark:text-gray-300 truncate">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 pb-2 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {displayValue}
                </p>
                {stat.change !== undefined && stat.change !== '0%' && (
                  <div className="ml-2">
                    <p
                      className={`inline-flex items-baseline px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        changeType === 'increase' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : changeType === 'decrease'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {changeType === 'increase' ? (
                        <ArrowUpRight className="-ml-1 mr-0.5 flex-shrink-0 self-center h-3 w-3" />
                      ) : changeType === 'decrease' ? (
                        <ArrowDownRight className="-ml-1 mr-0.5 flex-shrink-0 self-center h-3 w-3" />
                      ) : null}
                      <span className="sr-only">
                        {changeType === 'increase' ? 'Increased' : changeType === 'decrease' ? 'Decreased' : 'No change'}{' '}
                        by
                      </span>
                      {stat.change}
                    </p>
                  </div>
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
};

export default AdminStats;