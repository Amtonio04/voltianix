import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

/**
 * Hook de autenticación con Firebase Auth.
 * Expone login por email/contraseña junto con estados de loading y error.
 */
export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      return true;
    } catch (err) {
      setError(getAuthErrorMessage(err));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}

function getAuthErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = (err as { code?: string }).code ?? '';
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        return 'Credenciales incorrectas. Verifica tu email y contraseña.';
      case 'auth/invalid-email':
        return 'El formato del email no es válido.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Intenta de nuevo más tarde.';
      case 'auth/popup-closed-by-user':
        return 'Ventana de Google cerrada. Intenta de nuevo.';
      case 'auth/network-request-failed':
        return 'Error de conexión. Revisa tu red e intenta de nuevo.';
      default:
        return 'Ocurrió un error al iniciar sesión. Intenta de nuevo.';
    }
  }
  return 'Ocurrió un error inesperado.';
}
