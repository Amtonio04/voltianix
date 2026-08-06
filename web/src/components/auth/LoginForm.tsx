import { useEffect, useState } from 'react';
import { TEMP_USER, TEMP_USER_CREDENTIALS, getStoredUser, storeUser } from '../../lib/auth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (getStoredUser()) {
      window.location.assign('/');
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise((resolve) => window.setTimeout(resolve, 400));

    if (email.trim().toLowerCase() === TEMP_USER_CREDENTIALS.email && password === TEMP_USER_CREDENTIALS.password) {
      storeUser(TEMP_USER);
      window.dispatchEvent(new Event('auth:updated'));
      window.location.assign('/');
      return;
    }

    setError('Credenciales inválidas. Prueba con el usuario temporal mostrado abajo.');
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md rounded-[28px] border border-[#E6E6E6] bg-white p-8 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.25)]">
      <div className="mb-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#16A34A]/10 text-[#16A34A]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-[#1E1E1E]">Iniciar sesión</h2>
        <p className="mt-2 text-sm text-[#616161]">Ingresa al panel con un usuario temporal para probar la experiencia.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#1E1E1E]">
            Correo
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-[#E6E6E6] bg-[#FAFAFA] px-4 py-3 text-sm text-[#1E1E1E] outline-none ring-0 transition focus:border-[#16A34A] focus:bg-white"
            placeholder="demo@voltianix.com"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#1E1E1E]">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-[#E6E6E6] bg-[#FAFAFA] px-4 py-3 text-sm text-[#1E1E1E] outline-none ring-0 transition focus:border-[#16A34A] focus:bg-white"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </div>

        {error ? <p className="text-sm text-[#F53131]">{error}</p> : null}

        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-2xl bg-[#16A34A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? 'Ingresando...' : 'Entrar'}
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-dashed border-[#E6E6E6] bg-[#F9F9F9] p-4 text-sm text-[#616161]">
        <p className="font-semibold text-[#1E1E1E]">Usuario temporal de pruebas</p>
        <p className="mt-1">Correo: {TEMP_USER_CREDENTIALS.email}</p>
        <p>Contraseña: {TEMP_USER_CREDENTIALS.password}</p>
      </div>
    </div>
  );
}
