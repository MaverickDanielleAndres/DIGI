"use client";

import { useState } from 'react';
import Link from 'next/link';
import './signup.css';

export default function Signup() {
  const [accountType, setAccountType] = useState<'personal' | 'business'>('personal');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      setStep(3); // Go to success/redirect step
    }, 1500);
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <Link href="/" className="nav-brand" style={{ display: 'block', textAlign: 'center', marginBottom: '2rem' }}>Digi</Link>
        
        {step === 1 && (
          <div className="step-content">
            <h1 className="signup-title">Choose your path</h1>
            <p className="signup-sub">How will you use Digi?</p>
            
            <div className="account-types">
              <button 
                className={`type-card ${accountType === 'personal' ? 'active' : ''}`}
                onClick={() => setAccountType('personal')}
              >
                <div className="type-icon">📸</div>
                <h3>Personal</h3>
                <p>For weddings, birthdays, and trips with friends.</p>
              </button>
              
              <button 
                className={`type-card ${accountType === 'business' ? 'active' : ''}`}
                onClick={() => setAccountType('business')}
              >
                <div className="type-icon">🏢</div>
                <h3>Business</h3>
                <p>For planners, photographers, and agencies.</p>
              </button>
            </div>
            
            <button className="hero-cta" style={{ width: '100%', marginTop: '2rem' }} onClick={() => setStep(2)}>
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <h1 className="signup-title">Create {accountType === 'business' ? 'Business' : 'Personal'} Account</h1>
            <form onSubmit={handleSubmit} className="signup-form">
              {accountType === 'business' && (
                <div className="input-group">
                  <label>Brand / Company Name</label>
                  <input type="text" required placeholder="Acme Events" />
                </div>
              )}
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" required placeholder="hello@example.com" />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" required placeholder="••••••••" />
              </div>
              
              <button type="submit" className="hero-cta" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                {loading ? 'Creating...' : 'Sign Up'}
              </button>
            </form>
            <button className="back-btn" onClick={() => setStep(1)}>← Back</button>
          </div>
        )}

        {step === 3 && (
          <div className="step-content success-step">
            <div className="success-icon">✨</div>
            <h1 className="signup-title">Welcome to Digi</h1>
            <p className="signup-sub" style={{ marginBottom: '2rem' }}>
              Your account has been created successfully. 
              Digi is a mobile-first platform. Download the app to start creating events.
            </p>
            
            <a href="digi://" className="hero-cta" style={{ width: '100%', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
              Open Digi App
            </a>
            
            <p style={{ color: 'var(--color-ash)', fontSize: '0.85rem', textAlign: 'center' }}>
              (Or search for &quot;Digi&quot; on the App Store / Google Play)
            </p>
          </div>
        )}
      </div>
      <div className="grain-overlay" />
    </div>
  );
}
