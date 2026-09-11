import { useState, useRef, useEffect } from 'react';
import { analyzeQuery, generateResponse, getQuickSuggestions } from '../utils/aiEngine';
import { Service } from '../data/services';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  services?: Service[];
  timestamp: Date;
}

interface AIChatProps {
  onSelectService: (service: Service) => void;
}

export default function AIChat({ onSelectService }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: 'Здравствуйте! 👋 Я AI-помощник IT-поддержки. Опишите вашу проблему, и я помогу выбрать подходящую услугу из каталога.\n\nНапример:\n• "Не работает интернет"\n• "Нужно установить программу"\n• "Забыл пароль от учётной записи"',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (input.length > 2) {
      setSuggestions(getQuickSuggestions(input));
    } else {
      setSuggestions([]);
    }
  }, [input]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSuggestions([]);
    setIsTyping(true);

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    const results = analyzeQuery(messageText);
    const responseText = generateResponse(messageText, results);
    const matchedServices = results.map(r => r.service);

    const aiMessage: Message = {
      id: Date.now() + 1,
      text: responseText,
      sender: 'ai',
      services: matchedServices,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (text: string) => {
    setInput(text);
    setTimeout(() => handleSend(text), 100);
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {formatMessage(msg.text)}
              </div>
              {msg.services && msg.services.length > 0 && (
                <div className="mt-3 space-y-2">
                  {msg.services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => onSelectService(service)}
                      className="w-full text-left bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg p-3 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{service.icon}</span>
                        <div>
                          <div className="font-medium text-sm text-gray-800 group-hover:text-blue-600">
                            {service.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            ⏱ {service.estimatedTime} • Приоритет: {service.priority === 'critical' ? '🔴' : service.priority === 'high' ? '🟠' : service.priority === 'medium' ? '🟡' : '🟢'}
                          </div>
                        </div>
                        <span className="ml-auto text-gray-400 group-hover:text-blue-500">→</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <div className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions */}
      {suggestions.length > 0 && !isTyping && (
        <div className="px-4 pb-2 flex gap-2 flex-wrap">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickAction(suggestion)}
              className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full transition-colors border border-blue-200"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Опишите вашу проблему..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-5 py-3 rounded-xl transition-colors font-medium text-sm"
          >
            <i className="fas fa-paper-plane mr-1"></i>
          </button>
        </div>
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => handleQuickAction('Не работает компьютер')}
            className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
          >
            💻 Не работает ПК
          </button>
          <button
            onClick={() => handleQuickAction('Нет интернета')}
            className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
          >
            🌐 Нет интернета
          </button>
          <button
            onClick={() => handleQuickAction('Забыл пароль')}
            className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
          >
            🔑 Забыл пароль
          </button>
        </div>
      </div>
    </div>
  );
}

function formatMessage(text: string): React.ReactNode {
  // Simple markdown-like formatting
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    return <span key={idx}>{part}</span>;
  });
}
