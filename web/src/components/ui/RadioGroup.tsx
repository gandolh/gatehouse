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
  /** `track` draws the options as buttons in a track (the mode); `chips` as a row of pills (the filters); `row` as a row of the page's secondary buttons (the look). */
  look: "track" | "chips" | "row";
  /**
   * A setting the head script restores before the first paint: its options carry `data-<setting>-option`, so the chosen
   * one is drawn pressed from the first frame, before React hydrates (the stylesheet's `pressed` variant). A filter
   * has no such setting.
   */
  setting?: "mode" | "look" | "view";
  className?: string;
}

const groupLooks = {
  track:
    "inline-flex gap-0.5 rounded-track border border-line bg-surface-2 p-1 terminal:gap-0 terminal:border-edge terminal:bg-surface terminal:p-0 ninety-six:gap-1 ninety-six:border-0 ninety-six:bg-transparent ninety-six:p-0",
  chips: "flex gap-1",
  row: "flex flex-wrap gap-2",
} as const;

const optionLooks = {
  // On a phone a track shows only the icons, at 44 px; the label stays for a screen reader.
  track: [
    "inline-flex size-11 items-center justify-center gap-2 rounded-segment border border-transparent font-ui text-control",
    "font-medium text-ink-body hover:text-ink active:bg-line sm:h-9.5 sm:w-auto sm:px-3",
    "pressed:border-line-ui pressed:bg-surface pressed:text-ink pressed:shadow-card",
    "terminal:text-ink terminal:hover:bg-surface-2 terminal:not-first:border-l-edge sm:terminal:h-10",
    "terminal:pressed:border-transparent terminal:pressed:bg-button terminal:pressed:text-on-button terminal:pressed:shadow-none",
    "terminal:pressed:hover:bg-button",
    "ninety-six:border-0 ninety-six:bg-face ninety-six:font-normal ninety-six:text-ink ninety-six:shadow-raised ninety-six:hover:bg-surface-2",
    "ninety-six:pressed:bg-surface-2 ninety-six:pressed:font-bold ninety-six:pressed:shadow-sunken ninety-six:max-sm:pressed:[&>svg]:stroke-3",
  ].join(" "),
  chips: [
    "inline-flex min-h-11 min-w-11 flex-none items-center justify-center gap-2 rounded-full border border-line-ui px-3",
    "font-ui text-control font-medium whitespace-nowrap text-ink hover:not-pressed:bg-surface-2",
    "terminal:rounded-none terminal:border-edge terminal:bg-surface terminal:font-normal terminal:sm:not-pointer-coarse:min-h-9",
    "active:not-pressed:bg-line sm:min-h-9.5 sm:pointer-coarse:min-h-11",
    "pressed:border-button pressed:bg-button pressed:text-on-button",
    "ninety-six:rounded-none ninety-six:border-0 ninety-six:bg-face ninety-six:font-normal ninety-six:shadow-raised",
    "ninety-six:hover:not-pressed:bg-surface-2 ninety-six:active:not-pressed:bg-surface-2",
    "ninety-six:pressed:bg-surface-2 ninety-six:pressed:font-bold ninety-six:pressed:text-ink ninety-six:pressed:shadow-sunken",
  ].join(" "),
  row: [
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-control border border-line-ui px-4 font-ui text-control",
    "font-medium whitespace-nowrap text-ink hover:not-pressed:bg-surface-2 active:not-pressed:bg-line",
    "sm:min-h-9.5 sm:pointer-coarse:min-h-11",
    "pressed:border-button pressed:bg-button pressed:text-on-button",
    "ninety-six:border-0 ninety-six:bg-face ninety-six:font-normal ninety-six:shadow-raised",
    "ninety-six:hover:not-pressed:bg-surface-2 ninety-six:active:not-pressed:bg-surface-2",
    "ninety-six:pressed:bg-surface-2 ninety-six:pressed:font-bold ninety-six:pressed:text-ink ninety-six:pressed:shadow-sunken",
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
            "group/option cursor-pointer select-none motion-safe:transition-colors motion-safe:duration-120",
            optionLooks[look],
          )}
        >
          <CheckIcon
            className={cn(
              "hidden size-3.5",
              look === "chips" && "group-pressed/option:terminal:block",
              look === "track" ? "sm:group-pressed/option:ninety-six:block" : "group-pressed/option:ninety-six:block",
            )}
          />
          {option.icon}
          <span className={cn(look === "track" && "max-sm:sr-only")}>{option.label}</span>
        </Radio.Root>
      ))}
    </BaseRadioGroup>
  );
}
