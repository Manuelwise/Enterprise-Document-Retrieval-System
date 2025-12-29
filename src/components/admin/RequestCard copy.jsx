import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import { requestsAPI } from '../../services/api';
import StatusBadge from './StatusBadge';
import QuickActions from './QuickActions';

const RequestCard = ({ 
  request, 
  index, 
  onSelect, 
  onAction,
  dispatchOfficers = [],
  isAdmin = false,
  onUpdate
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuickAction = async (actionData) => {
    if (!request?._id) {
      console.error('No request ID found');
      return;
    }

    setIsUpdating(true);
    try {
      const { action, dispatchOfficerId, reason } = actionData;
      
      // Prepare update data based on action
      const updateData = {
        status: action === 'approve' ? 'approved' : 'rejected',
        ...(dispatchOfficerId && { assignedTo: dispatchOfficerId }),
        ...(reason && { notes: reason })
      };

      // Call the API to update the request
      const response = await requestsAPI.updateRequest(request._id, updateData);
      
      // Notify parent component of the update
      if (onUpdate) {
        onUpdate({
          ...request,
          ...response.data,
          status: updateData.status,
          updatedAt: new Date().toISOString()
        });
      }

      toast.success(`Request ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error(error.response?.data?.message || 'Failed to update request');
    } finally {
      setIsUpdating(false);
    }
  };

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
  const showActions = isAdmin && ['pending', 'in-progress'].includes(status);

  return (
    <div className="surface rounded-lg shadow overflow-hidden mb-4 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={() => onSelect && onSelect(request)}
      >
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
              <p>
                <span className="font-medium text-gray-900 dark:text-gray-100">Request Date:</span>{' '}
                {formatDate(request.requestDate)}
              </p>
              {request.approved_rejectedDate && (
                <p>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {status === 'approved' ? 'Approved' : 'Rejected'} Date:
                  </span>{' '}
                  {formatDate(request.approved_rejectedDate)}
                </p>
              )}
              {/* {request.processingNote && (
                <p className="mt-2 text-gray-500 dark:text-gray-400 italic">
                  <span className="font-medium">Note:</span> {request.processingNote}
                </p>
              )} */}
              <p className="truncate">
                <span className="font-medium text-gray-900 dark:text-gray-100">Supervisor:</span>{' '}
                {request.supervisorName?.trim() || 'N/A'}
              </p>
              <p className="truncate">
                <span className="font-medium text-gray-900 dark:text-gray-100">Email:</span>{' '}
                {request.email || 'N/A'}
              </p>
              {/* {request.documentReference && (
                <p>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Reference:</span>{' '}
                  {request.documentReference}
                </p>
              )} */}
              {request.documentType && (
                <p>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Document Type:</span>{' '}
                  {request.documentType.charAt(0).toUpperCase() + request.documentType.slice(1)}
                </p>
              )}
              {/* {request.returnDate && request.returnDate !== '2025-08-07T22:30:00.894Z' && (
                <p className="truncate">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {status === 'returned' ? 'Returned' : 'Expected Return'} Date:
                  </span>{' '}
                  {format(new Date(request.returnDate), 'PPpp')}
                </p>
              )} */}
              {/* {request.reasonForRejection && request.reasonForRejection !== 'none' && (
                <p className="text-red-500 dark:text-red-400">
                  <span className="font-medium">Reason for Rejection:</span> {request.reasonForRejection}
                </p>
              )} */}
            </div>
          </div>
          
          <div className="flex-shrink-0 ml-4">
            {request.attachments?.length > 0 && (
              <div className="text-right mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {request.attachments.length} attachment{request.attachments.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
              {request.requestDate && format(new Date(request.requestDate), 'PP')}
            </div>
          </div>
        </div>
      </div>
      
      {showActions && (
        <div className="px-4 pb-4">
          <QuickActions 
            request={request}
            onAction={handleQuickAction}
            dispatchOfficers={dispatchOfficers}
            currentStatus={status}
          />
        </div>
      )}
    </div>
  );
};

RequestCard.propTypes = {
  request: PropTypes.shape({
    _id: PropTypes.string,
    documentTitle: PropTypes.string,
    documentReference: PropTypes.string,
    documentType: PropTypes.oneOf(['original', 'photocopy', 'scanned']),
    officerName: PropTypes.string,
    email: PropTypes.string,
    department: PropTypes.string,
    supervisorName: PropTypes.string,
    status: PropTypes.oneOf(['pending', 'approved', 'rejected']),
    completionStatus: PropTypes.oneOf(['dispatched', 'returned']),
    processingNote: PropTypes.string,
    reasonForRejection: PropTypes.string,
    requestDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    approved_rejectedDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    dispatchDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    confirmationDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    returnDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    fromDate: PropTypes.string,
    toDate: PropTypes.string,
    personalNumber: PropTypes.string,
    corporateNumber: PropTypes.string,
    additionalInfo: PropTypes.string,
    approvalOfficer: PropTypes.string,
    dispatchOfficer: PropTypes.string,
    deliveryStatus: PropTypes.string
  }).isRequired,
  index: PropTypes.number,
  onSelect: PropTypes.func,
  onAction: PropTypes.func,
  onUpdate: PropTypes.func,
  dispatchOfficers: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      id: PropTypes.string,
      name: PropTypes.string.isRequired,
      email: PropTypes.string
    })
  ),
  isAdmin: PropTypes.bool
};

RequestCard.defaultProps = {
  index: null,
  onSelect: null,
  onAction: null,
  onUpdate: null,
  dispatchOfficers: [],
  isAdmin: false
};

export default RequestCard;