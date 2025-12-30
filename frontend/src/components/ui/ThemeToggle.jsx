
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-background border border-border text-secondary hover:text-brand hover:border-brand transition-colors"
            title="Toggle Theme"
        >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
    );
};

export default ThemeToggle;
