import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './components/AuthPage';
import AIChat from './components/AIChat';
import ServiceCatalog from './components/ServiceCatalog';
import ServiceDetail from './components/ServiceDetail';
import { Service } from './data/services';

type View = 'chat' | 'catalog' | 'detail';

function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();
  const [currentView, setCurrentView] = useState<View>('chat');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Если пользователь не авторизован, показываем страницу входа
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    setCurrentView('detail');
  };

  const handleBack = () => {
    setSelectedService(null);
    setCurrentView('chat');
  };

  const handleSubmitRequest = (service: Service, description: string) => {
    console.log(`Заявка на услугу "${service.name}" от ${user?.email}: ${description}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-600 hover:text-blue-600 p-2"
            >
              <i className="fas fa-bars text-lg"></i>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-headset text-white text-sm"></i>
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-800 leading-tight">IT Support</h1>
                <p className="text-xs text-gray-500 leading-tight">AI-помощник</p>
              </div>
            </div>
          </div>

          {/* Navigation tabs */}
          <nav className="flex items-center gap-1">
            <button
              onClick={() => { setCurrentView('chat'); setSelectedService(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'chat'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className="fas fa-robot mr-1.5"></i>
              <span className="hidden sm:inline">AI Помощник</span>
            </button>
            <button
              onClick={() => { setCurrentView('catalog'); setSelectedService(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'catalog' || currentView === 'detail'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className="fas fa-th-list mr-1.5"></i>
              <span className="hidden sm:inline">Каталог услуг</span>
            </button>
          </nav>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-2 py-1.5 transition-colors"
            >
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="hidden lg:inline">{user?.name}</span>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {user?.name ? getInitials(user.name) : <i className="fas fa-user text-sm"></i>}
              </div>
            </button>

            {/* Dropdown menu */}
            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user?.name ? getInitials(user.name) : <i className="fas fa-user"></i>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-800 truncate">{user?.name}</div>
                        <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    {user?.department && (
                      <div className="px-3 py-2 text-sm text-gray-600">
                        <i className="fas fa-building mr-2 text-gray-400"></i>
                        {user.department}
                      </div>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      Выйти из аккаунта
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - visible on larger screens */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-20 w-72 bg-white border-r border-gray-200 transition-transform duration-300 lg:w-80 flex flex-col pt-16 lg:pt-0`}>
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-700 text-sm">
              <i className="fas fa-chart-bar mr-2 text-blue-500"></i>
              Статистика
            </h2>
          </div>
          <div className="p-4 space-y-3">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="text-2xl font-bold">19</div>
              <div className="text-xs opacity-80">Услуг в каталоге</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-700">8</div>
                <div className="text-xs text-green-600">Категорий</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-purple-700">AI</div>
                <div className="text-xs text-purple-600">Подбор</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Популярные запросы</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">🔑 Сброс пароля</span>
                  <span className="text-xs text-gray-400">32%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">🌐 Нет интернета</span>
                  <span className="text-xs text-gray-400">24%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">💿 Установка ПО</span>
                  <span className="text-xs text-gray-400">18%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">🖥️ Новый ПК</span>
                  <span className="text-xs text-gray-400">14%</span>
                </div>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <span className="text-lg">💡</span>
                <div>
                  <h3 className="text-xs font-semibold text-amber-800">Совет</h3>
                  <p className="text-xs text-amber-700 mt-1">
                    Опишите проблему своими словами — AI подберёт нужную услугу автоматически
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/30 z-10"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {currentView === 'chat' && (
            <div className="flex-1 flex flex-col bg-white">
              <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <i className="fas fa-robot text-white text-xs"></i>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-gray-800">AI-помощник</h2>
                    <p className="text-xs text-gray-500">Опишите проблему — я подберу услугу</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <AIChat onSelectService={handleSelectService} />
              </div>
            </div>
          )}

          {currentView === 'catalog' && (
            <div className="flex-1 flex flex-col bg-white">
              <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-green-50 to-teal-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                    <i className="fas fa-th-list text-white text-xs"></i>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-gray-800">Каталог услуг</h2>
                    <p className="text-xs text-gray-500">Выберите нужную услугу</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <ServiceCatalog
                  onSelectService={handleSelectService}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>
            </div>
          )}

          {currentView === 'detail' && selectedService && (
            <div className="flex-1 flex flex-col bg-white">
              <ServiceDetail
                service={selectedService}
                onBack={handleBack}
                onSubmitRequest={handleSubmitRequest}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
