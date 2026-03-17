import {
  Armchair,
  Bath,
  Bed,
  Bell,
  Blinds,
  Car,
  ChevronDown,
  ChefHat,
  CookingPot,
  DoorOpen,
  Droplet,
  Lightbulb,
  LogOut,
  Monitor,
  Plus,
  Settings,
  ShowerHead,
  Speaker,
  Sun,
  TreePine,
  User,
  Users,
  Wind,
} from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "../hooks/useIsMobile";
import { Link } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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

interface Home {
  id: string;
  name: string;
  subtitle: string;
  spaces: Space[];
}

interface Account {
  id: string;
  name: string;
  email: string;
}

const initialHomes: Home[] = [
  {
    id: "mi-hogar",
    name: "Mi Hogar",
    subtitle: "Palermo, Buenos Aires",
    spaces: [
      {
        id: "sala",
        name: "Sala de Estar",
        icon: <Armchair size={28} />,
        devices: [
          { icon: <Lightbulb size={14} />, color: "text-blue-500" },
          { icon: <Lightbulb size={14} /> },
          { icon: <Speaker size={14} /> },
          { icon: <Blinds size={14} /> },
          { icon: <Bell size={14} /> },
        ],
      },
      {
        id: "dormitorio",
        name: "Dormitorio",
        icon: <Bed size={28} />,
        devices: [
          { icon: <Lightbulb size={14} />, color: "text-blue-500" },
          { icon: <Lightbulb size={14} /> },
          { icon: <Blinds size={14} /> },
          { icon: <Wind size={14} /> },
        ],
      },
      {
        id: "cocina",
        name: "Cocina",
        icon: <ChefHat size={28} />,
        devices: [
          { icon: <Lightbulb size={14} />, color: "text-blue-500" },
          { icon: <CookingPot size={14} /> },
          { icon: <Bell size={14} /> },
        ],
      },
      {
        id: "bano",
        name: "Baño",
        icon: <Bath size={28} />,
        devices: [
          { icon: <Lightbulb size={14} />, color: "text-blue-500" },
          { icon: <Wind size={14} /> },
        ],
      },
      {
        id: "oficina",
        name: "Oficina",
        icon: <Monitor size={28} />,
        devices: [
          { icon: <Lightbulb size={14} />, color: "text-blue-500" },
          { icon: <Speaker size={14} /> },
          { icon: <Blinds size={14} /> },
        ],
      },
      {
        id: "garaje",
        name: "Garaje",
        icon: <Car size={28} />,
        devices: [
          { icon: <Lightbulb size={14} />, color: "text-blue-500" },
          { icon: <DoorOpen size={14} /> },
          { icon: <Bell size={14} /> },
        ],
      },
      {
        id: "jardin",
        name: "Jardín",
        icon: <TreePine size={28} />,
        devices: [
          { icon: <Lightbulb size={14} />, color: "text-blue-500" },
          { icon: <Droplet size={14} /> },
          { icon: <Bell size={14} /> },
        ],
      },
      {
        id: "terraza",
        name: "Terraza",
        icon: <Sun size={28} />,
        devices: [
          { icon: <Lightbulb size={14} />, color: "text-blue-500" },
          { icon: <Speaker size={14} /> },
          { icon: <Blinds size={14} /> },
        ],
      },
    ],
  },
  {
    id: "casa-playa",
    name: "Casa de Playa",
    subtitle: "Pinamar, Buenos Aires",
    spaces: [
      {
        id: "sala",
        name: "Sala de Estar",
        icon: <Armchair size={28} />,
        devices: [
          { icon: <Lightbulb size={14} />, color: "text-blue-500" },
          { icon: <Speaker size={14} /> },
          { icon: <Blinds size={14} /> },
        ],
      },
      {
        id: "cocina",
        name: "Cocina",
        icon: <ChefHat size={28} />,
        devices: [
          { icon: <Lightbulb size={14} />, color: "text-blue-500" },
          { icon: <CookingPot size={14} /> },
        ],
      },
      {
        id: "terraza",
        name: "Terraza",
        icon: <Sun size={28} />,
        devices: [
          { icon: <Lightbulb size={14} />, color: "text-blue-500" },
          { icon: <Speaker size={14} /> },
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
        icon: <Monitor size={28} />,
        devices: [
          { icon: <Lightbulb size={14} />, color: "text-blue-500" },
          { icon: <Speaker size={14} /> },
          { icon: <Blinds size={14} /> },
        ],
      },
      {
        id: "cocina",
        name: "Office",
        icon: <ChefHat size={28} />,
        devices: [
          { icon: <Lightbulb size={14} />, color: "text-blue-500" },
          { icon: <CookingPot size={14} /> },
        ],
      },
    ],
  },
];

const accountOptions: Account[] = [
  { id: "matias", name: "Matías Ibarra", email: "matias@mihogar.app" },
  { id: "sofia", name: "Sofía Costa", email: "sofia@mihogar.app" },
  { id: "invitado", name: "Cuenta Invitada", email: "invitado@mihogar.app" },
];

const spaceTypes = [
  { id: "sala", name: "Sala de Estar", icon: <Armchair size={24} strokeWidth={1.5} /> },
  { id: "dormitorio", name: "Dormitorio", icon: <Bed size={24} strokeWidth={1.5} /> },
  { id: "cocina", name: "Cocina", icon: <ChefHat size={24} strokeWidth={1.5} /> },
  { id: "bano", name: "Baño", icon: <ShowerHead size={24} strokeWidth={1.5} /> },
  { id: "oficina", name: "Oficina", icon: <Monitor size={24} strokeWidth={1.5} /> },
  { id: "garaje", name: "Garaje", icon: <Car size={24} strokeWidth={1.5} /> },
  { id: "jardin", name: "Jardín", icon: <TreePine size={24} strokeWidth={1.5} /> },
  { id: "terraza", name: "Terraza", icon: <Sun size={24} strokeWidth={1.5} /> },
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

export function Espacios() {
  const isMobile = useIsMobile();
  const [homes, setHomes] = useState<Home[]>(initialHomes);
  const [selectedHomeId, setSelectedHomeId] = useState(initialHomes[0].id);
  const [selectedAccount, setSelectedAccount] = useState(accountOptions[0]);
  const [sessionClosed, setSessionClosed] = useState(false);
  const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false);
  const [isHomeModalOpen, setIsHomeModalOpen] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [newHomeName, setNewHomeName] = useState("");
  const [newHomeLocation, setNewHomeLocation] = useState("");

  const currentHome = homes.find((home) => home.id === selectedHomeId) || homes[0];

  const handleAddSpace = () => {
    if (!newSpaceName.trim() || !selectedType || !currentHome) return;

    const typeObj = spaceTypes.find((type) => type.id === selectedType);
    if (!typeObj) return;

    const newSpace: Space = {
      id: `${selectedType}-${Date.now()}`,
      name: newSpaceName,
      icon: typeObj.icon,
      devices: [],
    };

    setHomes(
      homes.map((home) =>
        home.id === currentHome.id
          ? { ...home, spaces: [...home.spaces, newSpace] }
          : home,
      ),
    );
    setIsSpaceModalOpen(false);
    setNewSpaceName("");
    setSelectedType(null);
  };

  const handleAddHome = () => {
    if (!newHomeName.trim()) return;

    const newHome: Home = {
      id: newHomeName.toLowerCase().replace(/\s+/g, "-"),
      name: newHomeName,
      subtitle: newHomeLocation || "Nuevo hogar",
      spaces: [],
    };

    setHomes([...homes, newHome]);
    setSelectedHomeId(newHome.id);
    setIsHomeModalOpen(false);
    setNewHomeName("");
    setNewHomeLocation("");
  };

  if (sessionClosed) {
    return (
      <div className="px-6 py-12 text-white">
        <div className="mx-auto max-w-[520px] rounded-[32px] border border-[#262d3d] bg-[#111520] p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[#7f879c] uppercase">
            Sesión cerrada
          </p>
          <h1 className="mt-3 text-[30px] font-semibold text-white">Hasta luego</h1>
          <p className="mt-2 text-sm text-[#8f97ab]">
            Cerraste sesión en la maqueta. Podés volver a entrar para la presentación.
          </p>
          <button
            type="button"
            onClick={() => setSessionClosed(false)}
            className="mt-6 rounded-[18px] bg-[#3f68ff] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5077ff]"
          >
            Volver a entrar
          </button>
        </div>
      </div>
    );
  }

  const spacesContent =
    currentHome.spaces.length > 0 ? (
      <div className={isMobile ? "flex flex-col gap-4" : "grid grid-cols-3 gap-6"}>
        {currentHome.spaces.map((space) => (
          <Link
            key={space.id}
            to={`/espacio/${space.id}`}
            className={`rounded-3xl border border-gray-700/50 bg-gradient-to-br from-gray-800/40 to-gray-900/40 transition-all ${
              isMobile
                ? "flex items-center justify-between p-5 hover:border-gray-600/50"
                : "p-6 hover:scale-[1.02] hover:border-gray-600/50"
            }`}
          >
            <div className={isMobile ? "flex items-center gap-4" : ""}>
              <div
                className={`mb-5 flex items-center justify-center rounded-2xl bg-gray-800/50 p-3 text-gray-300 ${
                  isMobile ? "mb-0" : ""
                }`}
              >
                {space.icon}
              </div>

              <div>
                <h3 className="text-lg font-medium text-white">{space.name}</h3>
                <div className="mt-3 flex flex-wrap gap-3">
                  {space.devices.length > 0 ? (
                    space.devices.map((device, index) => (
                      <div key={index} className={device.color || "text-gray-500"}>
                        {device.icon}
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-[#6b7280]">Sin dispositivos</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}

        <button
          type="button"
          onClick={() => setIsSpaceModalOpen(true)}
          className={`rounded-3xl border border-dashed border-gray-700/50 bg-gradient-to-br from-gray-800/30 to-gray-900/30 text-left transition-all hover:border-gray-600/50 ${
            isMobile
              ? "flex items-center gap-4 p-5"
              : "flex min-h-[220px] flex-col items-center justify-center p-6 text-center hover:scale-[1.02]"
          }`}
        >
          <div className="flex items-center justify-center rounded-2xl bg-gray-800/30 p-3 text-gray-500">
            <Plus size={24} />
          </div>
          <div className={isMobile ? "" : "mt-3"}>
            <p className="font-medium text-gray-300">Nuevo espacio</p>
            <p className="mt-1 text-sm text-[#6b7280]">Agregá otro ambiente visualmente</p>
          </div>
        </button>
      </div>
    ) : (
      <div className="rounded-[32px] border border-dashed border-[#33405a] bg-[#121722] px-6 py-10 text-center">
        <p className="text-lg font-medium text-white">
          Todavía no hay espacios en {currentHome.name}
        </p>
        <p className="mt-2 text-sm text-[#8f97ab]">
          Agregá un hogar nuevo o cargá el primer espacio.
        </p>
        <button
          type="button"
          onClick={() => setIsSpaceModalOpen(true)}
          className="mt-6 inline-flex items-center gap-2 rounded-[18px] bg-[#3f68ff] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5077ff]"
        >
          <Plus size={16} />
          Nuevo espacio
        </button>
      </div>
    );

  return (
    <>
      <div className={isMobile ? "px-6 pb-20 pt-12" : "mx-auto max-w-7xl px-12 py-8"}>
        <div className={isMobile ? "mb-8" : "mb-10"}>
          <div
            className={
              isMobile
                ? "mb-5 flex items-start justify-between gap-4"
                : "mb-6 flex items-start justify-between gap-6"
            }
          >
            <div>
              <p className="mb-2 text-sm text-gray-400">Bienvenido de vuelta</p>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="flex items-center gap-2 text-left text-white">
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className={isMobile ? "text-2xl" : "text-4xl"}>
                          {currentHome.name}
                        </h1>
                        <ChevronDown size={20} className="text-gray-400" />
                      </div>
                      <p className="mt-1 text-sm text-gray-400">{currentHome.subtitle}</p>
                    </div>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  sideOffset={12}
                  className="w-[min(92vw,360px)] rounded-[28px] border border-[#2b3042] bg-[#111520]/96 p-3 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
                >
                  <p className="px-2 pb-3 pt-1 text-[11px] font-semibold tracking-[0.22em] text-[#7f879c] uppercase">
                    Hogares activos
                  </p>

                  <div className="space-y-2">
                    {homes.map((home) => (
                      <button
                        key={home.id}
                        type="button"
                        onClick={() => setSelectedHomeId(home.id)}
                        className={`flex w-full items-start justify-between rounded-[22px] border px-4 py-3 text-left transition-all ${
                          home.id === selectedHomeId
                            ? "border-[#3f68ff] bg-[#17203a]"
                            : "border-[#202636] bg-[#171b26] hover:border-[#33405a] hover:bg-[#1a2030]"
                        }`}
                      >
                        <div>
                          <p className="text-[15px] font-medium text-white">{home.name}</p>
                          <p className="mt-1 text-[12px] text-[#8f97ab]">{home.subtitle}</p>
                        </div>
                        <span className="rounded-full bg-[#202636] px-2 py-1 text-[11px] text-[#8f97ab]">
                          {home.spaces.length} espacios
                        </span>
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsHomeModalOpen(true)}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-[20px] border border-dashed border-[#33405a] bg-[#151a25] px-4 py-3 text-[14px] font-medium text-[#d2d8e6] transition-colors hover:border-[#4b5d84]"
                  >
                    <Plus size={16} />
                    Agregar hogar
                  </button>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={`flex items-center justify-center rounded-full bg-gray-800/50 transition-all hover:bg-gray-800 ${
                    isMobile ? "h-12 w-12" : "h-14 w-14"
                  }`}
                >
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#24365f] to-[#3f68ff] text-sm font-semibold text-white">
                    {getInitials(selectedAccount.name) || <User size={20} />}
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={12}
                className="w-[280px] rounded-[24px] border border-[#2b3042] bg-[#111520]/96 p-2 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
              >
                <div className="rounded-[18px] bg-[#171c28] p-4">
                  <p className="text-[15px] font-medium text-white">{selectedAccount.name}</p>
                  <p className="text-xs text-[#8f97ab]">{selectedAccount.email}</p>
                </div>

                <DropdownMenuSeparator className="mx-1 my-2 bg-[#232a3a]" />

                <DropdownMenuItem className="rounded-[16px] px-3 py-3 text-[#d5dbea] focus:bg-[#1b2232] focus:text-white">
                  <User size={16} />
                  Ver perfil
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-[16px] px-3 py-3 text-[#d5dbea] focus:bg-[#1b2232] focus:text-white">
                  <Settings size={16} />
                  Preferencias
                </DropdownMenuItem>

                <DropdownMenuSeparator className="mx-1 my-2 bg-[#232a3a]" />

                {accountOptions.map((account) => (
                  <DropdownMenuItem
                    key={account.id}
                    onSelect={() => setSelectedAccount(account)}
                    className="rounded-[16px] px-3 py-3 text-[#d5dbea] focus:bg-[#1b2232] focus:text-white"
                  >
                    <Users size={16} />
                    {account.name}
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator className="mx-1 my-2 bg-[#232a3a]" />

                <DropdownMenuItem
                  onSelect={() => setSessionClosed(true)}
                  className="rounded-[16px] px-3 py-3 text-[#ffb4c0] focus:bg-[#2b1a21] focus:text-[#ffb4c0]"
                >
                  <LogOut size={16} />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center justify-between">
            <h2 className={isMobile ? "text-xl" : "text-2xl"}>Espacios</h2>
            <span className="text-gray-400 text-sm">{currentHome.spaces.length} espacios</span>
          </div>
        </div>

        {spacesContent}
      </div>

      <Dialog open={isSpaceModalOpen} onOpenChange={setIsSpaceModalOpen}>
        <DialogContent className="w-[min(92vw,760px)] rounded-[32px] border border-[#2b3042] bg-[#0f1219] p-0 text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)] [&>button]:hidden">
          <div className="overflow-hidden rounded-[32px]">
            <div className="border-b border-[#1f2432] px-6 pb-4 pt-6 sm:px-8">
              <DialogTitle className="text-[24px] font-semibold text-white">
                Nuevo Espacio
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-[#7f879c]">
                Panel visual simple para la presentación.
              </DialogDescription>
            </div>

            <div className="space-y-7 px-6 pb-8 pt-6 sm:px-8">
              <div className="space-y-3">
                <label className="text-[11px] font-semibold tracking-[0.22em] text-[#7f879c] uppercase">
                  Nombre
                </label>
                <div className="rounded-[20px] border border-[#2b3042] bg-[#1d2230] px-5 py-4">
                  <input
                    type="text"
                    placeholder="Sala principal"
                    value={newSpaceName}
                    onChange={(event) => setNewSpaceName(event.target.value)}
                    className="w-full bg-transparent text-base text-white outline-none placeholder:text-[#6b7280]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-semibold tracking-[0.22em] text-[#7f879c] uppercase">
                  Tipo de espacio
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {spaceTypes.map((type) => {
                    const isSelected = selectedType === type.id;

                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedType(type.id)}
                        className={`flex flex-col items-center justify-center gap-3 rounded-[22px] border px-3 py-5 text-center transition-all ${
                          isSelected
                            ? "border-[#3f68ff] bg-[#17203a] text-[#7ea1ff]"
                            : "border-[#202636] bg-[#171b26] text-[#aab3c8]"
                        }`}
                      >
                        {type.icon}
                        <span className="text-[12px] font-medium leading-tight">
                          {type.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddSpace}
                disabled={!newSpaceName.trim() || !selectedType}
                className={`w-full rounded-[20px] py-4 text-[15px] font-medium ${
                  newSpaceName.trim() && selectedType
                    ? "bg-[#3f68ff] text-white"
                    : "bg-[#202636] text-[#6b7280]"
                }`}
              >
                Agregar espacio
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isHomeModalOpen} onOpenChange={setIsHomeModalOpen}>
        <DialogContent className="w-[min(92vw,520px)] rounded-[32px] border border-[#2b3042] bg-[#0f1219] p-0 text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)] [&>button]:hidden">
          <div className="overflow-hidden rounded-[32px]">
            <div className="border-b border-[#1f2432] px-6 pb-4 pt-6 sm:px-8">
              <DialogTitle className="text-[24px] font-semibold text-white">
                Agregar hogar
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-[#7f879c]">
                Elegí o sumá hogares desde el dropdown de arriba.
              </DialogDescription>
            </div>

            <div className="space-y-6 px-6 pb-8 pt-6 sm:px-8">
              <div className="space-y-3">
                <label className="text-[11px] font-semibold tracking-[0.22em] text-[#7f879c] uppercase">
                  Nombre
                </label>
                <div className="rounded-[20px] border border-[#2b3042] bg-[#1d2230] px-5 py-4">
                  <input
                    type="text"
                    value={newHomeName}
                    onChange={(event) => setNewHomeName(event.target.value)}
                    placeholder="Casa de fin de semana"
                    className="w-full bg-transparent text-base text-white outline-none placeholder:text-[#6b7280]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-semibold tracking-[0.22em] text-[#7f879c] uppercase">
                  Ubicación
                </label>
                <div className="rounded-[20px] border border-[#2b3042] bg-[#1d2230] px-5 py-4">
                  <input
                    type="text"
                    value={newHomeLocation}
                    onChange={(event) => setNewHomeLocation(event.target.value)}
                    placeholder="Ciudad o referencia"
                    className="w-full bg-transparent text-base text-white outline-none placeholder:text-[#6b7280]"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddHome}
                disabled={!newHomeName.trim()}
                className={`w-full rounded-[20px] py-4 text-[15px] font-medium ${
                  newHomeName.trim()
                    ? "bg-[#3f68ff] text-white"
                    : "bg-[#202636] text-[#6b7280]"
                }`}
              >
                Agregar hogar
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
