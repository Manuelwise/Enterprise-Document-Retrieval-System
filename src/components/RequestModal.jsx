import React from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';

const RequestModal = ({ request, onClose }) => {
    const getBadgeClass = (r) => {
        const s = (r && (r.completionStatus || r.status)) || '';
        if (s === 'dispatched') return 'badge badge-success';
        if (s === 'returned') return 'badge';
        if (s === 'approved') return 'badge badge-success';
        if (s === 'rejected') return 'badge badge-danger';
        return 'badge badge-warning';
    };
    if (!request) return null;

    const handleOverlayClick = (e) => {
        if (e.target.id === 'modal-overlay') {
            onClose();
        }
    };

    return (
        <div 
            id="modal-overlay"
            className="fixed inset-0 flex justify-center items-center z-50"
            style={{ background: 'rgba(2,6,23,0.56)' }}
            onClick={handleOverlayClick}
        >
            <div className="surface rounded-lg shadow-lg max-w-lg w-full p-6 relative">
                <button
                    className="absolute top-2 right-2 muted"
                    onClick={onClose}
                    style={{ background: 'transparent' }}
                >
                    <X size={24} />
                </button>

                <h2 className="text-xl font-bold mb-4">Request Details</h2>

                <div className="space-y-3 text-sm">
                    <p><strong>Requesting Officer:</strong> {request.officerName}</p>
                    <p><strong>Department:</strong> {request.department}</p>
                    <p><strong>Supervisor Name:</strong> {request.supervisorName}</p>
                    <p><strong>Document Title:</strong> {request.documentTitle}</p>
                    <p><strong>File Reference:</strong> {request.documentReference}</p>
                    <p><strong>File Date Range</strong></p>
                    <p><strong>From:</strong> {format(new Date(request.fromDate), 'dd MMM yyyy')}</p>
                    <p><strong>To:</strong> {format(new Date(request.toDate), 'dd MMM yyyy')}</p>
                    <p><strong>Document Type:</strong> {request.documentType}</p>
                    <p><strong>Corporate Contact:</strong> +233{request.corporateNumber}</p>
                    <p><strong>Personal Contact:</strong> +233{request.personalNumber}</p>
                    <p><strong>Date of Request:</strong> {format(new Date(request.returnDate), 'dd MMM yyyy')}</p>
                    <p><strong>Document Delivery Status:</strong> {request.deliveryStatus}</p>
                    <p>
                        <strong>Status:</strong>
                        <span className={`ml-2 ${getBadgeClass(request)}`}>
                            {request.status}
                        </span>
                        <span className={`ml-2 ${ request.completionStatus ? getBadgeClass({ ...request, status: request.completionStatus, completionStatus: null }) : '' }`}>
                            {request.completionStatus}
                        </span>
                    </p>
                    <p><strong>Email:</strong> {request.email}</p>
                </div>

                <div className="mt-6 text-right">
                    <button
                        onClick={onClose}
                        className="btn btn-ghost"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RequestModal;
