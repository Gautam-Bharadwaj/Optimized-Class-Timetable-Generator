import { useEffect } from 'react';
import { useUiStore } from '../store/ui.store';

export const useTheme = () => {
    const { theme, setTheme } = useUiStore();

    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
    }, [theme]);

    return { theme, setTheme };
};
