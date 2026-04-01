import React, { ReactNode, useEffect, useMemo, useState } from "react";
import {
  Armchair,
  Bath,
  Bed,
  BookOpen,
  Car,
  Check,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Film,
  Heart,
  Monitor,
  Moon,
  Music,
  Sun,
  Sunset,
  TreePine,
  Tv,
  Zap,
} from "lucide-react";
import {
  createDevice,
  getDeviceIcon,
  getDeviceSummary,
  isDeviceActive,
  type Device,
  type DeviceKind,
} from "../context/home-context";
import { DeviceDetailControls } from "./DeviceDetailControls";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface DeviceAttribute extends Device {
  spaceId: string;
  deviceIndex: number;
}

interface Space {
  id: string;
  name: string;
  icon: ReactNode;
  devices: Array<{
    kind: DeviceKind;
    color?: string;
    name: string;
  }>;
}

interface Spaces {
  [key: string]: Space;
}

interface CreateSceneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (scene: {
    id?: string;
    name: string;
    color: string;
    description: string;
    devices: DeviceAttribute[];
  }) => void;
  initialScene?: {
    id?: string;
    name: string;
    color: string;
    description: string;
    devices: DeviceAttribute[];
  } | null;
}

const spaceData: Spaces = {
  sala: {
    id: "sala",
    name: "Sala de Estar",
    icon: <Armchair size={22} />,
    devices: [
      { kind: "lamp", color: "text-yellow-500", name: "Luz Principal" },
      { kind: "lamp", name: "Luz Ambiental" },
      { kind: "speaker", name: "Parlante" },
      { kind: "blind", name: "Persiana" },
    ],
  },
  dormitorio: {
    id: "dormitorio",
    name: "Dormitorio",
    icon: <Bed size={22} />,
    devices: [
      { kind: "lamp", color: "text-yellow-500", name: "Luz Principal" },
      { kind: "lamp", name: "Luz de Noche" },
      { kind: "blind", name: "Persiana" },
      { kind: "air", name: "Aire acondicionado" },
    ],
  },
  cocina: {
    id: "cocina",
    name: "Cocina",
    icon: <ChefHat size={22} />,
    devices: [
      { kind: "lamp", color: "text-yellow-500", name: "Luz Principal" },
      { kind: "oven", name: "Horno" },
      { kind: "fridge", name: "Heladera" },
    ],
  },
  bano: {
    id: "bano",
    name: "Baño",
    icon: <Bath size={22} />,
    devices: [
      { kind: "lamp", color: "text-yellow-500", name: "Luz Principal" },
      { kind: "air", name: "Extractor" },
    ],
  },
  oficina: {
    id: "oficina",
    name: "Oficina",
    icon: <Monitor size={22} />,
    devices: [
      { kind: "lamp", color: "text-yellow-500", name: "Luz Principal" },
      { kind: "speaker", name: "Parlante" },
      { kind: "blind", name: "Persiana" },
    ],
  },
  garaje: {
    id: "garaje",
    name: "Garaje",
    icon: <Car size={22} />,
    devices: [
      { kind: "lamp", color: "text-yellow-500", name: "Luz Principal" },
      { kind: "door", name: "Puerta automática" },
    ],
  },
  jardin: {
    id: "jardin",
    name: "Jardín",
    icon: <TreePine size={22} />,
    devices: [
      { kind: "lamp", color: "text-yellow-500", name: "Luz Principal" },
      { kind: "sprinkler", name: "Aspersor" },
    ],
  },
  terraza: {
    id: "terraza",
    name: "Terraza",
    icon: <Sun size={22} />,
    devices: [
      { kind: "lamp", color: "text-yellow-500", name: "Luz Principal" },
      { kind: "speaker", name: "Parlante" },
      { kind: "blind", name: "Persiana" },
    ],
  },
};

