import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string, department?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Имитация базы данных пользователей
const MOCK_USERS_KEY = 'it_support_users';
const CURRENT_USER_KEY = 'it_support_current_user';

function getStoredUsers(): Array<{ email: string; password: string; name: string; department?: string }> {
  const stored = localStorage.getItem(MOCK_USERS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Создаём тестового пользователя по умолчанию
  const defaultUsers = [
    { email: 'demo@example.com', password: 'demo123', name: 'Демо Пользователь', department: 'IT отдел' }
  ];
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

function saveUser(user: { email: string; password: string; name: string; department?: string }) {
  const users = getStoredUsers();
  users.push(user);
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Восстанавливаем сессию при загрузке
  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = getStoredUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (!foundUser) {
      return { success: false, error: 'Неверный email или пароль' };
    }

    const userData: User = {
      email: foundUser.email,
      name: foundUser.name,
      department: foundUser.department,
    };

    setUser(userData);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    return { success: true };
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    department?: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = getStoredUsers();
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      return { success: false, error: 'Пользователь с таким email уже существует' };
    }

    const newUser = { email, password, name, department };
    saveUser(newUser);

    const userData: User = { email, name, department };
    setUser(userData);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
