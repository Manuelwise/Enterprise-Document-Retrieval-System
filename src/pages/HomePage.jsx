import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Shield, Clock } from 'lucide-react';
import featureImage from '../assets/image/dashboard2.webp';

const FeatureCard = ({ Icon, title, description }) => (
  <div className="p-6 rounded-xl surface transition-transform transform hover:-translate-y-1 hover:elevated cursor-pointer">
    <div className="flex items-center justify-center w-12 h-12 rounded-lg mb-4" style={{ background: 'linear-gradient(135deg,var(--primary),var(--accent))' }}>
      <Icon size={20} color="#fff" />
    </div>
    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>{title}</h3>
    <p className="text-sm" style={{ color: 'var(--muted)' }}>{description}</p>
  </div>
);

const HomePage = () => {
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);
  const heroRef = useRef(null);
  const heroTextRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      // Slight parallax effect: move image proportionally but more gently than scroll
      const y = window.scrollY;
      setOffset(-y * 0.12);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-transparent to-transparent">
      {/* Hero */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="max-w-2xl" ref={heroTextRef} style={{ transform: `translate3d(0, ${offset * 0.2}px, 0)` }}>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ color: 'var(--text)' }}>Take control of file access with secure requests and auditable workflows</h1>
              <p className="text-lg mb-8 muted" style={{ color: 'var(--muted)' }}>Enterprise-ready document request management: role-based permissions, audit trails, and fast approvals for compliant teams.</p>

              <div className="flex items-center gap-3 md:sticky md:top-24 sticky-cta">
                <button onClick={() => navigate('/request')} className="btn btn-primary">
                  Request Files
                </button>
                <button onClick={() => navigate('/admin/login')} className="btn btn-ghost">
                  Admin Login
                </button>
              </div>

              <div className="mt-8 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-3">
                  <div className="kbd">SLA</div>
                  <div className="text-sm muted"><strong>24-48h</strong> for typical approvals</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="kbd">Audit</div>
                  <div className="text-sm muted"><strong>Full trace</strong> of requests & downloads</div>
                </div>
              </div>
            </div>

            <div ref={heroRef} className="hidden md:block">
              <div className="surface p-6 rounded-2xl elevated overflow-hidden" style={{ height: 360 }}>
                <img src={featureImage} alt="dashboard preview" className="rounded-lg shadow-md w-full object-cover hero-img" style={{ transform: `translate3d(0, ${offset}px, 0)` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--text)' }}>Core Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard Icon={FileText} title="Simple Requests" description="A minimal request flow that reduces friction and speeds approvals." />
            <FeatureCard Icon={Shield} title="Enterprise Security" description="Role-based access and auditable trails for compliance." />
            <FeatureCard Icon={Clock} title="Fast Processing" description="Optimized queues and notifications to keep workloads moving." />
          </div>
          <div className="mt-8 text-center">
            <div className="text-sm muted mb-4">Trusted by</div>
            <div className="flex items-center justify-center gap-4">
              <div className="surface rounded-lg px-4 py-2">Acme</div>
              <div className="surface rounded-lg px-4 py-2">Bridge</div>
              <div className="surface rounded-lg px-4 py-2">GlobalCo</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-semibold text-center mb-6" style={{ color: 'var(--text)' }}>How it works</h2>
          <ol className="space-y-4 text-sm" style={{ color: 'var(--muted)' }}>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center surface">1</div>
              <div>
                <div className="font-semibold">Submit</div>
                <div className="text-sm">Fill a concise form describing the documents and purpose of the document being requested.</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center surface">2</div>
              <div>
                <div className="font-semibold">Processing</div>
                <div className="text-sm">Team reviews requests and processes with clear actions and notes.</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center surface">3</div>
              <div>
                <div className="font-semibold">Access Granted</div>
                <div className="text-sm">Receive notification when your request is approved and access your requested files.</div>
              </div>
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
