import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto" style={{ background: 'var(--surface)', color: 'var(--muted)' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-start">
            <div className="flex items-center space-x-3">
              <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <rect width="48" height="48" rx="8" fill="url(#g2)" />
                <path d="M14 33L24 15L34 33H14Z" fill="white" opacity="0.95" />
                <defs>
                  <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6C5CE7" />
                    <stop offset="100%" stopColor="#00BFA6" />
                  </linearGradient>
                </defs>
              </svg>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Enterprise Document Retrieval System</h3>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>Modern, secure, and auditable document access management.</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text)' }}>Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline" style={{ color: 'var(--muted)' }}>Features</a></li>
              <li><a href="#" className="hover:underline" style={{ color: 'var(--muted)' }}>Security</a></li>
              <li><a href="#" className="hover:underline" style={{ color: 'var(--muted)' }}>Pricing</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text)' }}>Contact</h3>
            <ul className="space-y-2" style={{ color: 'var(--muted)' }}>
              <li>Email: support@enterprise.local</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Enterprise Ave, Suite 100</li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-4 text-center" style={{ borderColor: 'rgba(0,0,0,0.06)', color: 'var(--muted)' }}>
          <p>&copy; {new Date().getFullYear()} Enterprise Sample Management. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

