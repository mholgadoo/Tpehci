import React, { useState, ReactNode } from "react";
import {
  Armchair,
  Bath,
  Bed,
  ChefHat,
  Monitor,
  Car,
  TreePine,
  Sun,
  Lightbulb,
  Speaker,
  Blinds,
  Bell,
  Wind,
  CookingPot,
  DoorOpen,
  Droplet,
  Plus,
  Music,
  BookOpen,
  Moon,
  Film,
  Zap,
  Heart,
  Sunset,
  Tv,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface DeviceAttribute {
  id: string;
  spaceId: string;
  deviceIndex: number;
  status: "on" | "off";
  brightness?: number;
}

interface Space {
  id: string;
  name: string;
  icon: ReactNode;
  devices: Array<{
    icon: ReactNode;
    color?: string;
    name?: string;
  }>;
}

interface Spaces {
  [key: string]: Space;
}

const spaceData: Spaces = {
  sala: {
    id: "sala",
    name: "Sala de Estar",
    icon: <Armchair size={24} />,
    devices: [
      { icon: <Lightbulb size={14} />, color: "text-yellow-500", name: "Luz Principal" },
      { icon: <Lightbulb size={14} />, name: "Luz Ambiental" },
      { icon: <Speaker size={14} />, name: "Altavoz" },
      { icon: <Blinds size={14} />, name: "Cortinas" },
      { icon: <Bell size={14} />, name: "Timbre" },
    ],
  },
  dormitorio: {
    id: "dormitorio",
    name: "Dormitorio",
    icon: <Bed size={24} />,
    devices: [
      { icon: <Lightbulb size={14} />, color: "text-yellow-500", name: "Luz Principal" },
      { icon: <Lightbulb size={14} />, name: "Luz de Noche" },
      { icon: <Blinds size={14} />, name: "Cortinas" },
      { icon: <Wind size={14} />, name: "Aire Acondicionado" },
    ],
  },
  cocina: {
    id: "cocina",
    name: "Cocina",
    icon: <ChefHat size={24} />,
    devices: [
      { icon: <Lightbulb size={14} />, color: "text-yellow-500", name: "Luz Principal" },
      { icon: <CookingPot size={14} />, name: "Horno" },
      { icon: <Bell size={14} />, name: "Timbre" },
    ],
  },
  bano: {
    id: "bano",
    name: "Baño",
    icon: <Bath size={24} />,
    devices: [
      { icon: <Lightbulb size={14} />, color: "text-yellow-500", name: "Luz Principal" },
      { icon: <Wind size={14} />, name: "Extracto Humedad" },
    ],
  },
  oficina: {
    id: "oficina",
    name: "Oficina",
    icon: <Monitor size={24} />,
    devices: [
      { icon: <Lightbulb size={14} />, color: "text-yellow-500", name: "Luz Principal" },
      { icon: <Speaker size={14} />, name: "Altavoz" },
      { icon: <Blinds size={14} />, name: "Cortinas" },
    ],
  },
  garaje: {
    id: "garaje",
    name: "Garaje",
    icon: <Car size={24} />,
    devices: [
      { icon: <Lightbulb size={14} />, color: "text-yellow-500", name: "Luz Principal" },
      { icon: <DoorOpen size={14} />, name: "Puerta" },
      { icon: <Bell size={14} />, name: "Timbre" },
    ],
  },
  jardin: {
    id: "jardin",
    name: "Jardín",
    icon: <TreePine size={24} />,
    devices: [
      { icon: <Lightbulb size={14} />, color: "text-yellow-500", name: "Luz Principal" },
      { icon: <Droplet size={14} />, name: "Riego" },
      { icon: <Bell size={14} />, name: "Timbre" },
    ],
  },
  terraza: {
    id: "terraza",
    name: "Terraza",
    icon: <Sun size={24} />,
    devices: [
      { icon: <Lightbulb size={14} />, color: "text-yellow-500", name: "Luz Principal" },
      { icon: <Speaker size={14} />, name: "Altavoz" },
      { icon: <Blinds size={14} />, name: "Cortinas" },
    ],
  },
};

interface CreateSceneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (scene: { name: string; color: string; description: string; devices: DeviceAttribute[] }) => void;
}

