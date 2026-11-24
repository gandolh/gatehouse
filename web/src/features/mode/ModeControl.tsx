import { useEffect, type ReactNode } from "react";
import { MonitorIcon, MoonIcon, SunIcon } from "../../components/ui/icons";
import { RadioGroup } from "../../components/ui/RadioGroup";
import { paintBrowserBar, setMode, useMode, type Mode } from "./mode";

const MODES = [
  { value: "light", label: "Light", icon: <SunIcon /> },
  { value: "dark", label: "Dark", icon: <MoonIcon /> },
  { value: "system", label: "System", icon: <MonitorIcon /> },
] as const satisfies readonly { value: Mode; label: string; icon: ReactNode }[];

/**
 * Light, Dark or System, kept on this device. A RadioGroup: nothing goes to the server (base-ui rule 16). Hidden
 * without scripts, since it can't work there; the page is light then.
 */
export function ModeControl() {
  const mode = useMode();

  // System follows the device live: the page's colours do so through color-scheme, the browser bar through this.
  useEffect(() => {
    if (mode !== "system") return undefined;
    const query = matchMedia("(prefers-color-scheme: dark)");
    query.addEventListener("change", paintBrowserBar);
    return () => {
      query.removeEventListener("change", paintBrowserBar);
    };
  }, [mode]);

  return (
    <RadioGroup
      label="Mode"
      look="track"
      setting="mode"
      options={MODES}
      value={mode}
      onValueChange={setMode}
      className="hidden scripted:inline-flex"
    />
  );
}
