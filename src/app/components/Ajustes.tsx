import { Wifi, Shield, Bell, Info } from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";

interface SettingItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: string;
}

const settings: SettingItem[] = [
  {
    id: "wifi",
    icon: <Wifi size={20} />,
    label: "Red Wi-Fi",
    value: "Casa_5G",
  },
  {
    id: "security",
    icon: <Shield size={20} />,
    label: "Seguridad",
    value: "Activa",
  },
  {
    id: "notifications",
    icon: <Bell size={20} />,
    label: "Notificaciones",
    value: "Encendidas",
  },
  {
    id: "about",
    icon: <Info size={20} />,
    label: "Acerca de",
    value: "v1.0.0",
  },
];

export function Ajustes() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="pb-20 px-6 pt-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl">Ajustes</h1>
        </div>

        {/* Settings List */}
        <div className="space-y-4">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-5 border border-gray-700/50 hover:border-gray-600/50 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-gray-400">{setting.icon}</div>
                  <span>{setting.label}</span>
                </div>
                <span className="text-gray-400 text-sm">{setting.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="px-12 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl">Ajustes</h1>
      </div>

      {/* Settings List */}
      <div className="space-y-5">
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all cursor-pointer hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="text-gray-400">{setting.icon}</div>
                <span className="text-lg">{setting.label}</span>
              </div>
              <span className="text-gray-400">{setting.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}