interface HeaderProps {
  currentPage?: 'mapa' | 'unidades';
}

export default function Header({ currentPage = 'mapa' }: HeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 w-full h-14 z-50 px-6 flex items-center justify-between bg-white border-b border-gray-200"
      style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)' }}
    >
      {/* Left side: Logo / Brand */}
      <div className="flex items-center gap-2.5 w-48">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
          }}
        >
          V
        </div>
        <span className="font-semibold text-[15px] tracking-tight text-gray-900">
          Voltianix
        </span>
      </div>

      {/* Center: Navigation Links */}
      <nav className="flex items-center gap-1 h-full">
        <a
          href="/"
          className={`h-full flex items-center px-3 border-b-2 font-medium text-sm transition-colors ${
            currentPage === 'mapa'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Mapa de Flota
        </a>
        <a
          href="/unidades"
          className={`h-full flex items-center px-3 border-b-2 font-medium text-sm transition-colors ${
            currentPage === 'unidades'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Unidades
        </a>
      </nav>

      {/* Right side: User Profile */}
      <div className="flex items-center gap-2.5 w-48 justify-end">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-[11px] tracking-wide"
          style={{
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)',
          }}
        >
          NT
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] font-medium text-gray-800 leading-tight">
            Nathan Torres
          </span>
          <span className="text-[11px] text-gray-400 leading-tight">
            Administrador
          </span>
        </div>
      </div>
    </header>
  );
}
