import { Link, Outlet, useLocation } from "react-router";
import {
  Home,
  LogOut,
  MoreHorizontal,
  Settings,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { COMPACT_LAYOUT_BREAKPOINT, useIsMobile } from "../hooks/useIsMobile";
import { getAccountInitials, useAccount } from "../context/account-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const primaryNavItems = [
  { path: "/", label: "Hogar", icon: Home },
  { path: "/escenas", label: "Escenas", icon: Sparkles },
];

const secondaryNavItem = {
  path: "/ajustes",
  label: "Ajustes",
  icon: Settings,
};

export function Root() {
  const location = useLocation();
  const isMobile = useIsMobile(COMPACT_LAYOUT_BREAKPOINT);
  const SecondaryIcon = secondaryNavItem.icon;
  const { accountOptions, selectedAccount, setSelectedAccount, setSessionClosed } =
    useAccount();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#000000] text-white">
        <div className="mx-auto w-full max-w-[920px] pb-24">
          <Outlet />
        </div>

        <nav className="fixed bottom-0 left-0 right-0 border-t border-[#1f2432] bg-[#080a10]/96 backdrop-blur-xl">
          <div className="mx-auto flex h-[72px] w-full max-w-[920px] items-center justify-center gap-3 px-5">
            {primaryNavItems.map(({ path, label, icon: Icon }) => {
              const active = isActive(path);

              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex min-w-[132px] items-center justify-center gap-3 rounded-[20px] border px-4 py-3 transition-all ${
                    active
                      ? "border-[#f4c95d] bg-[#131822] text-[#f4c95d]"
                      : "border-[#262d3d] bg-[#10141d] text-[#aab3c8]"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              );
            })}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={`flex min-w-[64px] items-center justify-center rounded-[20px] border px-4 py-3 transition-all ${
                    isActive(secondaryNavItem.path)
                      ? "border-[#f4c95d] bg-[#131822] text-[#f4c95d]"
                      : "border-[#262d3d] bg-[#10141d] text-[#aab3c8]"
                  }`}
                >
                  <MoreHorizontal size={20} />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                side="top"
                sideOffset={14}
                className="w-[220px] rounded-[22px] border border-[#2b3042] bg-[#101520]/96 p-2 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
              >
                <DropdownMenuItem
                  asChild
                  className="rounded-[16px] px-3 py-3 text-[#d5dbea] focus:bg-[#1b2232] focus:text-white"
                >
                  <Link to={secondaryNavItem.path} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#171d2a] text-[#f4c95d]">
                      <Settings size={18} />
                    </div>
                    <div>
                      <p className="text-[15px] font-medium text-white">
                        {secondaryNavItem.label}
                      </p>
                      <p className="text-xs text-[#8f97ab]">
                        Preferencias y ajustes
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#000000] text-white">
      <nav className="sticky top-0 z-20 flex h-screen w-[292px] shrink-0 self-start flex-col overflow-y-auto border-r border-[#1f2432] bg-[#07090e]">
        <div className="border-b border-[#1f2432] px-6 pb-6 pt-7">
          <p className="text-[15px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
            Mi hogar
          </p>
          <h1 className="mt-3 text-[35px] font-semibold text-white">
            Panel Principal
          </h1>
        </div>

        <div className="flex-1 px-4 py-6">
          <div className="mt-3 space-y-2">
            {primaryNavItems.map(({ path, label, icon: Icon }) => {
              const active = isActive(path);

              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-3 rounded-[22px] border px-4 py-4 transition-all ${
                    active
                      ? "border-[#f4c95d] bg-[#111722] text-[#f4c95d]"
                      : "border-[#202636] bg-[#111520] text-[#d2d8e6] hover:border-[#33405a] hover:bg-[#171c28]"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-[16px] ${
                      active
                        ? "bg-[#0a0d13] text-[#f4c95d]"
                        : "bg-[#171c28] text-[#aab3c8]"
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-[16px] font-medium">{label}</p>
                    <p className="text-sm text-[#8f97ab]">
                      {path === "/" ? "Espacios y dispositivos" : "Automatizaciones"}
                    </p>
                  </div>
                </Link>
              );
            })}

          </div>
        </div>

        <div className="border-t border-[#1f2432] px-4 py-5">
          
          <div className="mt-3 space-y-3">
            <Link
              to={secondaryNavItem.path}
              className={`flex items-center gap-3 rounded-[20px] border px-4 py-3 transition-all ${
                isActive(secondaryNavItem.path)
                  ? "border-[#33405a] bg-[#151a25] text-white"
                  : "border-[#202636] bg-[#0f1219] text-[#aab3c8] hover:border-[#33405a] hover:bg-[#151a25]"
              }`}
            >
              <SecondaryIcon size={18} />
              <span className="text-[15px] font-medium">{secondaryNavItem.label}</span>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-[22px] border border-[#202636] bg-[#0f1219] px-4 py-3 text-left text-[#d2d8e6] transition-all hover:border-[#33405a] hover:bg-[#151a25]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f4bd49]/60 bg-[#16120a] text-sm font-semibold text-[#f4bd49]">
                    {getAccountInitials(selectedAccount.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7f879c]">
                      Cuenta
                    </p>
                    <p className="mt-1 truncate text-[15px] font-medium text-white">
                      {selectedAccount.name}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                side="top"
                sideOffset={12}
                className="w-[300px] rounded-[24px] border border-[#2b3042] bg-[#111520]/96 p-2 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
              >
                <div className="rounded-[18px] bg-[#171c28] p-4">
                  <p className="text-[15px] font-medium text-white">{selectedAccount.name}</p>
                  <p className="text-xs text-[#8f97ab]">{selectedAccount.email}</p>
                </div>

                <DropdownMenuSeparator className="mx-1 my-2 bg-[#232a3a]" />

                <DropdownMenuItem className="rounded-[16px] px-3 py-3 text-[#d5dbea] focus:bg-[#1b2232] focus:text-white">
                  <User size={16} />
                  Ver perfil
                </DropdownMenuItem>
                

                <DropdownMenuSeparator className="mx-1 my-2 bg-[#232a3a]" />

                {accountOptions.map((account) => (
                  <DropdownMenuItem
                    key={account.id}
                    onSelect={() => setSelectedAccount(account)}
                    className="rounded-[16px] px-3 py-3 text-[#d5dbea] focus:bg-[#1b2232] focus:text-white"
                  >
                    <Users size={16} />
                    {account.name}
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator className="mx-1 my-2 bg-[#232a3a]" />

                <DropdownMenuItem
                  onSelect={() => setSessionClosed(true)}
                  className="rounded-[16px] px-3 py-3 text-[#ffb4c0] focus:bg-[#2b1a21] focus:text-[#ffb4c0]"
                >
                  <LogOut size={16} />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
