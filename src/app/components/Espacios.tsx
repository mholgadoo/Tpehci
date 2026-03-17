import {
  Armchair,
  Bed,
  ChefHat,
  Bath,
  Monitor,
  Car,
  TreePine,
  Sun,
  Lightbulb,
  Droplet,
  Fan,
  Lock,
  Thermometer,
  Tv,
  Coffee,
  Camera,
  DoorOpen,
  Plus,
  ChevronDown,
  User,
  X,
  CookingPot,
  ShowerHead,
} from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "../hooks/useIsMobile";
import { Link } from "react-router";

interface Device {
  icon: React.ReactNode;
  color?: string;
}

interface Space {
  id: string;
  name: string;
  icon: React.ReactNode;
  devices: Device[];
}

const initialSpaces: Space[] = [
  {
    id: "sala",
    name: "Sala de Estar",
    icon: <Armchair size={28} />,
    devices: [
      { icon: <Lightbulb size={14} />, color: "text-blue-500" },
      { icon: <Lightbulb size={14} /> },
      { icon: <Fan size={14} /> },
      { icon: <Tv size={14} /> },
      { icon: <Thermometer size={14} /> },
      { icon: <Camera size={14} /> },
    ],
  },
  {
    id: "dormitorio",
    name: "Dormitorio",
    icon: <Bed size={28} />,
    devices: [
      { icon: <Lightbulb size={14} />, color: "text-blue-500" },
      { icon: <Lightbulb size={14} /> },
      { icon: <Fan size={14} /> },
      { icon: <Tv size={14} /> },
    ],
  },
  {
    id: "cocina",
    name: "Cocina",
    icon: <ChefHat size={28} />,
    devices: [
      { icon: <Lightbulb size={14} />, color: "text-blue-500" },
      { icon: <Droplet size={14} /> },
      { icon: <Coffee size={14} /> },
      { icon: <Thermometer size={14} /> },
      { icon: <Camera size={14} /> },
    ],
  },
  {
    id: "bano",
    name: "Baño",
    icon: <Bath size={28} />,
    devices: [
      { icon: <Lightbulb size={14} />, color: "text-blue-500" },
      { icon: <Thermometer size={14} /> },
      { icon: <Fan size={14} /> },
    ],
  },
  {
    id: "oficina",
    name: "Oficina",
    icon: <Monitor size={28} />,
    devices: [
      { icon: <Lightbulb size={14} />, color: "text-blue-500" },
      { icon: <Fan size={14} /> },
      { icon: <Camera size={14} /> },
      { icon: <Thermometer size={14} /> },
    ],
  },
  {
    id: "garaje",
    name: "Garaje",
    icon: <Car size={28} />,
    devices: [
      { icon: <Lightbulb size={14} />, color: "text-blue-500" },
      { icon: <Camera size={14} /> },
      { icon: <DoorOpen size={14} /> },
    ],
  },
  {
    id: "jardin",
    name: "Jardín",
    icon: <TreePine size={28} />,
    devices: [
      { icon: <Lightbulb size={14} />, color: "text-blue-500" },
      { icon: <Droplet size={14} /> },
      { icon: <Camera size={14} /> },
      { icon: <Thermometer size={14} /> },
    ],
  },
  {
    id: "terraza",
    name: "Terraza",
    icon: <Sun size={28} />,
    devices: [
      { icon: <Lightbulb size={14} />, color: "text-blue-500" },
      { icon: <Tv size={14} /> },
    ],
  },
];

