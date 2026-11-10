import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export type StoredScheme = 'light' | 'dark' | null;
export type ResolvedScheme = 'light' | 'dark';

interface ThemeContextValue {
  storedScheme: StoredScheme;
  systemScheme: ResolvedScheme;
  resolvedScheme: ResolvedScheme;
  toggleTheme: () => void;
  setScheme: (scheme: StoredScheme) => void;
}

const STORAGE_KEY = 'color-scheme';

function getSystemScheme(): ResolvedScheme {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function getInitialStoredScheme(): StoredScheme {
  if (typeof window === 'undefined') return 'light';
  try {
    const val = window.localStorage.getItem(STORAGE_KEY);
    if (val === 'light' || val === 'dark') {
      return val;
    }
    // Default to Buy Me a Coffee crisp light theme on first visit if not set
    window.localStorage.setItem(STORAGE_KEY, 'light');
    return 'light';
  } catch {
    return 'light';
  }
}

function syncDocumentMeta(scheme: StoredScheme, resolved: ResolvedScheme) {
  if (typeof document === 'undefined') return;
  const meta = document.querySelector<HTMLMetaElement>(
    'meta[name="color-scheme"]'
  );
  if (meta) {
    meta.content = scheme ?? 'light dark';
  }
  document.documentElement.dataset.theme = resolved;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
  document.documentElement.classList.toggle('light', resolved === 'light');
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [storedScheme, setStoredScheme] = useState<StoredScheme>(
    getInitialStoredScheme
  );
  const [systemScheme, setSystemScheme] =
    useState<ResolvedScheme>(getSystemScheme);

  const resolvedScheme: ResolvedScheme = storedScheme ?? systemScheme;

  useEffect(() => {
    syncDocumentMeta(storedScheme, resolvedScheme);
  }, [storedScheme, resolvedScheme]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemScheme(e.matches ? 'dark' : 'light');
    };
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const next =
          e.newValue === 'light' || e.newValue === 'dark' ? e.newValue : null;
        setStoredScheme(next);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setScheme = useCallback((next: StoredScheme) => {
    setStoredScheme(next);
    try {
      if (next === null) {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, next);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const currentSys = getSystemScheme();
    const currentRendered: ResolvedScheme = storedScheme ?? currentSys;
    const target: ResolvedScheme =
      currentRendered === 'dark' ? 'light' : 'dark';

    if (target === currentSys) {
      setScheme(null);
    } else {
      setScheme(target);
    }
  }, [storedScheme, setScheme]);

  return (
    <ThemeContext.Provider
      value={{
        storedScheme,
        systemScheme,
        resolvedScheme,
        toggleTheme,
        setScheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
