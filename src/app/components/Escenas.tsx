import {
  BookOpen,
  Edit3,
  Film,
  Heart,
  Moon,
  Music,
  Plus,
  Sparkles,
  Sun,
  Sunset,
  Tv,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  createDevice,
  getDeviceSummary,
  isDeviceActive,
  type Device,
  type DeviceKind,
} from "../context/home-context";
import { COMPACT_LAYOUT_BREAKPOINT, useIsMobile } from "../hooks/useIsMobile";
import { CreateSceneDialog } from "./CreateSceneDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

type SceneTypeId =
  | "relajacion"
  | "lectura"
  | "musica"
  | "pelicula"
  | "trabajo"
  | "romantica"
  | "atardecer"
  | "cine";

interface SceneDeviceAttribute extends Device {
  spaceId: string;
  deviceIndex: number;
}

interface SceneDeviceConfig extends SceneDeviceAttribute {
  deviceName: string;
  spaceName: string;
}

interface Scene {
  id: string;
  sceneType: SceneTypeId;
  name: string;
  description: string;
  isActive: boolean;
  devices: SceneDeviceConfig[];
}

interface SceneFormPayload {
  id?: string;
  name: string;
  color: string;
  description: string;
  devices: SceneDeviceAttribute[];
}

const sceneTypeMeta: Record<
  SceneTypeId,
  {
    label: string;
    description: string;
    icon: (size?: number) => React.ReactNode;
  }
> = {
  relajacion: {
    label: "Relajación",
    description: "Luces suaves y clima tranquilo.",
    icon: (size = 24) => <Moon size={size} />,
  },
  lectura: {
    label: "Lectura",
    description: "Luz enfocada y ambiente silencioso.",
    icon: (size = 24) => <BookOpen size={size} />,
  },
  musica: {
    label: "Música",
    description: "Altavoces listos y clima social.",
    icon: (size = 24) => <Music size={size} />,
  },
  pelicula: {
    label: "Película",
    description: "Baja la luz y prioriza confort.",
    icon: (size = 24) => <Film size={size} />,
  },
  trabajo: {
    label: "Trabajo",
    description: "Iluminación clara y foco activo.",
    icon: (size = 24) => <Zap size={size} />,
  },
  romantica: {
    label: "Romántica",
    description: "Tonos cálidos y ambiente íntimo.",
    icon: (size = 24) => <Heart size={size} />,
  },
  atardecer: {
    label: "Atardecer",
    description: "Transición cálida para cerrar el día.",
    icon: (size = 24) => <Sunset size={size} />,
  },
  cine: {
    label: "Cine",
    description: "TV protagonista y luces al mínimo.",
    icon: (size = 24) => <Tv size={size} />,
  },
};

const sceneSpaceCatalog: Record<
  string,
  { name: string; devices: Array<{ name: string; kind: DeviceKind }> }
> = {
  sala: {
    name: "Sala de estar",
    devices: [
      { name: "Luz Principal", kind: "lamp" },
      { name: "Luz Ambiental", kind: "lamp" },
      { name: "Parlante", kind: "speaker" },
      { name: "Persiana", kind: "blind" },
    ],
  },
  dormitorio: {
    name: "Dormitorio",
    devices: [
      { name: "Luz Principal", kind: "lamp" },
      { name: "Luz de Noche", kind: "lamp" },
      { name: "Persiana", kind: "blind" },
      { name: "Aire acondicionado", kind: "air" },
    ],
  },
  cocina: {
    name: "Cocina",
    devices: [
      { name: "Luz Principal", kind: "lamp" },
      { name: "Horno", kind: "oven" },
      { name: "Heladera", kind: "fridge" },
    ],
  },
  bano: {
    name: "Baño",
    devices: [
      { name: "Luz Principal", kind: "lamp" },
      { name: "Extractor", kind: "air" },
    ],
  },
  oficina: {
    name: "Oficina",
    devices: [
      { name: "Luz Principal", kind: "lamp" },
      { name: "Parlante", kind: "speaker" },
      { name: "Persiana", kind: "blind" },
    ],
  },
  garaje: {
    name: "Garaje",
    devices: [
      { name: "Luz Principal", kind: "lamp" },
      { name: "Puerta automática", kind: "door" },
    ],
  },
  jardin: {
    name: "Jardín",
    devices: [
      { name: "Luz Principal", kind: "lamp" },
      { name: "Aspersor", kind: "sprinkler" },
    ],
  },
  terraza: {
    name: "Terraza",
    devices: [
      { name: "Luz Principal", kind: "lamp" },
      { name: "Parlante", kind: "speaker" },
      { name: "Persiana", kind: "blind" },
    ],
  },
};

