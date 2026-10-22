import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

const isTheme = (value: string | null): value is Theme => value === 'light' || value === 'dark';

export function useTheme() {
  // 工业控制台默认深色：夜间值班、长时间盯屏更友好
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (isTheme(savedTheme)) {
      return savedTheme;
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  };
}
