import { useState } from 'react';
import { Service, categories } from '../data/services';

interface ServiceDetailProps {
  service: Service;
  onBack: () => void;
  onSubmitRequest: (service: Service, description: string) => void;
}

export default function ServiceDetail({ service, onBack, onSubmitRequest }: ServiceDetailProps) {
  const category = categories.find(c => c.id === service.category);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm"
        >
          <i className="fas fa-arrow-left"></i>
          Назад
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-lg mx-auto">
          {/* Service header */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">{service.icon}</div>
            <h2 className="text-xl font-bold text-gray-800">{service.name}</h2>
            {category && (
              <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                {category.icon} {category.name}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <h3 className="font-semibold text-sm text-gray-700 mb-2">Описание</h3>
            <p className="text-sm text-gray-600">{service.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-xs text-blue-600 font-medium mb-1">
                <i className="far fa-clock mr-1"></i>Время решения
              </div>
              <div className="text-sm font-semibold text-gray-800">{service.estimatedTime}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 font-medium mb-1">
                <i className="fas fa-flag mr-1"></i>Приоритет
              </div>
              <div className={`text-sm font-semibold ${
                service.priority === 'critical' ? 'text-red-600' :
                service.priority === 'high' ? 'text-orange-600' :
                service.priority === 'medium' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {service.priority === 'critical' ? '🔴 Критический' :
                 service.priority === 'high' ? '🟠 Высокий' :
                 service.priority === 'medium' ? '🟡 Средний' : '🟢 Низкий'}
              </div>
            </div>
          </div>

          {/* Request form */}
          <ServiceRequestForm service={service} onSubmit={onSubmitRequest} />
        </div>
      </div>
    </div>
  );
}

interface ServiceRequestFormProps {
  service: Service;
  onSubmit: (service: Service, description: string) => void;
}

function ServiceRequestForm({ service, onSubmit }: ServiceRequestFormProps) {
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    
    const id = `IT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    setTicketId(id);
    setSubmitted(true);
    onSubmit(service, description);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="font-bold text-green-800 text-lg mb-2">Заявка создана!</h3>
        <p className="text-sm text-green-700 mb-3">
          Номер заявки: <span className="font-mono font-bold">{ticketId}</span>
        </p>
        <p className="text-xs text-green-600">
          Специалист свяжется с вами в течение {service.estimatedTime}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="font-semibold text-sm text-gray-700 mb-3">
          <i className="fas fa-edit mr-2 text-blue-500"></i>
          Опишите вашу ситуацию
        </h3>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Подробно опишите проблему или запрос..."
          rows={4}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-400">
            {description.length} / 500 символов
          </span>
          <button
            type="submit"
            disabled={!description.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2.5 rounded-lg transition-colors text-sm font-medium"
          >
            <i className="fas fa-paper-plane mr-2"></i>
            Создать заявку
          </button>
        </div>
      </div>
    </form>
  );
}
