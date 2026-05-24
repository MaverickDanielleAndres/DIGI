import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* Navigation */}
      <nav className="nav">
        <Link href="/" className="nav-brand">Digi</Link>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#pricing">Pricing</a>
          <a href="/signup" className="nav-cta">Sign Up</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <p className="hero-tag">Collective Memory Platform</p>
        <h1 className="hero-title">
          Every Moment,<br />
          <span>Together</span>
        </h1>
        <p className="hero-sub">
          One event. One disposable camera. Everyone contributes to the same shared album — 
          no filters, no retakes, just real memories.
        </p>
        <a href="/signup" className="hero-cta">
          📸 Get Digi Free
        </a>
      </section>

      {/* Features */}
      <section className="section" id="features">
        <p className="section-tag">Why Digi?</p>
        <h2 className="section-title">Not just another photo app</h2>
        <p className="section-desc">
          Digi recreates the magic of disposable cameras for the digital age — 
          with collaborative albums, delayed reveals, and cinematic memories.
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📷</div>
            <h3 className="feature-name">Disposable Camera</h3>
            <p className="feature-text">
              10 unique camera styles from vintage disposable to Y2K digicam. 
              Each guest gets limited shots — making every capture intentional.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-name">Delayed Reveal</h3>
            <p className="feature-text">
              Photos stay locked until the event ends. Then, like developing film, 
              all memories reveal at once in a cinematic experience.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3 className="feature-name">Shared Album</h3>
            <p className="feature-text">
              Everyone contributes to one beautiful album. 8 layouts from filmstrip 
              to polaroid wall — your memories, your style.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3 className="feature-name">QR Join</h3>
            <p className="feature-text">
              Guests scan a QR code and start capturing instantly — no app download required. 
              Works as a web app for quick access.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✍️</div>
            <h3 className="feature-name">Memory Notes</h3>
            <p className="feature-text">
              Attach handwritten-style notes, voice messages, and dedications 
              to any photo. Future-unlock notes for anniversary surprises.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3 className="feature-name">AI Magic</h3>
            <p className="feature-text">
              AI-generated captions, best-shot detection, duplicate removal, 
              and one-tap recap videos of your entire event.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section" id="how-it-works">
        <p className="section-tag">How It Works</p>
        <h2 className="section-title">Three steps to magic</h2>
        <p className="section-desc">
          From creation to reveal — Digi makes the entire experience effortless.
        </p>
        <div className="steps">
          <div className="step">
            <h3 className="step-title">Create Your Event</h3>
            <p className="step-desc">
              Name your event, pick a camera style, set your shot limit, and choose 
              when photos reveal. Takes less than 30 seconds.
            </p>
          </div>
          <div className="step">
            <h3 className="step-title">Share the QR Code</h3>
            <p className="step-desc">
              Display your custom QR code at the event. Guests scan and 
              start shooting instantly — no sign-up required.
            </p>
          </div>
          <div className="step">
            <h3 className="step-title">Enjoy the Reveal</h3>
            <p className="step-desc">
              When the event ends, all photos develop at once. Watch 
              memories unfold together — from sepia to full color.
            </p>
          </div>
          <div className="step">
            <h3 className="step-title">Keep Forever</h3>
            <p className="step-desc">
              Download your album, order a physical photobook, or share 
              an AI-generated recap video with everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section" id="pricing">
        <p className="section-tag">Pricing</p>
        <h2 className="section-title">Start free, grow as you need</h2>
        <p className="section-desc">
          Every plan includes the full disposable camera experience. Upgrade for more events and premium features.
        </p>
        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="pricing-plan">Free</div>
            <div className="pricing-price">$0</div>
            <div className="pricing-period">Forever free</div>
            <ul className="pricing-features">
              <li>1 active event</li>
              <li>24 shots per guest</li>
              <li>50 guests per event</li>
              <li>3 camera styles</li>
              <li>Basic album layouts</li>
              <li>7-day photo storage</li>
            </ul>
            <a href="/signup" className="pricing-cta secondary">Get Started</a>
          </div>
          <div className="pricing-card featured">
            <div className="pricing-badge">Most Popular</div>
            <div className="pricing-plan">Creator</div>
            <div className="pricing-price">$9.99</div>
            <div className="pricing-period">per month</div>
            <ul className="pricing-features">
              <li>5 active events</li>
              <li>Unlimited shots</li>
              <li>200 guests per event</li>
              <li>All 10 camera styles</li>
              <li>All 8 album layouts</li>
              <li>AI captions & recap video</li>
              <li>Memory notes & voice</li>
              <li>Unlimited storage</li>
            </ul>
            <a href="/signup" className="pricing-cta primary">Start Free Trial</a>
          </div>
          <div className="pricing-card">
            <div className="pricing-plan">Business</div>
            <div className="pricing-price">$29.99</div>
            <div className="pricing-period">per month</div>
            <ul className="pricing-features">
              <li>Unlimited events</li>
              <li>Unlimited everything</li>
              <li>Custom branding</li>
              <li>Premium themes</li>
              <li>Analytics dashboard</li>
              <li>Physical photobooks</li>
              <li>Priority support</li>
              <li>White-label option</li>
            </ul>
            <a href="/signup" className="pricing-cta secondary">Contact Sales</a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero" style={{ minHeight: '60vh' }}>
        <p className="hero-tag">Ready to Create Memories?</p>
        <h2 className="hero-title">
          Your next event<br />
          deserves <span>Digi</span>
        </h2>
        <p className="hero-sub">
          Join thousands of hosts who trust Digi to capture their most important moments.
        </p>
        <a href="/signup" className="hero-cta" id="download">
          📸 Sign Up Now
        </a>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-brand">Digi</div>
        <p className="footer-desc">Collective Memory Platform</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Support</a>
          <a href="#">Blog</a>
          <a href="mailto:hello@getdigi.app">Contact</a>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} Digi. All rights reserved.</p>
      </footer>
    </>
  );
}