const createSceneDevice = (
  spaceId: string,
  deviceIndex: number,
  status: Device["status"],
  overrides: Partial<Device> = {},
): SceneDeviceConfig => {
  const definition = sceneSpaceCatalog[spaceId]?.devices[deviceIndex];
  const name = definition?.name || `Dispositivo ${deviceIndex + 1}`;
  const kind = definition?.kind || "lamp";
  const id = `${spaceId}-${deviceIndex}`;
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
    spaceName: sceneSpaceCatalog[spaceId]?.name || "Espacio",
    deviceIndex,
    deviceName: name,
  };
};

const defaultScenes: Scene[] = [
  {
    id: "night",
    sceneType: "relajacion",
    name: "Modo Noche",
    description: "Luces bajas, temperatura óptima",
    isActive: true,
    devices: [
      createSceneDevice("dormitorio", 0, "on", { brightness: 25 }),
      createSceneDevice("dormitorio", 3, "on", {
        targetTemp: 22,
        acMode: "cool",
        fanSpeed: "low",
      }),
      createSceneDevice("sala", 1, "on", { brightness: 20 }),
    ],
  },
  {
    id: "morning",
    sceneType: "trabajo",
    name: "Buenos Días",
    description: "Luces graduales, café encendido",
    isActive: false,
    devices: [
      createSceneDevice("cocina", 0, "on", { brightness: 85 }),
      createSceneDevice("sala", 0, "on", { brightness: 65 }),
      createSceneDevice("cocina", 1, "on", {
        ovenTemp: 180,
        ovenMode: "convection",
      }),
    ],
  },
  {
    id: "cinema",
    sceneType: "cine",
    name: "Cine en Casa",
    description: "Luces apagadas, TV encendida",
    isActive: false,
    devices: [
      createSceneDevice("sala", 0, "off"),
      createSceneDevice("sala", 1, "off"),
      createSceneDevice("sala", 2, "on", { volume: 35 }),
      createSceneDevice("sala", 3, "off", { position: 0 }),
    ],
  },
  {
    id: "party",
    sceneType: "musica",
    name: "Fiesta",
    description: "Luces de colores, altavoces",
    isActive: false,
    devices: [
      createSceneDevice("terraza", 1, "on", { volume: 78 }),
      createSceneDevice("sala", 2, "on", { volume: 65 }),
      createSceneDevice("terraza", 0, "on", { brightness: 90 }),
    ],
  },
];

const isSceneTypeId = (value: string): value is SceneTypeId => value in sceneTypeMeta;

const buildSceneDevices = (
  deviceAttributes: SceneDeviceAttribute[],
): SceneDeviceConfig[] =>
  deviceAttributes.map((attribute) => ({
    ...attribute,
    spaceName: sceneSpaceCatalog[attribute.spaceId]?.name || "Espacio",
    deviceName:
      attribute.name ||
      sceneSpaceCatalog[attribute.spaceId]?.devices[attribute.deviceIndex]?.name ||
      `Dispositivo ${attribute.deviceIndex + 1}`,
  }));

const getSceneDeviceCount = (scene: Scene) => scene.devices.length;

const getSceneStatusText = (scene: Scene) => (scene.isActive ? "Activa" : "Inactiva");

const slugifySceneName = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const createUniqueSceneId = (
  name: string,
  scenes: Scene[],
  preserveId?: string,
) => {
  if (preserveId) {
    return preserveId;
  }

  const baseId = slugifySceneName(name) || "escena";
  let candidateId = baseId;
  let suffix = 2;

  while (scenes.some((scene) => scene.id === candidateId)) {
    candidateId = `${baseId}-${suffix}`;
    suffix += 1;
  }

  return candidateId;
};

