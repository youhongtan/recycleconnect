import React from "react";
import { Globe } from "lucide-react";
import { useI18n, LANGS } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LanguageSwitch() {
  const { lang, setLang } = useI18n();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Change language"
        className="h-10 px-3 rounded-full grid place-items-center glass hover:bg-primary/10 transition-colors text-sm font-medium"
      >
        <span className="flex items-center gap-1.5">
          <Globe className="w-4 h-4" />
          {LANGS[lang].short}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl">
        {Object.entries(LANGS).map(([code, l]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLang(code)}
            className={code === lang ? "font-semibold text-primary" : ""}
          >
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}