import React from 'react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { color: 'yellow', text: 'Pending' },
    approved: { color: 'green', text: 'Approved' },
    rejected: { color: 'red', text: 'Rejected' },
    dispatched: { color: 'blue', text: 'Dispatched' },
    returned: { color: 'purple', text: 'Returned' }
  };

  const { color, text } = statusConfig[status] || { color: 'gray', text: status };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 dark:bg-${color}-900/30 text-${color}-800 dark:text-${color}-200`}>
      {text}
    </span>
  );
};

export default StatusBadge;