export function Espacios() {
  const isMobile = useIsMobile();
  const [spaces, setSpaces] = useState<Space[]>(initialSpaces);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const spaceTypes = [
    { id: "sala", name: "Sala de Estar", icon: <Armchair size={24} strokeWidth={1.5} /> },
    { id: "dormitorio", name: "Dormitorio", icon: <Bed size={24} strokeWidth={1.5} /> },
    { id: "cocina", name: "Cocina", icon: <CookingPot size={24} strokeWidth={1.5} /> },
    { id: "bano", name: "Baño", icon: <ShowerHead size={24} strokeWidth={1.5} /> },
    { id: "oficina", name: "Oficina", icon: <Monitor size={24} strokeWidth={1.5} /> },
    { id: "garaje", name: "Garaje", icon: <Car size={24} strokeWidth={1.5} /> },
    { id: "jardin", name: "Jardín", icon: <TreePine size={24} strokeWidth={1.5} /> },
    { id: "terraza", name: "Terraza", icon: <Sun size={24} strokeWidth={1.5} /> },
  ];

  const handleAddSpace = () => {
    if (!newSpaceName.trim() || !selectedType) return;
    
    const typeObj = spaceTypes.find(t => t.id === selectedType);
    if (!typeObj) return;

    const newSpace: Space = {
      id: newSpaceName.toLowerCase().replace(/\s+/g, '-'),
      name: newSpaceName,
      icon: typeObj.icon,
      devices: [],
    };

    setSpaces([...spaces, newSpace]);
    setIsModalOpen(false);
    setNewSpaceName("");
    setSelectedType(null);
  };

  const renderModal = () => {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center">
        <div className="w-full bg-[#0F0F13] sm:w-[500px] sm:rounded-[32px] rounded-t-[32px] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl relative">
          
          {isMobile && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-600 rounded-full" />
          )}

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-8 pb-4 sm:px-8 border-b border-transparent">
            <h2 className="text-[22px] font-semibold text-white">Nuevo Espacio</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-9 h-9 rounded-full bg-gray-800/80 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-6 pb-8 sm:px-8 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
            {/* Name Input */}
            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-semibold tracking-wider text-gray-400">
                NOMBRE
              </label>
              <div className="bg-[#24262d] rounded-2xl border border-transparent focus-within:border-blue-500/50 transition-all px-5 py-4">
                <input
                  type="text"
                  placeholder="Sala Principal"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-gray-500 outline-none text-base"
                />
              </div>
            </div>

            {/* Type Grid */}
            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-semibold tracking-wider text-gray-400">
                TIPO DE ESPACIO
              </label>
              <div className="grid grid-cols-4 gap-3 sm:gap-4">
                {spaceTypes.map((type) => {
                  const isSelected = selectedType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`flex flex-col items-center justify-center gap-3 py-5 px-2 rounded-2xl transition-all ${
                        isSelected
                          ? "bg-blue-600/20 border border-blue-500/50 text-blue-400"
                          : "bg-[#24262d] border border-transparent text-gray-400 hover:bg-[#2c2f38]"
                      }`}
                    >
                      {type.icon}
                      <span className="text-[11px] font-medium text-center leading-tight">
                        {type.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAddSpace}
              disabled={!newSpaceName.trim() || !selectedType}
              className={`w-full py-4 rounded-2xl text-[15px] font-medium transition-all mt-2 ${
                newSpaceName.trim() && selectedType
                  ? "bg-blue-600 text-white hover:bg-blue-500"
                  : "bg-[#24262d] text-gray-500 cursor-not-allowed"
              }`}
            >
              Agregar Espacio
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isMobile) {
    return (
      <>
        <div className="pb-20 px-6 pt-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Bienvenido de vuelta</p>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl">Mi Hogar</h1>
                  <ChevronDown size={20} className="text-gray-400" />
                </div>
              </div>
              <button className="w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center">
                <User size={20} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-xl">Espacios</h2>
              <span className="text-gray-400 text-sm">{spaces.length} espacios</span>
            </div>
          </div>

          {/* Spaces List */}
          <div className="flex flex-col gap-4 mb-4">
            {spaces.map((space) => (
              <Link
                key={space.id}
                to={`/espacio/${space.id}`}
                className="bg-gradient-to-r from-gray-800/40 to-gray-900/40 rounded-3xl p-5 border border-gray-700/50 hover:border-gray-600/50 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="text-gray-300 bg-gray-800/50 p-3 rounded-2xl flex items-center justify-center">
                    {space.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1.5">{space.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {space.devices.map((device, index) => (
                        <div
                          key={index}
                          className={`${device.color || "text-gray-500"}`}
                        >
                          {device.icon}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* Add New Space */}
            <div
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 rounded-3xl p-5 border border-gray-700/50 border-dashed hover:border-gray-600/50 transition-all cursor-pointer flex items-center gap-4"
            >
              <div className="text-gray-500 bg-gray-800/30 p-3 rounded-2xl flex items-center justify-center">
                <Plus size={24} />
              </div>
              <span className="text-gray-400 font-medium">Nuevo espacio</span>
            </div>
          </div>
        </div>
        {renderModal()}
      </>
    );
  }

  // Desktop Layout
  return (
    <>
      <div className="px-12 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-400 text-sm mb-2">Bienvenido de vuelta</p>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl">Mi Hogar</h1>
                <ChevronDown size={24} className="text-gray-400" />
              </div>
            </div>
            <button className="w-14 h-14 rounded-full bg-gray-800/50 flex items-center justify-center hover:bg-gray-800 transition-all">
              <User size={24} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-2xl">Espacios</h2>
            <span className="text-gray-400">{spaces.length} espacios</span>
          </div>
        </div>

        {/* Spaces Grid - Desktop (3 columns) */}
        <div className="grid grid-cols-3 gap-6">
          {spaces.map((space) => (
            <Link
              key={space.id}
              to={`/espacio/${space.id}`}
              className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-3xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <div className="mb-5 text-gray-300">{space.icon}</div>
              <h3 className="text-lg mb-4">{space.name}</h3>
              <div className="flex flex-wrap gap-3">
                {space.devices.map((device, index) => (
                  <div
                    key={index}
                    className={`${device.color || "text-gray-500"}`}
                  >
                    {device.icon}
                  </div>
                ))}
              </div>
            </Link>
          ))}

          {/* Add New Space */}
          <div
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-3xl p-6 border border-gray-700/50 border-dashed hover:border-gray-600/50 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[200px] hover:scale-[1.02]"
          >
            <Plus size={28} className="mb-3 text-gray-500" />
            <span className="text-gray-400">Nuevo espacio</span>
          </div>
        </div>
      </div>
      {renderModal()}
    </>
  );
}