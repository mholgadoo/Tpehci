import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Trash2,
  Power,
  Lightbulb,
  Coffee,
  Camera,
  Fan,
  Thermometer,
  Plus,
} from "lucide-react";
import { useState } from "react";

interface Device {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: "on" | "off";
  brightness?: number;
  type: "light" | "appliance" | "sensor" | "climate";
}

const spaceDevices: Record<string, Device[]> = {
  cocina: [
    {
      id: "luz-cocina",
      name: "Luz de Cocina",
      icon: <Lightbulb size={20} />,
      status: "on",
      brightness: 100,
      type: "light",
    },
    {
      id: "enchufe-cafetera",
      name: "Enchufe Cafetera",
      icon: <Coffee size={20} />,
      status: "on",
      type: "appliance",
    },
    {
      id: "camara",
      name: "Cámara",
      icon: <Camera size={20} />,
      status: "off",
      type: "sensor",
    },
    {
      id: "ventilador-extractor",
      name: "Ventilador Extractor",
      icon: <Fan size={20} />,
      status: "off",
      type: "climate",
    },
    {
      id: "luz-bajo-mueble",
      name: "Luz Bajo Mueble",
      icon: <Lightbulb size={20} />,
      status: "off",
      type: "light",
    },
  ],
  sala: [
    {
      id: "luz-principal",
      name: "Luz Principal",
      icon: <Lightbulb size={20} />,
      status: "on",
      brightness: 80,
      type: "light",
    },
    {
      id: "luz-ambiente",
      name: "Luz Ambiente",
      icon: <Lightbulb size={20} />,
      status: "on",
      brightness: 50,
      type: "light",
    },
    {
      id: "ventilador",
      name: "Ventilador",
      icon: <Fan size={20} />,
      status: "off",
      type: "climate",
    },
    {
      id: "termostato",
      name: "Termostato",
      icon: <Thermometer size={20} />,
      status: "on",
      type: "climate",
    },
  ],
  dormitorio: [
    {
      id: "luz-techo",
      name: "Luz de Techo",
      icon: <Lightbulb size={20} />,
      status: "on",
      brightness: 60,
      type: "light",
    },
    {
      id: "luz-mesita",
      name: "Luz Mesita",
      icon: <Lightbulb size={20} />,
      status: "off",
      type: "light",
    },
  ],
  bano: [
    {
      id: "luz-bano",
      name: "Luz de Baño",
      icon: <Lightbulb size={20} />,
      status: "on",
      brightness: 100,
      type: "light",
    },
    {
      id: "extractor",
      name: "Extractor",
      icon: <Fan size={20} />,
      status: "off",
      type: "climate",
    },
  ],
  oficina: [
    {
      id: "luz-escritorio",
      name: "Luz Escritorio",
      icon: <Lightbulb size={20} />,
      status: "on",
      brightness: 90,
      type: "light",
    },
    {
      id: "camara-oficina",
      name: "Cámara",
      icon: <Camera size={20} />,
      status: "on",
      type: "sensor",
    },
  ],
  garaje: [
    {
      id: "luz-garaje",
      name: "Luz de Garaje",
      icon: <Lightbulb size={20} />,
      status: "off",
      type: "light",
    },
  ],
  jardin: [
    {
      id: "luz-jardin",
      name: "Luz de Jardín",
      icon: <Lightbulb size={20} />,
      status: "on",
      brightness: 70,
      type: "light",
    },
  ],
  terraza: [
    {
      id: "luz-terraza",
      name: "Luz de Terraza",
      icon: <Lightbulb size={20} />,
      status: "on",
      brightness: 85,
      type: "light",
    },
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

export function SpaceDetail() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const navigate = useNavigate();
  const [devices, setDevices] = useState<Device[]>(
    spaceDevices[spaceId || ""] || []
  );

  const spaceName = spaceNames[spaceId || ""] || "Espacio";
  const activeDevices = devices.filter((d) => d.status === "on").length;

  const toggleDevice = (deviceId: string) => {
    setDevices(
      devices.map((device) =>
        device.id === deviceId
          ? { ...device, status: device.status === "on" ? "off" : "on" }
          : device
      )
    );
  };

  const updateBrightness = (deviceId: string, value: number) => {
    setDevices(
      devices.map((device) =>
        device.id === deviceId ? { ...device, brightness: value } : device
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-white pb-20 md:pb-8">
      {/* Header */}
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
              <h1 className="text-[22px] font-semibold text-white leading-tight">{spaceName}</h1>
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

      {/* Devices List */}
      <div className="px-6">
        <h2 className="text-[#8a8d9e] text-[12px] font-bold tracking-widest uppercase mb-4">
          Dispositivos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">
          {devices.map((device) => (
            <div
              key={device.id}
              className={`rounded-[18px] p-4 flex flex-col gap-4 transition-colors ${
                device.status === "on"
                  ? "bg-[#15171e] border border-[#2a3250] shadow-[0_0_20px_rgba(65,113,255,0.06)]"
                  : "bg-[#15171e] border border-[#20232d]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-[46px] h-[46px] rounded-[14px] flex items-center justify-center ${
                      device.status === "on"
                        ? "bg-[#1a2035] text-[#4171ff]"
                        : "bg-[#20232d] text-[#6b7280]"
                    }`}
                  >
                    {device.icon}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-medium text-white mb-0.5">{device.name}</h3>
                    <p
                      className={`text-[13px] ${
                        device.status === "on" ? "text-[#4171ff]" : "text-[#6b7280]"
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
                      device.status === "on" ? "bg-[#4171ff]" : "bg-[#454955]"
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

              {/* Brightness Slider for active lights */}
              {device.type === "light" && device.status === "on" && (
                <div className="px-1 pb-1 pt-1 relative">
                  <div className="relative w-full h-[6px] bg-[#2a2d3d] rounded-full">
                    {/* Progress bar (white fill) */}
                    <div
                      className="absolute h-full bg-white rounded-full transition-all duration-200"
                      style={{ width: `${device.brightness || 0}%` }}
                    />
                    {/* Invisible slider on top */}
                    <div className="relative h-[6px] bg-[#2a2d3d] rounded-full">
                    {/* Progress bar (filled part) */}
                    <div 
                      className="absolute left-0 top-0 h-full bg-[#4171ff] rounded-full transition-all duration-150"
                        style={{ width: `${device.brightness || 0}%` }}
                    />
                    {/* Slider input */}
                    <input
                      type="range"
                        min="0"
                        max="100"
                        value={device.brightness || 0}
                        onChange={(e) => updateBrightness(device.id, parseInt(e.target.value))}
                        className="absolute top-0 left-0 transpabsetute cursor-pointer inset-0 w-full h-[6px] opacity-0 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(65,113,255,0.5)] [&::-moz-range-thumb]:w-[16px] [&::-moz-range-thumb]:h-[16px] [&::-moz-range-thumb]:bg-[#4171ff] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                      />
                  </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add Device Button */}
          <button className="w-full h-[76px] bg-[#15171e] rounded-[18px] border border-dashed border-[#3f4354] flex items-center gap-4 px-4 text-[#6b7280] hover:text-[#9ca3af] hover:border-[#6b7280] transition-colors">
            <div className="w-[46px] h-[46px] rounded-[14px] bg-[#20232d] flex items-center justify-center">
              <Plus size={20} />
            </div>
            <span className="text-[15px] font-medium">Agregar dispositivo</span>
          </button>
        </div>
      </div>
    </div>
  );
}