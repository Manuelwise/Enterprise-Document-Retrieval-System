// UserDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { FileText, Clock, CheckCircle, Search, Filter, RefreshCw, Eye, Play, Check } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';

// Helper function to safely format dates
const formatSafeDate = (dateValue, formatString = 'MMM dd, yyyy') => {
  try {
    if (!dateValue) return 'N/A';
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return format(date, formatString);
  } catch (error) {
    console.error('Date formatting error:', error, 'for value:', dateValue);
    return 'Invalid Date';
  }
};

const UserDashboard = () => {
  const { username, token } = useAuth();
  const { 
    approvedRequests, 
    userProcessingRequests, 
    fetchApprovedRequests, 
    fetchUserProcessingRequests,
    claimRequest,
    updateProcessingStatus 
  } = useUser();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [processingNote, setProcessingNote] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  // Initial data fetch
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(''); // Clear any previous errors
      await Promise.all([
        fetchApprovedRequests(),
        fetchUserProcessingRequests()
      ]);
      console.log('Dashboard data loaded successfully');
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard loading error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search logic
  const filteredRequests = approvedRequests.filter(request => {
    const matchesSearch = 
      request.officerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.documentTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      statusFilter === 'all' || 
      (statusFilter === 'available' && !request.claimedBy) ||
      (statusFilter === 'claimed' && request.claimedBy === username);

    return matchesSearch && matchesFilter;
  });

  // Handle request actions
  const handleClaimRequest = async (requestId) => {
    try {
      setActionLoading(requestId);
      await claimRequest(requestId);
      await loadDashboardData(); // Refresh data
    } catch (err) {
      setError('Failed to claim request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleStartProcessing = async (requestId) => {
    try {
      setActionLoading(requestId);
      await updateProcessingStatus(requestId, 'in-progress', 'Started processing request');
      await loadDashboardData();
    } catch (err) {
      setError('Failed to start processing');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompleteRequest = async () => {
    if (!selectedRequest || !processingNote.trim()) return;
    
    try {
      setActionLoading(selectedRequest._id);
      await updateProcessingStatus(
        selectedRequest._id, 
        'completed', 
        processingNote
      );
      setShowModal(false);
      setProcessingNote('');
      setSelectedRequest(null);
      await loadDashboardData();
    } catch (err) {
      setError('Failed to complete request');
    } finally {
      setActionLoading(null);
    }
  };

  const getRequestStatus = (request) => {
    if (request.processingStatus === 'completed') return { text: 'Completed', className: 'badge badge-success' };
    if (request.processingStatus === 'in-progress') return { text: 'In Progress', className: 'badge badge-info' };
    if (request.claimedBy) return { text: 'Claimed', className: 'badge badge-warning' };
    return { text: 'Available', className: 'badge' };
  };

  const getActionButton = (request) => {
    const isOwner = request.claimedBy === username;
    const isLoading = actionLoading === request._id;

    if (request.processingStatus === 'completed') {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          ✓ Completed
        </span>
      );
    }

    if (request.processingStatus === 'in-progress' && isOwner) {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedRequest(request);
            setShowModal(true);
          }}
          disabled={isLoading}
          className="btn"
          style={{ background: 'var(--success)', color: '#fff' }}
        >
          <Check size={16} />
          Mark Complete
        </button>
      );
    }

    if (request.claimedBy && isOwner) {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleStartProcessing(request._id);
          }}
          disabled={isLoading}
          className="btn btn-primary"
        >
          {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
          Start Processing
        </button>
      );
    }

    if (!request.claimedBy) {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClaimRequest(request._id);
          }}
          disabled={isLoading}
          className="btn btn-accent"
        >
          {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <FileText size={16} />}
          Claim Request
        </button>
      );
    }

    return (
      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
        Claimed by {request.claimedBy}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <RefreshCw className="animate-spin" size={24} />
          <span className="text-lg text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {username}!
          </h1>
          <p className="text-gray-600 mt-2">
            Process approved document requests and manage your workload.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-800">{error}</div>
              <button
                onClick={() => setError('')}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Debug Info - Remove this after fixing */}
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p><strong>Debug Info:</strong></p>
          <p>Approved Requests Count: {approvedRequests.length}</p>
          <p>User Processing Requests Count: {userProcessingRequests.length}</p>
          <p>Current Username: {username}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 rounded-lg">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Available Requests</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {approvedRequests.filter(r => !r.claimedBy).length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6 rounded-lg">
            <div className="flex items-center">
              <div className="p-3 bg-linear-to-r rounded-lg" style={{ background: 'linear-gradient(135deg,var(--accent),var(--primary))' }}>
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">My Claims</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {approvedRequests.filter(r => r.claimedBy === username).length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6 rounded-lg">
            <div className="flex items-center">
              <div className="p-3 bg-linear-to-r rounded-lg" style={{ background: 'linear-gradient(135deg,var(--primary),var(--accent))' }}>
                <Play className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {approvedRequests.filter(r => r.processingStatus === 'in-progress' && r.claimedBy === username).length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6 rounded-lg">
            <div className="flex items-center">
              <div className="p-3 bg-linear-to-r rounded-lg" style={{ background: 'linear-gradient(135deg,var(--accent),var(--primary))' }}>
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Completed</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {userProcessingRequests.filter(r => r.processingStatus === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <h2 className="text-xl font-semibold text-gray-900">Document Requests</h2>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Requests</option>
                  <option value="available">Available</option>
                  <option value="claimed">My Claims</option>
                </select>

                {/* Refresh Button */}
                <button
                  onClick={loadDashboardData}
                  className="btn btn-ghost flex items-center gap-2"
                >
                  <RefreshCw size={16} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Requests List */}
          <div className="divide-y divide-gray-200">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => {
                const status = getRequestStatus(request);
                return (
                  <div
                    key={request._id}
                    className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowModal(true);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {request.documentTitle || 'Untitled Document'}
                          </h3>
                          <span className={`ml-2 ${status.className}`}>
                            {status.text}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Officer:</span> {request.officerName || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Email:</span> {request.email || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Approved Date:</span> {formatSafeDate(request.returnDate)}
                          </div>
                          <div>
                            <span className="font-medium">Approved:</span> {formatSafeDate(request.updatedAt)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6">
                        {getActionButton(request)}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No approved requests are currently available for processing.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Request Detail/Completion Modal */}
        {showModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Request Details</h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedRequest(null);
                      setProcessingNote('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Officer Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRequest.officerName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRequest.email || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Document Title</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRequest.documentTitle || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Return Date</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatSafeDate(selectedRequest.returnDate)}
                      </p>
                    </div>
                  </div>

                  {selectedRequest.purpose && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Purpose</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                        {selectedRequest.purpose}
                      </p>
                    </div>
                  )}

                  {/* Show completion form only if request is in-progress and owned by user */}
                  {selectedRequest.processingStatus === 'in-progress' && 
                   selectedRequest.claimedBy === username && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Complete Request</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Processing Notes *
                        </label>
                        <textarea
                          value={processingNote}
                          onChange={(e) => setProcessingNote(e.target.value)}
                          placeholder="Enter details about how this request was processed..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={4}
                          required
                        />
                      </div>
                      
                      <div className="mt-4 flex space-x-3">
                        <button
                          onClick={handleCompleteRequest}
                          disabled={!processingNote.trim() || actionLoading}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg flex items-center space-x-2"
                        >
                          {actionLoading ? <RefreshCw size={16} className="animate-spin" /> : <Check size={16} />}
                          <span>Mark as Completed</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;