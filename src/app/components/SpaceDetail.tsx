import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Trash2,
  Power,
  Lightbulb,
  Plus,
  Speaker,
  Blinds,
  Bell,
  CookingPot,
  Wind,
  Refrigerator,
  DoorOpen,
  Droplet,
  Bot,
  X,
} from "lucide-react";
import { useState } from "react";

type DeviceKind =
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

interface Device {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: "on" | "off";
  brightness?: number;
  type: "light" | "audio" | "security" | "cover" | "kitchen" | "climate" | "access" | "water" | "cleaning";
  kind: DeviceKind;
}

interface DeviceOption {
  id: DeviceKind;
  label: string;
  icon: (size?: number) => React.ReactNode;
  type: Device["type"];
}

const deviceOptions: Record<DeviceKind, DeviceOption> = {
  lamp: {
    id: "lamp",
    label: "Lámpara",
    icon: (size = 20) => <Lightbulb size={size} />,
    type: "light",
  },
  speaker: {
    id: "speaker",
    label: "Parlante",
    icon: (size = 20) => <Speaker size={size} />,
    type: "audio",
  },
  blind: {
    id: "blind",
    label: "Persiana",
    icon: (size = 20) => <Blinds size={size} />,
    type: "cover",
  },
  alarm: {
    id: "alarm",
    label: "Alarma",
    icon: (size = 20) => <Bell size={size} />,
    type: "security",
  },
  oven: {
    id: "oven",
    label: "Horno",
    icon: (size = 20) => <CookingPot size={size} />,
    type: "kitchen",
  },
  air: {
    id: "air",
    label: "Aire Ac.",
    icon: (size = 20) => <Wind size={size} />,
    type: "climate",
  },
  fridge: {
    id: "fridge",
    label: "Heladera",
    icon: (size = 20) => <Refrigerator size={size} />,
    type: "kitchen",
  },
  door: {
    id: "door",
    label: "Puerta",
    icon: (size = 20) => <DoorOpen size={size} />,
    type: "access",
  },
  sprinkler: {
    id: "sprinkler",
    label: "Aspersor",
    icon: (size = 20) => <Droplet size={size} />,
    type: "water",
  },
  vacuum: {
    id: "vacuum",
    label: "Aspiradora",
    icon: (size = 20) => <Bot size={size} />,
    type: "cleaning",
  },
};

const createDevice = (
  id: string,
  name: string,
  kind: DeviceKind,
  status: "on" | "off",
  brightness?: number,
): Device => ({
  id,
  name,
  kind,
  icon: deviceOptions[kind].icon(),
  status,
  brightness,
  type: deviceOptions[kind].type,
});

const spaceDevices: Record<string, Device[]> = {
  cocina: [
    createDevice("luz-cocina", "Luz de Cocina", "lamp", "on", 100),
    createDevice("horno", "Horno Eléctrico", "oven", "off"),
    createDevice("heladera", "Heladera", "fridge", "on"),
    createDevice("alarma-cocina", "Alarma humo", "alarm", "on"),
    createDevice("luz-bajo-mueble", "Luz Bajo Mueble", "lamp", "off"),
  ],
  sala: [
    createDevice("luz-principal", "Luz Principal", "lamp", "on", 80),
    createDevice("luz-ambiente", "Luz Ambiente", "lamp", "on", 50),
    createDevice("parlante", "Parlante", "speaker", "off"),
    createDevice("persiana", "Persiana Principal", "blind", "off"),
    createDevice("alarma", "Alarma Principal", "alarm", "on"),
  ],
  dormitorio: [
    createDevice("luz-techo", "Luz de Techo", "lamp", "on", 60),
    createDevice("luz-mesita", "Luz Mesita", "lamp", "off"),
    createDevice("persiana-dormitorio", "Persiana Blackout", "blind", "off"),
    createDevice("aire-dormitorio", "Aire acondicionado", "air", "off"),
  ],
  bano: [
    createDevice("luz-bano", "Luz de Baño", "lamp", "on", 100),
    createDevice("extractor", "Extractor", "air", "off"),
  ],
  oficina: [
    createDevice("luz-escritorio", "Luz Escritorio", "lamp", "on", 90),
    createDevice("parlante-oficina", "Parlante", "speaker", "off"),
    createDevice("persiana-oficina", "Persiana", "blind", "on"),
  ],
  garaje: [
    createDevice("luz-garaje", "Luz de Garaje", "lamp", "off"),
    createDevice("puerta-garaje", "Puerta automática", "door", "on"),
    createDevice("alarma-garaje", "Alarma de acceso", "alarm", "on"),
  ],
  jardin: [
    createDevice("aspersor", "Aspersor central", "sprinkler", "off"),
    createDevice("luz-jardin", "Luz de Jardín", "lamp", "on", 70),
    createDevice("alarma-jardin", "Alarma perimetral", "alarm", "on"),
  ],
  terraza: [
    createDevice("luz-terraza", "Luz de Terraza", "lamp", "on", 85),
    createDevice("parlante-terraza", "Parlante exterior", "speaker", "off"),
    createDevice("persiana-terraza", "Persiana plegable", "blind", "off"),
  ],
};

