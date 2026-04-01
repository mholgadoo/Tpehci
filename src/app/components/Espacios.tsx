import {
  Bell,
  Blinds,
  Bot,
  Check,
  ChevronDown,
  CookingPot,
  DoorOpen,
  Droplet,
  LogOut,
  MoonStar,
  Pencil,
  Plus,
  Settings,
  Shield,
  ShieldCheck,
  ShieldOff,
  Speaker,
  User,
  Users,
  Wind,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { getAccountInitials, useAccount } from "../context/account-context";
import {
  alarmModeLabels,
  type AcFanSpeed,
  type AcMode,
  getDeviceIcon,
  getSpeakerQueueForGenre,
  type Device,
  type HomeShortcut,
  getSpaceIcon,
  type HomeShortcutKind,
  spaceTypeOptions,
  type AlarmMode,
  type SpaceKind,
  useHome,
} from "../context/home-context";
import { COMPACT_LAYOUT_BREAKPOINT, useIsMobile } from "../hooks/useIsMobile";
import { AlarmModal } from "./AlarmModal";
import { DeviceDetailControls } from "./DeviceDetailControls";
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
    acMode?: AcMode;
    acFanSpeed?: AcFanSpeed;
    swing?: boolean;
    doorMode: "Cerrar" | "Abrir" | "Bloquear" | "Desbloquear";
    speakerGenre?: Device["speakerGenre"];
    speakerQueue?: Device["speakerQueue"];
    speakerTrackIndex?: number;
    speakerPlaybackState?: Device["speakerPlaybackState"];
    speakerProgressMs?: number;
    speakerTimestamp?: number;
  };

  type AlarmOptionsState = {
    houseModeOn: boolean;
    regularModeOn: boolean;
    securityCode: string;
  };

  type PendingAlarmModeChange = {
    alarmId: string;
    mode: "house" | "regular";
  };

  const isMobile = useIsMobile(COMPACT_LAYOUT_BREAKPOINT);
  const navigate = useNavigate();
  const { accountOptions, selectedAccount, setSelectedAccount, sessionClosed, setSessionClosed } =
    useAccount();
  const {
    homes,
    selectedHomeId,
    setSelectedHomeId,
    currentHome,
    addHome,
    updateHome,
    addSpace,
    updateAlarmMode,
    updateAlarmZone,
  } =
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
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [isAlarmsModalOpen, setIsAlarmsModalOpen] = useState(false);
  const [activeAlarm, setActiveAlarm] = useState<null>(null);
  const [isAlarmOptionsModalOpen, setIsAlarmOptionsModalOpen] = useState(false);
  const [alarmOptionsById, setAlarmOptionsById] = useState<Record<string, AlarmOptionsState>>({});
  const [isSecurityCodeModalOpen, setIsSecurityCodeModalOpen] = useState(false);
  const [pendingAlarmModeChange, setPendingAlarmModeChange] = useState<PendingAlarmModeChange | null>(null);
  const [securityCodeInput, setSecurityCodeInput] = useState("");
  const [securityCodeError, setSecurityCodeError] = useState("");
  const [isChangeSecurityCodeModalOpen, setIsChangeSecurityCodeModalOpen] = useState(false);
  const [changeSecurityCodeAlarmId, setChangeSecurityCodeAlarmId] = useState<string | null>(null);
  const [changeSecurityCodeOld, setChangeSecurityCodeOld] = useState("");
  const [changeSecurityCodeNew, setChangeSecurityCodeNew] = useState("");
  const [changeSecurityCodeError, setChangeSecurityCodeError] = useState("");
  const [isCreateAlarmModalOpen, setIsCreateAlarmModalOpen] = useState(false);
  const [draftAlarmName, setDraftAlarmName] = useState("");
 
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
    addHome(trimmedHomeName, newHomeLocation, []);
    setIsHomeModalOpen(false);
    setNewHomeName("");
    setNewHomeLocation("");
  };

  const handleHomeModalChange = (open: boolean) => {
    setIsHomeModalOpen(open);
    if (!open) {
      setNewHomeName("");
      setNewHomeLocation("");
    }
  };

  const homeShortcuts: Array<{ id: HomeShortcutKind; label: string; icon: ReactNode; description: string }> = [
    { id: "speaker", label: "Parlante", icon: <Speaker size={20} />, description: "Audio" },
    { id: "air", label: "Aire acondicionado", icon: <Wind size={20} />, description: "Clima" },
    { id: "blind", label: "Persiana", icon: <Blinds size={20} />, description: "Cerramiento" },
    { id: "door", label: "Puerta", icon: <DoorOpen size={20} />, description: "Acceso" },
  ];

  const selectedNewShortcutKinds = new Set(newHomeShortcuts.map((shortcut) => shortcut.kind));
  const availableNewShortcutOptions = homeShortcuts.filter(
    (shortcut) => !selectedNewShortcutKinds.has(shortcut.id),
  );

  const selectedEditShortcutKinds = new Set(editHomeShortcuts.map((shortcut) => shortcut.kind));
  const availableEditShortcutOptions = homeShortcuts.filter(
    (shortcut) => !selectedEditShortcutKinds.has(shortcut.id),
  );

  const addShortcutToHome = () => {
    const trimmedName = draftShortcutName.trim();
    if (!draftShortcutKind || !trimmedName) return;

    const alreadyExists = newHomeShortcuts.some((shortcut) => shortcut.kind === draftShortcutKind);
    if (alreadyExists) return;

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

  const openEditHomeModal = (homeName: string, homeSubtitle: string) => {
    setEditHomeName(homeName);
    setEditHomeLocation(homeSubtitle);
    setIsEditHomeModalOpen(true);
  };

  const handleEditHome = () => {
    if (!currentHome) return;
    updateHome(currentHome.id, editHomeName, editHomeLocation, currentHome.shortcuts ?? []);
    setIsEditHomeModalOpen(false);
  };

  const getShortcutIcon = (kind: HomeShortcutKind, size = 60, strokeWidth = 1.5) => {
    if (kind === "alarm") return <Bell size={size} strokeWidth={strokeWidth} />;
    if (kind === "speaker") return <Speaker size={size} strokeWidth={strokeWidth} />;
    if (kind === "air") return <Wind size={size} strokeWidth={strokeWidth} />;
    if (kind === "blind") return <Blinds size={size} strokeWidth={strokeWidth} />;
    if (kind === "door") return <DoorOpen size={size} strokeWidth={strokeWidth} />;
    if (kind === "oven") return <CookingPot size={size} strokeWidth={strokeWidth} />;
    if (kind === "vacuum") return <Bot size={size} strokeWidth={strokeWidth} />;
    if (kind === "sprinkler") return <Droplet size={size} strokeWidth={strokeWidth} />;
    return <Blinds size={size} strokeWidth={strokeWidth} />;
  };

  const getDefaultShortcutControl = (kind: HomeShortcutKind): ShortcutControlState => {
    if (kind === "speaker") {
      return {
        on: false,
        volume: 50,
        bass: 50,
        position: 0,
        slat: 0,
        temperature: 22,
        fanSpeed: 2,
        airMode: "Frio",
        acMode: "cool",
        acFanSpeed: "med",
        swing: false,
        doorMode: "Abrir",
        speakerGenre: "pop",
        speakerQueue: getSpeakerQueueForGenre("pop"),
        speakerTrackIndex: 0,
        speakerPlaybackState: "stopped",
        speakerProgressMs: 0,
        speakerTimestamp: Date.now(),
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
        acMode: "cool",
        acFanSpeed: "med",
        swing: false,
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
        acMode: "cool",
        acFanSpeed: "auto",
        swing: false,
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
      acMode: "cool",
      acFanSpeed: "auto",
      swing: false,
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

  const getDefaultAlarmOptions = (): AlarmOptionsState => ({
    houseModeOn: false,
    regularModeOn: false,
    securityCode: "1234",
  });

  const openAlarmOptionsPopup = (alarm: HomeAlarm) => {
    setAlarmOptionsById((previousState) => {
      if (previousState[alarm.id]) return previousState;
      return {
        ...previousState,
        [alarm.id]: getDefaultAlarmOptions(),
      };
    });
    setActiveAlarm(alarm);
    setIsAlarmOptionsModalOpen(true);
  };

  const updateAlarmOptions = (alarmId: string, patch: Partial<AlarmOptionsState>) => {
    setAlarmOptionsById((previousState) => ({
      ...previousState,
      [alarmId]: {
        ...(previousState[alarmId] ?? getDefaultAlarmOptions()),
        ...patch,
      },
    }));
  };

  const isAlarmActive = (alarm: HomeAlarm): boolean => {
    const options = alarmOptionsById[alarm.id];
    if (!options) return false;
    return options.houseModeOn || options.regularModeOn;
  };

  const openSecurityCodeModal = (alarmId: string, mode: "house" | "regular") => {
    setPendingAlarmModeChange({ alarmId, mode });
    setSecurityCodeInput("");
    setSecurityCodeError("");
    setIsSecurityCodeModalOpen(true);
  };

  const confirmSecurityCodeAndToggleMode = () => {
    if (!pendingAlarmModeChange) return;

    const normalizedCode = securityCodeInput.trim();
    if (!/^\d{4}$/.test(normalizedCode)) {
      setSecurityCodeError("El código debe tener exactamente 4 dígitos numéricos.");
      return;
    }

    const currentCode =
      (alarmOptionsById[pendingAlarmModeChange.alarmId] ?? getDefaultAlarmOptions()).securityCode;

    if (normalizedCode !== currentCode) {
      setSecurityCodeError("Código de seguridad incorrecto.");
      return;
    }

    const currentState =
      alarmOptionsById[pendingAlarmModeChange.alarmId] ?? getDefaultAlarmOptions();

    if (pendingAlarmModeChange.mode === "house") {
      updateAlarmOptions(pendingAlarmModeChange.alarmId, {
        houseModeOn: !currentState.houseModeOn,
      });
    } else {
      updateAlarmOptions(pendingAlarmModeChange.alarmId, {
        regularModeOn: !currentState.regularModeOn,
      });
    }

    setIsSecurityCodeModalOpen(false);
    setPendingAlarmModeChange(null);
    setSecurityCodeInput("");
    setSecurityCodeError("");
  };

  const openChangeSecurityCodeModal = (alarmId: string) => {
    setChangeSecurityCodeAlarmId(alarmId);
    setChangeSecurityCodeOld("");
    setChangeSecurityCodeNew("");
    setChangeSecurityCodeError("");
    setIsChangeSecurityCodeModalOpen(true);
  };

  const confirmChangeSecurityCode = () => {
    if (!changeSecurityCodeAlarmId) return;

    const normalizedOld = changeSecurityCodeOld.trim();
    const normalizedNew = changeSecurityCodeNew.trim();

    // Validar código antiguo
    if (!/^\d{4}$/.test(normalizedOld)) {
      setChangeSecurityCodeError("El código actual debe tener exactamente 4 dígitos numéricos.");
      return;
    }

    // Validar código nuevo
    if (!/^\d{4}$/.test(normalizedNew)) {
      setChangeSecurityCodeError("El nuevo código debe tener exactamente 4 dígitos numéricos.");
      return;
    }

    // Verificar que el código antiguo sea correcto
    const currentCode =
      (alarmOptionsById[changeSecurityCodeAlarmId] ?? getDefaultAlarmOptions()).securityCode;

    if (normalizedOld !== currentCode) {
      setChangeSecurityCodeError("El código de seguridad actual es incorrecto.");
      return;
    }

    // Verificar que no sean iguales
    if (normalizedOld === normalizedNew) {
      setChangeSecurityCodeError("El nuevo código debe ser diferente al actual.");
      return;
    }

    // Actualizar el código
    updateAlarmOptions(changeSecurityCodeAlarmId, { securityCode: normalizedNew });

    // Mostrar notificación de éxito
    toast.success("Código de seguridad actualizado correctamente");

    setIsChangeSecurityCodeModalOpen(false);
    setChangeSecurityCodeAlarmId(null);
    setChangeSecurityCodeOld("");
    setChangeSecurityCodeNew("");
    setChangeSecurityCodeError("");
  };

  const getAlarmButtonMeta = (mode: AlarmMode) => {
    if (mode === "disarmed") {
      return {
        icon: ShieldOff,
        label: "Desarmado",
        classes: "border-[#56d08a]/35 bg-[#0d1a14] text-[#8af0b4]",
      };
    }

    if (mode === "armed_away") {
      return {
        icon: ShieldCheck,
        label: "Armado ausente",
        classes: "border-[#f28d56]/35 bg-[#21140e] text-[#ffc39c]",
      };
    }

    if (mode === "armed_night") {
      return {
        icon: MoonStar,
        label: "Modo noche",
        classes: "border-[#7ca8ff]/35 bg-[#101628] text-[#b7ccff]",
      };
    }

    return {
      icon: Shield,
      label: "Armado casa",
      classes: "border-[#f0c45c]/35 bg-[#191309] text-[#f0c45c]",
    };
  };

  const alarmButtonMeta = getAlarmButtonMeta(currentHome.alarm.mode);
  const AlarmButtonIcon = alarmButtonMeta.icon;
  const headerShortcuts = (currentHome.shortcuts ?? []).filter(
    (shortcut) => shortcut.kind !== "alarm",
  );

  const getShortcutMeta = (kind: HomeShortcutKind) =>
    homeShortcuts.find((shortcut) => shortcut.id === kind);

  const isShortcutActive = (shortcut: HomeShortcut) => {
    const shortcutState = shortcutControlById[shortcut.id];

    if (!shortcutState) return false;

    if (shortcut.kind === "door") {
      return (
        shortcutState.doorMode === "Cerrar" ||
        shortcutState.doorMode === "Bloquear"
      );
    }

    return shortcutState.on;
  };

  const handleShortcutPress = (shortcut: HomeShortcut) => {
    if (shortcut.kind === "door") {
      openDoorPopup(shortcut);
      return;
    }

    openShortcutPopup(shortcut);
  };

  const handleEditHomeModalChange = (open: boolean) => {
    setIsEditHomeModalOpen(open);
  };

  const addShortcutToEditHome = () => {
    const trimmedName = draftEditShortcutName.trim();
    if (!draftEditShortcutKind || !trimmedName) return;

    const alreadyExists = editHomeShortcuts.some((shortcut) => shortcut.kind === draftEditShortcutKind);
    if (alreadyExists) return;

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

  if (sessionClosed) {
    return (
      <div className="px-6 py-12 text-white">
        <div className="mx-auto max-w-[520px] rounded-[32px] border border-[#262d3d] bg-[#111520] p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
            Sesión cerrada
          </p>
          <h1 className="mt-3 text-[30px] font-semibold text-white">Hasta luego</h1>
         
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
            className={`group rounded-[30px] border bg-gradient-to-br shadow-[0_18px_44px_rgba(0,0,0,0.18)] transition-all ${
              allOff
                ? "border-[#2b3448] from-[#121722] to-[#080a10]"
                : "border-[#2b3448] from-[#181d28] to-[#0c1017] shadow-[0_18px_44px_rgba(214,163,57,0.08)]"
            } ${
              isMobile
                ? "block p-5 hover:border-[#465168]"
                : "relative flex min-h-[240px] flex-col justify-between p-6 pr-24 hover:-translate-y-1 hover:border-[#465168]"
            }`}
          >
            <div>
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] border ${
                    allOff
                      ? "border-[#2b3548] bg-[#161c28] text-[#a5aec2]"
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
        <div className={isMobile ? "relative px-5 pb-10 pt-7" : "relative mx-auto max-w-7xl px-12 py-10"}>
          <div className={isMobile ? "space-y-6" : "space-y-8"}>
            <div className={isMobile ? "grid grid-cols-[minmax(0,1fr)_60px_60px] items-stretch gap-3" : "flex items-end justify-between gap-6"}>
              <DropdownMenu>
                <div className={isMobile ? "relative min-w-0" : "relative"}>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={`group flex items-start justify-between rounded-[30px] border border-[#2b3448] bg-[#111723]/92 text-left shadow-[0_18px_52px_rgba(0,0,0,0.18)] transition-all hover:border-[#44506a] ${
                        isMobile ? "w-full min-w-0 px-4 py-5 pr-12" : "px-5 py-5 pr-16"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
                          Hogar activo
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <h1 className={isMobile ? "text-[28px] font-semibold leading-none text-white" : "text-[42px] font-semibold leading-none text-white"}>
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
                    onClick={() => openEditHomeModal(currentHome.name, currentHome.subtitle)}
                    aria-label="Editar hogar seleccionado"
                    className={`absolute top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#3d4962] bg-[#151a25] text-[#d2d8e6] transition-colors hover:border-[#5a6b8f] hover:text-white ${
                      isMobile ? "right-4" : "right-5"
                    }`}
                  >
                    <Pencil size={16} />
                  </button>
                </div>
 
                <DropdownMenuContent
                  align="start"
                  sideOffset={12}
                  className="w-[min(180vw,600px)] rounded-[28px] border border-[#2b3042] bg-[#111520]/96 p-4 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
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
                <button
                  type="button"
                  onClick={() => setIsAlarmModalOpen(true)}
                  className={`shrink-0 rounded-[30px] border shadow-[0_18px_52px_rgba(0,0,0,0.18)] transition-all hover:border-[#55627f] ${alarmButtonMeta.classes} flex h-[60px] w-[60px] items-center justify-center rounded-[22px] p-0`}
                  aria-label={`Abrir alarma: ${alarmModeLabels[currentHome.alarm.mode]}`}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-[18px] border border-current/30 bg-black/10">
                    <AlarmButtonIcon size={18} />
                  </div>
                </button>
              ) : (
                <div className="flex items-stretch gap-4">
                  {headerShortcuts.length > 0 ? (
                    <div className="min-w-[320px] rounded-[30px] border border-[#252d3f] bg-[#111723]/92 px-4 py-4 shadow-[0_18px_52px_rgba(0,0,0,0.18)]">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7f879c]">
                            Shortcuts
                          </p>
                          <p className="mt-1 text-sm text-[#98a2b7]">
                            Controles rápidos del hogar
                          </p>
                        </div>
                        <Link
                          to="/shortcuts"
                          className="rounded-full border border-[#2d3649] bg-[#151b28] px-3 py-1.5 text-[12px] font-medium text-[#d5dbea] transition-colors hover:border-[#44506a] hover:text-white"
                        >
                          Gestionar
                        </Link>
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        {headerShortcuts.map((shortcut) => {
                          const shortcutMeta = getShortcutMeta(shortcut.kind);
                          const isActive = isShortcutActive(shortcut);

                          return (
                            <button
                              key={shortcut.id}
                              type="button"
                              onClick={() => handleShortcutPress(shortcut)}
                              aria-label={shortcut.name}
                              title={shortcut.name}
                              className={`inline-flex h-14 w-14 items-center justify-center rounded-[20px] border shadow-[0_18px_40px_rgba(0,0,0,0.18)] transition-colors ${
                                isActive
                                  ? "border-[#f4bd49]/60 bg-[#16120a] text-[#f4bd49]"
                                  : "border-[#2b3448] bg-[#111723] text-[#717a8f]"
                              }`}
                            >
                              {getShortcutIcon(shortcut.kind, 20, 1.8)}
                              <span className="sr-only">
                                {shortcutMeta?.label ?? shortcut.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => setIsAlarmModalOpen(true)}
                    className={`shrink-0 rounded-[30px] border shadow-[0_18px_52px_rgba(0,0,0,0.18)] transition-all hover:border-[#55627f] ${alarmButtonMeta.classes} flex min-w-[220px] items-center gap-4 px-5 py-4`}
                    aria-label={`Abrir alarma: ${alarmModeLabels[currentHome.alarm.mode]}`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-current/30 bg-black/10">
                      <AlarmButtonIcon size={24} />
                    </div>

                    <div className="min-w-0 text-left">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-current/70">
                        Alarma
                      </p>
                      <p className="mt-1 truncate text-[17px] font-semibold text-current">
                        {alarmButtonMeta.label}
                      </p>
                      <p className="mt-1 text-sm text-current/70">
                        {currentHome.alarm.zones.filter((zone) => zone.armed).length} zonas activas
                      </p>
                    </div>
                  </button>
                </div>
              )}

              {isMobile ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex h-[60px] w-[60px] items-center justify-center rounded-[22px] border border-[#2b3448] bg-[#111723]/92 p-0 shadow-[0_18px_52px_rgba(0,0,0,0.18)] transition-all hover:border-[#44506a]"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#f4bd49]/60 bg-[#16120a] text-[12px] font-semibold text-[#f4bd49]">
                        {getAccountInitials(selectedAccount.name) || <User size={16} />}
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

            {isMobile && headerShortcuts.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#7f879c]">
                      Shortcuts
                    </p>
                    
                  </div>
                  <Link
                    to="/shortcuts"
                    className="rounded-full border border-[#2d3649] bg-[#151b28] px-3 py-1.5 text-[12px] font-medium text-[#d5dbea]"
                  >
                    Gestionar
                  </Link>
                </div>

                <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex gap-3 pb-1">
                    {headerShortcuts.map((shortcut) => {
                      const shortcutMeta = getShortcutMeta(shortcut.kind);
                      const isActive = isShortcutActive(shortcut);

                      return (
                        <button
                          key={shortcut.id}
                          type="button"
                          onClick={() => handleShortcutPress(shortcut)}
                          className={`flex min-w-[108px] flex-col items-start gap-3 rounded-[24px] border px-4 py-4 text-left shadow-[0_18px_40px_rgba(0,0,0,0.18)] transition-colors ${
                            isActive
                              ? "border-[#f4bd49]/60 bg-[#16120a] text-[#f4bd49]"
                              : "border-[#2b3448] bg-[#111723]/92 text-[#d2d8e6]"
                          }`}
                        >
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-[16px] border ${
                              isActive
                                ? "border-current/30 bg-black/10 text-current"
                                : "border-[#2d3649] bg-[#151b28] text-[#8f97ab]"
                            }`}
                          >
                            {getShortcutIcon(shortcut.kind, 18, 1.8)}
                          </div>
                          <div className="min-w-0 w-full">
                            <p className="truncate text-[14px] font-medium">
                              {shortcut.name}
                            </p>
                            <p
                              className={`mt-1 break-words text-[11px] leading-[1.25] uppercase tracking-[0.12em] ${
                                isActive ? "text-current/70" : "text-[#7f879c]"
                              }`}
                            >
                              {shortcutMeta?.description ?? "Shortcut"}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}
 
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

      <AlarmModal
        open={isAlarmModalOpen}
        onOpenChange={setIsAlarmModalOpen}
        homeName={currentHome.name}
        alarm={currentHome.alarm}
        onModeChange={(mode) => updateAlarmMode(currentHome.id, mode)}
        onZoneChange={(zoneId, armed) => updateAlarmZone(currentHome.id, zoneId, armed)}
      />
 
      <Dialog open={isSpaceModalOpen} onOpenChange={handleSpaceModalChange}>
        <DialogContent className="w-[min(92vw,760px)] rounded-[32px] border border-[#20283a] bg-[#0e1218] p-0 text-white shadow-[0_32px_120px_rgba(0,0,0,0.6)] [&>button]:hidden">
          <div className="relative overflow-hidden rounded-[32px]">
            <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(240,196,92,0.38),rgba(240,196,92,0.08)_35%,transparent_70%)]" />
            <div className="relative border-b border-[#20283a] px-6 pb-4 pt-6 sm:px-8">
              <DialogTitle className="text-[24px] font-semibold text-white">
                Nuevo Espacio
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-[#98a2b7]">
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
                      ? "border-[#de6178] bg-[#2b1a21]"
                      : "border-[#2b3548] bg-[#141a26]"
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
                            ? "border-[#d6a339]/60 bg-[#15120b] text-[#f4c95d] shadow-[0_10px_28px_rgba(214,163,57,0.08)]"
                            : "border-[#2b3548] bg-[#141a26] text-[#cdd4e2] hover:border-[#3f4f6d]"
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
                    ? "border-[#d6a339] bg-[#151d2a] text-[#f0c45c] hover:bg-[#1b2434]"
                    : "border-[#2b3548] bg-[#141a26] text-[#6b7280]"
                }`}
              >
                Agregar espacio
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
 
      <Dialog open={isHomeModalOpen} onOpenChange={handleHomeModalChange}>
        <DialogContent className="w-[min(92vw,520px)] rounded-[32px] border border-[#20283a] bg-[#0e1218] p-0 text-white shadow-[0_32px_120px_rgba(0,0,0,0.6)] [&>button]:hidden">
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

      <Dialog open={isEditHomeModalOpen} onOpenChange={handleEditHomeModalChange}>
        <DialogContent className="w-[min(92vw,520px)] rounded-[32px] border border-[#20283a] bg-[#0e1218] p-0 text-white shadow-[0_32px_120px_rgba(0,0,0,0.6)] [&>button]:hidden">
          <div className="relative overflow-hidden rounded-[32px]">
            <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,#f4bd49_0%,rgba(244,189,73,0.2)_26%,transparent_70%)]" />
            <div className="relative border-b border-[#1f2432] px-6 pb-4 pt-6 sm:px-8">
              <DialogTitle className="text-[24px] font-semibold text-white">
                Editar hogar
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-[#7f879c]">
                Actualizá la configuración de tu hogar 
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
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(activeShortcut && activeShortcut.kind !== "alarm")}
        onOpenChange={(open) => {
          if (!open) setActiveShortcut(null);
        }}
      >
        <DialogContent className="flex max-h-[calc(100dvh-2rem)] w-[min(92vw,520px)] flex-col overflow-hidden rounded-[32px] border border-[#20283a] bg-[#0e1218] p-0 text-white shadow-[0_32px_120px_rgba(0,0,0,0.6)] [&>button]:hidden">
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[32px]">
            <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,#f4bd49_0%,rgba(244,189,73,0.2)_26%,transparent_70%)]" />
            <div className="relative border-b border-[#1f2432] px-6 pb-4 pt-6 sm:px-8">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <DialogTitle className="text-[24px] font-semibold text-white">
                    {activeShortcut?.name}
                  </DialogTitle>
                  <DialogDescription className="mt-2 text-sm text-[#7f879c]">
                    Configurá encendido y atributos del shortcut.
                  </DialogDescription>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveShortcut(null)}
                  aria-label="Cerrar"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2b3042] bg-[#151a25] text-[#c4c8d6] transition-colors hover:bg-[#1c2231] hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="relative min-h-0 flex-1 space-y-6 overflow-y-auto px-6 pb-8 pt-6 sm:px-8">
              {activeShortcut ? (
                (() => {
                  const control =
                    shortcutControlById[activeShortcut.id] ??
                    getDefaultShortcutControl(activeShortcut.kind);

                  return (
                    <>
                      {activeShortcut.kind !== "blind" && activeShortcut.kind !== "air" ? (
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              if (activeShortcut.kind === "speaker") {
                                const nextOn = !control.on;

                                updateShortcutControl(activeShortcut.id, {
                                  on: nextOn,
                                  speakerPlaybackState: nextOn
                                    ? control.speakerPlaybackState ?? "stopped"
                                    : "stopped",
                                  speakerProgressMs: nextOn ? control.speakerProgressMs ?? 0 : 0,
                                  speakerTimestamp: Date.now(),
                                });
                                return;
                              }

                              updateShortcutControl(activeShortcut.id, {
                                on: !control.on,
                              });
                            }}
                            className={`w-full rounded-[18px] border px-4 py-3 text-sm font-medium transition-colors ${
                              control.on
                                ? "border-[#f4bd49]/60 bg-[#16120a] text-[#f4bd49]"
                                : "border-[#2b3448] bg-[#151b28] text-[#717a8f]"
                            }`}
                          >
                            {control.on ? "Apagar" : "Prender"}
                          </button>
                        </div>
                      ) : null}

                      {activeShortcut.kind === "speaker" ? (
                        <DeviceDetailControls
                          device={{
                            id: activeShortcut.id,
                            name: activeShortcut.name,
                            kind: "speaker",
                            status: control.on ? "on" : "off",
                            volume: control.volume,
                            speakerGenre: control.speakerGenre,
                            speakerQueue: control.speakerQueue,
                            speakerTrackIndex: control.speakerTrackIndex,
                            speakerPlaybackState: control.speakerPlaybackState,
                            speakerProgressMs: control.speakerProgressMs,
                            speakerTimestamp: control.speakerTimestamp,
                          } satisfies Device}
                          onUpdate={(updates) => {
                            const patch: Partial<ShortcutControlState> = {};

                            if (typeof updates.status === "string") {
                              patch.on = updates.status === "on";
                            }

                            if (typeof updates.volume === "number") {
                              patch.volume = updates.volume;
                            }

                            if (typeof updates.speakerGenre === "string") {
                              patch.speakerGenre = updates.speakerGenre;
                            }

                            if (Array.isArray(updates.speakerQueue)) {
                              patch.speakerQueue = updates.speakerQueue;
                            }

                            if (typeof updates.speakerTrackIndex === "number") {
                              patch.speakerTrackIndex = updates.speakerTrackIndex;
                            }

                            if (typeof updates.speakerPlaybackState === "string") {
                              patch.speakerPlaybackState = updates.speakerPlaybackState;
                            }

                            if (typeof updates.speakerProgressMs === "number") {
                              patch.speakerProgressMs = updates.speakerProgressMs;
                            }

                            if (typeof updates.speakerTimestamp === "number") {
                              patch.speakerTimestamp = updates.speakerTimestamp;
                            }

                            if (Object.keys(patch).length > 0) {
                              updateShortcutControl(activeShortcut.id, patch);
                            }
                          }}
                        />
                      ) : null}

                      {activeShortcut.kind === "blind" ? (
                        <DeviceDetailControls
                          device={{
                            id: activeShortcut.id,
                            name: activeShortcut.name,
                            kind: "blind",
                            status: control.position > 0 ? "on" : "off",
                            position: control.position,
                          } satisfies Device}
                          onUpdate={(updates) => {
                            if (typeof updates.position === "number") {
                              updateShortcutControl(activeShortcut.id, {
                                position: updates.position,
                                on: updates.position > 0,
                              });
                            }
                          }}
                        />
                      ) : null}

                      {activeShortcut.kind === "air" ? (
                        <DeviceDetailControls
                          device={{
                            id: activeShortcut.id,
                            name: activeShortcut.name,
                            kind: "air",
                            status: control.on ? "on" : "off",
                            targetTemp: control.temperature,
                            fanSpeed:
                              control.acFanSpeed ??
                              (control.fanSpeed <= 1
                                ? "low"
                                : control.fanSpeed === 2
                                  ? "med"
                                  : control.fanSpeed >= 4
                                    ? "high"
                                    : "auto"),
                            acMode:
                              control.acMode ??
                              (control.airMode === "Calor"
                                ? "heat"
                                : control.airMode === "Ventilacion"
                                  ? "fan"
                                  : "cool"),
                            swing: control.swing ?? false,
                          } satisfies Device}
                          onUpdate={(updates) => {
                            const patch: Partial<ShortcutControlState> = {};

                            if (typeof updates.targetTemp === "number") {
                              patch.temperature = updates.targetTemp;
                            }

                            if (typeof updates.fanSpeed === "string") {
                              patch.acFanSpeed = updates.fanSpeed;
                            }

                            if (typeof updates.acMode === "string") {
                              patch.acMode = updates.acMode;
                            }

                            if (typeof updates.swing === "boolean") {
                              patch.swing = updates.swing;
                            }

                            if (Object.keys(patch).length > 0) {
                              updateShortcutControl(activeShortcut.id, patch);
                            }
                          }}
                        />
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
        <DialogContent className="w-[min(92vw,460px)] rounded-[32px] border border-[#20283a] bg-[#0e1218] p-0 text-white shadow-[0_32px_120px_rgba(0,0,0,0.6)] [&>button]:hidden">
          <div className="relative overflow-hidden rounded-[32px]">
            <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,#f4bd49_0%,rgba(244,189,73,0.2)_26%,transparent_70%)]" />
            <div className="relative border-b border-[#1f2432] px-6 pb-4 pt-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <DialogTitle className="text-[24px] font-semibold text-white">
                    Control de puerta
                  </DialogTitle>
                  <DialogDescription className="mt-2 text-sm text-[#7f879c]">
                    Elegí la acción para este shortcut.
                  </DialogDescription>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveDoorShortcut(null)}
                  aria-label="Cerrar"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2b3042] bg-[#151a25] text-[#c4c8d6] transition-colors hover:bg-[#1c2231] hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
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

      <Dialog open={isAlarmsModalOpen} onOpenChange={setIsAlarmsModalOpen}>
        <DialogContent className="w-[min(92vw,520px)] rounded-[32px] border border-[#20283a] bg-[#0e1218] p-0 text-white shadow-[0_32px_120px_rgba(0,0,0,0.6)] [&>button]:hidden">
          <div className="space-y-6 px-6 pb-8 pt-6 sm:px-8">
            <div className="border-b border-[#1f2432] pb-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[24px] font-semibold text-white">Alarmas</h2>
                  <p className="mt-2 text-sm text-[#7f879c]">Administrá tus sistemas de seguridad</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAlarmsModalOpen(false)}
                  aria-label="Cerrar"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2b3042] bg-[#151a25] text-[#c4c8d6] transition-colors hover:bg-[#1c2231] hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {(currentHome.alarms ?? []).length > 0 ? (
              <div className="space-y-3">
                {(currentHome.alarms ?? []).map((alarm) => (
                  (() => {
                    const alarmIsActive = isAlarmActive(alarm);

                    return (
                  <div
                    key={alarm.id}
                    className="flex cursor-pointer items-center justify-between rounded-[20px] border border-[#2b3042] bg-[#1d2230] px-4 py-4 transition-colors hover:border-[#44506a]"
                    role="button"
                    tabIndex={0}
                    onClick={() => openAlarmOptionsPopup(alarm)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openAlarmOptionsPopup(alarm);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] border border-[#252d3f] bg-[#161c28] ${
                          alarmIsActive ? "text-[#f4bd49]" : "text-[#717a8f]"
                        }`}
                      >
                        <Bell size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-white">{alarm.name}</p>
                        <p className="text-sm text-[#8f97ab]">{alarmIsActive ? "Activada" : "Desactivada"}</p>
                      </div>
                    </div>
                  </div>
                    );
                  })()
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-[#8f97ab]">No hay alarmas agregadas aún</p>
            )}

            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={() => setIsCreateAlarmModalOpen(true)}
                className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#f4bd49] bg-transparent text-[#f4bd49] transition-colors hover:border-[#efb32e] hover:text-[#efb32e]"
                aria-label="Agregar nueva alarma"
              >
                <Plus size={24} />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateAlarmModalOpen} onOpenChange={setIsCreateAlarmModalOpen}>
        <DialogContent className="w-[min(92vw,460px)] rounded-[32px] border border-[#20283a] bg-[#0e1218] p-0 text-white shadow-[0_32px_120px_rgba(0,0,0,0.6)] [&>button]:hidden">
          <div className="space-y-4 px-6 pb-8 pt-6 sm:px-8">
            <div>
              <h2 className="text-[30px] font-semibold text-white">Nueva alarma</h2>
            </div>

            <div className="space-y-3">
              <div className="rounded-[20px] border border-[#2b3042] bg-[#1d2230] px-4 py-4">
                <input
                  type="text"
                  value={draftAlarmName}
                  onChange={(event) => setDraftAlarmName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && draftAlarmName.trim()) {
                      addAlarm(currentHome.id, draftAlarmName.trim());
                      setDraftAlarmName("");
                      setIsCreateAlarmModalOpen(false);
                    }
                  }}
                  placeholder="Ej: Sistema Central"
                  className="w-full bg-transparent text-base text-white outline-none placeholder:text-[#6b7280]"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setDraftAlarmName("");
                  setIsCreateAlarmModalOpen(false);
                }}
                className="flex-1 rounded-[18px] border border-[#2b3548] bg-[#141a26] px-4 py-3 text-[15px] font-medium text-[#d0d6e3] transition-colors hover:bg-[#192131] hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (draftAlarmName.trim()) {
                    addAlarm(currentHome.id, draftAlarmName.trim());
                    setDraftAlarmName("");
                    setIsCreateAlarmModalOpen(false);
                  }
                }}
                disabled={!draftAlarmName.trim()}
                className="flex-1 rounded-[18px] border border-[#f4bd49] bg-[#15110a] px-4 py-3 text-[15px] font-medium text-[#f4bd49] transition-colors hover:bg-[#1b1408] disabled:border-[#3d3d3d] disabled:bg-[#1a1a1a] disabled:text-[#666666]"
              >
                Crear alarma
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isAlarmOptionsModalOpen}
        onOpenChange={(open) => {
          setIsAlarmOptionsModalOpen(open);
          if (!open) setActiveAlarm(null);
        }}
      >
        <DialogContent className="w-[min(92vw,500px)] rounded-[32px] border border-[#20283a] bg-[#0e1218] p-0 text-white shadow-[0_32px_120px_rgba(0,0,0,0.6)] [&>button]:hidden">
          <div className="space-y-5 px-6 pb-8 pt-6 sm:px-8">
            <div className="border-b border-[#1f2432] pb-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[24px] font-semibold text-white">{activeAlarm?.name ?? "Alarma"}</h2>
                  <p className="mt-2 text-sm text-[#7f879c]">Configuración de alarma</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAlarmOptionsModalOpen(false);
                    setActiveAlarm(null);
                  }}
                  aria-label="Cerrar"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2b3042] bg-[#151a25] text-[#c4c8d6] transition-colors hover:bg-[#1c2231] hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-[20px] border border-[#2b3042] bg-[#1d2230] px-4 py-4">
                <span className="text-[15px] font-medium text-white">Modo Casa</span>
                <button
                  type="button"
                  onClick={() => {
                    if (!activeAlarm) return;
                    openSecurityCodeModal(activeAlarm.id, "house");
                  }}
                  className={`rounded-[16px] border px-4 py-2 text-[13px] font-medium transition-colors ${
                    (activeAlarm && (alarmOptionsById[activeAlarm.id] ?? getDefaultAlarmOptions()).houseModeOn)
                      ? "border-[#f4bd49] bg-[#15110a] text-[#f4bd49]"
                      : "border-[#2b3548] bg-[#141a26] text-[#d0d6e3]"
                  }`}
                >
                  {(activeAlarm && (alarmOptionsById[activeAlarm.id] ?? getDefaultAlarmOptions()).houseModeOn)
                    ? "Desativar"
                    : "Activar"}
                </button>
              </div>

              <div className="flex items-center justify-between rounded-[20px] border border-[#2b3042] bg-[#1d2230] px-4 py-4">
                <span className="text-[15px] font-medium text-white">Modo Regular</span>
                <button
                  type="button"
                  onClick={() => {
                    if (!activeAlarm) return;
                    openSecurityCodeModal(activeAlarm.id, "regular");
                  }}
                  className={`rounded-[16px] border px-4 py-2 text-[13px] font-medium transition-colors ${
                    (activeAlarm && (alarmOptionsById[activeAlarm.id] ?? getDefaultAlarmOptions()).regularModeOn)
                      ? "border-[#f4bd49] bg-[#15110a] text-[#f4bd49]"
                      : "border-[#2b3548] bg-[#141a26] text-[#d0d6e3]"
                  }`}
                >
                  {(activeAlarm && (alarmOptionsById[activeAlarm.id] ?? getDefaultAlarmOptions()).regularModeOn)
                    ? "Desativar"
                    : "Activar"}
                </button>
              </div>

              <div className="flex items-center justify-between rounded-[20px] border border-[#2b3042] bg-[#1d2230] px-4 py-4">
                <span className="text-[15px] font-medium text-white">Cambiar Codigo de Seguridad</span>
                <button
                  type="button"
                  onClick={() => {
                    if (!activeAlarm) return;
                    openChangeSecurityCodeModal(activeAlarm.id);
                  }}
                  className="rounded-[16px] border border-[#2b3548] bg-[#141a26] px-4 py-2 text-[13px] font-medium text-[#d0d6e3] transition-colors hover:border-[#5a6b8f] hover:text-white"
                >
                  Cambiar
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isSecurityCodeModalOpen}
        onOpenChange={(open) => {
          setIsSecurityCodeModalOpen(open);
          if (!open) {
            setPendingAlarmModeChange(null);
            setSecurityCodeInput("");
            setSecurityCodeError("");
          }
        }}
      >
        <DialogContent className="w-[min(92vw,460px)] rounded-[32px] border border-[#20283a] bg-[#0e1218] p-0 text-white shadow-[0_32px_120px_rgba(0,0,0,0.6)] [&>button]:hidden">
          <div className="space-y-5 px-6 pb-8 pt-6 sm:px-8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <DialogTitle className="text-[24px] font-semibold text-white">Código de seguridad</DialogTitle>
                <DialogDescription className="mt-2 text-sm text-[#7f879c]">
                  Ingresá el código de 4 dígitos para confirmar la acción.
                </DialogDescription>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsSecurityCodeModalOpen(false);
                  setPendingAlarmModeChange(null);
                  setSecurityCodeInput("");
                  setSecurityCodeError("");
                }}
                aria-label="Cerrar"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2b3042] bg-[#151a25] text-[#c4c8d6] transition-colors hover:bg-[#1c2231] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="rounded-[20px] border border-[#2b3042] bg-[#1d2230] px-4 py-4">
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={securityCodeInput}
                  onChange={(event) => {
                    const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, 4);
                    setSecurityCodeInput(digitsOnly);
                    if (securityCodeError) setSecurityCodeError("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      confirmSecurityCodeAndToggleMode();
                    }
                  }}
                  placeholder="••••"
                  className="w-full bg-transparent text-base tracking-[0.25em] text-white outline-none placeholder:text-[#6b7280]"
                  autoFocus
                />
              </div>
              {securityCodeError ? (
                <p className="text-sm text-[#ff9cab]">{securityCodeError}</p>
              ) : null}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsSecurityCodeModalOpen(false);
                  setPendingAlarmModeChange(null);
                  setSecurityCodeInput("");
                  setSecurityCodeError("");
                }}
                className="w-full rounded-[18px] border border-[#2b3548] bg-[#141a26] py-3 text-[15px] font-medium text-[#d0d6e3] transition-colors hover:bg-[#192131] hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmSecurityCodeAndToggleMode}
                className="w-full rounded-[18px] border border-[#f4bd49] bg-[#15110a] py-3 text-[15px] font-medium text-[#f4bd49] transition-colors hover:bg-[#1b1408]"
              >
                Confirmar
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isChangeSecurityCodeModalOpen}
        onOpenChange={(open) => {
          setIsChangeSecurityCodeModalOpen(open);
          if (!open) {
            setChangeSecurityCodeAlarmId(null);
            setChangeSecurityCodeOld("");
            setChangeSecurityCodeNew("");
            setChangeSecurityCodeError("");
          }
        }}
      >
        <DialogContent className="w-[min(92vw,460px)] rounded-[32px] border border-[#20283a] bg-[#0e1218] p-0 text-white shadow-[0_32px_120px_rgba(0,0,0,0.6)] [&>button]:hidden">
          <div className="space-y-5 px-6 pb-8 pt-6 sm:px-8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <DialogTitle className="text-[24px] font-semibold text-white">Cambiar código de seguridad</DialogTitle>
                <DialogDescription className="mt-2 text-sm text-[#7f879c]">
                  Ingresá el código actual y el nuevo código de 4 dígitos.
                </DialogDescription>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsChangeSecurityCodeModalOpen(false);
                  setChangeSecurityCodeAlarmId(null);
                  setChangeSecurityCodeOld("");
                  setChangeSecurityCodeNew("");
                  setChangeSecurityCodeError("");
                }}
                aria-label="Cerrar"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2b3042] bg-[#151a25] text-[#c4c8d6] transition-colors hover:bg-[#1c2231] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="rounded-[20px] border border-[#2b3042] bg-[#1d2230] px-4 py-4">
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={changeSecurityCodeOld}
                  onChange={(event) => {
                    const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, 4);
                    setChangeSecurityCodeOld(digitsOnly);
                    if (changeSecurityCodeError) setChangeSecurityCodeError("");
                  }}
                  placeholder="Código actual ••••"
                  className="w-full bg-transparent text-base tracking-[0.25em] text-white outline-none placeholder:text-[#6b7280]"
                  autoFocus
                />
              </div>

              <div className="rounded-[20px] border border-[#2b3042] bg-[#1d2230] px-4 py-4">
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={changeSecurityCodeNew}
                  onChange={(event) => {
                    const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, 4);
                    setChangeSecurityCodeNew(digitsOnly);
                    if (changeSecurityCodeError) setChangeSecurityCodeError("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      confirmChangeSecurityCode();
                    }
                  }}
                  placeholder="Nuevo código ••••"
                  className="w-full bg-transparent text-base tracking-[0.25em] text-white outline-none placeholder:text-[#6b7280]"
                />
              </div>

              {changeSecurityCodeError ? (
                <p className="text-sm text-[#ff9cab]">{changeSecurityCodeError}</p>
              ) : null}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsChangeSecurityCodeModalOpen(false);
                  setChangeSecurityCodeAlarmId(null);
                  setChangeSecurityCodeOld("");
                  setChangeSecurityCodeNew("");
                  setChangeSecurityCodeError("");
                }}
                className="w-full rounded-[18px] border border-[#2b3548] bg-[#141a26] py-3 text-[15px] font-medium text-[#d0d6e3] transition-colors hover:bg-[#192131] hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmChangeSecurityCode}
                className="w-full rounded-[18px] border border-[#f4bd49] bg-[#15110a] py-3 text-[15px] font-medium text-[#f4bd49] transition-colors hover:bg-[#1b1408]"
              >
                Cambiar
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
