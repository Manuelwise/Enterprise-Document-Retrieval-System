import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import StatusBadge from './StatusBadge';

const RequestCard = ({ 
  request, 
  index,
  onSelect
}) => {
  // Get request status with fallback
  const getStatus = () => {
    if (request.status) return request.status.toLowerCase();
    if (request.completionStatus) {
      return request.completionStatus === 'dispatched' ? 'dispatched' :
             request.completionStatus === 'returned' ? 'returned' :
             'pending';
    }
    return 'pending';
  };

  const status = getStatus();

    return (
    <div 
      className="surface rounded-lg shadow overflow-hidden mb-3 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md cursor-pointer"
      onClick={() => onSelect && onSelect(request)}
    >
      <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-gray-900 dark:text-white truncate">
                {typeof index === 'number' ? `${index + 1}. ` : ''}
                {request.documentTitle || 'Document Request'}
              </span>
              <StatusBadge 
                status={status}
                size="sm"
              />
            </div>
            
            <div className="mt-1 text-xs text-gray-600 dark:text-gray-300 space-y-0.5">
              <p className="truncate">
                <span className="font-medium text-gray-900 dark:text-gray-100">By:</span>{' '}
                {request.officerName || 'N/A'}
                {request.department && ` • ${request.department}`}
              </p>
              {request.documentType && (
                <p className="truncate">
                  <span className="font-medium text-gray-900 dark:text-gray-100">Type:</span>{' '}
                  {request.documentType.charAt(0).toUpperCase() + request.documentType.slice(1)}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex-shrink-0 ml-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {request.requestDate && format(new Date(request.requestDate), 'MMM d')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

RequestCard.propTypes = {
  request: PropTypes.shape({
    _id: PropTypes.string,
    documentTitle: PropTypes.string,
    documentType: PropTypes.string,
    officerName: PropTypes.string,
    department: PropTypes.string,
    status: PropTypes.string,
    completionStatus: PropTypes.string,
    requestDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  }).isRequired,
  index: PropTypes.number,
  onSelect: PropTypes.func.isRequired
};

export default RequestCard;