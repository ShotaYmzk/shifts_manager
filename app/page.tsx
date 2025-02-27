// app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo">
          <Link href="/">
            <h2>Shift Management</h2>
          </Link>
        </div>
        <nav className="nav-links">
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </nav>
      </header>
      <section className="hero-section">
        <h1>Seamless Shift Management</h1>
        <p>Empower your workforce with modern shift scheduling.</p>
        <Link href="/dashboard" className="cta-button">
          Get Started
        </Link>
      </section>
      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} Shift Management App</p>
      </footer>
    </div>
  );
}