import React from 'react';
import type { NextPageContext } from 'next';

export default function Error({ statusCode }: { statusCode?: number }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '4rem', margin: '0 0 1rem 0' }}>{statusCode || 'Error'}</h1>
      <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '1rem' }}>Something went wrong</p>
      <a
        href="/"
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#3182ce',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '0.375rem',
          fontSize: '1rem'
        }}
      >
        Go Home
      </a>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode;
  return { statusCode };
};
