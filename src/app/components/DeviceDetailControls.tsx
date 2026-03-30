import {
  Flame,
  Minus,
  Snowflake,
  Volume,
  Volume1,
  Volume2,
  Wind,
  Droplets,
  Zap,
  Waves,
} from "lucide-react";
import {
  acModeLabels,
  fanSpeedLabels,
  formatBlindPosition,
  formatTimerMinutes,
  ovenModeLabels,
  type AcFanSpeed,
  type AcMode,
  type Device,
  type OvenMode,
} from "../context/home-context";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";

interface DeviceDetailControlsProps {
  device: Device;
  onUpdate: (updates: Partial<Device>) => void;
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[20px] border border-[#232c3d] bg-[#0d1420] p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm text-[#8f97ab]">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function DisplayValue({
  value,
  suffix,
}: {
  value: string | number;
  suffix?: string;
}) {
  return (
    <div className="rounded-[18px] border border-[#2d3749] bg-[#121a27] px-4 py-5 text-center">
      <p className="text-[28px] font-semibold text-white">
        {value}
        {suffix ? <span className="ml-1 text-[18px] text-[#98a2b7]">{suffix}</span> : null}
      </p>
    </div>
  );
}

function Stepper({
  onDecrease,
  onIncrease,
  decreaseDisabled = false,
  increaseDisabled = false,
}: {
  onDecrease: () => void;
  onIncrease: () => void;
  decreaseDisabled?: boolean;
  increaseDisabled?: boolean;
}) {
  const baseClasses =
    "flex h-12 w-12 items-center justify-center rounded-[16px] border border-[#2d3749] bg-[#121a27] text-[#dce3f0] transition-colors disabled:opacity-45";

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onDecrease}
        disabled={decreaseDisabled}
        className={baseClasses}
      >
        <Minus size={18} />
      </button>
      <button
        type="button"
        onClick={onIncrease}
        disabled={increaseDisabled}
        className={baseClasses}
      >
        <PlusIcon />
      </button>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Range({
  value,
  min,
  max,
  step = 1,
  onChange,
  labels,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (nextValue: number) => void;
  labels?: [string, string];
}) {
  return (
    <div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([nextValue]) => {
          if (typeof nextValue === "number") {
            onChange(nextValue);
          }
        }}
        className="[&_[data-slot=slider-range]]:bg-[#f0c45c] [&_[data-slot=slider-thumb]]:border-[#f0c45c] [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-track]]:bg-[#263144]"
      />
      {labels ? (
        <div className="mt-2 flex justify-between text-xs text-[#7f879c]">
          <span>{labels[0]}</span>
          <span>{labels[1]}</span>
        </div>
      ) : null}
    </div>
  );
}

