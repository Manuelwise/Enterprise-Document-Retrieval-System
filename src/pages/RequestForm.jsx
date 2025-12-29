import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const Input = ({ label, children, error }) => (
  <div>
    <label className="block mb-2 font-medium" style={{ color: 'var(--text)' }}>{label}</label>
    {children}
    {error && <div className="text-sm mt-1" style={{ color: 'var(--danger)' }}>{error}</div>}
  </div>
);

const RequestForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [formData, setFormData] = useState(null);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    watch,
    formState: { errors }
  } = useForm({ mode: 'onTouched' });
  const watched = watch();

  const months = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' },
    { value: '03', label: 'March' }, { value: '04', label: 'April' },
    { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' },
    { value: '09', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];

  const years = Array.from({ length: 70 }, (_, i) => ({
    value: new Date().getFullYear() - i,
    label: new Date().getFullYear() - i
  }));

  const validateStep = async (activeStep) => {
    if (activeStep === 1) {
      return await trigger(['officerName', 'email', 'supervisorName', 'department']);
    }
    if (activeStep === 2) {
      return await trigger(['documentTitle', 'documentType', 'fromMonth', 'fromYear', 'toMonth', 'toYear']);
    }
    return true;
  };

  const onSubmit = (data) => {
    if (!data.fromMonth || !data.fromYear || !data.toMonth || !data.toYear) {
      setSubmitStatus('error');
      return;
    }
    const fromDate = `${data.fromYear}-${data.fromMonth}-01`;
    const toDate = `${data.toYear}-${data.toMonth}-01`;
    const finalData = { ...data, fromDate, toDate };
    setFormData(finalData);
    setIsConfirming(true);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/requests/request', formData);
      setSubmitStatus('success');
      await new Promise(resolve => setTimeout(resolve, 700));
      reset();
    } catch (error) {
      setSubmitStatus('error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setIsConfirming(false);
    }
  };

  return (
    <div className="min-h-screen py-12 subtle-page-bg">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="lg:col-span-2 surface rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>Request File Access</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>Fill out the form below to request access to organizational documents. Fields marked * are required.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button type="button" onClick={async () => { if (await validateStep(1)) setStep(1); }} className={`kbd ${step === 1 ? 'elevated' : ''}`}>1</button>
                <div className="text-sm muted">Details</div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={async () => { if (await validateStep(1)) setStep(2); }} className={`kbd ${step === 2 ? 'elevated' : ''}`}>2</button>
                <div className="text-sm muted">Document</div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={async () => { if (await validateStep(2)) setStep(3); }} className={`kbd ${step === 3 ? 'elevated' : ''}`}>3</button>
                <div className="text-sm muted">Review</div>
              </div>
            </div>
            <div className="md:col-span-2">
                <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-linear-to-r gradient-primary" style={{ width: `${(step / 3) * 100}%` }}></div>
              </div>
            </div>
            <div className="md:col-span-2" style={{ display: step === 1 ? 'block' : 'none' }}>
              <Input label="Officer Name *" error={errors.officerName?.message}>
                <input {...register('officerName', { required: 'Officer name is required' })} className="w-full p-3 rounded border" />
              </Input>
            </div>

            <div style={{ display: step === 1 ? 'none' : (step === 2 ? 'block' : 'none') }}>
              <Input label="Email *" error={errors.email?.message}>
                <input type="email" {...register('email', { required: 'Email required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' } })} className="w-full p-3 rounded border" />
              </Input>
            </div>

            <div>
              <Input label="Supervisor Name *" error={errors.supervisorName?.message}>
                <input {...register('supervisorName', { required: 'Supervisor required' })} className="w-full p-3 rounded border" />
              </Input>
            </div>

            <div>
              <Input label="Department *" error={errors.department?.message}>
                <select {...register('department', { required: 'Department required' })} className="w-full p-3 rounded border bg-transparent">
                  <option value="">Select Department</option>
                  <option>R&D</option>
                  <option>Works</option>
                  <option>Finance</option>
                  <option>Human Resources</option>
                  <option>IT</option>
                  <option>Geology</option>
                  <option>Geophysics</option>
                  <option>Legal</option>
                  <option>Engineering</option>
                  <option>Corporate Finance</option>
                  <option>Safety</option>
                </select>
              </Input>
            </div>

            <div className="md:col-span-2" style={{ display: step === 3 ? 'block' : 'none' }}>
              <Input label="Document Title *" error={errors.documentTitle?.message}>
                <input {...register('documentTitle', { required: 'Document title is required' })} className="w-full p-3 rounded border" />
              </Input>
            </div>

            <div className="md:col-span-2">
              <Input label="Document Reference / Additional Info" error={errors.documentReference?.message}>
                <textarea {...register('documentReference')} className="w-full p-3 rounded border h-28" />
              </Input>
            </div>

            <div>
              <Input label="Document Type *" error={errors.documentType?.message}>
                <select {...register('documentType', { required: 'Select a type' })} className="w-full p-3 rounded border bg-transparent">
                  <option value="">Select Document Type</option>
                  <option value="original">Original Document</option>
                  <option value="scanned">Scanned Copy</option>
                  <option value="photocopy">Photocopy</option>
                </select>
              </Input>
            </div>

            <div>
              <Input label="File Date Range *">
                <div className="flex gap-2">
                  <select {...register('fromMonth')} className="w-1/2 p-3 rounded border bg-transparent">
                    <option value="">From Month</option>
                    {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                  <select {...register('fromYear')} className="w-1/2 p-3 rounded border bg-transparent">
                    <option value="">From Year</option>
                    {years.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
                  </select>
                </div>
                <div className="flex gap-2 mt-2">
                  <select {...register('toMonth')} className="w-1/2 p-3 rounded border bg-transparent">
                    <option value="">To Month</option>
                    {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                  <select {...register('toYear')} className="w-1/2 p-3 rounded border bg-transparent">
                    <option value="">To Year</option>
                    {years.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
                  </select>
                </div>
              </Input>
            </div>

            <div>
              <Input label="Corporate Contact *" error={errors.corporateNumber?.message}>
                <div className="flex">
                  <span className="p-3 rounded-l border bg-transparent">+233</span>
                  <input {...register('corporateNumber', { required: 'Required', pattern: { value: /^\d{9}$/, message: 'Enter 9 digits' } })} maxLength={9} className="w-full p-3 rounded-r border" placeholder="123456789" />
                </div>
              </Input>
            </div>

            <div>
              <Input label="Personal Contact" error={errors.personalNumber?.message}>
                <div className="flex">
                  <span className="p-3 rounded-l border bg-transparent">+233</span>
                  <input {...register('personalNumber', { pattern: { value: /^\d{9}$/, message: 'Enter 9 digits' } })} maxLength={9} className="w-full p-3 rounded-r border" placeholder="123456789" />
                </div>
              </Input>
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button type="button" className="btn btn-ghost" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>Back</button>
              {step < 3 ? (
                <button type="button" className="btn btn-primary" onClick={async () => {
                  const ok = await validateStep(step);
                  if (ok) setStep(step + 1);
                }}>Continue</button>
              ) : (
                <button type="submit" className="btn btn-primary w-full">Send Request</button>
              )}
            </div>
          </form>

          {submitStatus === 'success' && <div className="text-center mt-4" style={{ color: 'var(--success)' }}>Request submitted successfully!</div>}
          {submitStatus === 'error' && <div className="text-center mt-4" style={{ color: 'var(--danger)' }}>An error occurred. Please try again.</div>}
        </div>

        {isConfirming && formData && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="max-w-xl w-full surface rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>Confirm Request</h3>
              <div className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
                <p><strong>Officer:</strong> {formData.officerName}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Supervisor:</strong> {formData.supervisorName}</p>
                <p><strong>Document:</strong> {formData.documentTitle}</p>
                <p><strong>From:</strong> {formData.fromDate} <strong>To:</strong> {formData.toDate}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={confirmSubmit} disabled={isSubmitting} className="px-4 py-2 rounded font-medium" style={{ background: 'var(--accent)', color: 'var(--nav-text)' }}>{isSubmitting ? 'Submitting...' : 'Yes, submit'}</button>
                <button onClick={() => setIsConfirming(false)} className="px-4 py-2 rounded border" style={{ borderColor: 'var(--neutral-200)' }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        {isConfirming && formData && (
          <aside className="lg:col-span-1">
              <div className="surface rounded-xl p-4 sticky" style={{ top: '24px' }}>
              <h4 className="font-semibold mb-2">Request Summary</h4>
              <div className="text-sm muted mb-3">Review and confirm request details before submitting.</div>
              <div className="text-sm mb-2"><strong>Officer:</strong> {watched.officerName || '—'}</div>
              <div className="text-sm mb-2"><strong>Document:</strong> {watched.documentTitle || '—'}</div>
              <div className="text-sm mb-2"><strong>Type:</strong> {watched.documentType || '—'}</div>
              <div className="text-sm mb-2"><strong>From:</strong> {watched.fromMonth && watched.fromYear ? `${watched.fromYear}-${watched.fromMonth}-01` : '—'}</div>
              <div className="text-sm mb-2"><strong>To:</strong> {watched.toMonth && watched.toYear ? `${watched.toYear}-${watched.toMonth}-01` : '—'}</div>
              <div className="text-sm mb-3"><strong>Supervisor:</strong> {watched.supervisorName || '—'}</div>
              <div className="flex gap-2">
                <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>Review</button>
                <button type="button" className="btn btn-ghost" onClick={() => { reset(); setFormData(null); setSubmitStatus(null); }}>Reset</button>
              </div>
            </div>
          </aside>
        )}
        </div>
      </div>
    </div>
  );
};

export default RequestForm;
