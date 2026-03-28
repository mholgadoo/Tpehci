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
 
export interface Device {
  id: string;
  name: string;
  kind: DeviceKind;
  status: "on" | "off";
  brightness?: number;
}
 
export interface Space {
  id: string;
  name: string;
  kind: SpaceKind;
  devices: Device[];
}
 
export interface HomeAlarm {
  id: string;
  name: string;
  status: "on" | "off";
}

export interface Home {
  id: string;
  name: string;
  subtitle: string;
  shortcuts?: HomeShortcut[];
  alarms?: HomeAlarm[];
  spaces: Space[];
}

export type HomeShortcutKind = "alarm" | "speaker" | "air" | "blind" | "door" | "oven" | "vacuum" | "sprinkler";

export interface HomeShortcut {
  id: string;
  kind: HomeShortcutKind;
  name: string;
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
 
export const createDevice = (
  id: string,
  name: string,
  kind: DeviceKind,
  status: "on" | "off",
  brightness?: number,
): Device => ({
  id,
  name,
  kind,
  status,
  brightness,
});
 
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
    alarms: [
      { id: "alarm-1", name: "Sistema Central", status: "on" },
      { id: "alarm-2", name: "Puerta Principal", status: "off" },
    ],
    spaces: [
      {
        id: "sala",
        name: "Sala de Estar",
        kind: "sala",
        devices: [
          createDevice("luz-principal", "Luz Principal", "lamp", "on", 80),
          createDevice("luz-ambiente", "Luz Ambiente", "lamp", "on", 50),
          createDevice("parlante", "Parlante", "speaker", "off"),
          createDevice("persiana", "Persiana Principal", "blind", "off"),
        ],
      },
      {
        id: "dormitorio",
        name: "Dormitorio",
        kind: "dormitorio",
        devices: [
          createDevice("luz-techo", "Luz de Techo", "lamp", "on", 60),
          createDevice("luz-mesita", "Luz Mesita", "lamp", "off"),
          createDevice("persiana-dormitorio", "Persiana Blackout", "blind", "off"),
          createDevice("aire-dormitorio", "Aire acondicionado", "air", "off"),
        ],
      },
      {
        id: "cocina",
        name: "Cocina",
        kind: "cocina",
        devices: [
          createDevice("luz-cocina", "Luz de Cocina", "lamp", "on", 100),
          createDevice("horno", "Horno Eléctrico", "oven", "off"),
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
          createDevice("persiana-oficina", "Persiana", "blind", "on"),
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
          createDevice("persiana-terraza", "Persiana plegable", "blind", "off"),
        ],
      },
    ],
  },
  {
    id: "casa-playa",
    name: "Casa de Playa",
    subtitle: "Pinamar, Buenos Aires",
    alarms: [
      { id: "alarm-3", name: "Sistema Perimetral", status: "off" },
    ],
    spaces: [
      {
        id: "sala",
        name: "Sala de Estar",
        kind: "sala",
        devices: [
          createDevice("luz-sala-playa", "Luz Principal", "lamp", "on", 75),
          createDevice("parlante-playa", "Parlante", "speaker", "off"),
          createDevice("persiana-playa", "Persiana", "blind", "off"),
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
    spaces: [
      {
        id: "oficina",
        name: "Oficina",
        kind: "oficina",
        devices: [
          createDevice("luz-estudio", "Luz de Escritorio", "lamp", "on", 85),
          createDevice("parlante-estudio", "Parlante", "speaker", "off"),
          createDevice("persiana-estudio", "Persiana", "blind", "on"),
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
  updateBrightness: (
    homeId: string,
    spaceId: string,
    deviceId: string,
    value: number,
  ) => void;
  turnOffAllDevices: (homeId: string, spaceId: string) => void;
  addDevice: (
    homeId: string,
    spaceId: string,
    name: string,
    kind: DeviceKind,
  ) => void;
  deleteDevice: (homeId: string, spaceId: string, deviceId: string) => void;
  addAlarm: (homeId: string, name: string) => void;
  deleteAlarm: (homeId: string, alarmId: string) => void;
  toggleAlarmStatus: (homeId: string, alarmId: string) => void;
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
 
export function HomeProvider({ children }: { children: ReactNode }) {
  const [homes, setHomes] = useState<Home[]>(initialHomes);
  const [selectedHomeId, setSelectedHomeId] = useState(initialHomes[0].id);
 
  const currentHome =
    homes.find((home) => home.id === selectedHomeId) ?? homes[0];
 
  const value = useMemo<HomeContextValue>(
    () => ({
      homes,
      selectedHomeId,
      setSelectedHomeId,
      currentHome,
      addHome: (name, subtitle, shortcuts) => {
        const normalizedShortcuts = [
          {
            id: `alarm-${Date.now()}`,
            kind: "alarm" as const,
            name: "",
          },
          ...shortcuts.filter((shortcut) => shortcut.kind !== "alarm"),
        ];

        const newHome: Home = {
          id: name.toLowerCase().replace(/\s+/g, "-"),
          name,
          subtitle: subtitle || "Nuevo hogar",
          shortcuts: normalizedShortcuts,
          spaces: [],
        };
 
        setHomes((previousHomes) => [...previousHomes, newHome]);
        setSelectedHomeId(newHome.id);
 
        return newHome;
      },
      updateHome: (homeId, name, subtitle, shortcuts) => {
        const trimmedName = name.trim();
        if (!trimmedName) return;

        const nextSubtitle = subtitle.trim() || "Nuevo hogar";

        setHomes((previousHomes) =>
          previousHomes.map((home) =>
            home.id === homeId
              ? { ...home, name: trimmedName, subtitle: nextSubtitle, shortcuts }
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
              device.id === deviceId
                ? {
                    ...device,
                    status: device.status === "on" ? "off" : "on",
                  }
                : device,
            ),
          })),
        );
      },
      updateBrightness: (homeId, spaceId, deviceId, value) => {
        setHomes((previousHomes) =>
          updateSpace(previousHomes, homeId, spaceId, (space) => ({
            ...space,
            devices: space.devices.map((device) => {
              if (device.id !== deviceId) return device;
              // brightness 0% → apagar automáticamente
              // brightness >0 con dispositivo apagado → encender automáticamente
              const newStatus =
                value === 0 ? "off" : device.status === "off" ? "on" : device.status;
              return { ...device, brightness: value, status: newStatus };
            }),
          })),
        );
      },
      turnOffAllDevices: (homeId, spaceId) => {
        setHomes((previousHomes) =>
          updateSpace(previousHomes, homeId, spaceId, (space) => ({
            ...space,
            devices: space.devices.map((device) => ({
              ...device,
              status: "off" as const,
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
          kind === "alarm" || kind === "fridge" ? "on" : "off",
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
      addAlarm: (homeId, name) => {
        setHomes((previousHomes) =>
          previousHomes.map((home) =>
            home.id === homeId
              ? {
                  ...home,
                  alarms: [
                    ...(home.alarms ?? []),
                    {
                      id: `alarm-${Date.now()}`,
                      name,
                      status: "off" as const,
                    },
                  ],
                }
              : home,
          ),
        );
      },
      deleteAlarm: (homeId, alarmId) => {
        setHomes((previousHomes) =>
          previousHomes.map((home) =>
            home.id === homeId
              ? {
                  ...home,
                  alarms: (home.alarms ?? []).filter((alarm) => alarm.id !== alarmId),
                }
              : home,
          ),
        );
      },
      toggleAlarmStatus: (homeId, alarmId) => {
        setHomes((previousHomes) =>
          previousHomes.map((home) =>
            home.id === homeId
              ? {
                  ...home,
                  alarms: (home.alarms ?? []).map((alarm) =>
                    alarm.id === alarmId
                      ? { ...alarm, status: alarm.status === "on" ? "off" : "on" }
                      : alarm,
                  ),
                }
              : home,
          ),
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
