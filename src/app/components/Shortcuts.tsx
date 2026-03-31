import { Blinds, Bot, CookingPot, DoorOpen, Droplet, Plus, Speaker, Trash2, Wind, Zap } from "lucide-react";
import { useState } from "react";
import { COMPACT_LAYOUT_BREAKPOINT, useIsMobile } from "../hooks/useIsMobile";
import { type HomeShortcutKind, useHome } from "../context/home-context";

export function Shortcuts() {
  const isMobile = useIsMobile(COMPACT_LAYOUT_BREAKPOINT);
  const { currentHome, updateHome } = useHome();
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [newShortcutKind, setNewShortcutKind] = useState<HomeShortcutKind | null>(null);
  const [newShortcutName, setNewShortcutName] = useState("");

  const shortcutTypeOptions: Array<{ id: Exclude<HomeShortcutKind, "alarm">; label: string; icon: React.ComponentType<{ size?: number }> }> = [
    { id: "speaker", label: "Parlante", icon: Speaker },
    { id: "air", label: "Aire", icon: Wind },
    { id: "blind", label: "Persiana", icon: Blinds },
    { id: "door", label: "Puerta", icon: DoorOpen },
    { id: "oven", label: "Horno", icon: CookingPot },
    { id: "vacuum", label: "Aspiradora", icon: Bot },
    { id: "sprinkler", label: "Aspersor", icon: Droplet },
  ];

  const existingKinds = new Set((currentHome.shortcuts ?? []).map((shortcut) => shortcut.kind));
  const totalShortcuts = currentHome.shortcuts ?? [];
  const canAddMoreShortcuts = totalShortcuts.length < 5;
  const availableShortcutTypes = shortcutTypeOptions.filter((option) => !existingKinds.has(option.id) && canAddMoreShortcuts);
  const existingShortcuts = (currentHome.shortcuts ?? []).filter((shortcut) => shortcut.kind !== "alarm");

  const getShortcutMeta = (kind: HomeShortcutKind) =>
    shortcutTypeOptions.find((option) => option.id === kind);

  const handleCreateShortcut = () => {
    const trimmedName = newShortcutName.trim();
    if (!newShortcutKind || !trimmedName) return;

    const currentShortcuts = currentHome.shortcuts ?? [];
    
    if (currentShortcuts.length >= 5) {
      return;
    }

    if (currentShortcuts.some((shortcut) => shortcut.kind === newShortcutKind)) {
      return;
    }

    const nextShortcuts = [
      ...currentShortcuts,
      {
        id: `${newShortcutKind}-${Date.now()}`,
        kind: newShortcutKind,
        name: trimmedName,
      },
    ];

    updateHome(currentHome.id, currentHome.name, currentHome.subtitle, nextShortcuts);
    setIsComposerOpen(false);
    setNewShortcutKind(null);
    setNewShortcutName("");
  };

  const handleDeleteShortcut = (shortcutId: string) => {
    const nextShortcuts = (currentHome.shortcuts ?? []).filter((shortcut) => shortcut.id !== shortcutId);
    updateHome(currentHome.id, currentHome.name, currentHome.subtitle, nextShortcuts);
  };

  return (
    <div className={isMobile ? "px-6 pb-20 pt-12" : "mx-auto max-w-5xl px-12 py-8"}>
      <div className={isMobile ? "mb-8" : "mb-10"}>
        <h1 className={isMobile ? "mb-2 text-3xl" : "mb-3 text-4xl"}>Shortcuts</h1>
        <p className="text-gray-400">
          Creá accesos directos para controlar tus dispositivos favoritos desde cualquier lado.
        </p>
      </div>

      <div className={isMobile ? "space-y-4" : "space-y-5"}>
        {existingShortcuts.map((shortcut) => {
          const shortcutMeta = getShortcutMeta(shortcut.kind);
          const ShortcutIcon = shortcutMeta?.icon ?? Zap;

          return (
            <div
              key={shortcut.id}
              className={`rounded-[30px] border bg-gradient-to-br p-5 transition-all ${
                isMobile
                  ? "border-[#2b3448] from-[#121722] to-[#080a10]"
                  : "border-[#2b3448] from-[#121722] to-[#080a10] hover:-translate-y-1 hover:border-[#4b5d84]"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] border border-[#2b3548] bg-[#161c28] text-[#f4c95d]">
                    <ShortcutIcon size={24} />
                  </div>

                  <div className="min-w-0">
                    <h3 className={isMobile ? "text-[18px] font-semibold text-white" : "text-[20px] font-semibold text-white"}>
                      {shortcut.name || "Sin nombre"}
                    </h3>
                    <p className="text-[14px] text-[#aeb6c8]">{shortcutMeta?.label ?? "Shortcut"}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteShortcut(shortcut.id)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] text-[#e94b3c]/70 transition-colors hover:bg-[#e94b3c]/10 hover:text-[#e94b3c]"
                  title="Eliminar shortcut"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          );
        })}

        {availableShortcutTypes.length > 0 ? (
          <div
            onClick={() => {
              setIsComposerOpen(true);
              setNewShortcutKind(null);
              setNewShortcutName("");
            }}
            className={`cursor-pointer rounded-[30px] border border-dashed border-[#3b465d] bg-gradient-to-br from-[#121722] to-[#0b0f17] transition-all ${
              isMobile ? "p-5" : "p-6 hover:-translate-y-1 hover:border-[#566582]"
            }`}
          >
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-[#f4c95d]/60 bg-[#16120a] text-[#f4c95d]">
                <Plus size={28} />
              </div>
              <div>
                <h3 className={isMobile ? "mb-1 text-[18px] font-semibold text-white" : "mb-2 text-[20px] font-semibold text-white"}>
                  Nuevo shortcut
                </h3>
                <p className="text-[#aeb6c8]">
                  Agregá un acceso directo a un dispositivo de tu hogar.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {isComposerOpen && (
          <div className="rounded-[24px] border border-[#2b3042] bg-[#111723] p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">Crear nuevo shortcut</p>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {availableShortcutTypes.map((option) => {
                const Icon = option.icon;
                const isSelected = newShortcutKind === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setNewShortcutKind(option.id)}
                    className={`flex items-center gap-2 rounded-[14px] border px-3 py-2 text-left text-sm transition-all ${
                      isSelected
                        ? "border-[#f4bd49]/70 bg-[#15110a] text-[#f4bd49]"
                        : "border-[#202636] bg-[#171b26] text-[#aab3c8]"
                    }`}
                  >
                    <Icon size={18} />
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-[16px] border border-[#2b3042] bg-[#1d2230] px-4 py-3">
              <input
                type="text"
                value={newShortcutName}
                onChange={(event) => setNewShortcutName(event.target.value)}
                placeholder="Nombre del shortcut"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#6b7280]"
              />
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsComposerOpen(false);
                  setNewShortcutKind(null);
                  setNewShortcutName("");
                }}
                className="flex-1 rounded-[18px] border border-[#2b3548] bg-[#141a26] py-3 text-[15px] font-medium text-[#d0d6e3] transition-colors hover:bg-[#192131] hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreateShortcut}
                disabled={!newShortcutKind || !newShortcutName.trim()}
                className="flex-1 rounded-[18px] border border-[#f4bd49] bg-[#15110a] py-3 text-[15px] font-medium text-[#f4bd49] transition-colors hover:bg-[#1b1408] disabled:border-[#3d3d3d] disabled:bg-[#1a1a1a] disabled:text-[#666666]"
              >
                Crear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
