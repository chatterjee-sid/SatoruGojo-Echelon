import React, { createContext, useContext, useState, type ReactNode } from 'react';

type AlertColor = 'cyber-red' | 'cyber-green' | 'cyber-blue';

interface ThemeContextType {
    alertColor: AlertColor;
    setAlertColor: (color: AlertColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [alertColor, setAlertColor] = useState<AlertColor>('cyber-red');

    return (
        <ThemeContext.Provider value={{ alertColor, setAlertColor }}>
            <div className={`theme-root ${alertColor}`}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