const spaceNames: Record<string, string> = {
  cocina: "Cocina",
  sala: "Sala de Estar",
  dormitorio: "Dormitorio",
  bano: "Baño",
  oficina: "Oficina",
  garaje: "Garaje",
  jardin: "Jardín",
  terraza: "Terraza",
};

const allowedDevicesBySpace: Record<string, DeviceKind[]> = {
  cocina: ["lamp", "oven", "fridge", "alarm", "air"],
  sala: ["lamp", "speaker", "blind", "alarm"],
  dormitorio: ["lamp", "speaker", "blind", "air", "alarm"],
  bano: ["lamp", "air", "alarm"],
  oficina: ["lamp", "speaker", "blind", "air", "alarm"],
  garaje: ["lamp", "door", "alarm", "vacuum"],
  jardin: ["sprinkler", "lamp", "alarm"],
  terraza: ["lamp", "speaker", "blind"],
};

export function SpaceDetail() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const navigate = useNavigate();
  const normalizedSpaceId = (spaceId || "").split("-")[0];
  const [devices, setDevices] = useState<Device[]>(
    spaceDevices[normalizedSpaceId] || [],
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [selectedDeviceType, setSelectedDeviceType] = useState<DeviceKind | null>(null);

  const spaceName = spaceNames[normalizedSpaceId] || "Espacio";
  const activeDevices = devices.filter((device) => device.status === "on").length;
  const availableTypes =
    Object.keys(deviceOptions) as DeviceKind[];

  const toggleDevice = (deviceId: string) => {
    setDevices(
      devices.map((device) =>
        device.id === deviceId
          ? { ...device, status: device.status === "on" ? "off" : "on" }
          : device,
      ),
    );
  };

  const updateBrightness = (deviceId: string, value: number) => {
    setDevices(
      devices.map((device) =>
        device.id === deviceId ? { ...device, brightness: value } : device,
      ),
    );
  };

  const handleAddDevice = () => {
    if (!newDeviceName.trim() || !selectedDeviceType) return;

    const option = deviceOptions[selectedDeviceType];
    const newDevice = createDevice(
      `device-${Date.now()}`,
      newDeviceName,
      selectedDeviceType,
      selectedDeviceType === "alarm" || selectedDeviceType === "fridge" ? "on" : "off",
      option.type === "light" ? 80 : undefined,
    );

    setDevices([...devices, newDevice]);
    setIsModalOpen(false);
    setNewDeviceName("");
    setSelectedDeviceType(null);
  };

  const renderDeviceModal = () => {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
        <div className="relative w-full max-w-[520px] overflow-hidden rounded-[32px] bg-[#080a10] shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
          <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,#fbbf24_0%,rgba(251,191,36,0.22)_26%,transparent_70%)]" />

          <div className="relative px-6 pb-8 pt-8 sm:px-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-[22px] font-semibold text-white">Nuevo Dispositivo</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2a2d3a] text-[#c4c8d6]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-semibold tracking-wider text-gray-400">
                  NOMBRE
                </label>
                <div className="rounded-2xl border border-[#fbbf24] bg-[#292c38] px-5 py-4">
                  <input
                    type="text"
                    placeholder="Lámpara de techo"
                    value={newDeviceName}
                    onChange={(event) => setNewDeviceName(event.target.value)}
                    className="w-full bg-transparent text-base text-white placeholder-[#8f97ab] outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-semibold tracking-wider text-gray-400">
                  TIPO DE DISPOSITIVO
                </label>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                  {availableTypes.map((type) => {
                    const option = deviceOptions[type];
                    const isSelected = selectedDeviceType === type;

                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelectedDeviceType(type)}
                        className={`flex min-h-[110px] flex-col items-center justify-center gap-3 rounded-2xl border px-3 py-4 transition-all ${
                          isSelected
                            ? "border border-yellow-500/50 bg-yellow-600/20 text-yellow-400"
                            : "border border-transparent bg-[#24262d] text-gray-400 hover:bg-[#2c2f38]"
                        }`}
                      >
                        {option.icon(22)}
                        <span className="text-[11px] font-medium text-center leading-tight">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddDevice}
                disabled={!newDeviceName.trim() || !selectedDeviceType}
                className={`w-full rounded-[20px] py-4 text-[15px] font-medium border-2 transition-all ${
                  newDeviceName.trim() && selectedDeviceType
                    ? "bg-black text-yellow-500 border-yellow-500"
                    : "bg-[#202636] text-[#6b7280] border-[#202636]"
                }`}
              >
                Agregar Dispositivo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-[#000000] text-white pb-20 md:pb-8">
        <div className="px-6 pt-12 pb-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="w-[46px] h-[46px] rounded-[14px] bg-[#20232d] flex items-center justify-center text-[#9ca3af] hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-[22px] font-semibold text-white leading-tight">
                  {spaceName}
                </h1>
                <p className="text-[14px] text-[#6b7280] mt-0.5">
                  {activeDevices} de {devices.length} activos
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-[46px] h-[46px] rounded-[14px] bg-[#20232d] flex items-center justify-center text-[#9ca3af] hover:text-white transition-colors">
                <Trash2 size={18} />
              </button>
              <button className="w-[46px] h-[46px] rounded-[14px] bg-[#20232d] flex items-center justify-center text-[#9ca3af] hover:text-white transition-colors">
                <Power size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="px-6">
          <h2 className="text-[#8a8d9e] text-[12px] font-bold tracking-widest uppercase mb-4">
            Dispositivos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map((device) => (
              <div
                key={device.id}
                className="rounded-3xl border border-gray-700/50 bg-gradient-to-br from-gray-900/80 to-black/80 p-6 flex flex-col gap-4 transition-all hover:border-gray-600/50 min-h-[76px]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-[46px] h-[46px] rounded-2xl flex items-center justify-center ${
                        device.status === "on"
                          ? "bg-black text-[#fbbf24] border-2 border-yellow-500"
                          : "bg-gray-800 text-[#6b7280]"
                      }`}
                    >
                      {device.icon}
                    </div>
                    <div>
                      <h3 className="text-[15px] font-medium text-white mb-0.5">{device.name}</h3>
                      <p
                        className={`text-[13px] ${
                          device.status === "on" ? "text-[#fbbf24]" : "text-[#6b7280]"
                        }`}
                      >
                        {device.status === "on" ? "Encendido" : "Apagado"}
                        {device.status === "on" && device.brightness !== undefined && ` · ${device.brightness}%`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button className="text-[#6b7280] hover:text-[#9ca3af] transition-colors">
                      <Trash2 size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleDevice(device.id)}
                      className={`relative inline-flex h-[32px] w-[56px] items-center rounded-full p-[2px] transition-colors duration-200 ${
                        device.status === "on" ? "bg-[#fbbf24]" : "bg-[#454955]"
                      }`}
                    >
                      <span
                        className={`inline-block h-[28px] w-[28px] transform rounded-full bg-white transition-transform duration-200 ${
                          device.status === "on" ? "translate-x-[24px]" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {device.type === "light" && device.status === "on" && (
                  <div className="px-1 pb-1 pt-1 relative">
                    <div className="relative w-full h-[6px] bg-[#2a2d3d] rounded-full">
                      <div
                        className="absolute left-0 top-0 h-full bg-[#fbbf24] rounded-full transition-all duration-150"
                        style={{ width: `${device.brightness || 0}%` }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={device.brightness || 0}
                        onChange={(event) => updateBrightness(device.id, parseInt(event.target.value))}
                        className="absolute inset-0 w-full h-[6px] opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="rounded-3xl border border-dashed border-gray-700/50 bg-gradient-to-br from-gray-900/60 to-black/60 text-left transition-all hover:border-gray-600/50 flex items-center gap-4 p-6 text-center min-h-[76px]"
            >
              <div className="flex items-center justify-center rounded-2xl bg-black border-2 border-yellow-500 p-3 text-yellow-500">
                <Plus size={24} />
              </div>
              <div>
                <p className="font-medium text-[#6b7280]">Agregar dispositivo</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {renderDeviceModal()}
    </>
  );
}
