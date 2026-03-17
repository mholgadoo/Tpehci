import { Moon, Sun, Film, Music, Plus } from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";

interface Scene {
  id: string;
  icon: React.ReactNode;
  name: string;
  description: string;
  color: string;
}

const scenes: Scene[] = [
  {
    id: "night",
    icon: <Moon size={24} />,
    name: "Modo Noche",
    description: "Luces bajas, temperatura óptima",
    color: "bg-blue-600",
  },
  {
    id: "morning",
    icon: <Sun size={24} />,
    name: "Buenos Días",
    description: "Luces graduales, café encendido",
    color: "bg-blue-600",
  },
  {
    id: "cinema",
    icon: <Film size={24} />,
    name: "Cine en Casa",
    description: "Luces apagadas, TV encendida",
    color: "bg-blue-600",
  },
  {
    id: "party",
    icon: <Music size={24} />,
    name: "Fiesta",
    description: "Luces de colores, altavoces",
    color: "bg-blue-600",
  },
];

export function Escenas() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="pb-20 px-6 pt-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Escenas</h1>
          <p className="text-gray-400 text-sm">
            Automatiza tu hogar con un toque
          </p>
        </div>

        {/* Scenes List */}
        <div className="space-y-4">
          {scenes.map((scene) => (
            <div
              key={scene.id}
              className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-5 border border-gray-700/50 hover:border-gray-600/50 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`${scene.color} w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0`}
                >
                  {scene.icon}
                </div>
                <div>
                  <h3 className="mb-1">{scene.name}</h3>
                  <p className="text-gray-400 text-sm">{scene.description}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Scene */}
          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl p-5 border border-gray-700/50 border-dashed hover:border-gray-600/50 transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-700/30 flex items-center justify-center flex-shrink-0">
                <Plus size={24} className="text-gray-500" />
              </div>
              <div>
                <h3 className="mb-1">Nueva escena</h3>
                <p className="text-gray-400 text-sm">
                  Crea una rutina personalizada
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="px-12 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl mb-3">Escenas</h1>
        <p className="text-gray-400">
          Automatiza tu hogar con un toque
        </p>
      </div>

      {/* Scenes List */}
      <div className="space-y-5">
        {scenes.map((scene) => (
          <div
            key={scene.id}
            className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all cursor-pointer hover:scale-[1.01]"
          >
            <div className="flex items-center gap-5">
              <div
                className={`${scene.color} w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0`}
              >
                {scene.icon}
              </div>
              <div>
                <h3 className="text-lg mb-2">{scene.name}</h3>
                <p className="text-gray-400">{scene.description}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Scene */}
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl p-6 border border-gray-700/50 border-dashed hover:border-gray-600/50 transition-all cursor-pointer hover:scale-[1.01]">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gray-700/30 flex items-center justify-center flex-shrink-0">
              <Plus size={28} className="text-gray-500" />
            </div>
            <div>
              <h3 className="text-lg mb-2">Nueva escena</h3>
              <p className="text-gray-400">
                Crea una rutina personalizada
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}