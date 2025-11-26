import React from 'react';
import PropTypes from 'prop-types';
import { format, parseISO } from 'date-fns';
import StatusBadge from './StatusBadge';

const RequestCard = ({ 
  request, 
  index,
  onSelect
}) => {
  // Format date from API response
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };

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
      className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-4 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md cursor-pointer"
      onClick={() => onSelect && onSelect(request)}
    >
      <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-900 dark:text-white">
                {typeof index === 'number' ? `${index + 1}. ` : ''}
                {request.documentTitle || 'Document Request'}
                {request._id && (
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 font-normal">
                    #{request._id.slice(-6).toUpperCase()}
                  </span>
                )}
              </span>
              <StatusBadge 
                status={status}
                className="ml-2"
              />
            </div>
            
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <p>
                <span className="font-medium text-gray-900 dark:text-gray-100">Requested by:</span>{' '}
                {request.officerName || 'N/A'}
              </p>
              <p>
                <span className="font-medium text-gray-900 dark:text-gray-100">Department:</span>{' '}
                {request.department || 'N/A'}
              </p>
              {/* <p>
                <span className="font-medium text-gray-900 dark:text-gray-100">Request Date:</span>{' '}
                {formatDate(request.requestDate)}
              </p> */}
              {/* {request.approved_rejectedDate && (
                <p>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {status === 'approved' ? 'Approved' : 'Rejected'} Date:
                  </span>{' '}
                  {formatDate(request.approved_rejectedDate)}
                </p>
              )} */}
              {/* <p className="truncate">
                <span className="font-medium text-gray-900 dark:text-gray-100">Supervisor:</span>{' '}
                {request.supervisorName?.trim() || 'N/A'}
              </p> */}
              {/* <p className="truncate">
                <span className="font-medium text-gray-900 dark:text-gray-100">Email:</span>{' '}
                {request.email || 'N/A'}
              </p> */}
              {request.documentType && (
                <p>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Document Type:</span>{' '}
                  {request.documentType.charAt(0).toUpperCase() + request.documentType.slice(1)}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex-shrink-0 ml-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
              {request.requestDate && format(new Date(request.requestDate), 'PP')}
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
    email: PropTypes.string,
    department: PropTypes.string,
    supervisorName: PropTypes.string,
    status: PropTypes.string,
    completionStatus: PropTypes.string,
    requestDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    approved_rejectedDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    attachments: PropTypes.array
  }).isRequired,
  index: PropTypes.number,
  onSelect: PropTypes.func.isRequired
};

export default RequestCard;