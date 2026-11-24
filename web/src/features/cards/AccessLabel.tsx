import type { Access } from "@gatehouse/shared";
import type { ComponentType, SVGProps } from "react";
import { BookIcon, FileIcon, GitHubIcon, GlobeIcon, KeyIcon, LockIcon, UnlockIcon } from "../../components/ui/icons";
import { cn } from "../../lib/cn";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

/** Each label's icon in Profile, and Ninety-six's where it draws another. Terminal draws none. */
const ICONS: Record<Access, { profile: Icon; ninetySix?: Icon }> = {
  open: { profile: UnlockIcon, ninetySix: GlobeIcon },
  "sign-in": { profile: LockIcon },
  owner: { profile: LockIcon, ninetySix: KeyIcon },
  docs: { profile: FileIcon, ninetySix: BookIcon },
  repo: { profile: GitHubIcon },
};

/**
 * Who can open the card, in words and an icon, never colour alone: Public, Sign-in, Owner only, Docs only, On GitHub.
 * Only Public carries the access colour. Terminal writes the words in brackets, which the markup carries hidden.
 */
export function AccessLabel({ access, label }: { access: Access; label: string }) {
  const { profile: ProfileIcon, ninetySix: NinetySixIcon } = ICONS[access];
  return (
    <span
      className={cn(
        "inline-flex h-6 flex-none items-center gap-1 rounded-full border border-line-ui px-2 font-ui text-label font-medium",
        "terminal:h-auto terminal:gap-0 terminal:rounded-none terminal:border-0 terminal:p-0 terminal:leading-[1.6] terminal:lowercase",
        "whitespace-nowrap text-ink-body",
        access === "open" && "border-ok-line text-ok terminal:font-bold",
      )}
    >
      <span aria-hidden="true" className="hidden terminal:inline">
        [
      </span>
      <ProfileIcon className={cn("size-3.25 terminal:hidden", NinetySixIcon && "ninety-six:hidden")} />
      {NinetySixIcon && <NinetySixIcon className="hidden size-3.25 ninety-six:block" />}
      {label}
      <span aria-hidden="true" className="hidden terminal:inline">
        ]
      </span>
    </span>
  );
}
