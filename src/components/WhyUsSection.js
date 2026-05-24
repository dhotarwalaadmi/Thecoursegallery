'use client';

export default function WhyUsSection() {
  return (
    <div className="why-us-section">
      <h2>Why Purchase From Us?</h2>
      <p>We provide the best digital courses at unbeatable prices with instant delivery and lifetime access.</p>
      
      <div className="feature-item">
        <svg className="feature-icon" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28"/>
          <path d="M20 32l8 8 16-16"/>
        </svg>
        <h3>Verified Courses</h3>
        <p>All our courses are verified and tested before being listed. We ensure you get the highest quality content from top instructors.</p>
      </div>

      <div className="feature-item">
        <svg className="feature-icon" viewBox="0 0 64 64">
          <path d="M32 8v48M8 32h48"/>
          <circle cx="32" cy="32" r="28"/>
          <path d="M16 20h32v28H16z"/>
          <path d="M24 20v-6a8 8 0 0116 0v6"/>
        </svg>
        <h3>Secure Payments</h3>
        <p>We offer secure UPI payment methods. Your transactions are safe and protected with our manual verification process.</p>
      </div>

      <div className="feature-item">
        <svg className="feature-icon" viewBox="0 0 64 64">
          <path d="M8 16l24 14 24-14"/>
          <rect x="8" y="16" width="48" height="36" rx="4"/>
        </svg>
        <h3>Instant Delivery</h3>
        <p>Get access to your courses instantly after payment verification. Download and start learning right away.</p>
      </div>
    </div>
  );
}