const sceneOptions = [
  {
    value: "relajacion",
    label: "Relajación",
    description: "Luces suaves y clima tranquilo.",
    icon: <Moon size={20} />,
  },
  {
    value: "lectura",
    label: "Lectura",
    description: "Luz enfocada y ambiente silencioso.",
    icon: <BookOpen size={20} />,
  },
  {
    value: "musica",
    label: "Música",
    description: "Altavoces listos y clima social.",
    icon: <Music size={20} />,
  },
  {
    value: "pelicula",
    label: "Película",
    description: "Baja la luz y prioriza confort.",
    icon: <Film size={20} />,
  },
  {
    value: "trabajo",
    label: "Trabajo",
    description: "Iluminación clara y foco activo.",
    icon: <Zap size={20} />,
  },
  {
    value: "romantica",
    label: "Romántica",
    description: "Tonos cálidos y ambiente íntimo.",
    icon: <Heart size={20} />,
  },
  {
    value: "atardecer",
    label: "Atardecer",
    description: "Transición cálida para cerrar el día.",
    icon: <Sunset size={20} />,
  },
  {
    value: "cine",
    label: "Cine",
    description: "TV protagonista y luces al mínimo.",
    icon: <Tv size={20} />,
  },
];

const steps = [
  { id: "details", label: "Detalles", description: "Nombre y descripción" },
  { id: "style", label: "Estilo", description: "Tipo de escena" },
  { id: "devices", label: "Dispositivos", description: "Configuración por ambiente" },
  { id: "review", label: "Resumen", description: "Chequeo final" },
];

const getSpaceDeviceDefinition = (spaceId: string, deviceIndex: number) =>
  spaceData[spaceId]?.devices[deviceIndex];

const buildSceneDevice = (
  spaceId: string,
  deviceIndex: number,
  status: Device["status"],
  overrides: Partial<Device> = {},
): DeviceAttribute => {
  const definition = getSpaceDeviceDefinition(spaceId, deviceIndex);
  const id = `${spaceId}-${deviceIndex}`;
  const kind = definition?.kind ?? "lamp";
  const name = definition?.name ?? `Dispositivo ${deviceIndex + 1}`;
  const baseDevice = createDevice(
    id,
    name,
    kind,
    status,
    kind === "lamp" ? 80 : undefined,
  );

  return {
    ...baseDevice,
    ...overrides,
    id,
    name,
    kind,
    spaceId,
    deviceIndex,
  };
};

const applySceneDeviceUpdates = (
  currentDevice: DeviceAttribute,
  updates: Partial<Device>,
): DeviceAttribute => {
  const nextDevice = {
    ...buildSceneDevice(
      currentDevice.spaceId,
      currentDevice.deviceIndex,
      updates.status ?? currentDevice.status,
    ),
    ...currentDevice,
    ...updates,
  };

  if (currentDevice.kind === "lamp" && typeof updates.brightness === "number") {
    nextDevice.status = updates.brightness === 0 ? "off" : "on";
  }

  if (currentDevice.kind === "blind") {
    if (updates.status === "off") {
      nextDevice.position = 0;
    }
    if (updates.status === "on" && !nextDevice.position) {
      nextDevice.position = 100;
    }
    if (typeof updates.position === "number") {
      nextDevice.status = updates.position > 0 ? "on" : "off";
    }
  }

  return nextDevice;
};

