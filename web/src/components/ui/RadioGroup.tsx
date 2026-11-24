import { Radio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { CheckIcon } from "./icons";

interface RadioOption<Value extends string> {
  value: Value;
  label: string;
  icon?: ReactNode;
}

export interface RadioGroupProps<Value extends string> {
  /** Names the group for a screen reader; never shown. */
  label: string;
  options: readonly RadioOption<Value>[];
  value: Value;
  onValueChange: (value: Value) => void;
  /** `track` draws the options as buttons in a track (the mode); `chips` as a row of pills (the filters). */
  look: "track" | "chips";
  /**
   * A setting the head script restores before the first paint: its options carry `data-<setting>-option`, so the chosen
   * one is drawn pressed from the first frame, before React hydrates (the stylesheet's `pressed` variant). A filter
   * has no such setting.
   */
  setting?: "mode" | "look";
  className?: string;
}

const groupLooks = {
  track: "inline-flex gap-0.5 rounded-track border border-line bg-surface-2 p-1",
  chips: "flex gap-1",
} as const;

const optionLooks = {
  // On a phone a track shows only the icons, at 44 px; the label stays for a screen reader.
  track: [
    "inline-flex size-11 items-center justify-center gap-2 rounded-segment border border-transparent text-control",
    "font-medium text-ink-body hover:text-ink active:bg-line sm:h-9.5 sm:w-auto sm:px-3",
    "pressed:border-line-ui pressed:bg-surface pressed:text-ink pressed:shadow-card",
  ].join(" "),
  chips: [
    "inline-flex min-h-11 min-w-11 flex-none items-center justify-center gap-2 rounded-full border border-line-ui px-3",
    "text-control font-medium whitespace-nowrap text-ink hover:not-pressed:bg-surface-2",
    "active:not-pressed:bg-line sm:min-h-9.5 sm:pointer-coarse:min-h-11",
    "pressed:border-button pressed:bg-button pressed:text-on-button",
  ].join(" "),
} as const;

/**
 * One choice from a few, drawn as buttons, the chosen one pressed (`data-checked`). Tab enters the group and arrow keys
 * move and choose (base-ui rule 16): for a filter, and for a setting kept on the device. Each option carries a check
 * icon that a look may show on the chosen one; Profile doesn't.
 */
export function RadioGroup<Value extends string>({
  label,
  options,
  value,
  onValueChange,
  look,
  setting,
  className,
}: RadioGroupProps<Value>) {
  return (
    <BaseRadioGroup<Value>
      aria-label={label}
      value={value}
      onValueChange={onValueChange}
      className={cn(groupLooks[look], className)}
    >
      {options.map((option) => (
        <Radio.Root
          key={option.value}
          value={option.value}
          {...(setting === undefined ? {} : { [`data-${setting}-option`]: option.value })}
          className={cn(
            "cursor-pointer select-none motion-safe:transition-colors motion-safe:duration-120",
            optionLooks[look],
          )}
        >
          <CheckIcon className="hidden size-3.5" />
          {option.icon}
          <span className={cn(look === "track" && "max-sm:sr-only")}>{option.label}</span>
        </Radio.Root>
      ))}
    </BaseRadioGroup>
  );
}
