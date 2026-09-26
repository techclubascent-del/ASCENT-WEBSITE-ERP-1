"use client";
import React from 'react';
import { MemberPortal } from '@/components/home/MemberPortal';
import { ThemeProvider } from '@/components/context/ThemeContext';
import { useRouter } from 'next/navigation';

export default function PortalPage() {
  const router = useRouter();

  return (
    <ThemeProvider>
      <div className="bg-black min-h-screen text-white">
        <MemberPortal 
          onLogout={() => router.push('/')}
          onNavigateToRegistration={() => router.push('/auth/signup')}
        />
      </div>
    </ThemeProvider>
  );
}
