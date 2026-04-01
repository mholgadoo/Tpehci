import {
  CircleAlert,
  MoonStar,
  Shield,
  ShieldCheck,
  ShieldOff,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  alarmModeLabels,
  type AlarmMode,
  type AlarmSystem,
} from "../context/home-context";
import { Dialog, DialogContent } from "./ui/dialog";
import { Switch } from "./ui/switch";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "./ui/input-otp";

interface AlarmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  homeName: string;
  alarm: AlarmSystem;
  onModeChange: (mode: AlarmMode) => void;
  onZoneChange: (zoneId: string, armed: boolean) => void;
}

type PendingAlarmChange =
  | {
      type: "mode";
      mode: AlarmMode;
    }
  | {
      type: "zone";
      zoneId: string;
      zoneName: string;
      armed: boolean;
    };

const modeMeta: Record<
  AlarmMode,
  {
    label: string;
    helper: string;
    icon: React.ComponentType<{ size?: number }>;
    classes: {
      active: string;
      icon: string;
      badge: string;
    };
  }
> = {
  disarmed: {
    label: alarmModeLabels.disarmed,
    helper: "Todo desactivado para accesos frecuentes.",
    icon: ShieldOff,
    classes: {
      active: "border-[#56d08a]/45 bg-[#0d1a14] text-[#8af0b4]",
      icon: "border-[#56d08a]/45 bg-[#0d1a14] text-[#8af0b4]",
      badge: "border-[#56d08a]/35 bg-[#0d1a14] text-[#8af0b4]",
    },
  },
  armed_away: {
    label: alarmModeLabels.armed_away,
    helper: "Cobertura máxima para cuando no hay nadie.",
    icon: ShieldCheck,
    classes: {
      active: "border-[#f28d56]/45 bg-[#21140e] text-[#ffc39c]",
      icon: "border-[#f28d56]/45 bg-[#21140e] text-[#ffc39c]",
      badge: "border-[#f28d56]/35 bg-[#21140e] text-[#ffc39c]",
    },
  },
  armed_home: {
    label: alarmModeLabels.armed_home,
    helper: "Protección perimetral con circulación interior.",
    icon: Shield,
    classes: {
      active: "border-[#f0c45c]/45 bg-[#191309] text-[#f0c45c]",
      icon: "border-[#f0c45c]/45 bg-[#191309] text-[#f0c45c]",
      badge: "border-[#f0c45c]/35 bg-[#191309] text-[#f0c45c]",
    },
  },
  armed_night: {
    label: alarmModeLabels.armed_night,
    helper: "Perímetro activo y circulación limitada.",
    icon: MoonStar,
    classes: {
      active: "border-[#7ca8ff]/45 bg-[#101628] text-[#b7ccff]",
      icon: "border-[#7ca8ff]/45 bg-[#101628] text-[#b7ccff]",
      badge: "border-[#7ca8ff]/35 bg-[#101628] text-[#b7ccff]",
    },
  },
};

