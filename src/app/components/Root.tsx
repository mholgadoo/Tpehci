import { Outlet, Link, useLocation } from "react-router";
import { Home, Settings, Sparkles } from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";

export function Root() {
  const location = useLocation();
  const isMobile = useIsMobile();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: "/", label: "Espacios", icon: Home },
    { path: "/escenas", label: "Escenas", icon: Sparkles },
    { path: "/ajustes", label: "Ajustes", icon: Settings },
  ];

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#000000] text-white">
        <Outlet />
        
        {/* Bottom Navigation - Mobile */}
        <nav className="fixed bottom-0 left-0 right-0 bg-[#000000] border-t border-gray-800">
          <div className="max-w-2xl mx-auto flex justify-around items-center h-16">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-1 px-4 py-2 ${
                  isActive(path) && (path !== "/" || location.pathname === "/")
                    ? "text-yellow-500"
                    : "text-gray-400"
                }`}
              >
                <Icon size={24} />
                <span className="text-xs">{label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="min-h-screen bg-[#000000] text-white flex">
      {/* Sidebar Navigation - Desktop */}
      <nav className="w-64 bg-[#000000] border-r border-gray-800 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl mb-8">Mi Hogar</h1>
        </div>
        
        <div className="flex-1 px-3">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                isActive(path) && (path !== "/" || location.pathname === "/")
                  ? "bg-yellow-600 text-white"
                  : "text-gray-400 hover:bg-gray-800/50"
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}