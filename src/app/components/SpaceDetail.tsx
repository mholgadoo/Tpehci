import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
 
import {
  ArrowLeft,
  Trash2,
  Power,
  Plus,
  X,
} from "lucide-react";
import {
  allowedDevicesBySpace,
  deviceOptions,
  deviceTypeLabels,
  getDeviceIcon,
  useHome,
  type DeviceKind,
} from "../context/home-context";
import { useIsMobile } from "../hooks/useIsMobile";
 
export function SpaceDetail() {
  const { homeId, spaceId } = useParams<{ homeId?: string; spaceId: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const {
    homes,
    selectedHomeId,
    setSelectedHomeId,
    toggleDevice,
    updateBrightness,
    turnOffAllDevices,
    addDevice,
    deleteDevice,
  } = useHome();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [selectedDeviceType, setSelectedDeviceType] = useState<DeviceKind | null>(null);
  const [deviceNameError, setDeviceNameError] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
 
  useEffect(() => {
    if (homeId && homeId !== selectedHomeId) {
      setSelectedHomeId(homeId);
    }
  }, [homeId, selectedHomeId, setSelectedHomeId]);
 
  const currentHomeId = homeId || selectedHomeId;
  const home =
    homes.find((candidateHome) => candidateHome.id === currentHomeId) ??
    homes.find((candidateHome) =>
      candidateHome.spaces.some((candidateSpace) => candidateSpace.id === spaceId),
    ) ??
    null;
  const space = home?.spaces.find((candidateSpace) => candidateSpace.id === spaceId) ?? null;
  const devices = space?.devices ?? [];
  const spaceName = space?.name || "Espacio";
  const activeDevices = devices.filter((device) => device.status === "on").length;
  const availableTypes =
    (space ? allowedDevicesBySpace[space.kind] : undefined) ||
    (Object.keys(deviceOptions) as DeviceKind[]);
  const selectedDevice =
    devices.find((device) => device.id === selectedDeviceId) || null;
 
  const handleAddDevice = () => {
    if (!newDeviceName.trim()) {
      setDeviceNameError(true);
      return;
    }
 
    if (!selectedDeviceType) return;
    if (!home || !space) return;
 
    addDevice(home.id, space.id, newDeviceName.trim(), selectedDeviceType);
    setIsModalOpen(false);
    setNewDeviceName("");
    setSelectedDeviceType(null);
    setDeviceNameError(false);
  };
 
  const handleOpenDeviceModal = () => {
    setDeviceNameError(false);
    setIsModalOpen(true);
  };
 
  const handleCloseDeviceModal = () => {
    setDeviceNameError(false);
    setIsModalOpen(false);
  };
 
  const handleOpenDeviceDetails = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setIsDeleteConfirmOpen(false);
  };
 
  const handleCloseDeviceDetails = () => {
    setSelectedDeviceId(null);
    setIsDeleteConfirmOpen(false);
  };
 
  const handleDeviceCardKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    deviceId: string,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpenDeviceDetails(deviceId);
    }
  };
 
  const handleDeleteSelectedDevice = () => {
    if (!selectedDevice || !home || !space) return;
 
    deleteDevice(home.id, space.id, selectedDevice.id);
    handleCloseDeviceDetails();
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
                onClick={handleCloseDeviceModal}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2b3042] bg-[#151a25] text-[#c4c8d6] transition-colors hover:bg-[#1c2231]"
              >
                <X size={18} />
              </button>
            </div>
 
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-semibold tracking-wider text-gray-400">
                  NOMBRE
                </label>
                <div
                  className={`rounded-2xl border px-5 py-4 transition-colors ${
                    deviceNameError
                      ? "border-[#ef4444] bg-[#34161b]"
                      : "border-[#2b3042] bg-[#151a25]"
                  }`}
                >
                  <input
                    type="text"
                    placeholder="Lámpara de techo"
                    value={newDeviceName}
                    onChange={(event) => {
                      setNewDeviceName(event.target.value);
                      if (event.target.value.trim()) {
                        setDeviceNameError(false);
                      }
                    }}
                    className="w-full bg-transparent text-base text-white placeholder-[#8f97ab] outline-none"
                  />
                </div>
                {deviceNameError ? (
                  <p className="text-sm text-[#fca5a5]">Ingresá un nombre.</p>
                ) : null}
              </div>
 
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-semibold tracking-wider text-gray-400">
                  TIPO DE DISPOSITIVO
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
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
                        {getDeviceIcon(type, 22)}
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
                    ? "border-[#f4c95d] bg-[#0f1219] text-[#f4c95d] hover:bg-[#151a25]"
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
 
  const renderDeviceDetailsModal = () => {
    if (!selectedDevice) return null;
 
    const deviceType = deviceOptions[selectedDevice.kind].type;
    const isLight = deviceType === "light";
    const isOn = selectedDevice.status === "on";
    const deviceLabel = deviceOptions[selectedDevice.kind].label;
 
    return (
      <>
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4"
          onClick={handleCloseDeviceDetails}
        >
          <div
            className="relative w-full max-w-[560px] overflow-hidden rounded-[32px] bg-[#080a10] shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,#fbbf24_0%,rgba(251,191,36,0.22)_26%,transparent_70%)]" />
 
            <div className="relative px-6 pb-8 pt-8 sm:px-8">
              <div className="mb-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-[18px] border ${
                      isOn && selectedDevice.brightness !== 0
                        ? "border-[#f4c95d] bg-[#0f1219] text-[#f4c95d]"
                        : "border-[#2b3042] bg-[#151a25] text-[#8f97ab]"
                    }`}
                  >
                    {getDeviceIcon(selectedDevice.kind, 22)}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
                      Dispositivo
                    </p>
                    <h2 className="mt-1 text-[24px] font-semibold text-white">
                      {selectedDevice.name}
                    </h2>
                    <p className="mt-1 text-sm text-[#98a2b7]">
                      {deviceLabel} · {deviceTypeLabels[deviceType]}
                    </p>
                  </div>
                </div>
 
                <button
                  type="button"
                  onClick={handleCloseDeviceDetails}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2b3042] bg-[#151a25] text-[#c4c8d6] transition-colors hover:bg-[#1c2231]"
                >
                  <X size={18} />
                </button>
              </div>
 
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[20px] border border-[#2b3042] bg-[#111722] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7f879c]">
                      Estado
                    </p>
                    <p className={`mt-3 text-[18px] font-medium ${isOn ? "text-[#f4c95d]" : "text-white"}`}>
                      {isOn ? "Encendido" : "Apagado"}
                    </p>
                  </div>
 
                  <div className="rounded-[20px] border border-[#2b3042] bg-[#111722] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7f879c]">
                      Ambiente
                    </p>
                    <p className="mt-3 text-[18px] font-medium text-white">
                      {spaceName}
                    </p>
                  </div>
 
                  <div className="rounded-[20px] border border-[#2b3042] bg-[#111722] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7f879c]">
                      Acción rápida
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (!home || !space) return;
                        toggleDevice(home.id, space.id, selectedDevice.id);
                      }}
                      className={`mt-3 relative inline-flex h-[34px] w-[60px] items-center rounded-full p-[2px] transition-colors ${
                        isOn ? "bg-[#fbbf24]" : "bg-[#454955]"
                      }`}
                    >
                      <span
                        className={`inline-block h-[30px] w-[30px] rounded-full bg-white transition-transform ${
                          isOn ? "translate-x-[26px]" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
 
                <div className="rounded-[24px] border border-[#2b3042] bg-[#111722] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
                    Información
                  </p>
                  <p className="mt-3 text-[15px] leading-7 text-[#c3cad8]">
                    {isLight
                      ? "Podés ver y ajustar la intensidad de esta luz desde este segundo nivel."
                      : "Acá quedan las acciones menos frecuentes para no recargar la grilla principal."}
                  </p>
 
                  {isLight ? (
                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between text-sm text-[#aeb6c8]">
                        <span>Intensidad</span>
                        <span>{selectedDevice.brightness ?? 0}%</span>
                      </div>
                      <div className="relative h-[6px] rounded-full bg-[#273246]">
                        <div
                          className="absolute left-0 top-0 h-full rounded-full bg-[#f0c45c]"
                          style={{ width: `${selectedDevice.brightness ?? 0}%` }}
                        />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={selectedDevice.brightness ?? 0}
                          onChange={(event) => {
                            if (!home || !space) return;
                            updateBrightness(
                              home.id,
                              space.id,
                              selectedDevice.id,
                              parseInt(event.target.value, 10),
                            );
                          }}
                          className="absolute inset-0 h-[6px] w-full cursor-pointer opacity-0"
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
 
                <div className="flex flex-col gap-3 border-t border-[#1f2432] pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-[18px] border border-[#8f3949] bg-[#2a141a] px-5 py-3 text-[15px] font-medium text-[#ffb4c0] transition-colors hover:bg-[#341820]"
                  >
                    <Trash2 size={16} />
                    Eliminar dispositivo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
 
        <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
          <AlertDialogContent className="max-w-[460px] rounded-[28px] border border-[#2b3042] bg-[#0f1219] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
            <AlertDialogHeader className="text-left">
              <AlertDialogTitle className="text-[24px] text-white">
                Confirmá la eliminación
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[15px] leading-6 text-[#98a2b7]">
                Vas a borrar <span className="font-medium text-white">{selectedDevice.name}</span>.
                Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
 
            <AlertDialogFooter className="mt-2">
              <AlertDialogCancel className="rounded-[18px] border border-[#2b3548] bg-[#141a26] text-[#d0d6e3] hover:bg-[#192131] hover:text-white">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteSelectedDevice}
                className="rounded-[18px] border border-[#8f3949] bg-[#2a141a] text-[#ffb4c0] hover:bg-[#341820]"
              >
                Sí, eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
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
                className="flex h-[48px] w-[48px] items-center justify-center rounded-[16px] border border-[#2b3042] bg-[#151a25] text-[#c4c8d6] transition-colors hover:bg-[#1c2231] hover:text-white"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-[24px] font-semibold text-white leading-tight md:text-[28px]">
                  {spaceName}
                </h1>
                <p className="mt-1 text-[15px] text-[#9aa3b8]">
                  {activeDevices} de {devices.length} activos
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="flex h-[46px] w-[46px] items-center justify-center rounded-[14px] border border-[#2b3042] bg-[#151a25] text-[#c4c8d6] transition-colors hover:bg-[#1c2231] hover:text-white"
                onClick={() => {
                  if (home && space) turnOffAllDevices(home.id, space.id);
                }}
                title="Apagar todos los dispositivos"
              >
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
                role="button"
                tabIndex={0}
                onClick={() => handleOpenDeviceDetails(device.id)}
                onKeyDown={(event) => handleDeviceCardKeyDown(event, device.id)}
                className="flex min-h-[76px] cursor-pointer flex-col gap-4 rounded-3xl border border-[#2b3042] bg-gradient-to-br from-[#121722] to-[#080a10] p-6 transition-all hover:border-[#3c4968]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-[46px] h-[46px] rounded-2xl flex items-center justify-center ${
                        device.status === "on" && device.brightness !== 0
                          ? "border-2 border-[#f4c95d] bg-[#0f1219] text-[#f4c95d]"
                          : "bg-[#202636] text-[#8f97ab]"
                      }`}
                    >
                      {getDeviceIcon(device.kind, 20)}
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
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        if (!home || !space) return;
                        toggleDevice(home.id, space.id, device.id);
                      }}
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
              </div>
            ))}
 
            {!isMobile ? (
              <button
                type="button"
                onClick={handleOpenDeviceModal}
                className="flex min-h-[76px] items-center gap-4 rounded-3xl border border-dashed border-[#33405a] bg-gradient-to-br from-[#121722] to-[#0b0f17] p-6 text-left transition-all hover:border-[#4b5d84]"
              >
                <div className="flex items-center justify-center rounded-2xl border-2 border-[#f4c95d] bg-[#0f1219] p-3 text-[#f4c95d]">
                  <Plus size={24} />
                </div>
                <div>
                  <p className="font-medium text-[#d2d8e6]">Agregar dispositivo</p>
                  <p className="text-sm text-[#8f97ab]">Sumá otro control al espacio.</p>
                </div>
              </button>
            ) : null}
          </div>
        </div>
      </div>
 
      {isMobile ? (
        <button
          type="button"
          onClick={handleOpenDeviceModal}
          className="fixed bottom-24 right-6 z-40 inline-flex items-center gap-3 rounded-full border border-[#f4c95d] bg-[#0f1219] px-5 py-3 text-[15px] font-medium text-[#f4c95d] shadow-[0_18px_40px_rgba(0,0,0,0.45)] transition-colors hover:bg-[#151a25]"
        >
          <Plus size={18} />
          Agregar dispositivo
        </button>
      ) : null}
 
      {renderDeviceModal()}
      {renderDeviceDetailsModal()}
    </>
  );
}
