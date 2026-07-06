'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

interface NavbarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  onOpenChat: () => void;
}

export default function Navbar({ theme, toggleTheme, onOpenChat }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''} glass-panel`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} style={{ textDecoration: 'none' }}>
          <span className={styles.logo3D}>A</span>
          <span className={styles.logoText}>AURA<span className={styles.accent}>ESTATE</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.desktopNav}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/search" className={styles.navLink}>Properties</Link>
          <Link href="/#locations" className={styles.navLink}>Locations</Link>
          <button className={styles.navLink} onClick={onOpenChat}>AI Assistant</button>
        </nav>

        <div className={styles.actions}>
          <button 
            className={styles.themeToggle} 
            onClick={toggleTheme} 
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.364 17.636l-.707.707M6.364 6.364l.707.707M17.636 17.636l.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <button className={`${styles.cta} glow-btn`} onClick={onOpenChat}>
            Chat Bot
          </button>

          <button 
            className={styles.mobileMenuBtn} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <div className={`${styles.hamburger} ${mobileMenuOpen ? styles.open : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.menuVisible : ''} glass-panel`}>
        <nav className={styles.mobileNavLinks}>
          <Link href="/" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link href="/search" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Properties</Link>
          <Link href="/#locations" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Locations</Link>
          <button className={styles.mobileNavLink} onClick={() => { setMobileMenuOpen(false); onOpenChat(); }}>
            AI Assistant
          </button>
          <button className={`${styles.mobileCta} glow-btn`} onClick={() => { setMobileMenuOpen(false); onOpenChat(); }}>
            Interactive Chatbot
          </button>
        </nav>
      </div>
    </header>
  );
}
