"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Switch } from "./switch"

export function ModeToggle() {
    const { theme, setTheme } = useTheme();
    const [isDark, setIsDark] = React.useState(false);

    React.useEffect(() => {
        setIsDark(theme === "dark");
    }, [theme]);

    // Xử lý khi người dùng thay đổi switch
    const handleToggle = (checked: boolean) => {
        setIsDark(checked);
        setTheme(checked ? "dark" : "light");
    };

    return (
        <div className="flex items-center space-x-2">
            <Sun className={`h-5 w-5 ${isDark ? "text-gray-400" : "text-yellow-500"}`} />
            <Switch checked={isDark} onCheckedChange={handleToggle} />
            <Moon className={`h-5 w-5 ${isDark ? "text-foreground" : "text-gray-400"}`} />
        </div>
    )
}
