import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState(null);
    const [approvedRequests, setApprovedRequests] = useState([]);
    const [userProcessingRequests, setUserProcessingRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchApprovedRequests = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            setIsLoading(true);
            const response = await axios.get('http://localhost:5000/api/requests', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const approvedOnly = response.data.filter(request => 
                request.status === 'approved' && 
                (!request.processingStatus || request.processingStatus !== 'completed')
            );

            setApprovedRequests(approvedOnly);
        } catch (error) {
            console.error('Error fetching requests:', error);
            setApprovedRequests([]);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchUserProcessingRequests = useCallback(async () => {
        const token = localStorage.getItem('token');
        const currentUsername = localStorage.getItem('username');
        if (!token || !currentUsername) return;

        try {
            const response = await axios.get('http://localhost:5000/api/requests', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const userRequests = response.data.filter(request => 
                request.claimedBy === currentUsername
            );

            setUserProcessingRequests(userRequests);
        } catch (error) {
            console.error('Error fetching user processing requests:', error);
            setUserProcessingRequests([]);
            throw error;
        }
    }, []);

    const claimRequest = useCallback(async (requestId) => {
        const token = localStorage.getItem('token');
        const currentUsername = localStorage.getItem('username');
        if (!token || !currentUsername) return;

        try {
            await axios.patch(
                `http://localhost:5000/api/requests/${requestId}/claim`,
                { claimedBy: currentUsername },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setApprovedRequests(prev => 
                prev.map(request => 
                    request._id === requestId 
                        ? { ...request, claimedBy: currentUsername }
                        : request
                )
            );
        } catch (error) {
            console.error('Error claiming request:', error);
            try {
                await axios.patch(
                    `http://localhost:5000/api/requests/${requestId}`,
                    { claimedBy: currentUsername },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setApprovedRequests(prev => 
                    prev.map(request => 
                        request._id === requestId 
                            ? { ...request, claimedBy: currentUsername }
                            : request
                    )
                );
            } catch (fallbackError) {
                console.error('Fallback claim request also failed:', fallbackError);
                throw fallbackError;
            }
        }
    }, []);

    const updateProcessingStatus = useCallback(async (requestId, status, notes) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await axios.patch(
                `http://localhost:5000/api/requests/${requestId}/processing`,
                { 
                    processingStatus: status,
                    processingNotes: notes,
                    processedAt: new Date().toISOString()
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updateRequest = (request) => 
                request._id === requestId 
                    ? { 
                        ...request, 
                        processingStatus: status,
                        processingNotes: notes,
                        processedAt: new Date().toISOString()
                    }
                    : request;

            setApprovedRequests(prev => prev.map(updateRequest));
            setUserProcessingRequests(prev => prev.map(updateRequest));
        } catch (error) {
            console.error('Error updating processing status:', error);
            try {
                await axios.patch(
                    `http://localhost:5000/api/requests/${requestId}`,
                    { 
                        processingStatus: status,
                        processingNotes: notes,
                        processedAt: new Date().toISOString()
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const updateRequest = (request) => 
                    request._id === requestId 
                        ? { 
                            ...request, 
                            processingStatus: status,
                            processingNotes: notes,
                            processedAt: new Date().toISOString()
                        }
                        : request;

                setApprovedRequests(prev => prev.map(updateRequest));
                setUserProcessingRequests(prev => prev.map(updateRequest));
            } catch (fallbackError) {
                console.error('Fallback processing status update also failed:', fallbackError);
                throw fallbackError;
            }
        }
    }, []);

    const refreshData = useCallback(async () => {
        await Promise.all([
            fetchApprovedRequests(),
            fetchUserProcessingRequests()
        ]);
    }, [fetchApprovedRequests, fetchUserProcessingRequests]);

    return (
        <UserContext.Provider value={{ 
            userId, 
            setUserId, 
            username, 
            setUsername,
            approvedRequests,
            userProcessingRequests,
            isLoading,
            fetchApprovedRequests,
            fetchUserProcessingRequests,
            claimRequest,
            updateProcessingStatus,
            refreshData
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);