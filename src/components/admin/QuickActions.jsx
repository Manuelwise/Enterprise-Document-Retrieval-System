import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Users, MessageSquare, ChevronDown, Loader2 } from 'lucide-react';

const QuickActions = ({ 
  request, 
  onAction, 
  dispatchOfficers = [],
  currentStatus = 'pending'
}) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset form when request changes
  useEffect(() => {
    resetForm();
  }, [request?._id]);

  const handleAction = async (action) => {
    if (action === 'approve' && !selectedOfficer && dispatchOfficers.length > 0) {
      setError('Please select a dispatch officer');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onAction({
        action,
        requestId: request._id || request.id,
        dispatchOfficerId: selectedOfficer,
        reason: reason.trim() || undefined
      });
      resetForm();
    } catch (err) {
      console.error('Error performing action:', err);
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedOfficer('');
    setReason('');
    setIsApproving(false);
    setIsRejecting(false);
    setError(null);
  };

  const canApprove = ['pending', 'in-progress'].includes(currentStatus);
  const canReject = ['pending', 'in-progress'].includes(currentStatus);

  if (!canApprove && !canReject) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
        No actions available for this status
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
          {error}
        </div>
      )}

      {!isApproving && !isRejecting ? (
        <div className="flex flex-wrap gap-2">
          {canApprove && (
            <button
              onClick={() => {
                setIsApproving(true);
                setIsRejecting(false);
              }}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-1" />
              )}
              Approve
            </button>
          )}
          
          {canReject && (
            <button
              onClick={() => {
                setIsRejecting(true);
                setIsApproving(false);
              }}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4 mr-1" />
              )}
              Reject
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {isApproving && (
            <div className="space-y-2">
              {dispatchOfficers.length > 0 && (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Assign to Officer
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    value={selectedOfficer}
                    onChange={(e) => {
                      setSelectedOfficer(e.target.value);
                      setError(null);
                    }}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    disabled={isLoading}
                  >
                    <option value="">Select Dispatch Officer</option>
                    {dispatchOfficers.map((officer) => (
                      <option key={officer._id || officer.id} value={officer._id || officer.id}>
                        {officer.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="space-y-1">
                <label htmlFor="approval-notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notes (optional)
                </label>
                <textarea
                  id="approval-notes"
                  rows={2}
                  className="mt-1 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={isLoading}
                  placeholder="Add any additional notes about this approval..."
                />
              </div>
              
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => handleAction('approve')}
                  disabled={isLoading || (dispatchOfficers.length > 0 && !selectedOfficer)}
                  className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    (isLoading || (dispatchOfficers.length > 0 && !selectedOfficer))
                      ? 'bg-green-400 dark:bg-green-500 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-1" />
                  )}
                  Confirm Approval
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isLoading}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {isRejecting && (
            <div className="space-y-2">
              <div className="space-y-1">
                <label htmlFor="reject-reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Reason for rejection
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  id="reject-reason"
                  rows={3}
                  className="mt-1 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    setError(null);
                  }}
                  disabled={isLoading}
                  placeholder="Please provide a reason for rejection"
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => handleAction('reject')}
                  disabled={isLoading || !reason.trim()}
                  className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    isLoading || !reason.trim()
                      ? 'bg-red-400 dark:bg-red-500 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-1" />
                  )}
                  Confirm Rejection
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isLoading}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuickActions;
