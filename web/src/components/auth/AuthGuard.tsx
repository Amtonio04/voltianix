import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import LoginForm from './LoginForm';

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * Guard de autenticación para páginas protegidas.
 * - Mientras Firebase resuelve el estado de sesión, muestra un "spinner".
 * - Si NO hay sesión autenticada, muestra el formulario de login.
 * - Si hay sesión, renderiza el contenido protegido (children).
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthed(!!user);
      setLoading(false);
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

  if (!authed) {
    return (
      <main className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-6">
        <LoginForm />
      </main>
    );
  }

  return <>{children}</>;
}
