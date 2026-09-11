import { useState } from 'react';
import { services, categories, Service } from '../data/services';

interface ServiceCatalogProps {
  onSelectService: (service: Service) => void;
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function ServiceCatalog({ onSelectService, selectedCategory, onSelectCategory }: ServiceCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter(service => {
    const matchesCategory = !selectedCategory || service.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Search */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск услуг..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => onSelectCategory(null)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              !selectedCategory
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Все
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id === selectedCategory ? null : cat.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Services list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {filteredServices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-search text-3xl mb-3 block"></i>
            <p className="text-sm">Услуги не найдены</p>
            <p className="text-xs mt-1">Попробуйте изменить запрос</p>
          </div>
        ) : (
          filteredServices.map(service => (
            <button
              key={service.id}
              onClick={() => onSelectService(service)}
              className="w-full text-left bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl p-4 transition-all duration-200 group shadow-sm hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{service.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-800 group-hover:text-blue-600 transition-colors">
                    {service.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {service.description}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-400">
                      <i className="far fa-clock mr-1"></i>
                      {service.estimatedTime}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      service.priority === 'critical' ? 'bg-red-100 text-red-700' :
                      service.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      service.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {service.priority === 'critical' ? 'Критический' :
                       service.priority === 'high' ? 'Высокий' :
                       service.priority === 'medium' ? 'Средний' : 'Низкий'}
                    </span>
                  </div>
                </div>
                <span className="text-gray-300 group-hover:text-blue-500 transition-colors mt-1">
                  <i className="fas fa-chevron-right"></i>
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
