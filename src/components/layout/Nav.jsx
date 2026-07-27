import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Leaf, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";
import LanguageSwitch from "@/components/common/LanguageSwitch";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/AuthContext";

const LINKS = [
  { to: "/", key: "home" },
  { to: "/learn", key: "learn" },
  { to: "/pollution", key: "pollution" },
  { to: "/assistant", key: "assistant" },
  { to: "/finder", key: "finder" },
  { to: "/rewards", key: "rewards" },
  { to: "/challenges", key: "challenges" },
  { to: "/leaderboard", key: "leaderboard" },
  { to: "/profile", key: "profile" },
  { to: "/about", key: "about" },
  { to: "/contact", key: "contact" },
];

export default function Nav() {
  const { t } = useI18n();
  const { role, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isAdmin = role === "admin";

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 pt-4">
      <nav
        className={`mx-auto max-w-6xl rounded-full glass soft-shadow transition-all duration-500 ${
          scrolled ? "py-2 px-3 opacity-95" : "py-3 px-4"
        }`}
        aria-label="Main"
      >
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 pl-2 pr-3 shrink-0">
            <span className="h-9 w-9 rounded-2xl bg-primary grid place-items-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </span>
            <span className="font-bold tracking-tight text-lg">
              Recycle<span className="text-accent">Connect</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5 mx-auto">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `px-2.5 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive ? "bg-primary/12 text-primary" : "hover:bg-primary/8 text-foreground/80"
                  }`
                }
              >
                {t(l.key)}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `px-2.5 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive ? "bg-accent/12 text-accent" : "hover:bg-accent/8 text-accent"
                  }`
                }
              >
                {t("admin")}
              </NavLink>
            )}
          </div>

          <div className="ml-auto lg:ml-0 flex items-center gap-2">
            <LanguageSwitch />
            <ThemeToggle />
            <button
              type="button"
              className="lg:hidden h-10 w-10 rounded-full grid place-items-center glass"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden mt-3 grid grid-cols-2 gap-1 pb-2">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-2xl text-sm font-medium ${
                    isActive ? "bg-primary/12 text-primary" : "hover:bg-primary/8"
                  }`
                }
              >
                {t(l.key)}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-2xl text-sm font-medium bg-accent/12 text-accent"
              >
                {t("admin")}
              </NavLink>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
