
import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export const useRequests = () => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchRequests = useCallback(async (showLoading = true) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            if (showLoading) setIsLoading(true);
            const response = await axios.get('http://localhost:5000/api/requests', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const sortedRequests = response.data.sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setRequests(sortedRequests);
        } catch (error) {
            console.error('Error fetching requests:', error);
            setAlert({ 
                type: 'error', 
                message: error.response?.data?.message || 'Failed to fetch requests.' 
            });
        } finally {
            if (showLoading) setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchRequests(false);
    }, [fetchRequests]);

    const updateRequestStatus = useCallback(async ({ id, status, additionalInfo, reasonForRejection }) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `http://localhost:5000/api/requests/${id}`,
                { 
                    status, 
                    ...(additionalInfo && { additionalInfo }),
                    ...(reasonForRejection && { reasonForRejection }) 
                },
                { headers: { Authorization: `Bearer ${token}` }}
            );

            setAlert({ 
                type: 'success', 
                message: `Request ${status} successfully` 
            });
            fetchRequests(false);
            return true;
        } catch (error) {
            console.error('Error updating status:', error);
            setAlert({ 
                type: 'error', 
                message: error.response?.data?.message || 'Failed to update request status' 
            });
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [fetchRequests]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    return {
        requests,
        isLoading,
        alert,
        isRefreshing,
        fetchRequests,
        handleRefresh,
        updateRequestStatus,
        setAlert
    };
};