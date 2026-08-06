import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLogin } from '../../hooks/useLogin';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useLogin();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      window.location.href = '/';
    }
  };

  return (
    <div className="w-full max-w-[480px] bg-white rounded-xl shadow-lg p-10 animate-fade-in font-['Poppins']">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-[2rem] font-bold text-[#1E1E1E] mb-3">
          ¡Bienvenido de Vuelta!
        </h1>
        <p className="text-[13px] leading-relaxed text-[#1E1E1E]">
          Accede a{' '}
          <span className="font-semibold text-[#16A34A]">
            Voltianix
          </span>{' '}
          y supervisa tu flota de vehículos eléctricos en tiempo real desde un solo lugar.
        </p>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div
          role="alert"
          className="mb-6 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-[13px] font-bold text-[#1E1E1E] mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Ingresa tu Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 px-4 text-[13px] rounded-lg border border-[#E6E6E6] outline-none transition-colors focus:border-[#2563EB]"
          />
        </div>

        {/* Contraseña */}
        <div>
          <label htmlFor="password" className="block text-[13px] font-bold text-[#1E1E1E] mb-2">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="Ingresa tu Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 pl-4 pr-10 text-[13px] rounded-lg border border-[#E6E6E6] outline-none transition-colors focus:border-[#2563EB]"
            />
            {/* Ícono de Mostrar/Ocultar Contraseña */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#616161] hover:text-[#1E1E1E] focus:outline-none"
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

        {/* Opciones (Recuérdame y Olvidé contraseña) */}
        <div className="flex items-center justify-between text-[11px] text-[#616161] pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="accent-[#1E1E1E] w-3.5 h-3.5 rounded-sm"
            />
            Recuérdame
          </label>
          <button
            type="button"
            className="hover:text-[#2563EB] transition-colors"
          >
            ¿Olvidaste tu Contraseña?
          </button>
        </div>

        {/* Botón de Login */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-full text-white text-[13px] font-semibold transition-opacity bg-[#2563EB] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión…' : 'Iniciar Sesión'}
          </button>
        </div>
      </form>
    </div>
  );
}