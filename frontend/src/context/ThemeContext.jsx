import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        // Initialise synchronously from localStorage to avoid flash
        const saved = typeof window !== 'undefined'
            ? localStorage.getItem('vtrc_theme')
            : null;
        return saved ? saved === 'dark' : true; // default = dark (VTRC brand)
    });

    // Apply class to <html> immediately — this is what drives all CSS vars,
    // so there's zero lag vs toggling per-component.
    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            root.classList.remove('light');
        } else {
            root.classList.add('light');
            root.classList.remove('dark');
        }
        localStorage.setItem('vtrc_theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggleTheme = useCallback(() => setIsDark(prev => !prev), []);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
    return ctx;
};
