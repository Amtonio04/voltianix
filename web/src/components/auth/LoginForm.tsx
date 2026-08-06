import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLogin } from '../../hooks/useLogin';
import { TEMP_USER_CREDENTIALS } from '../../lib/auth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useLogin();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const success = await login(email, password);
    if (success) {
      window.location.assign('/');
    }
  };

  return (
    <div className="w-full max-w-[480px] rounded-[28px] border border-[#E6E6E6] bg-white p-8 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.25)]">
      <div className="mb-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#16A34A]/10 text-[#16A34A]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 className="mt-4 text-[2rem] font-bold text-[#1E1E1E]">¡Bienvenido de vuelta!</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-[#616161]">
          Accede a <span className="font-semibold text-[#16A34A]">Voltianix</span> y supervisa tu flota de vehículos eléctricos desde un solo lugar.
        </p>
      </div>

      {error ? (
        <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-[13px] font-bold text-[#1E1E1E]">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="demo@voltianix.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11 w-full rounded-lg border border-[#E6E6E6] px-4 text-[13px] outline-none transition-colors focus:border-[#2563EB]"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-[13px] font-bold text-[#1E1E1E]">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 w-full rounded-lg border border-[#E6E6E6] pl-4 pr-10 text-[13px] outline-none transition-colors focus:border-[#2563EB]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#616161] transition hover:text-[#1E1E1E]"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-full items-center justify-center rounded-full bg-[#2563EB] text-[13px] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
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