export function CreateSceneDialog({ open, onOpenChange, onSave }: CreateSceneDialogProps) {
  const [sceneName, setSceneName] = useState("");
  const [sceneDescription, setSceneDescription] = useState("");
  const [sceneType, setSceneType] = useState("relajacion");
  const [deviceAttributes, setDeviceAttributes] = useState<DeviceAttribute[]>([]);
  const [activeTab, setActiveTab] = useState<string>("sala");

  const sceneOptions = [
    { value: "relajacion", label: "Relajación", icon: <Moon size={20} /> },
    { value: "lectura", label: "Lectura", icon: <BookOpen size={20} /> },
    { value: "musica", label: "Música", icon: <Music size={20} /> },
    { value: "pelicula", label: "Película", icon: <Film size={20} /> },
    { value: "trabajo", label: "Trabajo", icon: <Zap size={20} /> },
    { value: "romantica", label: "Romántica", icon: <Heart size={20} /> },
    { value: "atardecer", label: "Atardecer", icon: <Sunset size={20} /> },
    { value: "cine", label: "Cine", icon: <Tv size={20} /> },
  ];

  const handleDeviceStatusChange = (spaceId: string, deviceIndex: number, status: "on" | "off") => {
    const id = `${spaceId}-${deviceIndex}`;
    setDeviceAttributes((prev: DeviceAttribute[]) => {
      const existing = prev.find((attr: DeviceAttribute) => attr.id === id);
      if (existing) {
        return prev.map((attr: DeviceAttribute) =>
          attr.id === id ? { ...attr, status } : attr
        );
      }
      return [
        ...prev,
        { id, spaceId, deviceIndex, status, brightness: 100 },
      ];
    });
  };

  const handleBrightnessChange = (spaceId: string, deviceIndex: number, brightness: number) => {
    const id = `${spaceId}-${deviceIndex}`;
    setDeviceAttributes((prev: DeviceAttribute[]) => {
      const existing = prev.find((attr: DeviceAttribute) => attr.id === id);
      if (existing) {
        return prev.map((attr: DeviceAttribute) =>
          attr.id === id ? { ...attr, brightness } : attr
        );
      }
      return [
        ...prev,
        { id, spaceId, deviceIndex, status: "on", brightness },
      ];
    });
  };

  const getDeviceAttribute = (spaceId: string, deviceIndex: number) => {
    return deviceAttributes.find(
      (attr: DeviceAttribute) => attr.spaceId === spaceId && attr.deviceIndex === deviceIndex
    );
  };

  const handleSave = () => {
    if (!sceneName.trim()) {
      alert("Por favor ingresa un nombre para la escena");
      return;
    }

    onSave({
      name: sceneName,
      description: sceneDescription,
      color: sceneType,
      devices: deviceAttributes,
    });

    // Reset form
    setSceneName("");
    setSceneDescription("");
    setSceneType("relajacion");
    setDeviceAttributes([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0f1115] border border-[#20232d] [&_button]:text-[#6b7280]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Crear Nueva Escena</DialogTitle>
          <DialogDescription className="text-[#8a8d9e]">
            Configura los dispositivos para tu nueva escena personalizada
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Escena Details */}
          <div className="space-y-4 bg-[#15171e] rounded-2xl p-5 border border-[#20232d]">
            <div>
              <Label htmlFor="scene-name" className="text-white text-[11px] font-bold tracking-wider uppercase">Nombre de la Escena</Label>
              <Input
                id="scene-name"
                placeholder="Ej: Lectura Relajante"
                value={sceneName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSceneName(e.target.value)}
                className="mt-3 bg-[#0f1115] border border-[#26293a] text-white placeholder:text-[#6b7280] rounded-2xl"
              />
            </div>

            <div>
              <Label htmlFor="scene-description" className="text-white text-[11px] font-bold tracking-wider uppercase">Descripción</Label>
              <Input
                id="scene-description"
                placeholder="Ej: Luces bajas, música suave"
                value={sceneDescription}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSceneDescription(e.target.value)}
                className="mt-3 bg-[#0f1115] border border-[#26293a] text-white placeholder:text-[#6b7280] rounded-2xl"
              />
            </div>

            <div>
              <Label className="text-white text-[11px] font-bold tracking-wider uppercase mb-3 block">Tipo de Escena</Label>
              <div className="grid grid-cols-4 gap-2">
                {sceneOptions.map((scene) => (
                  <button
                    key={scene.value}
                    onClick={() => setSceneType(scene.value)}
                    className={`h-[56px] rounded-2xl flex flex-col items-center justify-center gap-1 border-2 transition-all ${
                      sceneType === scene.value
                        ? "border-[#fbbf24] bg-[#000000] text-[#fbbf24]"
                        : "border-[#2a2d3a] bg-[#15171e] text-[#6b7280] hover:border-[#335bd1]"
                    }`}
                    title={scene.label}
                  >
                    <div className="text-lg">{scene.icon}</div>
                    <span className="text-[10px] font-medium text-center">{scene.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Spaces and Devices */}
          <div className="space-y-4">
            <div>
              <h3 className="text-[#8a8d9e] text-[12px] font-bold tracking-widest uppercase mb-4">Configura tus Dispositivos</h3>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 gap-2 h-auto bg-transparent border-0 p-0 mb-6 w-full">
                  {Object.values(spaceData).map((space) => (
                    <TabsTrigger
                      key={space.id}
                      value={space.id}
                      className="flex flex-col items-center gap-2 py-3 rounded-[14px] data-[state=active]:bg-[#20232d] data-[state=active]:text-[#fbbf24] text-[#6b7280] bg-transparent border border-transparent hover:border-[#2a2d3a] flex-1"
                    >
                      <div className="text-lg">{space.icon}</div>
                      <span className="text-xs text-center">{space.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.values(spaceData).map((space) => (
                  <TabsContent key={space.id} value={space.id} className="space-y-4 mt-4">
                    <h2 className="text-[#8a8d9e] text-[12px] font-bold tracking-widest uppercase mb-4">
                      {space.name}
                    </h2>
                    <div className="space-y-3">
                        {space.devices.map((device, index) => {
                          const attribute = getDeviceAttribute(space.id, index);
                          const isActive = attribute !== undefined && attribute.status === "on";

                          return (
                            <div
                              key={index}
                              className={`rounded-[18px] p-4 flex flex-col gap-4 transition-colors ${
                                isActive
                                  ? "bg-[#15171e] border border-[#2a3250] shadow-[0_0_20px_rgba(65,113,255,0.06)]"
                                  : "bg-[#15171e] border border-[#20232d]"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div
                                    className={`w-[46px] h-[46px] rounded-[14px] flex items-center justify-center ${
                                      isActive
                                        ? "bg-[#000000] text-[#fbbf24]"
                                        : "bg-[#20232d] text-[#6b7280]"
                                    }`}
                                  >
                                    {device.icon}
                                  </div>
                                  <div>
                                    <h4 className="text-[15px] font-medium text-white mb-0.5">
                                      {device.name || `Dispositivo ${index + 1}`}
                                    </h4>
                                    <p
                                      className={`text-[13px] ${
                                        isActive ? "text-[#fbbf24]" : "text-[#6b7280]"
                                      }`}
                                    >
                                      {isActive ? "Encendido" : "Apagado"}
                                      {isActive && attribute?.brightness !== undefined && ` · ${attribute.brightness}%`}
                                    </p>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeviceStatusChange(
                                      space.id,
                                      index,
                                      isActive ? "off" : "on"
                                    )
                                  }
                                  className={`relative inline-flex h-[32px] w-[56px] items-center rounded-full p-[2px] transition-colors duration-200 ${
                                    isActive ? "bg-[#fbbf24]" : "bg-[#454955]"
                                  }`}
                                >
                                  <span
                                    className={`inline-block h-[28px] w-[28px] transform rounded-full bg-white transition-transform duration-200 ${
                                      isActive ? "translate-x-[24px]" : "translate-x-0"
                                    }`}
                                  />
                                </button>
                              </div>

                              {isActive && (
                                <div className="px-1 pb-1 pt-1 relative">
                                  <div className="relative w-full h-[6px] bg-[#2a2d3d] rounded-full">
                                    <div
                                      className="absolute left-0 top-0 h-full bg-[#fbbf24] rounded-full transition-all duration-150"
                                      style={{ width: `${attribute?.brightness || 0}%` }}
                                    />
                                    <input
                                      type="range"
                                      min="0"
                                      max="100"
                                      value={attribute?.brightness || 0}
                                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                        handleBrightnessChange(space.id, index, parseInt(event.target.value))
                                      }
                                      className="absolute inset-0 w-full h-[6px] opacity-0 cursor-pointer"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3 border-t border-[#20232d] pt-6">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-[#15171e] border border-[#20232d] text-[#6b7280] hover:bg-[#1a1d28] hover:text-[#9ca3af]"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#000000] border border-[#fbbf24] text-[#fbbf24] hover:bg-[#1a1a1a] !text-[#fbbf24]"
            >
              Guardar Escena
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
