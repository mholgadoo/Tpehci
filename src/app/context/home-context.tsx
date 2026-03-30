import {
  Armchair,
  Bath,
  Bed,
  Bell,
  Blinds,
  Bot,
  Car,
  ChefHat,
  CookingPot,
  DoorOpen,
  Droplet,
  Lightbulb,
  Monitor,
  Refrigerator,
  Speaker,
  Sun,
  TreePine,
  Wind,
  type LucideIcon,
} from "lucide-react";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type DeviceKind =
  | "lamp"
  | "speaker"
  | "blind"
  | "alarm"
  | "oven"
  | "air"
  | "fridge"
  | "door"
  | "sprinkler"
  | "vacuum";

export type DeviceType =
  | "light"
  | "audio"
  | "security"
  | "cover"
  | "kitchen"
  | "climate"
  | "access"
  | "water"
  | "cleaning";

export type SpaceKind =
  | "sala"
  | "dormitorio"
  | "cocina"
  | "bano"
  | "oficina"
  | "garaje"
  | "jardin"
  | "terraza";

export type DeviceStatus = "on" | "off";
export type AcFanSpeed = "low" | "med" | "high" | "auto";
export type AcMode = "cool" | "heat" | "fan" | "dry" | "auto";
export type OvenMode =
  | "convection"
  | "grill"
  | "upper_lower"
  | "fan_forced"
  | "defrost";
export type AlarmMode =
  | "disarmed"
  | "armed_away"
  | "armed_home"
  | "armed_night";
export type HomeShortcutKind =
  | "alarm"
  | "speaker"
  | "air"
  | "blind"
  | "door"
  | "oven"
  | "vacuum"
  | "sprinkler";

export interface Device {
  id: string;
  name: string;
  kind: DeviceKind;
  status: DeviceStatus;
  brightness?: number;
  targetTemp?: number;
  fanSpeed?: AcFanSpeed;
  acMode?: AcMode;
  swing?: boolean;
  ovenTemp?: number;
  ovenMode?: OvenMode;
  timerMinutes?: number;
  position?: number;
  volume?: number;
  fridgeTemp?: number;
  freezerTemp?: number;
}

export interface AlarmZone {
  id: string;
  name: string;
  armed: boolean;
}

export interface AlarmSystem {
  mode: AlarmMode;
  zones: AlarmZone[];
  pin: string;
}

export interface Space {
  id: string;
  name: string;
  kind: SpaceKind;
  devices: Device[];
}

export interface HomeShortcut {
  id: string;
  kind: HomeShortcutKind;
  name: string;
}

export interface Home {
  id: string;
  name: string;
  subtitle: string;
  shortcuts?: HomeShortcut[];
  spaces: Space[];
  alarm: AlarmSystem;
}

interface DeviceOption {
  id: DeviceKind;
  label: string;
  type: DeviceType;
  icon: LucideIcon;
}

