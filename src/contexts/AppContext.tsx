import React, { createContext, useState, useContext, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';
type Language = 'en' | 'es' | 'fr'; // Add more languages as needed

interface AppContextType {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	language: Language;
	setLanguage: (language: Language) => void;
	toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [theme, setTheme] = useState<Theme>('system');
	const [language, setLanguage] = useState<Language>('en');

	useEffect(() => {
		// Check for saved theme preference
		const savedTheme = localStorage.getItem('theme') as Theme;
		if (savedTheme) {
			setTheme(savedTheme);
		}

		// Apply theme
		applyTheme(savedTheme || 'system');
	}, []);

	const applyTheme = (newTheme: Theme) => {
		const root = window.document.documentElement;
		root.classList.remove('light', 'dark');

		if (newTheme === 'system') {
			const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
			root.classList.add(systemTheme);
		} else {
			root.classList.add(newTheme);
		}
	};

	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		setTheme(newTheme);
		localStorage.setItem('theme', newTheme);
		applyTheme(newTheme);
	};

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = () => {
			if (theme === 'system') {
				applyTheme('system');
			}
		};
		mediaQuery.addListener(handleChange);
		return () => mediaQuery.removeListener(handleChange);
	}, [theme]);

	return <AppContext.Provider value={{ theme, setTheme, language, setLanguage, toggleTheme }}>{children}</AppContext.Provider>;
};

export const useApp = () => {
	const context = useContext(AppContext);
	if (context === undefined) {
		throw new Error('useApp must be used within an AppProvider');
	}
	return context;
};
