"use client";

import { Switch } from "@heroui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-14 h-8" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Switch
      isSelected={isDark}
      onValueChange={(val) => setTheme(val ? "dark" : "light")}
      onChange={(e) => {
        if (typeof e === "boolean") {
          setTheme(e ? "dark" : "light");
        } else if (e && e.target) {
          setTheme(e.target.checked ? "dark" : "light");
        }
      }}
      size="lg"
      color="primary"
    >
      <Switch.Content>
        <Switch.Control>
          <Switch.Thumb className="flex items-center justify-center">
            {isDark ? (
              <Moon className="w-4 h-4 text-blue-600" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </Switch.Thumb>
        </Switch.Control>
      </Switch.Content>
    </Switch>
  );
}