export function Escenas() {
  const isMobile = useIsMobile(COMPACT_LAYOUT_BREAKPOINT);
  const [scenes, setScenes] = useState<Scene[]>(defaultScenes);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);

  const selectedScene = scenes.find((scene) => scene.id === selectedSceneId) || null;
  const editingScene = scenes.find((scene) => scene.id === editingSceneId) || null;

  const groupedSelectedSceneDevices = useMemo(() => {
    if (!selectedScene) return [];

    const grouped = selectedScene.devices.reduce<
      Record<string, { spaceId: string; spaceName: string; devices: SceneDeviceConfig[] }>
    >((accumulator, device) => {
      if (!accumulator[device.spaceId]) {
        accumulator[device.spaceId] = {
          spaceId: device.spaceId,
          spaceName: device.spaceName,
          devices: [],
        };
      }

      accumulator[device.spaceId].devices.push(device);
      return accumulator;
    }, {});

    return Object.values(grouped);
  }, [selectedScene]);

  const toggleScene = (sceneId: string) => {
    setScenes((previousScenes) =>
      previousScenes.map((scene) =>
        scene.id === sceneId ? { ...scene, isActive: !scene.isActive } : scene,
      ),
    );
  };

  const handleSaveScene = (newScene: SceneFormPayload) => {
    const sceneType = isSceneTypeId(newScene.color) ? newScene.color : "relajacion";
    let savedSceneId = newScene.id ?? "";

    setScenes((previousScenes) => {
      const existingScene = newScene.id
        ? previousScenes.find((scene) => scene.id === newScene.id)
        : null;
      const nextSceneId = createUniqueSceneId(
        newScene.name,
        previousScenes,
        existingScene?.id,
      );

      savedSceneId = nextSceneId;

      const scene: Scene = {
        id: nextSceneId,
        sceneType,
        name: newScene.name,
        description: newScene.description || "Rutina personalizada lista para activar.",
        isActive: existingScene?.isActive ?? false,
        devices: buildSceneDevices(newScene.devices),
      };

      if (existingScene) {
        return previousScenes.map((previousScene) =>
          previousScene.id === existingScene.id ? scene : previousScene,
        );
      }

      return [...previousScenes, scene];
    });

    setEditingSceneId(null);
    setSelectedSceneId(savedSceneId);
  };

  const handleOpenSceneDetails = (sceneId: string) => {
    setSelectedSceneId(sceneId);
  };

  const handleCloseSceneDetails = () => {
    setSelectedSceneId(null);
  };

  const handleOpenCreateScene = () => {
    setEditingSceneId(null);
    setIsCreateDialogOpen(true);
  };

  const handleOpenEditScene = (sceneId: string) => {
    setEditingSceneId(sceneId);
    setSelectedSceneId(null);
    setIsCreateDialogOpen(true);
  };

  const handleCreateDialogChange = (open: boolean) => {
    setIsCreateDialogOpen(open);

    if (!open) {
      setEditingSceneId(null);
    }
  };

  const getSceneFormPayload = (scene: Scene): SceneFormPayload => ({
    id: scene.id,
    name: scene.name,
    color: scene.sceneType,
    description: scene.description,
    devices: scene.devices.map((device) => ({ ...device })),
  });

  const handleSceneCardKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    sceneId: string,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpenSceneDetails(sceneId);
    }
  };

  const renderSceneCard = (scene: Scene) => {
    const sceneMeta = sceneTypeMeta[scene.sceneType];
    const configuredDevices = getSceneDeviceCount(scene);

    return (
      <div
        key={scene.id}
        role="button"
        tabIndex={0}
        onClick={() => handleOpenSceneDetails(scene.id)}
        onKeyDown={(event) => handleSceneCardKeyDown(event, scene.id)}
        className={`cursor-pointer rounded-[30px] border bg-gradient-to-br p-5 transition-all ${
          scene.isActive
            ? "border-[#d6a339]/60 from-[#181d28] to-[#0c1017] shadow-[0_18px_44px_rgba(214,163,57,0.08)]"
            : "border-[#2b3448] from-[#121722] to-[#080a10]"
        } ${isMobile ? "" : "hover:-translate-y-1 hover:border-[#4b5d84]"}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] border ${
                scene.isActive
                  ? "border-[#f4c95d] bg-[#15120b] text-[#f4c95d]"
                  : "border-[#2b3548] bg-[#161c28] text-[#a5aec2]"
              }`}
            >
              {sceneMeta.icon(24)}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className={isMobile ? "text-[20px] font-semibold text-white" : "text-[22px] font-semibold text-white"}>
                  {scene.name}
                </h3>
                <span
                  className={`rounded-full border px-3 py-1 text-[12px] font-medium ${
                    scene.isActive
                      ? "border-[#d6a339]/40 bg-[#15120b] text-[#f4c95d]"
                      : "border-[#2b3548] bg-[#151b28] text-[#cdd4e2]"
                  }`}
                >
                  {getSceneStatusText(scene)}
                </span>
              </div>

              <p className="mt-2 text-[15px] leading-6 text-[#aeb6c8]">
                {scene.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#2b3548] bg-[#151b28] px-3 py-1.5 text-[12px] font-medium text-[#cdd4e2]">
                  {sceneMeta.label}
                </span>
                <span className="rounded-full border border-[#2b3548] bg-[#151b28] px-3 py-1.5 text-[12px] font-medium text-[#cdd4e2]">
                  {configuredDevices} {configuredDevices === 1 ? "dispositivo" : "dispositivos"}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              toggleScene(scene.id);
            }}
            aria-label={scene.isActive ? `Desactivar ${scene.name}` : `Activar ${scene.name}`}
            className={`relative inline-flex h-[34px] w-[60px] shrink-0 items-center rounded-full p-[2px] transition-colors ${
              scene.isActive ? "bg-[#fbbf24]" : "bg-[#454955]"
            }`}
          >
            <span
              className={`inline-block h-[30px] w-[30px] rounded-full bg-white transition-transform ${
                scene.isActive ? "translate-x-[26px]" : "translate-x-0"
              }`}
            />
          </button>
        </div>

      </div>
    );
  };

  return (
    <>
      <div className={isMobile ? "px-6 pb-20 pt-12" : "mx-auto max-w-5xl px-12 py-8"}>
        <div className={isMobile ? "mb-8" : "mb-10"}>
          <h1 className={isMobile ? "mb-2 text-3xl" : "mb-3 text-4xl"}>Escenas</h1>
          <p className="text-gray-400">
            El ambiente perfecto para cada momento, a un solo toque.
          </p>
        </div>

        <div className={isMobile ? "space-y-4" : "space-y-5"}>
          {scenes.map((scene) => renderSceneCard(scene))}

          {isMobile ? null : (
            <div
              onClick={handleOpenCreateScene}
              className="cursor-pointer rounded-[30px] border border-dashed border-[#3b465d] bg-gradient-to-br from-[#121722] to-[#0b0f17] p-6 transition-all hover:-translate-y-1 hover:border-[#566582]"
            >
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-[#f4c95d]/60 bg-[#16120a] text-[#f4c95d]">
                  <Plus size={28} />
                </div>
                <h3 className="text-[18px] font-semibold text-white">
                  NUEVA ESCENA
                </h3>
              </div>
            </div>
          )}
        </div>
      </div>

      {isMobile ? (
        <button
          type="button"
          onClick={handleOpenCreateScene}
          className="fixed bottom-24 right-5 z-30 inline-flex items-center gap-2 rounded-full bg-[#f4bd49] px-5 py-4 text-[15px] font-medium text-[#111111] shadow-[0_18px_44px_rgba(244,189,73,0.26)] transition-transform hover:scale-[1.01]"
        >
          <Plus size={18} />
          NUEVA ESCENA
        </button>
      ) : null}

      <CreateSceneDialog
        open={isCreateDialogOpen}
        onOpenChange={handleCreateDialogChange}
        onSave={handleSaveScene}
        initialScene={editingScene ? getSceneFormPayload(editingScene) : null}
      />

      <Dialog open={Boolean(selectedScene)} onOpenChange={(open) => !open && handleCloseSceneDetails()}>
        <DialogContent className="w-[min(96vw,980px)] overflow-hidden border border-[#20283a] bg-[#0e1218] p-0 text-white shadow-[0_32px_120px_rgba(0,0,0,0.6)] sm:max-h-[88vh] sm:rounded-[32px] [&>button]:top-4 [&>button]:right-4 [&>button]:flex [&>button]:h-9 [&>button]:w-9 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:border [&>button]:border-[#2b3042] [&>button]:bg-[#151a25] [&>button]:text-[#c4c8d6] [&>button]:opacity-100 [&>button]:transition-colors [&>button]:hover:bg-[#1c2231] [&>button]:hover:text-white">
          {selectedScene ? (
            <div className="flex max-h-[88vh] flex-col overflow-hidden">
              <div className="relative border-b border-[#20283a] px-5 pb-5 pt-6 sm:px-8">
                <div className="relative">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] border ${
                          selectedScene.isActive
                            ? "border-[#f4c95d] bg-[#15120b] text-[#f4c95d]"
                            : "border-[#2b3548] bg-[#161c28] text-[#a5aec2]"
                        }`}
                      >
                        {sceneTypeMeta[selectedScene.sceneType].icon(24)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
                          Escena
                        </p>
                        <DialogTitle className="mt-2 text-[30px] font-semibold text-white">
                          {selectedScene.name}
                        </DialogTitle>
                        <DialogDescription className="mt-2 max-w-[58ch] text-[15px] leading-6 text-[#a5aec2]">
                          {selectedScene.description}
                        </DialogDescription>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6">
                <div className="space-y-5">
                  <div className="rounded-[26px] border border-[#252e3f] bg-[#121722] p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-[16px] border border-[#d6a339]/40 bg-[#15120b] text-[#f4c95d]">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <h3 className="text-[24px] font-semibold text-white">
                          Detalle de la escena
                        </h3>
                        <p className="text-sm text-[#98a2b7]">
                          Ambientes y acciones incluidas.
                        </p>
                      </div>
                    </div>

                    {groupedSelectedSceneDevices.length > 0 ? (
                      <div className="grid gap-4 lg:grid-cols-2">
                        {groupedSelectedSceneDevices.map((group, index) => (
                          <div
                            key={group.spaceId}
                            className={`rounded-[22px] border border-[#252e3f] bg-[#10151f] p-4 ${
                              groupedSelectedSceneDevices.length % 2 === 1 &&
                              index === groupedSelectedSceneDevices.length - 1
                                ? "lg:col-span-2"
                                : ""
                            }`}
                          >
                            <div className="mb-3 flex items-center justify-between">
                              <div>
                                <p className="text-[18px] font-semibold text-white">
                                  {group.spaceName}
                                </p>
                                <p className="text-sm text-[#98a2b7]">
                                  {group.devices.length} acción
                                  {group.devices.length === 1 ? "" : "es"} configurada
                                  {group.devices.length === 1 ? "" : "s"}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              {group.devices.map((device) => (
                                <div
                                  key={device.id}
                                  className="rounded-[18px] border border-[#232c3d] bg-[#141a26] p-3"
                                >
                                  {(() => {
                                    const isActive = isDeviceActive(device);

                                    return (
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                          <p className="break-words font-medium text-white">
                                            {device.deviceName}
                                          </p>
                                          <p className="mt-1 break-words text-sm text-[#98a2b7]">
                                            {getDeviceSummary(device)}
                                          </p>
                                        </div>
                                        <span
                                          className={`shrink-0 self-start rounded-full border px-3 py-1 text-xs font-medium ${
                                            isActive
                                              ? "border-[#d6a339]/40 bg-[#15120b] text-[#f4c95d]"
                                              : "border-[#2b3548] bg-[#151b28] text-[#cdd4e2]"
                                          }`}
                                        >
                                          {isActive ? "ACTIVO" : "INACTIVO"}
                                        </span>
                                      </div>
                                    );
                                  })()}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-[22px] border border-dashed border-[#33405a] bg-[#10151f] p-6 text-center">
                        <p className="text-[18px] font-medium text-white">
                          Esta escena todavía no tiene dispositivos configurados.
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[#98a2b7]">
                          La podés activar igual o completarla más tarde con una nueva configuración.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-[#20283a] bg-[#0b0f16] px-5 py-4 sm:px-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-[#8b96ab]">
                 
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOpenEditScene(selectedScene.id)}
                      className="h-11 rounded-[18px] border border-[#2b3548] bg-[#141a26] px-5 text-[#d0d6e3] hover:bg-[#192131] hover:text-white"
                    >
                      <Edit3 size={16} />
                      EDITAR ESCENA
                    </Button>
                    <Button
                      type="button"
                      onClick={() => toggleScene(selectedScene.id)}
                      className="h-11 rounded-[18px] border border-[#d6a339] bg-[#151d2a] px-5 text-[#f0c45c] hover:bg-[#1b2434]"
                    >
                      {selectedScene.isActive ? "DESACTIVAR ESCENA" : "ACTIVAR ESCENA"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
