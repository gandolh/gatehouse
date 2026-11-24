import { RadioGroup } from "../../components/ui/RadioGroup";
import { setLook, useLook, type Look } from "./look";

const LOOKS = [
  { value: "profile", label: "Profile" },
  { value: "terminal", label: "Terminal" },
  { value: "ninety-six", label: "Ninety-six" },
] as const satisfies readonly { value: Look; label: string }[];

/**
 * Profile, Terminal or Ninety-six, kept on this device: a RadioGroup, since nothing goes to the server (base-ui rule
 * 16). Drawn plainly, as a row of the page's secondary buttons, each in the look's own button style. Hidden without
 * scripts, which keep the page in Profile.
 */
export function LookSwitcher() {
  const look = useLook();
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span aria-hidden="true" className="font-ui text-control text-ink-muted">
        Look
      </span>
      <RadioGroup label="Look" look="row" setting="look" options={LOOKS} value={look} onValueChange={setLook} />
    </div>
  );
}
