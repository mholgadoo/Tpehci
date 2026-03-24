import {
  ChevronDown,
  LogOut,
  Plus,
  Settings,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { getAccountInitials, useAccount } from "../context/account-context";
import {
  getDeviceIcon,
  getSpaceIcon,
  spaceTypeOptions,
  type SpaceKind,
  useHome,
} from "../context/home-context";
import { useIsMobile } from "../hooks/useIsMobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
 
export function Espacios() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { accountOptions, selectedAccount, setSelectedAccount, sessionClosed, setSessionClosed } =
    useAccount();
  const { homes, selectedHomeId, setSelectedHomeId, currentHome, addHome, addSpace } =
    useHome();
  const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false);
  const [isHomeModalOpen, setIsHomeModalOpen] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [selectedType, setSelectedType] = useState<SpaceKind | null>(null);
  const [spaceNameError, setSpaceNameError] = useState("");
  const [newHomeName, setNewHomeName] = useState("");
  const [newHomeLocation, setNewHomeLocation] = useState("");
 
  const resetSpaceForm = () => {
    setNewSpaceName("");
    setSelectedType(null);
    setSpaceNameError("");
  };
 
  const openSpaceModal = () => {
    resetSpaceForm();
    setIsSpaceModalOpen(true);
  };
 
  const handleSpaceModalChange = (open: boolean) => {
    setIsSpaceModalOpen(open);
 
    if (!open) {
      resetSpaceForm();
    }
  };
 
  const handleAddSpace = () => {
    const trimmedSpaceName = newSpaceName.trim();
 
    if (!trimmedSpaceName) {
      setSpaceNameError("Escribí un nombre para seguir.");
      return;
    }
 
    if (!selectedType || !currentHome) return;
    addSpace(currentHome.id, trimmedSpaceName, selectedType);
 
    handleSpaceModalChange(false);
  };
 
  const handleAddHome = () => {
    const trimmedHomeName = newHomeName.trim();
    if (!trimmedHomeName) return;
    addHome(trimmedHomeName, newHomeLocation);
    setIsHomeModalOpen(false);
    setNewHomeName("");
    setNewHomeLocation("");
  };
 
  if (sessionClosed) {
    return (
      <div className="px-6 py-12 text-white">
        <div className="mx-auto max-w-[520px] rounded-[32px] border border-[#262d3d] bg-[#111520] p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
            Sesión cerrada
          </p>
          <h1 className="mt-3 text-[30px] font-semibold text-white">Hasta luego</h1>
          <p className="mt-2 text-sm text-[#8f97ab]">
            Cerraste sesión en la maqueta. Podés volver a entrar para la presentación.
          </p>
          <button
            type="button"
            onClick={() => setSessionClosed(false)}
            className="mt-6 rounded-[18px] bg-[#f4bd49] px-5 py-3 text-sm font-medium text-[#111111] transition-colors hover:bg-[#efb32e]"
          >
            Volver a entrar
          </button>
        </div>
      </div>
    );
  }
 
  const spacesContent =
    currentHome.spaces.length > 0 ? (
      <div className={isMobile ? "space-y-4" : "grid grid-cols-3 gap-6"}>
        {currentHome.spaces.map((space) => {
          const allOff =
            space.devices.length === 0 ||
            space.devices.every(
              (d) => d.status === "off" || d.brightness === 0,
            );
          return (
          <Link
            key={space.id}
            to={`/espacio/${currentHome.id}/${space.id}`}
            className={`group rounded-[30px] border border-[#20283a] bg-[#101620]/92 shadow-[0_18px_44px_rgba(0,0,0,0.18)] transition-all ${
              isMobile
                ? "block p-5 hover:border-[#39445a]"
                : "relative flex min-h-[240px] flex-col justify-between p-6 pr-24 hover:-translate-y-1 hover:border-[#39445a]"
            }`}
          >
            {!isMobile ? (
              <span className="absolute right-6 top-6 inline-flex items-center rounded-full border border-[#3a4660] bg-[#151b28] px-3 py-2 text-[13px] font-semibold text-[#eef2ff] shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
                {space.devices.length} {space.devices.length === 1 ? "dispositivo" : "dispositivos"}
              </span>
            ) : null}
 
            <div className={isMobile ? "flex items-start gap-4" : ""}>
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-[22px] border ${
                  allOff
                    ? "border-[#2b3448] bg-[#151b28] text-[#717a8f]"
                    : "border-[#f4bd49]/60 bg-[#16120a] text-[#f4bd49]"
                } ${isMobile ? "shrink-0" : "mb-6"}`}
              >
                {getSpaceIcon(space.kind, 28)}
              </div>
 
              <div className="min-w-0 flex-1">
                <div className={isMobile ? "flex items-start justify-between gap-3" : "min-h-[106px]"}>
                  <div className="min-w-0">
                    <h3 className={isMobile ? "text-[22px] font-semibold text-white" : "text-[24px] font-semibold text-white"}>
                      {space.name}
                    </h3>
                    <p className={isMobile ? "mt-2 text-[15px] leading-6 text-[#97a0b4]" : "mt-3 max-w-[28ch] text-[16px] leading-7 text-[#c3cad8]"}>
                      {space.devices.length > 0
                        ? "Acceso directo a luces y dispositivos del ambiente."
                        : "Todavía no tiene dispositivos cargados."}
                    </p>
                  </div>
                  {isMobile ? (
                    <span className="rounded-full border border-[#2d3649] bg-[#151b28] px-3 py-1 text-[12px] font-medium text-[#cdd4e2]">
                      {space.devices.length} disp.
                    </span>
                  ) : null}
                </div>
 
                <div className="mt-5 flex flex-wrap gap-3">
                  {space.devices.length > 0 ? (
                    space.devices.map((device, index) => (
                      <div
                        key={index}
                        className={`flex h-11 w-11 items-center justify-center rounded-[16px] border border-[#252d3f] bg-[#161c28] text-xl ${
                          device.status === "on" && device.brightness !== 0 ? "text-[#f4bd49]" : "text-[#717a8f]"
                        }`}
                      >
                        {getDeviceIcon(device.kind, 20)}
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-[#7f879c]">Sin dispositivos</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
          );
        })}
 
        {!isMobile && (
          <button
            type="button"
            onClick={openSpaceModal}
            className="flex min-h-[240px] flex-col items-center justify-center rounded-[30px] border border-dashed border-[#3b465d] bg-[#101620]/70 p-6 text-center transition-all hover:-translate-y-1 hover:border-[#566582]"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-[#f4bd49]/60 bg-[#16120a] text-[#f4bd49]">
              <Plus size={26} />
            </div>
            <p className="mt-4 text-[18px] font-medium text-white">Nuevo espacio</p>
            <p className="mt-2 max-w-[220px] text-sm leading-6 text-[#8f97ab]">
              Agregá un ambiente sin competir con las acciones principales.
            </p>
          </button>
        )}
      </div>
    ) : (
      <div className="rounded-[32px] border border-dashed border-[#3c4860] bg-[#111723]/88 px-6 py-10 text-center shadow-[0_18px_48px_rgba(0,0,0,0.18)]">
        <p className="text-[24px] font-semibold text-white">
          Todavía no hay espacios en {currentHome.name}
        </p>
        <p className="mt-3 text-[15px] leading-7 text-[#8f97ab]">
          Cargá el primer ambiente para que el hogar quede listo para la demo.
        </p>
        <button
          type="button"
          onClick={openSpaceModal}
          className="mt-6 inline-flex items-center gap-2 rounded-[18px] bg-[#f4bd49] px-5 py-3 text-[15px] font-medium text-[#111111] transition-colors hover:bg-[#efb32e]"
        >
          <Plus size={16} />
          Nuevo espacio
        </button>
      </div>
    );
 
  return (
    <>
      <div className="relative">
        <div className={isMobile ? "relative px-5 pb-28 pt-7" : "relative mx-auto max-w-7xl px-12 py-10"}>
          <div className={isMobile ? "space-y-6" : "space-y-8"}>
            <div className={isMobile ? "flex items-stretch gap-3" : ""}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="group flex min-w-0 flex-1 items-start justify-between rounded-[30px] border border-[#2b3448] bg-[#111723]/92 px-5 py-5 text-left shadow-[0_18px_52px_rgba(0,0,0,0.18)] transition-all hover:border-[#44506a]"
                  >
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
                        Hogar activo
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <h1 className={isMobile ? "text-[29px] font-semibold leading-none text-white" : "text-[42px] font-semibold leading-none text-white"}>
                          {currentHome.name}
                        </h1>
                        <ChevronDown size={22} className="text-[#8f97ab]" />
                      </div>
                      <p className="mt-2 text-[15px] leading-6 text-[#97a0b4]">
                        {currentHome.subtitle}
                      </p>
                    </div>
 
                    <div className="ml-4 rounded-[20px] border border-[#2d3649] bg-[#151b28] px-4 py-4 text-right">
                      <p className="text-[16px] font-semibold text-white">
                        {currentHome.spaces.length} espacios
                      </p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
 
                <DropdownMenuContent
                  align="start"
                  sideOffset={12}
                  className="w-[min(92vw,380px)] rounded-[28px] border border-[#2b3042] bg-[#111520]/96 p-3 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
                >
                  <p className="px-2 pb-3 pt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
                    Cambiar hogar
                  </p>
 
                  <div className="space-y-2">
                    {homes.map((home) => (
                      <button
                        key={home.id}
                        type="button"
                        onClick={() => setSelectedHomeId(home.id)}
                        className={`flex w-full items-start justify-between rounded-[22px] border px-4 py-4 text-left transition-all ${
                          home.id === selectedHomeId
                            ? "border-[#f4bd49]/70 bg-[#15110a]"
                            : "border-[#202636] bg-[#171b26] hover:border-[#33405a] hover:bg-[#1a2030]"
                        }`}
                      >
                        <div>
                          <p className="text-[16px] font-medium text-white">{home.name}</p>
                          <p className="mt-1 text-[13px] leading-5 text-[#8f97ab]">{home.subtitle}</p>
                        </div>
                        <span className="rounded-full border border-[#30384b] bg-[#161c28] px-3 py-1 text-[11px] text-[#c3cad9]">
                          {home.spaces.length} espacios
                        </span>
                      </button>
                    ))}
                  </div>
 
                  <button
                    type="button"
                    onClick={() => setIsHomeModalOpen(true)}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-[20px] border border-dashed border-[#3d4962] bg-[#151a25] px-4 py-3 text-[14px] font-medium text-[#d2d8e6] transition-colors hover:border-[#5a6b8f]"
                  >
                    <Plus size={16} />
                    Agregar hogar
                  </button>
                </DropdownMenuContent>
              </DropdownMenu>
 
              {isMobile ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="w-[104px] rounded-[30px] border border-[#2b3448] bg-[#111723]/92 p-3 shadow-[0_18px_52px_rgba(0,0,0,0.18)] transition-all hover:border-[#44506a]"
                    >
                      <div className="flex h-full flex-col items-center justify-between gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#f4bd49]/60 bg-[#16120a] text-sm font-semibold text-[#f4bd49]">
                          {getAccountInitials(selectedAccount.name) || <User size={20} />}
                        </div>
                        <div className="text-center">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7f879c]">
                            Cuenta
                          </p>
                        </div>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
 
                  <DropdownMenuContent
                    align="end"
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
                    <DropdownMenuItem
                      onSelect={() => navigate("/ajustes")}
                      className="rounded-[16px] px-3 py-3 text-[#d5dbea] focus:bg-[#1b2232] focus:text-white"
                    >
                      <Settings size={16} />
                      Preferencias
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
              ) : null}
            </div>
 
            <div className={isMobile ? "space-y-3" : "flex items-end justify-between gap-6"}>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
                  Vista principal
                </p>
                <h2 className={isMobile ? "mt-2 text-[30px] font-semibold text-white" : "mt-3 text-[36px] font-semibold text-white"}>
                  Espacios
                </h2>
                <p className="mt-2 text-[15px] leading-7 text-[#97a0b4]">
                  Dejamos lo más usado al frente y el resto en un segundo nivel.
                </p>
              </div>
 
              {isMobile ? (
                <span className="inline-flex w-fit items-center rounded-full border border-[#2d3649] bg-[#151b28] px-3 py-1 text-[12px] font-medium text-[#d5dbea]">
                  {currentHome.spaces.length} espacios
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full border border-[#2d3649] bg-[#151b28] px-3 py-2 text-[13px] font-medium text-[#d5dbea]">
                  {currentHome.spaces.length} espacios
                </span>
              )}
            </div>
 
            {spacesContent}
          </div>
        </div>
 
        {isMobile && (
          <button
            type="button"
            onClick={openSpaceModal}
            className="fixed bottom-24 right-5 z-30 inline-flex items-center gap-2 rounded-full bg-[#f4bd49] px-5 py-4 text-[15px] font-medium text-[#111111] shadow-[0_18px_44px_rgba(244,189,73,0.26)] transition-transform hover:scale-[1.01]"
          >
            <Plus size={18} />
            Nuevo espacio
          </button>
        )}
 
        {!isMobile && currentHome.spaces.length > 0 && (
          <button
            type="button"
            onClick={openSpaceModal}
            className="fixed bottom-8 right-10 z-40 inline-flex items-center gap-2 rounded-full bg-[#f4bd49] px-6 py-4 text-[15px] font-medium text-[#111111] shadow-[0_20px_48px_rgba(244,189,73,0.28)] transition-transform hover:scale-[1.01] hover:bg-[#efb32e]"
          >
            <Plus size={18} />
            Nuevo espacio
          </button>
        )}
      </div>
 
      <Dialog open={isSpaceModalOpen} onOpenChange={handleSpaceModalChange}>
        <DialogContent className="w-[min(92vw,760px)] rounded-[32px] border border-[#2b3042] bg-[#0f1219] p-0 text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)] [&>button]:hidden">
          <div className="relative overflow-hidden rounded-[32px]">
            <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,#f4bd49_0%,rgba(244,189,73,0.2)_26%,transparent_70%)]" />
            <div className="relative border-b border-[#1f2432] px-6 pb-4 pt-6 sm:px-8">
              <DialogTitle className="text-[24px] font-semibold text-white">
                Nuevo Espacio
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-[#7f879c]">
                Panel visual simple para la presentación.
              </DialogDescription>
            </div>
 
            <div className="relative space-y-7 px-6 pb-8 pt-6 sm:px-8">
              <div className="space-y-3">
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
                  Nombre
                </label>
                <div
                  className={`rounded-[20px] border px-5 py-4 transition-colors ${
                    spaceNameError
                      ? "border-[#de6178] bg-[#28171d]"
                      : "border-[#2b3042] bg-[#1d2230]"
                  }`}
                >
                  <input
                    type="text"
                    placeholder="Sala principal"
                    value={newSpaceName}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setNewSpaceName(nextValue);
 
                      if (nextValue.trim()) {
                        setSpaceNameError("");
                      }
                    }}
                    aria-invalid={Boolean(spaceNameError)}
                    className="w-full bg-transparent text-[16px] text-white outline-none placeholder:text-[#6b7280]"
                  />
                </div>
                {spaceNameError ? (
                  <p className="text-[13px] font-medium text-[#ff9cab]">
                    {spaceNameError}
                  </p>
                ) : null}
              </div>
 
              <div className="space-y-3">
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
                  Tipo de espacio
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {spaceTypeOptions.map((type) => {
                    const isSelected = selectedType === type.id;
 
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedType(type.id)}
                        className={`flex flex-col items-center justify-center gap-3 rounded-[22px] border px-3 py-5 text-center transition-all ${
                          isSelected
                            ? "border-[#f4bd49]/70 bg-[#15110a] text-[#f4bd49]"
                            : "border-[#202636] bg-[#171b26] text-[#aab3c8]"
                        }`}
                      >
                        {getSpaceIcon(type.id, 24, 1.5)}
                        <span className="text-[13px] font-medium leading-tight">
                          {type.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
 
              <button
                type="button"
                onClick={handleAddSpace}
                disabled={!selectedType}
                className={`w-full rounded-[20px] border-2 py-4 text-[15px] font-medium transition-all ${
                  selectedType
                    ? "border-[#f4bd49] bg-[#15110a] text-[#f4bd49]"
                    : "border-[#202636] bg-[#202636] text-[#6b7280]"
                }`}
              >
                Agregar espacio
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
 
      <Dialog open={isHomeModalOpen} onOpenChange={setIsHomeModalOpen}>
        <DialogContent className="w-[min(92vw,520px)] rounded-[32px] border border-[#2b3042] bg-[#0f1219] p-0 text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)] [&>button]:hidden">
          <div className="relative overflow-hidden rounded-[32px]">
            <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,#f4bd49_0%,rgba(244,189,73,0.2)_26%,transparent_70%)]" />
            <div className="relative border-b border-[#1f2432] px-6 pb-4 pt-6 sm:px-8">
              <DialogTitle className="text-[24px] font-semibold text-white">
                Agregar hogar
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-[#7f879c]">
                Elegí o sumá hogares desde el dropdown principal.
              </DialogDescription>
            </div>
 
            <div className="relative space-y-6 px-6 pb-8 pt-6 sm:px-8">
              <div className="space-y-3">
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
                  Nombre
                </label>
                <div className="rounded-[20px] border border-[#2b3042] bg-[#1d2230] px-5 py-4">
                  <input
                    type="text"
                    value={newHomeName}
                    onChange={(event) => setNewHomeName(event.target.value)}
                    placeholder="Casa de fin de semana"
                    className="w-full bg-transparent text-base text-white outline-none placeholder:text-[#6b7280]"
                  />
                </div>
              </div>
 
              <div className="space-y-3">
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
                  Ubicación
                </label>
                <div className="rounded-[20px] border border-[#2b3042] bg-[#1d2230] px-5 py-4">
                  <input
                    type="text"
                    value={newHomeLocation}
                    onChange={(event) => setNewHomeLocation(event.target.value)}
                    placeholder="Ciudad o referencia"
                    className="w-full bg-transparent text-base text-white outline-none placeholder:text-[#6b7280]"
                  />
                </div>
              </div>
 
              <button
                type="button"
                onClick={handleAddHome}
                disabled={!newHomeName.trim()}
                className={`w-full rounded-[20px] border-2 py-4 text-[15px] font-medium transition-all ${
                  newHomeName.trim()
                    ? "border-[#f4bd49] bg-[#15110a] text-[#f4bd49]"
                    : "border-[#202636] bg-[#202636] text-[#6b7280]"
                }`}
              >
                Agregar hogar
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}