interface HeaderProps {
  currentPage?: 'mapa' | 'unidades';
}

export default function Header({ currentPage = 'mapa' }: HeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 w-full h-14 z-50 px-6 flex items-center justify-between bg-white"
      style={{ borderBottom: '1px solid #E6E6E6' }}
    >
      {/* Left side: Logo */}
      <div className="flex items-center gap-2 w-48">
        <img
          src="/logo.png"
          alt="Voltianix"
          className="h-9 w-auto object-contain"
        />
      </div>

      {/* Center: Navigation Links */}
      <nav className="flex items-center gap-6 h-full">
        <a
          href="/"
          className={`h-full flex items-center px-1 border-b-2 font-medium text-sm transition-colors ${
            currentPage === 'mapa'
              ? 'text-[#16A34A] border-[#16A34A]'
              : 'text-[#1E1E1E] border-transparent hover:text-[#616161]'
          }`}
          style={{ fontStyle: currentPage === 'mapa' ? 'italic' : 'normal' }}
        >
          Mapa de Flota
        </a>
        <a
          href="/unidades"
          className={`h-full flex items-center px-1 border-b-2 font-medium text-sm transition-colors ${
            currentPage === 'unidades'
              ? 'text-[#16A34A] border-[#16A34A]'
              : 'text-[#1E1E1E] border-transparent hover:text-[#616161]'
          }`}
          style={{ fontStyle: currentPage === 'unidades' ? 'italic' : 'normal' }}
        >
          Unidades
        </a>
      </nav>

      {/* Right side: User Profile */}
      <div className="flex items-center gap-2.5 w-48 justify-end">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-[11px] tracking-wide"
          style={{ backgroundColor: '#16A34A' }}
        >
          NT
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] font-medium leading-tight" style={{ color: '#1E1E1E' }}>
            Nathan Torres
          </span>
          <span className="text-[11px] leading-tight" style={{ color: '#616161' }}>
            Administrador
          </span>
        </div>
      </div>
    </header>
  );
}