interface SpaceOption {
  id: SpaceKind;
  name: string;
  icon: LucideIcon;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const roundToStep = (value: number, step: number) =>
  Math.round(value / step) * step;

const normalizeTextId = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const defaultAlarmZones = (): AlarmZone[] => [
  { id: "perimetro", name: "Perímetro", armed: false },
  { id: "interior", name: "Interior", armed: false },
  { id: "garaje", name: "Garaje", armed: false },
  { id: "jardin", name: "Jardín", armed: false },
];

const syncAlarmZonesForMode = (zones: AlarmZone[], mode: AlarmMode) =>
  zones.map((zone) => ({
    ...zone,
    armed: mode === "disarmed" ? false : true,
  }));

const deriveAlarmModeFromZones = (currentMode: AlarmMode, zones: AlarmZone[]) => {
  const hasArmedZones = zones.some((zone) => zone.armed);

  if (!hasArmedZones) {
    return "disarmed";
  }

  return currentMode === "disarmed" ? "armed_home" : currentMode;
};

export const createAlarmSystem = (
  mode: AlarmMode = "disarmed",
  zones: AlarmZone[] = defaultAlarmZones(),
  pin = "1234",
): AlarmSystem => ({
  mode,
  pin,
  zones,
});

export const deviceOptions: Record<DeviceKind, DeviceOption> = {
  lamp: {
    id: "lamp",
    label: "Lámpara",
    icon: Lightbulb,
    type: "light",
  },
  speaker: {
    id: "speaker",
    label: "Parlante",
    icon: Speaker,
    type: "audio",
  },
  blind: {
    id: "blind",
    label: "Persiana",
    icon: Blinds,
    type: "cover",
  },
  alarm: {
    id: "alarm",
    label: "Alarma",
    icon: Bell,
    type: "security",
  },
  oven: {
    id: "oven",
    label: "Horno",
    icon: CookingPot,
    type: "kitchen",
  },
  air: {
    id: "air",
    label: "Aire Ac.",
    icon: Wind,
    type: "climate",
  },
  fridge: {
    id: "fridge",
    label: "Heladera",
    icon: Refrigerator,
    type: "kitchen",
  },
  door: {
    id: "door",
    label: "Puerta",
    icon: DoorOpen,
    type: "access",
  },
  sprinkler: {
    id: "sprinkler",
    label: "Aspersor",
    icon: Droplet,
    type: "water",
  },
  vacuum: {
    id: "vacuum",
    label: "Aspiradora",
    icon: Bot,
    type: "cleaning",
  },
};

export const deviceTypeLabels: Record<DeviceType, string> = {
  light: "Iluminación",
  audio: "Audio",
  security: "Seguridad",
  cover: "Cerramiento",
  kitchen: "Cocina",
  climate: "Clima",
  access: "Acceso",
  water: "Agua",
  cleaning: "Limpieza",
};

export const spaceTypeOptions: SpaceOption[] = [
  { id: "sala", name: "Sala de Estar", icon: Armchair },
  { id: "dormitorio", name: "Dormitorio", icon: Bed },
  { id: "cocina", name: "Cocina", icon: ChefHat },
  { id: "bano", name: "Baño", icon: Bath },
  { id: "oficina", name: "Oficina", icon: Monitor },
  { id: "garaje", name: "Garaje", icon: Car },
  { id: "jardin", name: "Jardín", icon: TreePine },
  { id: "terraza", name: "Terraza", icon: Sun },
];

export const allowedDevicesBySpace: Record<SpaceKind, DeviceKind[]> = {
  cocina: ["lamp", "speaker", "blind", "oven", "air", "fridge", "door", "sprinkler", "vacuum"],
  sala: ["lamp", "speaker", "blind", "oven", "air", "fridge", "door", "sprinkler", "vacuum"],
  dormitorio: ["lamp", "speaker", "blind", "oven", "air", "fridge", "door", "sprinkler", "vacuum"],
  bano: ["lamp", "speaker", "blind", "oven", "air", "fridge", "door", "sprinkler", "vacuum"],
  oficina: ["lamp", "speaker", "blind", "oven", "air", "fridge", "door", "sprinkler", "vacuum"],
  garaje: ["lamp", "speaker", "blind", "oven", "air", "fridge", "door", "sprinkler", "vacuum"],
  jardin: ["lamp", "speaker", "blind", "oven", "air", "fridge", "door", "sprinkler", "vacuum"],
  terraza: ["lamp", "speaker", "blind", "oven", "air", "fridge", "door", "sprinkler", "vacuum"],
};

export const acModeLabels: Record<AcMode, string> = {
  cool: "Frío",
  heat: "Calor",
  fan: "Ventilador",
  dry: "Seco",
  auto: "Auto",
};

export const fanSpeedLabels: Record<AcFanSpeed, string> = {
  low: "Bajo",
  med: "Medio",
  high: "Alto",
  auto: "Auto",
};

export const ovenModeLabels: Record<OvenMode, string> = {
  convection: "Convección",
  grill: "Grill",
  upper_lower: "Superior e inferior",
  fan_forced: "Turbo ventilado",
  defrost: "Descongelar",
};

export const alarmModeLabels: Record<AlarmMode, string> = {
  disarmed: "Desarmado",
  armed_away: "Armado ausente",
  armed_home: "Armado casa",
  armed_night: "Modo noche",
};

function normalizeDeviceByKind(device: Device): Device {
  const base: Device = {
    ...device,
    brightness: device.brightness ?? undefined,
  };

  switch (device.kind) {
    case "lamp":
      return {
        ...base,
        brightness: clamp(base.brightness ?? 80, 0, 100),
      };
    case "air":
      return {
        ...base,
        targetTemp: clamp(base.targetTemp ?? 24, 16, 30),
        fanSpeed: base.fanSpeed ?? "auto",
        acMode: base.acMode ?? "cool",
        swing: base.swing ?? false,
      };
    case "oven":
      return {
        ...base,
        ovenTemp: clamp(roundToStep(base.ovenTemp ?? 180, 5), 50, 300),
        ovenMode: base.ovenMode ?? "convection",
        timerMinutes: Math.max(0, roundToStep(base.timerMinutes ?? 0, 5)),
      };
    case "blind": {
      const position = clamp(base.position ?? (base.status === "on" ? 100 : 0), 0, 100);
      return {
        ...base,
        position,
        status: position > 0 ? "on" : "off",
      };
    }
    case "speaker":
      return {
        ...base,
        volume: clamp(base.volume ?? 50, 0, 100),
      };
    case "fridge":
      return {
        ...base,
        fridgeTemp: clamp(base.fridgeTemp ?? 4, 1, 7),
        freezerTemp: clamp(base.freezerTemp ?? -18, -24, -16),
      };
    default:
      return base;
  }
}

export const createDevice = (
  id: string,
  name: string,
  kind: DeviceKind,
  status: DeviceStatus,
  brightness?: number,
): Device => normalizeDeviceByKind({
  id,
  name,
  kind,
  status,
  brightness,
});

export function isDeviceActive(device: Device) {
  if (device.kind === "lamp") {
    return device.status === "on" && (device.brightness ?? 100) > 0;
  }

  if (device.kind === "blind") {
    return (device.position ?? 0) > 0;
  }

  return device.status === "on";
}

export function formatBlindPosition(position = 0) {
  if (position <= 0) return "Cerrada";
  if (position >= 100) return "Abierta";
  return `${position}% abierta`;
}

export function formatTimerMinutes(timerMinutes = 0) {
  if (timerMinutes <= 0) return "Sin timer";

  const hours = Math.floor(timerMinutes / 60);
  const minutes = timerMinutes % 60;

  if (hours && minutes) return `${hours}h ${minutes}m`;
  if (hours) return `${hours}h`;
  return `${minutes}m`;
}

export function getDeviceSummary(device: Device) {
  switch (device.kind) {
    case "lamp":
      if (!isDeviceActive(device)) return "Apagado";
      return `Encendido · ${device.brightness ?? 80}%`;
    case "air":
      if (device.status === "off") return "Apagado";
      return `${device.targetTemp ?? 24}°C · ${acModeLabels[device.acMode ?? "cool"]}`;
    case "oven":
      if (device.status === "off") return "Apagado";
      return `${device.ovenTemp ?? 180}°C · ${ovenModeLabels[device.ovenMode ?? "convection"]}`;
    case "blind":
      return formatBlindPosition(device.position ?? 0);
    case "speaker":
      if (device.status === "off") return "Apagado";
      return `Vol. ${device.volume ?? 50}%`;
    case "fridge":
      if (device.status === "off") return "Apagado";
      return `${device.fridgeTemp ?? 4}°C · Freezer ${device.freezerTemp ?? -18}°C`;
    default:
      return device.status === "on" ? "Encendido" : "Apagado";
  }
}

const defaultShortcutsByHome: Record<string, HomeShortcut[]> = {
  "mi-hogar": [
    { id: "speaker-main", kind: "speaker", name: "Parlante" },
    { id: "air-main", kind: "air", name: "Aire" },
    { id: "blind-main", kind: "blind", name: "Persiana" },
    { id: "door-main", kind: "door", name: "Puerta" },
  ],
  "casa-playa": [
    { id: "speaker-beach", kind: "speaker", name: "Parlante" },
    { id: "blind-beach", kind: "blind", name: "Persiana" },
  ],
  estudio: [
    { id: "speaker-studio", kind: "speaker", name: "Parlante" },
    { id: "air-studio", kind: "air", name: "Clima" },
  ],
};

export function getDeviceIcon(kind: DeviceKind, size = 20, strokeWidth = 1.8) {
  const Icon = deviceOptions[kind].icon;
  return <Icon size={size} strokeWidth={strokeWidth} />;
}

export function getSpaceIcon(kind: SpaceKind, size = 28, strokeWidth = 1.8) {
  const option = spaceTypeOptions.find((space) => space.id === kind);

  if (!option) return null;

  const Icon = option.icon;
  return <Icon size={size} strokeWidth={strokeWidth} />;
}

const initialHomes: Home[] = [
  {
    id: "mi-hogar",
    name: "Mi Hogar",
    subtitle: "Palermo, Buenos Aires",
    shortcuts: defaultShortcutsByHome["mi-hogar"],
    alarm: createAlarmSystem("armed_home", [
      { id: "perimetro", name: "Perímetro", armed: true },
      { id: "interior", name: "Interior", armed: false },
      { id: "garaje", name: "Garaje", armed: true },
      { id: "jardin", name: "Jardín", armed: true },
    ]),
    spaces: [
      {
        id: "sala",
        name: "Sala de Estar",
        kind: "sala",
        devices: [
          createDevice("luz-principal", "Luz Principal", "lamp", "on", 80),
          createDevice("luz-ambiente", "Luz Ambiente", "lamp", "on", 50),
          createDevice("parlante", "Parlante", "speaker", "off"),
          { ...createDevice("persiana", "Persiana Principal", "blind", "off"), position: 0 },
        ],
      },
      {
        id: "dormitorio",
        name: "Dormitorio",
        kind: "dormitorio",
        devices: [
          createDevice("luz-techo", "Luz de Techo", "lamp", "on", 60),
          createDevice("luz-mesita", "Luz Mesita", "lamp", "off"),
          { ...createDevice("persiana-dormitorio", "Persiana Blackout", "blind", "off"), position: 0 },
          {
            ...createDevice("aire-dormitorio", "Aire acondicionado", "air", "off"),
            targetTemp: 24,
            fanSpeed: "auto",
            acMode: "cool",
          },
        ],
      },
      {
        id: "cocina",
        name: "Cocina",
        kind: "cocina",
        devices: [
          createDevice("luz-cocina", "Luz de Cocina", "lamp", "on", 100),
          { ...createDevice("horno", "Horno Eléctrico", "oven", "off"), ovenTemp: 180 },
          createDevice("heladera", "Heladera", "fridge", "on"),
          createDevice("luz-bajo-mueble", "Luz Bajo Mueble", "lamp", "off"),
        ],
      },
      {
        id: "bano",
        name: "Baño",
        kind: "bano",
        devices: [
          createDevice("luz-bano", "Luz de Baño", "lamp", "on", 100),
          createDevice("extractor", "Extractor", "air", "off"),
        ],
      },
      {
        id: "oficina",
        name: "Oficina",
        kind: "oficina",
        devices: [
          createDevice("luz-escritorio", "Luz Escritorio", "lamp", "on", 90),
          createDevice("parlante-oficina", "Parlante", "speaker", "off"),
          { ...createDevice("persiana-oficina", "Persiana", "blind", "on"), position: 100 },
        ],
      },
      {
        id: "garaje",
        name: "Garaje",
        kind: "garaje",
        devices: [
          createDevice("luz-garaje", "Luz de Garaje", "lamp", "off"),
          createDevice("puerta-garaje", "Puerta automática", "door", "on"),
        ],
      },
      {
        id: "jardin",
        name: "Jardín",
        kind: "jardin",
        devices: [
          createDevice("aspersor", "Aspersor central", "sprinkler", "off"),
          createDevice("luz-jardin", "Luz de Jardín", "lamp", "on", 70),
        ],
      },
      {
        id: "terraza",
        name: "Terraza",
        kind: "terraza",
        devices: [
          createDevice("luz-terraza", "Luz de Terraza", "lamp", "on", 85),
          createDevice("parlante-terraza", "Parlante exterior", "speaker", "off"),
          { ...createDevice("persiana-terraza", "Persiana plegable", "blind", "off"), position: 0 },
        ],
      },
    ],
  },
  {
    id: "casa-playa",
    name: "Casa de Playa",
    subtitle: "Pinamar, Buenos Aires",
    shortcuts: defaultShortcutsByHome["casa-playa"],
    alarm: createAlarmSystem("disarmed", [
      { id: "perimetro-playa", name: "Perímetro", armed: false },
      { id: "interior-playa", name: "Interior", armed: false },
    ]),
    spaces: [
      {
        id: "sala",
        name: "Sala de Estar",
        kind: "sala",
        devices: [
          createDevice("luz-sala-playa", "Luz Principal", "lamp", "on", 75),
          createDevice("parlante-playa", "Parlante", "speaker", "off"),
          { ...createDevice("persiana-playa", "Persiana", "blind", "off"), position: 0 },
        ],
      },
      {
        id: "cocina",
        name: "Cocina",
        kind: "cocina",
        devices: [
          createDevice("luz-cocina-playa", "Luz de Cocina", "lamp", "on", 90),
          createDevice("horno-playa", "Horno", "oven", "off"),
        ],
      },
      {
        id: "terraza",
        name: "Terraza",
        kind: "terraza",
        devices: [
          createDevice("luz-terraza-playa", "Luz Exterior", "lamp", "on", 80),
          createDevice("parlante-terraza-playa", "Parlante", "speaker", "off"),
        ],
      },
    ],
  },
  {
    id: "estudio",
    name: "Estudio",
    subtitle: "Microcentro, Buenos Aires",
    shortcuts: defaultShortcutsByHome.estudio,
    alarm: createAlarmSystem("armed_night", [
      { id: "perimetro-estudio", name: "Perímetro", armed: true },
      { id: "interior-estudio", name: "Interior", armed: false },
    ]),
    spaces: [
      {
        id: "oficina",
        name: "Oficina",
        kind: "oficina",
        devices: [
          createDevice("luz-estudio", "Luz de Escritorio", "lamp", "on", 85),
          createDevice("parlante-estudio", "Parlante", "speaker", "off"),
          { ...createDevice("persiana-estudio", "Persiana", "blind", "on"), position: 100 },
        ],
      },
      {
        id: "cocina",
        name: "Office",
        kind: "cocina",
        devices: [
          createDevice("luz-office", "Luz", "lamp", "on", 70),
          createDevice("cafetera-office", "Horno", "oven", "off"),
        ],
      },
    ],
  },
];

interface HomeContextValue {
  homes: Home[];
  selectedHomeId: string;
  setSelectedHomeId: (homeId: string) => void;
  currentHome: Home;
  addHome: (name: string, subtitle: string, shortcuts: HomeShortcut[]) => Home;
  updateHome: (homeId: string, name: string, subtitle: string, shortcuts: HomeShortcut[]) => void;
  addSpace: (homeId: string, name: string, kind: SpaceKind) => void;
  toggleDevice: (homeId: string, spaceId: string, deviceId: string) => void;
  updateBrightness: (homeId: string, spaceId: string, deviceId: string, value: number) => void;
  updateDeviceProperty: (
    homeId: string,
    spaceId: string,
    deviceId: string,
    updates: Partial<Device>,
  ) => void;
  turnOffAllDevices: (homeId: string, spaceId: string) => void;
  addDevice: (homeId: string, spaceId: string, name: string, kind: DeviceKind) => void;
  deleteDevice: (homeId: string, spaceId: string, deviceId: string) => void;
  updateAlarmMode: (homeId: string, mode: AlarmMode) => void;
  updateAlarmZone: (homeId: string, zoneId: string, armed: boolean) => void;
  updateAlarmPin: (homeId: string, pin: string) => void;
}

const HomeContext = createContext<HomeContextValue | null>(null);

function updateSpace(
  homes: Home[],
  homeId: string,
  spaceId: string,
  updater: (space: Space) => Space,
) {
  return homes.map((home) =>
    home.id === homeId
      ? {
          ...home,
          spaces: home.spaces.map((space) =>
            space.id === spaceId ? updater(space) : space,
          ),
        }
      : home,
  );
}

function updateHomeAlarm(
  homes: Home[],
  homeId: string,
  updater: (alarm: AlarmSystem) => AlarmSystem,
) {
  return homes.map((home) =>
    home.id === homeId
      ? {
          ...home,
          alarm: updater(home.alarm),
        }
      : home,
  );
}

function buildToggledDevice(device: Device) {
  const nextStatus: DeviceStatus = device.status === "on" ? "off" : "on";

  if (device.kind === "lamp") {
    return normalizeDeviceByKind({
      ...device,
      status: nextStatus,
      brightness:
        nextStatus === "on"
          ? clamp(device.brightness && device.brightness > 0 ? device.brightness : 80, 1, 100)
          : 0,
    });
  }

  if (device.kind === "blind") {
    return normalizeDeviceByKind({
      ...device,
      status: nextStatus,
      position:
        nextStatus === "on"
          ? clamp(device.position && device.position > 0 ? device.position : 100, 1, 100)
          : 0,
    });
  }

  return normalizeDeviceByKind({
    ...device,
    status: nextStatus,
  });
}

function buildUpdatedDevice(device: Device, updates: Partial<Device>) {
  const merged = normalizeDeviceByKind({
    ...device,
    ...updates,
  });

  if (device.kind === "lamp" && updates.brightness !== undefined) {
    return {
      ...merged,
      status: updates.brightness === 0 ? "off" : merged.status === "off" ? "on" : merged.status,
    };
  }

  if (device.kind === "blind" && updates.position !== undefined) {
    return {
      ...merged,
      status: (merged.position ?? 0) > 0 ? "on" : "off",
    };
  }

  return merged;
}

export function HomeProvider({ children }: { children: ReactNode }) {
  const [homes, setHomes] = useState<Home[]>(initialHomes);
  const [selectedHomeId, setSelectedHomeId] = useState(initialHomes[0].id);

  const currentHome = homes.find((home) => home.id === selectedHomeId) ?? homes[0];

  const value = useMemo<HomeContextValue>(
    () => ({
      homes,
      selectedHomeId,
      setSelectedHomeId,
      currentHome,
      addHome: (name, subtitle, shortcuts) => {
        const trimmedName = name.trim();
        const newHome: Home = {
          id: normalizeTextId(trimmedName || `hogar-${Date.now()}`),
          name: trimmedName || "Nuevo hogar",
          subtitle: subtitle.trim() || "Nuevo hogar",
          shortcuts: shortcuts.filter((shortcut) => shortcut.kind !== "alarm"),
          spaces: [],
          alarm: createAlarmSystem(),
        };

        setHomes((previousHomes) => [...previousHomes, newHome]);
        setSelectedHomeId(newHome.id);

        return newHome;
      },
      updateHome: (homeId, name, subtitle, shortcuts) => {
        const trimmedName = name.trim();
        if (!trimmedName) return;

        setHomes((previousHomes) =>
          previousHomes.map((home) =>
            home.id === homeId
              ? {
                  ...home,
                  name: trimmedName,
                  subtitle: subtitle.trim() || "Nuevo hogar",
                  shortcuts: shortcuts.filter((shortcut) => shortcut.kind !== "alarm"),
                }
              : home,
          ),
        );
      },
      addSpace: (homeId, name, kind) => {
        const newSpace: Space = {
          id: `${kind}-${Date.now()}`,
          name,
          kind,
          devices: [],
        };

        setHomes((previousHomes) =>
          previousHomes.map((home) =>
            home.id === homeId
              ? { ...home, spaces: [...home.spaces, newSpace] }
              : home,
          ),
        );
      },
      toggleDevice: (homeId, spaceId, deviceId) => {
        setHomes((previousHomes) =>
          updateSpace(previousHomes, homeId, spaceId, (space) => ({
            ...space,
            devices: space.devices.map((device) =>
              device.id === deviceId ? buildToggledDevice(device) : device,
            ),
          })),
        );
      },
      updateBrightness: (homeId, spaceId, deviceId, value) => {
        setHomes((previousHomes) =>
          updateSpace(previousHomes, homeId, spaceId, (space) => ({
            ...space,
            devices: space.devices.map((device) =>
              device.id === deviceId
                ? buildUpdatedDevice(device, { brightness: clamp(value, 0, 100) })
                : device,
            ),
          })),
        );
      },
      updateDeviceProperty: (homeId, spaceId, deviceId, updates) => {
        setHomes((previousHomes) =>
          updateSpace(previousHomes, homeId, spaceId, (space) => ({
            ...space,
            devices: space.devices.map((device) =>
              device.id === deviceId ? buildUpdatedDevice(device, updates) : device,
            ),
          })),
        );
      },
      turnOffAllDevices: (homeId, spaceId) => {
        setHomes((previousHomes) =>
          updateSpace(previousHomes, homeId, spaceId, (space) => ({
            ...space,
            devices: space.devices.map((device) => buildToggledDevice({
              ...device,
              status: "on",
            })),
          })),
        );
      },
      addDevice: (homeId, spaceId, name, kind) => {
        const option = deviceOptions[kind];
        const newDevice = createDevice(
          `device-${Date.now()}`,
          name,
          kind,
          kind === "fridge" ? "on" : "off",
          option.type === "light" ? 80 : undefined,
        );

        setHomes((previousHomes) =>
          updateSpace(previousHomes, homeId, spaceId, (space) => ({
            ...space,
            devices: [...space.devices, newDevice],
          })),
        );
      },
      deleteDevice: (homeId, spaceId, deviceId) => {
        setHomes((previousHomes) =>
          updateSpace(previousHomes, homeId, spaceId, (space) => ({
            ...space,
            devices: space.devices.filter((device) => device.id !== deviceId),
          })),
        );
      },
      updateAlarmMode: (homeId, mode) => {
        setHomes((previousHomes) =>
          updateHomeAlarm(previousHomes, homeId, (alarm) => ({
            ...alarm,
            mode,
            zones: syncAlarmZonesForMode(alarm.zones, mode),
          })),
        );
      },
      updateAlarmZone: (homeId, zoneId, armed) => {
        setHomes((previousHomes) =>
          updateHomeAlarm(previousHomes, homeId, (alarm) => ({
            ...alarm,
            zones: alarm.zones.map((zone) =>
              zone.id === zoneId ? { ...zone, armed } : zone,
            ),
            mode: deriveAlarmModeFromZones(
              alarm.mode,
              alarm.zones.map((zone) =>
                zone.id === zoneId ? { ...zone, armed } : zone,
              ),
            ),
          })),
        );
      },
      updateAlarmPin: (homeId, pin) => {
        setHomes((previousHomes) =>
          updateHomeAlarm(previousHomes, homeId, (alarm) => ({
            ...alarm,
            pin,
          })),
        );
      },
    }),
    [currentHome, homes, selectedHomeId],
  );

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
}

export function useHome() {
  const context = useContext(HomeContext);

  if (!context) {
    throw new Error("useHome must be used within a HomeProvider");
  }

  return context;
}
