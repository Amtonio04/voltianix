import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface GuestOnlyProps {
  children: ReactNode;
}

/**
 * Visible solo para usuarios NO autenticados.
 * Si ya hay una sesión activa, redirige al dashboard.
 */
export default function GuestOnly({ children }: GuestOnlyProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        window.location.href = '/';
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#E6E6E6] border-t-[var(--color-button)] rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
