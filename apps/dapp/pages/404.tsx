import Link from 'next/link';
import React from 'react';

export default function Custom404() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '4rem', margin: '0 0 1rem 0' }}>404</h1>
      <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '1rem' }}>
        Page not found
      </p>
      <Link
        href="/"
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#3182ce',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '0.375rem',
          fontSize: '1rem',
        }}
      >
        Go Home
      </Link>
    </div>
  );
}

// Flag to skip Layout wrapper in _app.tsx
Custom404.skipLayout = true;
