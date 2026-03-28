import {
  Bell,
  Blinds,
  Check,
  ChevronDown,
  DoorOpen,
  LogOut,
  Pencil,
  Plus,
  Settings,
  Speaker,
  User,
  Users,
  Wind,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { getAccountInitials, useAccount } from "../context/account-context";
import {
  getDeviceIcon,
  type HomeShortcut,
  getSpaceIcon,
  type HomeShortcutKind,
  spaceTypeOptions,
  type SpaceKind,
  useHome,
} from "../context/home-context";
import { useIsMobile } from "../hooks/useIsMobile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
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
  type ShortcutControlState = {
    on: boolean;
    volume: number;
    bass: number;
    position: number;
    slat: number;
    temperature: number;
    fanSpeed: number;
    airMode: "Frio" | "Calor" | "Ventilacion";
    doorMode: "Cerrar" | "Abrir" | "Bloquear" | "Desbloquear";
  };

  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { accountOptions, selectedAccount, setSelectedAccount, sessionClosed, setSessionClosed } =
    useAccount();
  const { homes, selectedHomeId, setSelectedHomeId, currentHome, addHome, updateHome, addSpace } =
    useHome();
  const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false);
  const [isHomeModalOpen, setIsHomeModalOpen] = useState(false);
  const [isEditHomeModalOpen, setIsEditHomeModalOpen] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [selectedType, setSelectedType] = useState<SpaceKind | null>(null);
  const [spaceNameError, setSpaceNameError] = useState("");
  const [newHomeName, setNewHomeName] = useState("");
  const [newHomeLocation, setNewHomeLocation] = useState("");
  const [newHomeShortcuts, setNewHomeShortcuts] = useState<HomeShortcut[]>([]);
  const [isShortcutComposerOpen, setIsShortcutComposerOpen] = useState(false);
  const [draftShortcutKind, setDraftShortcutKind] = useState<HomeShortcutKind | null>(null);
  const [draftShortcutName, setDraftShortcutName] = useState("");
  const [homeStep, setHomeStep] = useState(0);
  const [editHomeName, setEditHomeName] = useState("");
  const [editHomeLocation, setEditHomeLocation] = useState("");
  const [editHomeStep, setEditHomeStep] = useState(0);
  const [editHomeShortcuts, setEditHomeShortcuts] = useState<HomeShortcut[]>([]);
  const [isEditShortcutComposerOpen, setIsEditShortcutComposerOpen] = useState(false);
  const [draftEditShortcutKind, setDraftEditShortcutKind] = useState<HomeShortcutKind | null>(null);
  const [draftEditShortcutName, setDraftEditShortcutName] = useState("");
  const [activeShortcut, setActiveShortcut] = useState<HomeShortcut | null>(null);
  const [activeDoorShortcut, setActiveDoorShortcut] = useState<HomeShortcut | null>(null);
  const [shortcutControlById, setShortcutControlById] = useState<Record<string, ShortcutControlState>>({});
  const [isHomeAlarmOn, setIsHomeAlarmOn] = useState(false);
  const [isAlarmConfirmOpen, setIsAlarmConfirmOpen] = useState(false);
 
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
    addHome(trimmedHomeName, newHomeLocation, newHomeShortcuts);
    setIsHomeModalOpen(false);
    setNewHomeName("");
    setNewHomeLocation("");
    setNewHomeShortcuts([]);
    setIsShortcutComposerOpen(false);
    setDraftShortcutKind(null);
    setDraftShortcutName("");
    setHomeStep(0);
  };

  const handleHomeModalChange = (open: boolean) => {
    setIsHomeModalOpen(open);
    if (!open) {
      setNewHomeName("");
      setNewHomeLocation("");
      setNewHomeShortcuts([]);
      setIsShortcutComposerOpen(false);
      setDraftShortcutKind(null);
      setDraftShortcutName("");
      setHomeStep(0);
    }
  };

  const homeShortcuts: Array<{ id: HomeShortcutKind; label: string; icon: ReactNode; description: string }> = [
    { id: "alarm", label: "Alarma", icon: <Bell size={20} />, description: "Seguridad" },
    { id: "speaker", label: "Parlante", icon: <Speaker size={20} />, description: "Audio" },
    { id: "air", label: "Aire acondicionado", icon: <Wind size={20} />, description: "Clima" },
    { id: "blind", label: "Persiana", icon: <Blinds size={20} />, description: "Cerramiento" },
    { id: "door", label: "Puerta", icon: <DoorOpen size={20} />, description: "Acceso" },
  ];

  const addShortcutToHome = () => {
    const trimmedName = draftShortcutName.trim();
    if (!draftShortcutKind || !trimmedName) return;

    const newShortcut: HomeShortcut = {
      id: `${draftShortcutKind}-${Date.now()}`,
      kind: draftShortcutKind,
      name: trimmedName,
    };

    setNewHomeShortcuts((previousShortcuts) => [...previousShortcuts, newShortcut]);
    setDraftShortcutKind(null);
    setDraftShortcutName("");
    setIsShortcutComposerOpen(false);
  };

  const removeShortcutFromHome = (shortcutId: string) => {
    setNewHomeShortcuts((previousShortcuts) =>
      previousShortcuts.filter((shortcut) => shortcut.id !== shortcutId),
    );
  };

  const homeSteps = [
    { id: "details", label: "Detalles" },
    { id: "shortcuts", label: "Shortcuts" },
  ];

  const openEditHomeModal = (homeName: string, homeSubtitle: string, shortcuts: HomeShortcut[] = []) => {
    setEditHomeName(homeName);
    setEditHomeLocation(homeSubtitle);
    setEditHomeStep(0);
    setEditHomeShortcuts(shortcuts);
    setIsEditShortcutComposerOpen(false);
    setDraftEditShortcutKind(null);
    setDraftEditShortcutName("");
    setIsEditHomeModalOpen(true);
  };

  const handleEditHome = () => {
    if (!currentHome) return;
    updateHome(currentHome.id, editHomeName, editHomeLocation, editHomeShortcuts);
    setIsEditHomeModalOpen(false);
  };

  const getShortcutIcon = (kind: HomeShortcutKind, size = 60, strokeWidth = 1.5) => {
    if (kind === "alarm") return <Bell size={size} strokeWidth={strokeWidth} />;
    if (kind === "speaker") return <Speaker size={size} strokeWidth={strokeWidth} />;
    if (kind === "air") return <Wind size={size} strokeWidth={strokeWidth} />;
    if (kind === "door") return <DoorOpen size={size} strokeWidth={strokeWidth} />;
    return <Blinds size={size} strokeWidth={strokeWidth} />;
  };

  const getDefaultShortcutControl = (kind: HomeShortcutKind): ShortcutControlState => {
    if (kind === "speaker") {
      return {
        on: false,
        volume: 45,
        bass: 50,
        position: 0,
        slat: 0,
        temperature: 22,
        fanSpeed: 2,
        airMode: "Frio",
        doorMode: "Abrir",
      };
    }

    if (kind === "air") {
      return {
        on: false,
        volume: 0,
        bass: 0,
        position: 0,
        slat: 0,
        temperature: 23,
        fanSpeed: 3,
        airMode: "Frio",
        doorMode: "Abrir",
      };
    }

    if (kind === "door") {
      return {
        on: true,
        volume: 0,
        bass: 0,
        position: 0,
        slat: 0,
        temperature: 0,
        fanSpeed: 0,
        airMode: "Frio",
        doorMode: "Cerrar",
      };
    }

    return {
      on: false,
      volume: 0,
      bass: 0,
      position: 50,
      slat: 50,
      temperature: 0,
      fanSpeed: 0,
      airMode: "Frio",
      doorMode: "Abrir",
    };
  };

  const openShortcutPopup = (shortcut: HomeShortcut) => {
    setShortcutControlById((previousState) => {
      if (previousState[shortcut.id]) return previousState;
      return {
        ...previousState,
        [shortcut.id]: getDefaultShortcutControl(shortcut.kind),
      };
    });
    setActiveShortcut(shortcut);
  };

  const openDoorPopup = (shortcut: HomeShortcut) => {
    setShortcutControlById((previousState) => {
      if (previousState[shortcut.id]) return previousState;
      return {
        ...previousState,
        [shortcut.id]: getDefaultShortcutControl("door"),
      };
    });
    setActiveDoorShortcut(shortcut);
  };

  const updateShortcutControl = (shortcutId: string, patch: Partial<ShortcutControlState>) => {
    setShortcutControlById((previousState) => ({
      ...previousState,
      [shortcutId]: {
        ...(previousState[shortcutId] ?? getDefaultShortcutControl("speaker")),
        ...patch,
      },
    }));
  };

  const shortcutsForHeader: HomeShortcut[] = [
    { id: `${currentHome.id}-alarm-default`, kind: "alarm", name: "Alarma" },
    ...(currentHome.shortcuts ?? []).filter((shortcut) => shortcut.kind !== "alarm"),
  ];

  const handleEditHomeModalChange = (open: boolean) => {
    setIsEditHomeModalOpen(open);
    if (!open) {
      setEditHomeStep(0);
      setIsEditShortcutComposerOpen(false);
      setDraftEditShortcutKind(null);
      setDraftEditShortcutName("");
    }
  };

  const addShortcutToEditHome = () => {
    const trimmedName = draftEditShortcutName.trim();
    if (!draftEditShortcutKind || !trimmedName) return;

    const newShortcut: HomeShortcut = {
      id: `${draftEditShortcutKind}-${Date.now()}`,
      kind: draftEditShortcutKind,
      name: trimmedName,
    };

    setEditHomeShortcuts((previousShortcuts) => [...previousShortcuts, newShortcut]);
    setDraftEditShortcutKind(null);
    setDraftEditShortcutName("");
    setIsEditShortcutComposerOpen(false);
  };

  const removeShortcutFromEditHome = (shortcutId: string) => {
    setEditHomeShortcuts((previousShortcuts) =>
      previousShortcuts.filter((shortcut) => shortcut.id !== shortcutId),
    );
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
            <div>
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] border ${
                    allOff
                      ? "border-[#2b3448] bg-[#151b28] text-[#717a8f]"
                      : "border-[#f4bd49]/60 bg-[#16120a] text-[#f4bd49]"
                  }`}
                >
                  {getSpaceIcon(space.kind, 28)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className={isMobile ? "text-[22px] font-semibold text-white" : "text-[30px] font-semibold text-white"}>
                    {space.name}
                  </h3>
                </div>
              </div>

              <div className={isMobile ? "mt-5 grid grid-cols-[repeat(5,min-content)] justify-start gap-3" : "mt-5 grid grid-cols-[repeat(6,min-content)] justify-start gap-3"}>
                {space.devices.length > 0 ? (
                  space.devices.map((device, index) => (
                    <div
                      key={index}
                      className={`flex h-11 w-11 items-center justify-center rounded-[16px] border border-[#252d3f] bg-[#161c28] ${
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
            <div className={isMobile ? "flex items-stretch gap-3" : "flex items-end justify-between gap-6"}>
              <DropdownMenu>
                <div className="relative">
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="group flex items-start justify-between rounded-[30px] border border-[#2b3448] bg-[#111723]/92 px-5 py-5 pr-16 text-left shadow-[0_18px_52px_rgba(0,0,0,0.18)] transition-all hover:border-[#44506a]"
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
                    </button>
                  </DropdownMenuTrigger>

                  <button
                    type="button"
                    onClick={() => openEditHomeModal(currentHome.name, currentHome.subtitle, currentHome.shortcuts ?? [])}
                    aria-label="Editar hogar seleccionado"
                    className="absolute right-5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#3d4962] bg-[#151a25] text-[#d2d8e6] transition-colors hover:border-[#5a6b8f] hover:text-white"
                  >
                    <Pencil size={16} />
                  </button>
                </div>
 
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
              
              {!isMobile && (
                <div className="flex items-center gap-3">
                  {shortcutsForHeader.map((shortcut) => {
                    const isAlarmShortcut = shortcut.kind === "alarm";
                    const isDoorShortcut = shortcut.kind === "door";
                    const shortcutControl = shortcutControlById[shortcut.id];
                    const isActive = isAlarmShortcut
                      ? isHomeAlarmOn
                      : isDoorShortcut
                        ? shortcutControl?.doorMode === "Cerrar" || shortcutControl?.doorMode === "Bloquear"
                        : Boolean(shortcutControl?.on);

                    return (
                      <button
                        key={shortcut.id}
                        type="button"
                        onClick={() => {
                          if (isAlarmShortcut) {
                            setIsAlarmConfirmOpen(true);
                          } else if (isDoorShortcut) {
                            openDoorPopup(shortcut);
                          } else {
                            openShortcutPopup(shortcut);
                          }
                        }}
                        aria-label={isAlarmShortcut ? (isHomeAlarmOn ? "Apagar alarma" : "Encender alarma") : shortcut.name}
                        className={`rounded-[30px] border px-4 py-5 transition-colors inline-flex items-center justify-center shrink-0 shadow-[0_18px_52px_rgba(0,0,0,0.18)] ${
                          isActive
                            ? "border-[#f4bd49]/60 bg-[#16120a] text-[#f4bd49]"
                            : "border-[#2b3448] bg-[#111723]/92 text-[#717a8f]"
                        }`}
                        title={shortcut.name}
                      >
                        {getShortcutIcon(shortcut.kind)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
 
            <div className={isMobile ? "space-y-3" : "flex items-end justify-between gap-6"}>
              <div>
                
                <h2 className={isMobile ? "mt-2 text-[30px] font-semibold text-white" : "mt-3 text-[36px] font-semibold text-white"}>
                  Espacios
                </h2>
                
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
 
      <Dialog open={isHomeModalOpen} onOpenChange={handleHomeModalChange}>
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

              <ol className="mt-5 grid grid-cols-2 gap-2">
                {homeSteps.map((step, index) => {
                  const isCurrentStep = index === homeStep;
                  const isCompletedStep = index < homeStep;

                  return (
                    <li key={step.id} className="relative">
                      {index < homeSteps.length - 1 ? (
                        <span
                          className={`absolute left-1/2 right-[-50%] top-5 h-[2px] ${
                            isCompletedStep ? "bg-[#d6a339]" : "bg-[#2a3346]"
                          }`}
                        />
                      ) : null}
                      <div className="relative z-10 flex flex-col items-center gap-2 text-center">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors ${
                            isCompletedStep
                              ? "border-[#d6a339] bg-[#d6a339] text-[#10151f]"
                              : isCurrentStep
                                ? "border-[#d6a339] bg-[#151d2a] text-[#f0c45c]"
                                : "border-[#2b3548] bg-[#10151f] text-[#7f8aa3]"
                          }`}
                        >
                          {isCompletedStep ? <Check size={16} /> : index + 1}
                        </div>
                        <p
                          className={`text-[13px] font-medium ${
                            isCurrentStep || isCompletedStep ? "text-white" : "text-[#8b96ab]"
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
 
            <div className="relative space-y-6 px-6 pb-8 pt-6 sm:px-8">
              {homeStep === 0 ? (
                <>
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
                    onClick={() => setHomeStep(1)}
                    disabled={!newHomeName.trim()}
                    className={`w-full rounded-[20px] border-2 py-4 text-[15px] font-medium transition-all ${
                      newHomeName.trim()
                        ? "border-[#f4bd49] bg-[#15110a] text-[#f4bd49]"
                        : "border-[#202636] bg-[#202636] text-[#6b7280]"
                    }`}
                  >
                    Continuar
                  </button>
                </>
              ) : (
                <>
                  <div className="space-y-3">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
                      Shortcuts
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {newHomeShortcuts.map((shortcut) => {
                        const shortcutMeta = homeShortcuts.find((item) => item.id === shortcut.kind);

                        return (
                          <div
                            key={shortcut.id}
                            className="relative rounded-[18px] border border-[#252e3f] bg-[#121722] px-3 py-4"
                          >
                            <button
                              type="button"
                              onClick={() => removeShortcutFromHome(shortcut.id)}
                              className="absolute right-2 top-2 rounded-full border border-[#2b3548] bg-[#141a26] px-2 py-0.5 text-[10px] text-[#aeb6c8] transition-colors hover:border-[#5a6b8f] hover:text-white"
                            >
                              x
                            </button>
                            <div className="flex flex-col items-center justify-center gap-2 pt-2 text-center">
                              <div className="text-[#f4bd49]">{shortcutMeta?.icon}</div>
                              <span className="text-[13px] font-medium leading-tight text-white">{shortcut.name}</span>
                              <span className="text-[11px] text-[#8f97ab]">{shortcutMeta?.label}</span>
                            </div>
                          </div>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => {
                          setIsShortcutComposerOpen(true);
                          setDraftShortcutKind(null);
                          setDraftShortcutName("");
                        }}
                        className="flex min-h-[134px] flex-col items-center justify-center rounded-[18px] border border-dashed border-[#3b465d] bg-[#101620]/70 p-4 text-center transition-all hover:border-[#566582]"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-[#f4bd49]/60 bg-[#16120a] text-[#f4bd49]">
                          <Plus size={20} />
                        </div>
                        <p className="mt-3 text-[13px] font-medium text-white">Agregar shortcut</p>
                      </button>
                    </div>

                    {isShortcutComposerOpen ? (
                      <div className="rounded-[20px] border border-[#2b3042] bg-[#111723] p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
                          Nuevo shortcut
                        </p>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {homeShortcuts.map((shortcut) => {
                            const isSelected = draftShortcutKind === shortcut.id;

                            return (
                              <button
                                key={shortcut.id}
                                type="button"
                                onClick={() => setDraftShortcutKind(shortcut.id)}
                                className={`flex items-center gap-2 rounded-[14px] border px-3 py-2 text-left text-sm transition-all ${
                                  isSelected
                                    ? "border-[#f4bd49]/70 bg-[#15110a] text-[#f4bd49]"
                                    : "border-[#202636] bg-[#171b26] text-[#aab3c8]"
                                }`}
                              >
                                {shortcut.icon}
                                {shortcut.label}
                              </button>
                            );
                          })}
                        </div>

                        <div className="mt-3 rounded-[16px] border border-[#2b3042] bg-[#1d2230] px-4 py-3">
                          <input
                            type="text"
                            value={draftShortcutName}
                            onChange={(event) => setDraftShortcutName(event.target.value)}
                            placeholder="Nombre del dispositivo"
                            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#6b7280]"
                          />
                        </div>

                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => setIsShortcutComposerOpen(false)}
                            className="w-full rounded-[14px] border border-[#2b3042] bg-[#151a25] py-2 text-sm text-[#d2d8e6] transition-colors hover:border-[#5a6b8f]"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={addShortcutToHome}
                            disabled={!draftShortcutKind || !draftShortcutName.trim()}
                            className={`w-full rounded-[14px] border py-2 text-sm font-medium transition-colors ${
                              draftShortcutKind && draftShortcutName.trim()
                                ? "border-[#f4bd49] bg-[#15110a] text-[#f4bd49]"
                                : "border-[#202636] bg-[#202636] text-[#6b7280]"
                            }`}
                          >
                            Agregar
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setHomeStep(0)}
                      className="w-full rounded-[20px] border border-[#2b3042] bg-[#151a25] py-4 text-[15px] font-medium text-[#d2d8e6] transition-colors hover:border-[#5a6b8f]"
                    >
                      Atrás
                    </button>
                    <button
                      type="button"
                      onClick={handleAddHome}
                      className="w-full rounded-[20px] border-2 border-[#f4bd49] bg-[#15110a] py-4 text-[15px] font-medium text-[#f4bd49] transition-all"
                    >
                      Agregar hogar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditHomeModalOpen} onOpenChange={handleEditHomeModalChange}>
        <DialogContent className="w-[min(92vw,520px)] rounded-[32px] border border-[#2b3042] bg-[#0f1219] p-0 text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)] [&>button]:hidden">
          <div className="relative overflow-hidden rounded-[32px]">
            <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,#f4bd49_0%,rgba(244,189,73,0.2)_26%,transparent_70%)]" />
            <div className="relative border-b border-[#1f2432] px-6 pb-4 pt-6 sm:px-8">
              <DialogTitle className="text-[24px] font-semibold text-white">
                Editar hogar
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-[#7f879c]">
                Actualizá el nombre y la ubicación del hogar seleccionado.
              </DialogDescription>

              <ol className="mt-5 grid grid-cols-2 gap-2">
                {homeSteps.map((step, index) => {
                  const isCurrentStep = index === editHomeStep;
                  const isCompletedStep = index < editHomeStep;

                  return (
                    <li key={`edit-${step.id}`} className="relative">
                      {index < homeSteps.length - 1 ? (
                        <span
                          className={`absolute left-1/2 right-[-50%] top-5 h-[2px] ${
                            isCompletedStep ? "bg-[#d6a339]" : "bg-[#2a3346]"
                          }`}
                        />
                      ) : null}
                      <div className="relative z-10 flex flex-col items-center gap-2 text-center">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors ${
                            isCompletedStep
                              ? "border-[#d6a339] bg-[#d6a339] text-[#10151f]"
                              : isCurrentStep
                                ? "border-[#d6a339] bg-[#151d2a] text-[#f0c45c]"
                                : "border-[#2b3548] bg-[#10151f] text-[#7f8aa3]"
                          }`}
                        >
                          {isCompletedStep ? <Check size={16} /> : index + 1}
                        </div>
                        <p
                          className={`text-[13px] font-medium ${
                            isCurrentStep || isCompletedStep ? "text-white" : "text-[#8b96ab]"
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="relative space-y-6 px-6 pb-8 pt-6 sm:px-8">
              {editHomeStep === 0 ? (
                <>
                  <div className="space-y-3">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
                      Nombre
                    </label>
                    <div className="rounded-[20px] border border-[#2b3042] bg-[#1d2230] px-5 py-4">
                      <input
                        type="text"
                        value={editHomeName}
                        onChange={(event) => setEditHomeName(event.target.value)}
                        placeholder="Mi hogar"
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
                        value={editHomeLocation}
                        onChange={(event) => setEditHomeLocation(event.target.value)}
                        placeholder="Ciudad o referencia"
                        className="w-full bg-transparent text-base text-white outline-none placeholder:text-[#6b7280]"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditHomeStep(1)}
                    disabled={!editHomeName.trim()}
                    className={`w-full rounded-[20px] border-2 py-4 text-[15px] font-medium transition-all ${
                      editHomeName.trim()
                        ? "border-[#f4bd49] bg-[#15110a] text-[#f4bd49]"
                        : "border-[#202636] bg-[#202636] text-[#6b7280]"
                    }`}
                  >
                    Continuar
                  </button>
                </>
              ) : (
                <>
                  <div className="space-y-3">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
                      Shortcuts
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {editHomeShortcuts.map((shortcut) => {
                        const shortcutMeta = homeShortcuts.find((item) => item.id === shortcut.kind);

                        return (
                          <div
                            key={shortcut.id}
                            className="relative rounded-[18px] border border-[#252e3f] bg-[#121722] px-3 py-4"
                          >
                            <button
                              type="button"
                              onClick={() => removeShortcutFromEditHome(shortcut.id)}
                              className="absolute right-2 top-2 rounded-full border border-[#2b3548] bg-[#141a26] px-2 py-0.5 text-[10px] text-[#aeb6c8] transition-colors hover:border-[#5a6b8f] hover:text-white"
                            >
                              x
                            </button>
                            <div className="flex flex-col items-center justify-center gap-2 pt-2 text-center">
                              <div className="text-[#f4bd49]">{shortcutMeta?.icon}</div>
                              <span className="text-[13px] font-medium leading-tight text-white">{shortcut.name}</span>
                              <span className="text-[11px] text-[#8f97ab]">{shortcutMeta?.label}</span>
                            </div>
                          </div>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => {
                          setIsEditShortcutComposerOpen(true);
                          setDraftEditShortcutKind(null);
                          setDraftEditShortcutName("");
                        }}
                        className="flex min-h-[134px] flex-col items-center justify-center rounded-[18px] border border-dashed border-[#3b465d] bg-[#101620]/70 p-4 text-center transition-all hover:border-[#566582]"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-[#f4bd49]/60 bg-[#16120a] text-[#f4bd49]">
                          <Plus size={20} />
                        </div>
                        <p className="mt-3 text-[13px] font-medium text-white">Agregar shortcut</p>
                      </button>
                    </div>

                    {isEditShortcutComposerOpen ? (
                      <div className="rounded-[20px] border border-[#2b3042] bg-[#111723] p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
                          Nuevo shortcut
                        </p>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {homeShortcuts.map((shortcut) => {
                            const isSelected = draftEditShortcutKind === shortcut.id;

                            return (
                              <button
                                key={shortcut.id}
                                type="button"
                                onClick={() => setDraftEditShortcutKind(shortcut.id)}
                                className={`flex items-center gap-2 rounded-[14px] border px-3 py-2 text-left text-sm transition-all ${
                                  isSelected
                                    ? "border-[#f4bd49]/70 bg-[#15110a] text-[#f4bd49]"
                                    : "border-[#202636] bg-[#171b26] text-[#aab3c8]"
                                }`}
                              >
                                {shortcut.icon}
                                {shortcut.label}
                              </button>
                            );
                          })}
                        </div>

                        <div className="mt-3 rounded-[16px] border border-[#2b3042] bg-[#1d2230] px-4 py-3">
                          <input
                            type="text"
                            value={draftEditShortcutName}
                            onChange={(event) => setDraftEditShortcutName(event.target.value)}
                            placeholder="Nombre del dispositivo"
                            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#6b7280]"
                          />
                        </div>

                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => setIsEditShortcutComposerOpen(false)}
                            className="w-full rounded-[14px] border border-[#2b3042] bg-[#151a25] py-2 text-sm text-[#d2d8e6] transition-colors hover:border-[#5a6b8f]"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={addShortcutToEditHome}
                            disabled={!draftEditShortcutKind || !draftEditShortcutName.trim()}
                            className={`w-full rounded-[14px] border py-2 text-sm font-medium transition-colors ${
                              draftEditShortcutKind && draftEditShortcutName.trim()
                                ? "border-[#f4bd49] bg-[#15110a] text-[#f4bd49]"
                                : "border-[#202636] bg-[#202636] text-[#6b7280]"
                            }`}
                          >
                            Agregar
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setEditHomeStep(0)}
                      className="w-full rounded-[20px] border border-[#2b3042] bg-[#151a25] py-4 text-[15px] font-medium text-[#d2d8e6] transition-colors hover:border-[#5a6b8f]"
                    >
                      Atrás
                    </button>
                    <button
                      type="button"
                      onClick={handleEditHome}
                      disabled={!editHomeName.trim()}
                      className={`w-full rounded-[20px] border-2 py-4 text-[15px] font-medium transition-all ${
                        editHomeName.trim()
                          ? "border-[#f4bd49] bg-[#15110a] text-[#f4bd49]"
                          : "border-[#202636] bg-[#202636] text-[#6b7280]"
                      }`}
                    >
                      Guardar cambios
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(activeShortcut && activeShortcut.kind !== "alarm")}
        onOpenChange={(open) => {
          if (!open) setActiveShortcut(null);
        }}
      >
        <DialogContent className="w-[min(92vw,520px)] rounded-[32px] border border-[#2b3042] bg-[#0f1219] p-0 text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)] [&>button]:hidden">
          <div className="relative overflow-hidden rounded-[32px]">
            <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,#f4bd49_0%,rgba(244,189,73,0.2)_26%,transparent_70%)]" />
            <div className="relative border-b border-[#1f2432] px-6 pb-4 pt-6 sm:px-8">
              <DialogTitle className="text-[24px] font-semibold text-white">
                {activeShortcut?.name}
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-[#7f879c]">
                Configurá encendido y atributos del shortcut.
              </DialogDescription>
            </div>

            <div className="relative space-y-6 px-6 pb-8 pt-6 sm:px-8">
              {activeShortcut ? (
                (() => {
                  const control =
                    shortcutControlById[activeShortcut.id] ??
                    getDefaultShortcutControl(activeShortcut.kind);

                  return (
                    <>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            updateShortcutControl(activeShortcut.id, {
                              on: !control.on,
                            })
                          }
                          className={`w-full rounded-[18px] border px-4 py-3 text-sm font-medium transition-colors ${
                            control.on
                              ? "border-[#f4bd49]/60 bg-[#16120a] text-[#f4bd49]"
                              : "border-[#2b3448] bg-[#151b28] text-[#717a8f]"
                          }`}
                        >
                          {control.on ? "Apagar" : "Prender"}
                        </button>
                      </div>

                      {activeShortcut.kind === "speaker" ? (
                        <>
                          <div className="space-y-2">
                            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
                              Volumen: {control.volume}%
                            </label>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={control.volume}
                              onChange={(event) =>
                                updateShortcutControl(activeShortcut.id, {
                                  volume: Number(event.target.value),
                                })
                              }
                              className="w-full accent-[#f4bd49]"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
                              Bajos: {control.bass}%
                            </label>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={control.bass}
                              onChange={(event) =>
                                updateShortcutControl(activeShortcut.id, {
                                  bass: Number(event.target.value),
                                })
                              }
                              className="w-full accent-[#f4bd49]"
                            />
                          </div>
                        </>
                      ) : null}

                      {activeShortcut.kind === "blind" ? (
                        <>
                          <div className="space-y-2">
                            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
                              Apertura: {control.position}%
                            </label>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={control.position}
                              onChange={(event) =>
                                updateShortcutControl(activeShortcut.id, {
                                  position: Number(event.target.value),
                                })
                              }
                              className="w-full accent-[#f4bd49]"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
                              Inclinación: {control.slat}%
                            </label>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={control.slat}
                              onChange={(event) =>
                                updateShortcutControl(activeShortcut.id, {
                                  slat: Number(event.target.value),
                                })
                              }
                              className="w-full accent-[#f4bd49]"
                            />
                          </div>
                        </>
                      ) : null}

                      {activeShortcut.kind === "air" ? (
                        <>
                          <div className="space-y-2">
                            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
                              Temperatura: {control.temperature}°C
                            </label>
                            <input
                              type="range"
                              min={16}
                              max={30}
                              value={control.temperature}
                              onChange={(event) =>
                                updateShortcutControl(activeShortcut.id, {
                                  temperature: Number(event.target.value),
                                })
                              }
                              className="w-full accent-[#f4bd49]"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
                              Intensidad: {control.fanSpeed}
                            </label>
                            <input
                              type="range"
                              min={1}
                              max={5}
                              value={control.fanSpeed}
                              onChange={(event) =>
                                updateShortcutControl(activeShortcut.id, {
                                  fanSpeed: Number(event.target.value),
                                })
                              }
                              className="w-full accent-[#f4bd49]"
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            {(["Frio", "Calor", "Ventilacion"] as const).map((mode) => {
                              const isSelected = control.airMode === mode;

                              return (
                                <button
                                  key={mode}
                                  type="button"
                                  onClick={() =>
                                    updateShortcutControl(activeShortcut.id, {
                                      airMode: mode,
                                    })
                                  }
                                  className={`rounded-[14px] border px-3 py-2 text-xs transition-colors ${
                                    isSelected
                                      ? "border-[#f4bd49]/70 bg-[#15110a] text-[#f4bd49]"
                                      : "border-[#202636] bg-[#171b26] text-[#aab3c8]"
                                  }`}
                                >
                                  {mode}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => setActiveShortcut(null)}
                        className="w-full rounded-[20px] border border-[#2b3042] bg-[#151a25] py-3 text-[14px] font-medium text-[#d2d8e6] transition-colors hover:border-[#5a6b8f]"
                      >
                        Cerrar
                      </button>
                    </>
                  );
                })()
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(activeDoorShortcut)}
        onOpenChange={(open) => {
          if (!open) setActiveDoorShortcut(null);
        }}
      >
        <DialogContent className="w-[min(92vw,460px)] rounded-[32px] border border-[#2b3042] bg-[#0f1219] p-0 text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)] [&>button]:hidden">
          <div className="relative overflow-hidden rounded-[32px]">
            <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,#f4bd49_0%,rgba(244,189,73,0.2)_26%,transparent_70%)]" />
            <div className="relative border-b border-[#1f2432] px-6 pb-4 pt-6">
              <DialogTitle className="text-[24px] font-semibold text-white">
                Control de puerta
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-[#7f879c]">
                Elegí la acción para este shortcut.
              </DialogDescription>
            </div>

            <div className="relative space-y-4 px-6 pb-6 pt-5">
              {activeDoorShortcut ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    {(["Cerrar", "Abrir", "Bloquear", "Desbloquear"] as const).map((mode) => {
                      const currentMode =
                        shortcutControlById[activeDoorShortcut.id]?.doorMode ?? "Cerrar";
                      const isSelected = currentMode === mode;

                      return (
                        <button
                          key={mode}
                          type="button"
                          onClick={() =>
                            updateShortcutControl(activeDoorShortcut.id, {
                              doorMode: mode,
                              on: mode === "Cerrar" || mode === "Bloquear",
                            })
                          }
                          className={`rounded-[16px] border px-3 py-3 text-sm font-medium transition-colors ${
                            isSelected
                              ? "border-[#f4bd49]/70 bg-[#15110a] text-[#f4bd49]"
                              : "border-[#202636] bg-[#171b26] text-[#aab3c8]"
                          }`}
                        >
                          {mode}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveDoorShortcut(null)}
                    className="w-full rounded-[18px] border border-[#2b3548] bg-[#141a26] px-4 py-3 text-sm font-medium text-[#d0d6e3] transition-colors hover:bg-[#192131] hover:text-white"
                  >
                    Cerrar
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlarmConfirmOpen} onOpenChange={setIsAlarmConfirmOpen}>
        <AlertDialogContent className="max-w-[460px] rounded-[28px] border border-[#2b3042] bg-[#0f1219] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle className="text-[24px] text-white">
              {isHomeAlarmOn ? "¿Desactivar la alarma?" : "¿Activar la alarma?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[15px] leading-6 text-[#98a2b7]">
              {isHomeAlarmOn
                ? "El sistema de seguridad dejará de monitorear tu hogar."
                : "El sistema de seguridad de tu hogar quedará encendido."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-2">
            <AlertDialogCancel className="rounded-[18px] border border-[#2b3548] bg-[#141a26] text-[#d0d6e3] hover:bg-[#192131] hover:text-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => setIsHomeAlarmOn((prev) => !prev)}
              className={`rounded-[18px] border ${
                isHomeAlarmOn
                  ? "border-[#8f3949] bg-[#2a141a] text-[#ffb4c0] hover:bg-[#341820]"
                  : "border-[#f4bd49] bg-[#15110a] text-[#f4bd49] hover:bg-[#1b1408]"
              }`}
            >
              {isHomeAlarmOn ? "Desactivar" : "Activar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}