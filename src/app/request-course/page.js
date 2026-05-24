'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import FloatingFAB from '@/components/FloatingFAB';
import CurrencyWidget from '@/components/CurrencyWidget';

export default function RequestCoursePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [courseName, setCourseName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !courseName.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/course-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          courseName: courseName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to submit request');
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onCartOpen={() => setCartOpen(true)} />

      <div className="static-page">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / <span>Request Course</span>
        </div>

        <h1>Request Course</h1>

        {submitted ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Request Submitted!</h2>
            <p style={{ color: '#666', marginTop: '10px' }}>
              Thank you! We have received your course request and will get back to you soon.
            </p>
            <button
              className="btn-auth"
              onClick={() => {
                setSubmitted(false);
                setName('');
                setEmail('');
                setCourseName('');
              }}
              style={{ maxWidth: '250px', margin: '20px auto 0' }}
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form className="static-page-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}

            <div className="form-group">
              <label>Your name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Your email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Course Name or Trainer Name</label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-submit-green" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        )}
      </div>

      <Footer />
      <FloatingFAB />
      <CurrencyWidget />
    </>
  );
}