function SegmentedButtons<TValue extends string>({
  options,
  value,
  onChange,
  columns = 2,
}: {
  options: Array<{
    value: TValue;
    label: string;
    icon?: React.ReactNode;
  }>;
  value: TValue;
  onChange: (nextValue: TValue) => void;
  columns?: 2 | 3 | 4 | 5;
}) {
  return (
    <div
      className={`grid gap-2 ${
        columns === 5
          ? "grid-cols-2 sm:grid-cols-5"
          : columns === 4
            ? "grid-cols-2 sm:grid-cols-4"
            : columns === 3
              ? "grid-cols-2 sm:grid-cols-3"
              : "grid-cols-2"
      }`}
    >
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex min-h-[56px] items-center justify-center gap-2 rounded-[16px] border px-3 py-3 text-sm transition-colors ${
              isSelected
                ? "border-[#f0c45c]/60 bg-[#171208] text-[#f0c45c]"
                : "border-[#2d3749] bg-[#121a27] text-[#c6cedd]"
            }`}
          >
            {option.icon}
            <span className="leading-tight">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function BlindPreview({ position = 0 }: { position?: number }) {
  const openRatio = position / 100;
  const blindHeight = 18 + (1 - openRatio) * 130;
  const railTop = Math.max(16, blindHeight - 6);
  const glowOpacity = 0.18 + openRatio * 0.42;

  return (
    <div className="rounded-[22px] border border-[#2d3749] bg-[#0f1724] p-4">
      <div className="relative h-52 overflow-hidden rounded-[18px] border border-[#314056] bg-[#0b1320]">
        <div
          className="absolute inset-[14px] rounded-[14px] border border-[#32435b] bg-[linear-gradient(180deg,#4d6788_0%,#84a6c3_54%,#ead49f_100%)]"
        />
        <div
          className="absolute inset-[14px] rounded-[14px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.28),transparent_65%)] transition-opacity"
          style={{ opacity: glowOpacity }}
        />

        <div className="absolute inset-x-[14px] top-[14px] h-4 rounded-t-[14px] border border-[#8c94a7]/40 bg-[linear-gradient(180deg,#d9dee8_0%,#9ba4b7_100%)] shadow-[0_10px_24px_rgba(0,0,0,0.28)]" />

        <div
          className="absolute inset-x-[14px] top-[14px] overflow-hidden rounded-b-[12px] bg-[linear-gradient(180deg,#e7ecf5_0%,#d8dee9_48%,#c2cad8_100%)] shadow-[0_14px_28px_rgba(0,0,0,0.28)] transition-all duration-300"
          style={{ height: `${blindHeight}px` }}
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.65)_0px,rgba(255,255,255,0.65)_3px,rgba(192,202,216,0.85)_3px,rgba(192,202,216,0.85)_12px)] opacity-75" />
          <div className="absolute inset-x-0 top-0 h-6 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),transparent)]" />
        </div>

        <div
          className="absolute inset-x-[18px] h-3 rounded-full border border-[#7f8799]/40 bg-[linear-gradient(180deg,#c6ccda_0%,#8f97aa_100%)] shadow-[0_6px_16px_rgba(0,0,0,0.32)] transition-all duration-300"
          style={{ top: `${railTop}px` }}
        />

        <div className="absolute right-8 top-[18px] flex h-[156px] w-5 justify-center">
          <div className="absolute top-0 h-[120px] w-px bg-[#cfd5e0]/70" />
          <div className="absolute bottom-0 flex h-10 w-4 items-center justify-center rounded-full border border-[#cfd5e0]/40 bg-[#d8dee9]/15">
            <div className="h-5 w-1 rounded-full bg-[#d8dee9]/80" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LampControls({
  brightness = 0,
  onUpdate,
}: {
  brightness?: number;
  onUpdate: (updates: Partial<Device>) => void;
}) {
  const nextBrightness = brightness ?? 0;

  return (
    <Section
      title="Intensidad"
      description="Ajustá la luz ambiente sin salir del detalle."
    >
      <div className="grid gap-4 sm:grid-cols-[auto,1fr] sm:items-center">
        <Stepper
          onDecrease={() => onUpdate({ brightness: Math.max(0, nextBrightness - 5) })}
          onIncrease={() => onUpdate({ brightness: Math.min(100, nextBrightness + 5) })}
          decreaseDisabled={nextBrightness <= 0}
          increaseDisabled={nextBrightness >= 100}
        />
        <DisplayValue value={nextBrightness} suffix="%" />
      </div>
      <div className="mt-4">
        <Range
          value={nextBrightness}
          min={0}
          max={100}
          onChange={(value) => onUpdate({ brightness: value })}
          labels={["Suave", "Máxima"]}
        />
      </div>
    </Section>
  );
}

function AirControls({ device, onUpdate }: DeviceDetailControlsProps) {
  const currentTemp = device.targetTemp ?? 24;
  const currentMode = device.acMode ?? "cool";
  const currentFanSpeed = device.fanSpeed ?? "auto";

  const modeOptions: Array<{ value: AcMode; label: string; icon: React.ReactNode }> = [
    { value: "cool", label: "Frío", icon: <Snowflake size={16} /> },
    { value: "heat", label: "Calor", icon: <Flame size={16} /> },
    { value: "fan", label: "Ventilador", icon: <Wind size={16} /> },
    { value: "dry", label: "Seco", icon: <Droplets size={16} /> },
    { value: "auto", label: "Auto", icon: <Zap size={16} /> },
  ];

  const fanOptions: Array<{ value: AcFanSpeed; label: string }> = [
    { value: "low", label: fanSpeedLabels.low },
    { value: "med", label: fanSpeedLabels.med },
    { value: "high", label: fanSpeedLabels.high },
    { value: "auto", label: fanSpeedLabels.auto },
  ];

  return (
    <div className="space-y-4">
      <Section title="Temperatura" description="Configurá entre 16°C y 30°C.">
        <div className="grid gap-4 sm:grid-cols-[auto,1fr] sm:items-center">
          <Stepper
            onDecrease={() => onUpdate({ targetTemp: Math.max(16, currentTemp - 1) })}
            onIncrease={() => onUpdate({ targetTemp: Math.min(30, currentTemp + 1) })}
            decreaseDisabled={currentTemp <= 16}
            increaseDisabled={currentTemp >= 30}
          />
          <DisplayValue value={currentTemp} suffix="°C" />
        </div>
        <div className="mt-4">
          <Range
            value={currentTemp}
            min={16}
            max={30}
            onChange={(value) => onUpdate({ targetTemp: value })}
            labels={["16°C", "30°C"]}
          />
        </div>
      </Section>

      <Section title="Modo" description={`${currentTemp}°C · ${acModeLabels[currentMode]}`}>
        <SegmentedButtons
          options={modeOptions}
          value={currentMode}
          onChange={(value) => onUpdate({ acMode: value })}
          columns={5}
        />
      </Section>

      <Section title="Ventilación" description="Elegí la velocidad del flujo de aire.">
        <SegmentedButtons
          options={fanOptions}
          value={currentFanSpeed}
          onChange={(value) => onUpdate({ fanSpeed: value })}
          columns={4}
        />
      </Section>

      <Section title="Swing" description="Oscilación automática de las paletas.">
        <div className="flex items-center justify-between rounded-[18px] border border-[#2d3749] bg-[#121a27] px-4 py-4">
          <div>
            <p className="text-sm font-medium text-white">Movimiento horizontal</p>
            <p className="mt-1 text-sm text-[#8f97ab]">
              {device.swing ? "Activado" : "Desactivado"}
            </p>
          </div>
          <Switch
            checked={device.swing ?? false}
            onCheckedChange={(checked) => onUpdate({ swing: checked })}
            className="h-7 w-12 data-[state=checked]:bg-[#f0c45c] data-[state=unchecked]:bg-[#39465d]"
          />
        </div>
      </Section>
    </div>
  );
}

function OvenControls({ device, onUpdate }: DeviceDetailControlsProps) {
  const currentTemp = device.ovenTemp ?? 180;
  const currentTimer = device.timerMinutes ?? 0;
  const currentMode = device.ovenMode ?? "convection";

  const modeOptions: Array<{ value: OvenMode; label: string }> = [
    { value: "convection", label: ovenModeLabels.convection },
    { value: "grill", label: ovenModeLabels.grill },
    { value: "upper_lower", label: ovenModeLabels.upper_lower },
    { value: "fan_forced", label: ovenModeLabels.fan_forced },
    { value: "defrost", label: ovenModeLabels.defrost },
  ];

  return (
    <div className="space-y-4">
      <Section title="Temperatura" description="Rango de 50°C a 300°C.">
        <div className="grid gap-4 sm:grid-cols-[auto,1fr] sm:items-center">
          <Stepper
            onDecrease={() => onUpdate({ ovenTemp: Math.max(50, currentTemp - 5) })}
            onIncrease={() => onUpdate({ ovenTemp: Math.min(300, currentTemp + 5) })}
            decreaseDisabled={currentTemp <= 50}
            increaseDisabled={currentTemp >= 300}
          />
          <DisplayValue value={currentTemp} suffix="°C" />
        </div>
        <div className="mt-4">
          <Range
            value={currentTemp}
            min={50}
            max={300}
            step={5}
            onChange={(value) => onUpdate({ ovenTemp: value })}
            labels={["50°C", "300°C"]}
          />
        </div>
      </Section>

      <Section title="Modo" description={ovenModeLabels[currentMode]}>
        <SegmentedButtons
          options={modeOptions}
          value={currentMode}
          onChange={(value) => onUpdate({ ovenMode: value })}
          columns={3}
        />
      </Section>

      <Section title="Timer" description="Programá el apagado automático.">
        <div className="grid gap-4 sm:grid-cols-[auto,1fr] sm:items-center">
          <Stepper
            onDecrease={() => onUpdate({ timerMinutes: Math.max(0, currentTimer - 5) })}
            onIncrease={() => onUpdate({ timerMinutes: Math.min(240, currentTimer + 5) })}
            decreaseDisabled={currentTimer <= 0}
            increaseDisabled={currentTimer >= 240}
          />
          <DisplayValue value={formatTimerMinutes(currentTimer)} />
        </div>
      </Section>
    </div>
  );
}

function BlindControls({ device, onUpdate }: DeviceDetailControlsProps) {
  const position = device.position ?? 0;
  const selectedPreset =
    position === 0 ? "0" : position === 50 ? "50" : position === 100 ? "100" : "custom";

  return (
    <div className="space-y-4">
      <Section title="Apertura" description={formatBlindPosition(position)}>
        <BlindPreview position={position} />
      </Section>

      <Section title="Posición" description="0% cerrada · 100% abierta">
        <DisplayValue value={position} suffix="%" />
        <div className="mt-4">
          <Range
            value={position}
            min={0}
            max={100}
            onChange={(value) => onUpdate({ position: value })}
            labels={["Cerrada", "Abierta"]}
          />
        </div>
      </Section>

      <Section title="Presets rápidos">
        <SegmentedButtons
          options={[
            { value: "0", label: "Cerrada" },
            { value: "50", label: "Media" },
            { value: "100", label: "Abierta" },
          ]}
          value={selectedPreset}
          onChange={(value) => onUpdate({ position: Number(value) })}
          columns={3}
        />
      </Section>
    </div>
  );
}

function SpeakerControls({ device, onUpdate }: DeviceDetailControlsProps) {
  const volume = device.volume ?? 50;
  const VolumeIcon = volume === 0 ? Volume : volume < 45 ? Volume1 : Volume2;

  return (
    <Section title="Volumen" description="Ajuste general del parlante.">
      <div className="grid gap-4 sm:grid-cols-[auto,1fr] sm:items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-[18px] border border-[#2d3749] bg-[#121a27] text-[#f0c45c]">
          <VolumeIcon size={28} />
        </div>
        <DisplayValue value={volume} suffix="%" />
      </div>
      <div className="mt-4">
        <Range
          value={volume}
          min={0}
          max={100}
          onChange={(value) => onUpdate({ volume: value })}
          labels={["Mute", "Alto"]}
        />
      </div>
    </Section>
  );
}

function FridgeControls({ device, onUpdate }: DeviceDetailControlsProps) {
  const fridgeTemp = device.fridgeTemp ?? 4;
  const freezerTemp = device.freezerTemp ?? -18;

  return (
    <div className="space-y-4">
      <Section title="Heladera" description="Temperatura interna principal.">
        <div className="grid gap-4 sm:grid-cols-[auto,1fr] sm:items-center">
          <Stepper
            onDecrease={() => onUpdate({ fridgeTemp: Math.max(1, fridgeTemp - 1) })}
            onIncrease={() => onUpdate({ fridgeTemp: Math.min(7, fridgeTemp + 1) })}
            decreaseDisabled={fridgeTemp <= 1}
            increaseDisabled={fridgeTemp >= 7}
          />
          <DisplayValue value={fridgeTemp} suffix="°C" />
        </div>
        <div className="mt-4">
          <Range
            value={fridgeTemp}
            min={1}
            max={7}
            onChange={(value) => onUpdate({ fridgeTemp: value })}
            labels={["1°C", "7°C"]}
          />
        </div>
      </Section>

      <Section title="Freezer" description="Congelación profunda para alimentos.">
        <div className="grid gap-4 sm:grid-cols-[auto,1fr] sm:items-center">
          <Stepper
            onDecrease={() => onUpdate({ freezerTemp: Math.max(-24, freezerTemp - 1) })}
            onIncrease={() => onUpdate({ freezerTemp: Math.min(-16, freezerTemp + 1) })}
            decreaseDisabled={freezerTemp <= -24}
            increaseDisabled={freezerTemp >= -16}
          />
          <DisplayValue value={freezerTemp} suffix="°C" />
        </div>
        <div className="mt-4">
          <Range
            value={freezerTemp}
            min={-24}
            max={-16}
            onChange={(value) => onUpdate({ freezerTemp: value })}
            labels={["-24°C", "-16°C"]}
          />
        </div>
      </Section>
    </div>
  );
}

function DefaultControls({ device }: { device: Device }) {
  return (
    <Section
      title="Información"
      description="Este dispositivo mantiene acciones rápidas desde la grilla principal."
    >
      <div className="rounded-[18px] border border-[#2d3749] bg-[#121a27] px-4 py-4">
        <p className="flex items-center gap-2 text-sm text-[#98a2b7]">
          <Waves size={16} />
          Estado actual
        </p>
        <p className="mt-2 text-lg font-semibold text-white">
          {device.status === "on" ? "Encendido" : "Apagado"}
        </p>
      </div>
    </Section>
  );
}

export function DeviceDetailControls({
  device,
  onUpdate,
}: DeviceDetailControlsProps) {
  switch (device.kind) {
    case "lamp":
      return (
        <LampControls
          brightness={device.brightness}
          onUpdate={onUpdate}
        />
      );
    case "air":
      return <AirControls device={device} onUpdate={onUpdate} />;
    case "oven":
      return <OvenControls device={device} onUpdate={onUpdate} />;
    case "blind":
      return <BlindControls device={device} onUpdate={onUpdate} />;
    case "speaker":
      return <SpeakerControls device={device} onUpdate={onUpdate} />;
    case "fridge":
      return <FridgeControls device={device} onUpdate={onUpdate} />;
    default:
      return <DefaultControls device={device} />;
  }
}
