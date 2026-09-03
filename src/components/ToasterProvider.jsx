'use client';

import { Toaster } from 'react-hot-toast';

export default function ToasterProvider() {
  return (
    <Toaster 
      position="top-right" 
      toastOptions={{
        duration: 1800,
        style: {
          background: '#0F172A',
          color: '#fff',
          borderRadius: '12px',
          fontSize: '14px',
          zIndex: 999999,
        },
      }} 
    />
  );
}