export function CreateSceneDialog({
  open,
  onOpenChange,
  onSave,
  initialScene = null,
}: CreateSceneDialogProps) {
  const isEditing = Boolean(initialScene);
  const [sceneId, setSceneId] = useState<string | undefined>(undefined);
  const [sceneName, setSceneName] = useState("");
  const [sceneDescription, setSceneDescription] = useState("");
  const [sceneType, setSceneType] = useState("relajacion");
  const [deviceAttributes, setDeviceAttributes] = useState<DeviceAttribute[]>([]);
  const [activeTab, setActiveTab] = useState<string>("sala");
  const [currentStep, setCurrentStep] = useState(0);
  const [showNameError, setShowNameError] = useState(false);

  const selectedSceneType =
    sceneOptions.find((scene) => scene.value === sceneType) ?? sceneOptions[0];

  const activeDevices = useMemo(
    () => deviceAttributes.filter((attribute) => isDeviceActive(attribute)),
    [deviceAttributes],
  );

  const configuredSpaces = useMemo(
    () =>
      Object.values(spaceData)
        .map((space) => {
          const devices = activeDevices
            .filter((attribute) => attribute.spaceId === space.id)
            .map((attribute) => ({
              ...attribute,
              deviceName:
                space.devices[attribute.deviceIndex]?.name ||
                `Dispositivo ${attribute.deviceIndex + 1}`,
            }));

          return {
            id: space.id,
            name: space.name,
            icon: space.icon,
            devices,
          };
        })
        .filter((space) => space.devices.length > 0),
    [activeDevices],
  );

  const resetForm = () => {
    setSceneId(undefined);
    setSceneName("");
    setSceneDescription("");
    setSceneType("relajacion");
    setDeviceAttributes([]);
    setActiveTab("sala");
    setCurrentStep(0);
    setShowNameError(false);
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    if (initialScene) {
      setSceneId(initialScene.id);
      setSceneName(initialScene.name);
      setSceneDescription(initialScene.description);
      setSceneType(initialScene.color);
      setDeviceAttributes(
        initialScene.devices.map((device) =>
          buildSceneDevice(device.spaceId, device.deviceIndex, device.status, device),
        ),
      );
      setActiveTab(initialScene.devices[0]?.spaceId || "sala");
      setCurrentStep(0);
      setShowNameError(false);
      return;
    }

    resetForm();
  }, [initialScene, open]);

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm();
    }
    onOpenChange(nextOpen);
  };

  const handleDeviceStatusChange = (
    spaceId: string,
    deviceIndex: number,
    status: Device["status"],
  ) => {
    const id = `${spaceId}-${deviceIndex}`;
    setDeviceAttributes((previousAttributes) => {
      const existingAttribute = previousAttributes.find(
        (attribute) => attribute.id === id,
      );

      if (existingAttribute) {
        return previousAttributes.map((attribute) =>
          attribute.id === id
            ? applySceneDeviceUpdates(attribute, { status })
            : attribute,
        );
      }

      return [...previousAttributes, buildSceneDevice(spaceId, deviceIndex, status)];
    });
  };

  const handleDevicePropertyChange = (
    spaceId: string,
    deviceIndex: number,
    updates: Partial<Device>,
  ) => {
    const id = `${spaceId}-${deviceIndex}`;
    setDeviceAttributes((previousAttributes) => {
      const existingAttribute = previousAttributes.find(
        (attribute) => attribute.id === id,
      );

      if (existingAttribute) {
        return previousAttributes.map((attribute) =>
          attribute.id === id
            ? applySceneDeviceUpdates(attribute, updates)
            : attribute,
        );
      }

      return [
        ...previousAttributes,
        buildSceneDevice(spaceId, deviceIndex, "on", updates),
      ];
    });
  };

  const getDeviceAttribute = (spaceId: string, deviceIndex: number) =>
    deviceAttributes.find(
      (attribute) =>
        attribute.spaceId === spaceId && attribute.deviceIndex === deviceIndex,
    );

  const validateDetailsStep = () => {
    const isValid = sceneName.trim().length > 0;
    setShowNameError(!isValid);
    return isValid;
  };

  const handleNextStep = () => {
    if (currentStep === 0 && !validateDetailsStep()) {
      return;
    }

    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const handlePreviousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const handleSave = () => {
    if (!validateDetailsStep()) {
      setCurrentStep(0);
      return;
    }

    onSave({
      id: sceneId,
      name: sceneName.trim(),
      description: sceneDescription.trim(),
      color: sceneType,
      devices: deviceAttributes,
    });

    handleDialogChange(false);
  };

  const renderDetailsStep = () => (
    <section className="rounded-[28px] border border-[#252e3f] bg-[#121722] p-5 sm:p-6">
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7f8aa3]">
              Paso 1
            </p>
            <h3 className="mt-2 text-[28px] font-semibold text-white">
              Datos básicos
            </h3>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <Label
            htmlFor="scene-name"
            className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#98a2b7]"
          >
            Nombre de la escena
          </Label>
          <Input
            id="scene-name"
            placeholder="Ej: Noche de lectura"
            value={sceneName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setSceneName(event.target.value);
              if (showNameError && event.target.value.trim()) {
                setShowNameError(false);
              }
            }}
            className={`mt-3 h-14 rounded-[20px] border bg-[#0d1118] px-4 text-[16px] text-white placeholder:text-[#667089] ${
              showNameError
                ? "border-[#f46d6d] focus-visible:ring-[#f46d6d]/40"
                : "border-[#283245] focus-visible:ring-[#f0c45c]/30"
            }`}
          />
          {showNameError ? (
            <p className="mt-2 text-sm text-[#f29a9a]">
              El nombre es obligatorio
            </p>
          ) : null}
        </div>

        <div>
          <Label
            htmlFor="scene-description"
            className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#98a2b7]"
          >
            Descripción breve
          </Label>
          <Textarea
            id="scene-description"
            placeholder="Ej: Luces bajas y música suave"
            value={sceneDescription}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
              setSceneDescription(event.target.value)
            }
            className="mt-3 min-h-[116px] rounded-[20px] border border-[#283245] bg-[#0d1118] px-4 py-3 text-[16px] text-white placeholder:text-[#667089] focus-visible:ring-[#f0c45c]/30"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <div className="rounded-[22px] border border-[#2b3548] bg-[linear-gradient(180deg,rgba(233,188,87,0.18),rgba(18,23,34,0.02))] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d6a339]/60 bg-[#10151f] text-[#f0c45c]">
              {selectedSceneType.icon}
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f8aa3]">
                Vista previa
              </p>
              <p className="mt-1 text-[18px] font-medium text-white">
                {sceneName.trim() || "Tu nueva escena"}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#a5aec2]">
            {sceneDescription.trim() || "Todavía no agregaste una descripción."}
          </p>
        </div>

        <div className="rounded-[22px] border border-[#252e3f] bg-[#10151f] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f8aa3]">
            Estilo actual
          </p>
          <p className="mt-3 text-[18px] font-medium text-white">
            {selectedSceneType.label}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#98a2b7]">
            Lo cambiás en el paso siguiente.
          </p>
        </div>
      </div>
    </section>
  );

  const renderStyleStep = () => (
    <section className="rounded-[28px] border border-[#252e3f] bg-[#121722] p-5 sm:p-6">
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7f8aa3]">
              Paso 2
            </p>
            <h3 className="mt-2 text-[28px] font-semibold text-white">
              Elegí el estilo
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {sceneOptions.map((scene) => {
          const isSelected = scene.value === sceneType;

          return (
            <button
              key={scene.value}
              type="button"
              onClick={() => setSceneType(scene.value)}
              className={`flex min-h-[118px] items-start gap-4 rounded-[22px] border px-4 py-4 text-left transition-all ${
                isSelected
                  ? "border-[#d6a339] bg-[linear-gradient(180deg,rgba(214,163,57,0.18),rgba(18,23,34,0.92))] text-white shadow-[0_16px_40px_rgba(214,163,57,0.08)]"
                  : "border-[#253042] bg-[#10151f] text-[#a5aec2] hover:border-[#3a4a66] hover:bg-[#131a27]"
              }`}
            >
              <div
                className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
                  isSelected
                    ? "border-[#e0b14e]/60 bg-[#141a24] text-[#f0c45c]"
                    : "border-[#2a3346] bg-[#161d2a] text-[#8c96ab]"
                }`}
              >
                {scene.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[17px] font-semibold">{scene.label}</p>
                <p
                  className={`mt-2 text-[14px] leading-6 ${
                    isSelected ? "text-[#ece6d4]" : "text-[#92a0b6]"
                  }`}
                >
                  {scene.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );

  const renderDevicesStep = () => (
    <section className="rounded-[28px] border border-[#252e3f] bg-[#121722] p-5 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7f8aa3]">
            Paso 3
          </p>
          <h3 className="mt-2 text-[26px] font-semibold text-white">
            Configurá dispositivos
          </h3>
        
        </div>
        <div className="inline-flex items-center rounded-full border border-[#2b3548] bg-[#10151f] px-4 py-2 text-sm text-[#d0d6e3]">
          {activeDevices.length} dispositivo
          {activeDevices.length === 1 ? "" : "s"} activo
          {activeDevices.length === 1 ? "" : "s"}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
        <div className="rounded-[24px] border border-[#252e3f] bg-[#10151f] p-3">
          <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f8aa3]">
            Ambientes
          </p>
          <TabsList className="mt-3 grid h-auto grid-cols-2 gap-2 bg-transparent p-0">
            {Object.values(spaceData).map((space) => {
              const spaceActiveDevices = activeDevices.filter(
                (attribute) => attribute.spaceId === space.id,
              ).length;

              return (
                <TabsTrigger
                  key={space.id}
                  value={space.id}
                  className="min-h-[88px] rounded-[20px] border border-[#253042] bg-[#121823] px-3 py-4 text-left text-[#9aa4b8] data-[state=active]:border-[#d6a339] data-[state=active]:bg-[#171f2d] data-[state=active]:text-white"
                >
                  <div className="flex items-start gap-3 text-left">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[#2c3648] bg-[#171d2a]">
                      {space.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[15px] font-medium leading-5 whitespace-normal">
                        {space.name}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[#7f8aa3]">
                        {spaceActiveDevices} activo
                        {spaceActiveDevices === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {Object.values(spaceData).map((space) => (
          <TabsContent
            key={space.id}
            value={space.id}
            className="mt-0 rounded-[24px] border border-[#252e3f] bg-[#10151f] p-4 sm:p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="text-[22px] font-semibold text-white">
                  {space.name}
                </h4>
                <p className="mt-1 text-sm text-[#98a2b7]">
                  Encendé solo los dispositivos que formen parte de esta escena.
                </p>
              </div>
            </div>

            <div className="max-h-[400px] space-y-3 overflow-y-auto pr-1">
              {space.devices.map((device, index) => {
                const attribute = getDeviceAttribute(space.id, index);
                const deviceState = attribute ?? buildSceneDevice(space.id, index, "off");
                const isActive = isDeviceActive(deviceState);

                return (
                  <div
                    key={`${space.id}-${index}`}
                    className={`rounded-[22px] border p-4 transition-colors ${
                      isActive
                        ? "border-[#d6a339]/70 bg-[#151d2a]"
                        : "border-[#252e3f] bg-[#131925]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                            isActive
                              ? "border-[#d6a339]/60 bg-[#10151f] text-[#f0c45c]"
                              : "border-[#2b3548] bg-[#1a2230] text-[#8c96ab]"
                          }`}
                        >
                          {getDeviceIcon(device.kind, 18)}
                        </div>
                        <div>
                          <h5 className="text-[16px] font-medium text-white">
                            {device.name || `Dispositivo ${index + 1}`}
                          </h5>
                          <p className="mt-1 text-sm text-[#98a2b7]">
                            {getDeviceSummary(deviceState)}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeviceStatusChange(
                            space.id,
                            index,
                            isActive ? "off" : "on",
                          )
                        }
                        className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full p-[2px] transition-colors ${
                          isActive ? "bg-[#d6a339]" : "bg-[#4c566a]"
                        }`}
                      >
                        <span
                          className={`inline-block h-7 w-7 rounded-full bg-white transition-transform ${
                            isActive ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {isActive ? (
                      <div className="mt-4 rounded-[20px] border border-[#232c3d] bg-[#0d1420] p-4">
                        <DeviceDetailControls
                          device={deviceState}
                          onUpdate={(updates) =>
                            handleDevicePropertyChange(space.id, index, updates)
                          }
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );

  const renderReviewStep = () => (
    <section className="rounded-[28px] border border-[#252e3f] bg-[#121722] p-5 sm:p-6">
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7f8aa3]">
          Paso 4
        </p>
        <h3 className="mt-2 text-[28px] font-semibold text-white">
          Revisá antes de guardar
        </h3>
      </div>

      <div className="space-y-4">
        <div className="rounded-[22px] border border-[#252e3f] bg-[#10151f] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d6a339]/60 bg-[#151b27] text-[#f0c45c]">
              {selectedSceneType.icon}
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f8aa3]">
                Escena
              </p>
              <h4 className="mt-1 text-[24px] font-semibold text-white">
                {sceneName.trim() || "Sin nombre"}
              </h4>
            </div>
          </div>
          <p className="mt-3 text-[15px] leading-6 text-[#a5aec2]">
            {sceneDescription.trim() || "Sin descripción adicional."}
          </p>
        </div>

        <div className="rounded-[22px] border border-[#252e3f] bg-[#10151f] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f8aa3]">
            Configuración activa
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <div className="rounded-full border border-[#2b3548] bg-[#151b27] px-4 py-2 text-sm text-[#d0d6e3]">
              Tipo: {selectedSceneType.label}
            </div>
            <div className="rounded-full border border-[#2b3548] bg-[#151b27] px-4 py-2 text-sm text-[#d0d6e3]">
              {activeDevices.length} dispositivo
              {activeDevices.length === 1 ? "" : "s"} activo
              {activeDevices.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>

        <div className="rounded-[22px] border border-[#252e3f] bg-[#10151f] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f8aa3]">
            Ambientes incluidos
          </p>

          {configuredSpaces.length > 0 ? (
            <div className="mt-4 space-y-3">
              {configuredSpaces.map((space) => (
                <div
                  key={space.id}
                  className="rounded-[18px] border border-[#232c3d] bg-[#141a26] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#2c3648] bg-[#171d2a] text-[#f0c45c]">
                      {space.icon}
                    </div>
                    <div>
                      <p className="font-medium text-white">{space.name}</p>
                      <p className="text-sm text-[#98a2b7]">
                        {space.devices.length} dispositivo
                        {space.devices.length === 1 ? "" : "s"} activo
                        {space.devices.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    {space.devices.map((device) => (
                      <div
                        key={device.id}
                        className="flex items-center justify-between gap-3 rounded-[16px] border border-[#2b3548] bg-[#10151f] px-3 py-3 text-sm text-[#d0d6e3]"
                      >
                        <span>{device.deviceName}</span>
                        <span className="text-[#98a2b7]">{getDeviceSummary(device)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-[#98a2b7]">
              No activaste dispositivos
            </p>
          )}
        </div>
      </div>
    </section>
  );

  const renderStepContent = () => {
    if (currentStep === 0) {
      return renderDetailsStep();
    }

    if (currentStep === 1) {
      return renderStyleStep();
    }

    if (currentStep === 2) {
      return renderDevicesStep();
    }

    return renderReviewStep();
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="w-[min(98vw,1240px)] overflow-hidden border border-[#20283a] bg-[#0e1218] p-0 text-white shadow-[0_32px_120px_rgba(0,0,0,0.6)] sm:max-h-[90vh] sm:rounded-[32px] [&>button]:text-[#8b96ab]">
        <div className="flex max-h-[90vh] flex-col overflow-hidden">
          <div className="relative border-b border-[#20283a] px-5 pb-3 pt-4 sm:px-7">
            <div className="absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_top,rgba(240,196,92,0.38),rgba(240,196,92,0.1)_35%,transparent_70%)]" />
            <div className="relative">
              <DialogTitle className="text-[24px] font-semibold text-white">
                {isEditing ? "Editar escena" : "Crear escena"}
              </DialogTitle>

              <ol className="mt-4 grid grid-cols-4 gap-2">
                {steps.map((step, index) => {
                  const isCurrentStep = index === currentStep;
                  const isCompletedStep = index < currentStep;

                  return (
                    <li key={step.id} className="relative">
                      {index < steps.length - 1 ? (
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
                        <div>
                          <p
                            className={`text-[13px] font-medium ${
                              isCurrentStep || isCompletedStep
                                ? "text-white"
                                : "text-[#8b96ab]"
                            }`}
                          >
                            {step.label}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-3 sm:px-7 sm:py-4">
            {renderStepContent()}
          </div>

          <div className="border-t border-[#20283a] bg-[#0b0f16] px-5 py-4 sm:px-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#8b96ab]">
                {currentStep === 0
                  ? "Completá el nombre y seguí."
                  : currentStep === 1
                    ? "Elegí el estilo de la escena."
                    : currentStep === 2
                      ? "Activá solo los dispositivos necesarios."
                      : "Revisá y guardá."}
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={currentStep === 0 ? () => handleDialogChange(false) : handlePreviousStep}
                  className="h-11 rounded-[18px] border border-[#2b3548] bg-[#141a26] px-5 text-[#d0d6e3] hover:bg-[#192131] hover:text-white"
                >
                  {currentStep === 0 ? (
                    "Cancelar"
                  ) : (
                    <>
                      <ChevronLeft size={16} />
                      Atrás
                    </>
                  )}
                </Button>

                {currentStep === steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleSave}
                    className="h-11 rounded-[18px] border border-[#d6a339] bg-[#151d2a] px-5 text-[#f0c45c] hover:bg-[#1b2434]"
                  >
                    {isEditing ? "Guardar cambios" : "Guardar escena"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="h-11 rounded-[18px] border border-[#d6a339] bg-[#151d2a] px-5 text-[#f0c45c] hover:bg-[#1b2434]"
                  >
                    Continuar
                    <ChevronRight size={16} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
