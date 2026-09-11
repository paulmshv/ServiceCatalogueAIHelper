import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

type AuthMode = 'login' | 'register';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, register } = useAuth();

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Валидация
    if (!email.trim()) {
      setError('Введите email');
      return;
    }
    if (!validateEmail(email)) {
      setError('Введите корректный email');
      return;
    }
    if (!password) {
      setError('Введите пароль');
      return;
    }
    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Введите имя');
        return;
      }
    }

    setIsLoading(true);

    try {
      let result;
      if (mode === 'login') {
        result = await login(email, password);
      } else {
        result = await register(email, password, name, department || undefined);
      }

      if (!result.success) {
        setError(result.error || 'Произошла ошибка');
      }
    } catch (err) {
      setError('Произошла ошибка при подключении');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setDepartment('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <i className="fas fa-headset text-white text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">IT Support</h1>
          <p className="text-sm text-gray-500 mt-1">AI-помощник для сотрудников</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => switchMode()}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === 'login'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => switchMode()}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === 'register'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Регистрация
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <i className="fas fa-user mr-1.5 text-gray-400"></i>
                    Имя
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Иван Иванов"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <i className="fas fa-building mr-1.5 text-gray-400"></i>
                    Отдел
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Маркетинг, Финансы, IT..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <i className="fas fa-envelope mr-1.5 text-gray-400"></i>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@company.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <i className="fas fa-lock mr-1.5 text-gray-400"></i>
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Минимум 6 символов"
                  className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
                <i className="fas fa-exclamation-circle mt-0.5"></i>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white py-3 rounded-xl font-medium text-sm transition-all shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Загрузка...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  <span>{mode === 'login' ? 'Войти' : 'Зарегистрироваться'}</span>
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          {mode === 'login' && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <div className="flex items-start gap-2">
                <i className="fas fa-info-circle text-blue-500 mt-0.5"></i>
                <div className="text-xs text-blue-700">
                  <p className="font-semibold mb-1">Демо-доступ:</p>
                  <p>Email: <code className="bg-blue-100 px-1.5 py-0.5 rounded">demo@example.com</code></p>
                  <p>Пароль: <code className="bg-blue-100 px-1.5 py-0.5 rounded">demo123</code></p>
                </div>
              </div>
            </div>
          )}

          {/* Switch mode link */}
          <div className="mt-6 text-center">
            <button
              onClick={switchMode}
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              {mode === 'login' ? (
                <>Нет аккаунта? <span className="font-medium text-blue-600">Зарегистрироваться</span></>
              ) : (
                <>Уже есть аккаунт? <span className="font-medium text-blue-600">Войти</span></>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-400">
          <p>© 2024 IT Support. Все права защищены.</p>
        </div>
      </div>
    </div>
  );
}