export function AlarmModal({
  open,
  onOpenChange,
  homeName,
  alarm,
  onModeChange,
  onZoneChange,
}: AlarmModalProps) {
  const [pendingChange, setPendingChange] = useState<PendingAlarmChange | null>(null);
  const [pinValue, setPinValue] = useState("");
  const [pinError, setPinError] = useState("");
  const [shakeNonce, setShakeNonce] = useState(0);

  const resetPinState = () => {
    setPendingChange(null);
    setPinValue("");
    setPinError("");
  };

  useEffect(() => {
    if (!open) {
      resetPinState();
      setShakeNonce(0);
    }
  }, [open]);

  const currentModeMeta = modeMeta[alarm.mode];

  const armedZoneCount = useMemo(
    () => alarm.zones.filter((zone) => zone.armed).length,
    [alarm.zones],
  );

  const handleStartModeChange = (mode: AlarmMode) => {
    if (mode === alarm.mode) return;

    setPendingChange({ type: "mode", mode });
    setPinValue("");
    setPinError("");
  };

  const handleStartZoneChange = (zoneId: string, armed: boolean) => {
    const zone = alarm.zones.find((currentZone) => currentZone.id === zoneId);

    if (!zone || zone.armed === armed) return;

    setPendingChange({
      type: "zone",
      zoneId,
      zoneName: zone.name,
      armed,
    });
    setPinValue("");
    setPinError("");
  };

  const handleConfirmPin = () => {
    if (!pendingChange) return;

    if (pinValue !== alarm.pin) {
      setPinError("PIN incorrecto. Probá nuevamente.");
      setShakeNonce((currentValue) => currentValue + 1);
      return;
    }

    if (pendingChange.type === "mode") {
      onModeChange(pendingChange.mode);
    } else {
      onZoneChange(pendingChange.zoneId, pendingChange.armed);
    }

    resetPinState();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[100vw] max-w-none rounded-none border-0 bg-[#0b0f17] p-0 text-white sm:h-auto sm:w-[min(94vw,760px)] sm:rounded-[32px] sm:border sm:border-[#20283a] sm:bg-[#0e1218] sm:shadow-[0_32px_120px_rgba(0,0,0,0.6)] [&>button]:hidden">
        <div className="relative min-h-[100dvh] overflow-hidden sm:min-h-0 sm:rounded-[32px]">
          <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(240,196,92,0.38),rgba(240,196,92,0.08)_35%,transparent_70%)]" />

          <div className="relative flex max-h-[100dvh] flex-col sm:max-h-[88vh]">
            <div className="border-b border-[#20283a] px-5 pb-5 pt-6 sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] border ${currentModeMeta.classes.icon}`}
                  >
                    <currentModeMeta.icon size={24} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
                      Sistema de alarma
                    </p>
                    <h2 className="mt-2 text-[28px] font-semibold text-white">{homeName}</h2>
                    <p className="mt-2 text-sm text-[#98a2b7]">
                      Estado actual: {currentModeMeta.label}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2b3042] bg-[#151a25] text-[#c4c8d6] transition-colors hover:bg-[#1c2231]"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6">
              <div className="space-y-5">
                <section className="rounded-[26px] border border-[#252e3f] bg-[#121722] p-5">
                  <div className="mb-4">
                    <h3 className="text-[22px] font-semibold text-white">Modo de alarma</h3>
                    <p className="mt-1 text-sm text-[#98a2b7]">
                      Elegí cómo querés proteger el hogar.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {(Object.keys(modeMeta) as AlarmMode[]).map((mode) => {
                      const meta = modeMeta[mode];
                      const Icon = meta.icon;
                      const isSelected = alarm.mode === mode;

                      return (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => handleStartModeChange(mode)}
                          className={`rounded-[22px] border p-4 text-left transition-colors ${
                            isSelected
                              ? meta.classes.active
                              : "border-[#2c3547] bg-[#10151f] text-[#d9dfeb]"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-[16px] border ${isSelected ? meta.classes.icon : "border-[#2c3547] bg-[#161d2a] text-[#c5cede]"}`}>
                              <Icon size={20} />
                            </div>
                            <div>
                              <p className="text-base font-semibold">{meta.label}</p>
                              <p className="mt-1 text-sm leading-6 text-[#98a2b7]">
                                {meta.helper}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="rounded-[26px] border border-[#252e3f] bg-[#121722] p-5">
                  <div className="mb-4">
                    <h3 className="text-[22px] font-semibold text-white">Zonas</h3>
                    <p className="mt-1 text-sm text-[#98a2b7]">
                      Activá o desactivá sectores individuales del sistema.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {alarm.zones.map((zone) => (
                      <div
                        key={zone.id}
                        className="flex items-center justify-between rounded-[20px] border border-[#2c3547] bg-[#10151f] px-4 py-4"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white">{zone.name}</p>
                          <p className="mt-1 text-sm text-[#98a2b7]">
                            {zone.armed ? "Zona armada" : "Zona desarmada"}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                              zone.armed
                                ? "border-[#f0c45c]/35 bg-[#191309] text-[#f0c45c]"
                                : "border-[#2d3749] bg-[#131a27] text-[#8f97ab]"
                            }`}
                          >
                            {zone.armed ? "Activa" : "Off"}
                          </span>
                          <Switch
                            checked={zone.armed}
                            onCheckedChange={(checked) =>
                              handleStartZoneChange(zone.id, checked)
                            }
                            className="h-7 w-12 data-[state=checked]:bg-[#f0c45c] data-[state=unchecked]:bg-[#39465d]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>

          {pendingChange ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0b0f17]/94 px-5 backdrop-blur-sm">
              <div
                key={shakeNonce}
                className="w-full max-w-[420px] rounded-[28px] border border-[#2b3448] bg-[#111723] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
                style={pinError ? { animation: "alarm-shake 0.32s ease-in-out" } : undefined}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f879c]">
                      Verificación PIN
                    </p>
                    <h3 className="mt-2 text-[24px] font-semibold text-white">Ingresá tu PIN</h3>
                    <p className="mt-2 text-sm text-[#98a2b7]">
                      {pendingChange.type === "mode"
                        ? `Confirmá el cambio a ${modeMeta[pendingChange.mode].label.toLowerCase()}.`
                        : `${pendingChange.armed ? "Activá" : "Desactivá"} la zona ${pendingChange.zoneName.toLowerCase()}.`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetPinState}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2b3042] bg-[#151a25] text-[#c4c8d6]"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-6">
                  <InputOTP
                    maxLength={4}
                    value={pinValue}
                    onChange={(value) => {
                      setPinValue(value.replace(/\D/g, "").slice(0, 4));
                      if (pinError) setPinError("");
                    }}
                    onComplete={handleConfirmPin}
                    containerClassName="justify-center"
                  >
                    <InputOTPGroup className="gap-3">
                      <InputOTPSlot index={0} className="h-14 w-14 rounded-[16px] border border-[#2d3749] bg-[#0f1520] text-lg text-white first:border last:border" />
                      <InputOTPSlot index={1} className="h-14 w-14 rounded-[16px] border border-[#2d3749] bg-[#0f1520] text-lg text-white first:border last:border" />
                      <InputOTPSlot index={2} className="h-14 w-14 rounded-[16px] border border-[#2d3749] bg-[#0f1520] text-lg text-white first:border last:border" />
                      <InputOTPSlot index={3} className="h-14 w-14 rounded-[16px] border border-[#2d3749] bg-[#0f1520] text-lg text-white first:border last:border" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {pinError ? (
                  <div className="mt-4 flex items-center gap-2 rounded-[16px] border border-[#7b2a39] bg-[#2b141b] px-4 py-3 text-sm text-[#ffb5c0]">
                    <CircleAlert size={16} />
                    <span>{pinError}</span>
                  </div>
                ) : null}

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={resetPinState}
                    className="flex-1 rounded-[18px] border border-[#2b3548] bg-[#141a26] py-3 text-sm font-medium text-[#d0d6e3]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmPin}
                    className="flex-1 rounded-[18px] border border-[#f0c45c] bg-[#171208] py-3 text-sm font-medium text-[#f0c45c]"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <style>
          {`@keyframes alarm-shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            50% { transform: translateX(8px); }
            75% { transform: translateX(-4px); }
            100% { transform: translateX(0); }
          }`}
        </style>
      </DialogContent>
    </Dialog>
  );
}
