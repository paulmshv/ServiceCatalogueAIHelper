import { services, Service } from '../data/services';

interface MatchResult {
  service: Service;
  score: number;
  matchedKeywords: string[];
}

export function analyzeQuery(query: string): MatchResult[] {
  const normalizedQuery = query.toLowerCase().trim();
  const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 2);
  
  const results: MatchResult[] = [];

  for (const service of services) {
    let score = 0;
    const matchedKeywords: string[] = [];

    // Check keyword matches
    for (const keyword of service.keywords) {
      if (normalizedQuery.includes(keyword)) {
        score += 3;
        matchedKeywords.push(keyword);
      } else {
        // Partial word match
        const keywordWords = keyword.split(/\s+/);
        for (const kw of keywordWords) {
          if (kw.length > 2 && queryWords.some(qw => qw.includes(kw) || kw.includes(qw))) {
            score += 1;
            matchedKeywords.push(keyword);
            break;
          }
        }
      }
    }

    // Check name match
    const nameWords = service.name.toLowerCase().split(/\s+/);
    for (const nw of nameWords) {
      if (nw.length > 2 && normalizedQuery.includes(nw)) {
        score += 2;
      }
    }

    // Check description match
    const descWords = service.description.toLowerCase().split(/\s+/);
    for (const dw of descWords) {
      if (dw.length > 3 && normalizedQuery.includes(dw)) {
        score += 0.5;
      }
    }

    if (score > 0) {
      results.push({
        service,
        score,
        matchedKeywords: [...new Set(matchedKeywords)],
      });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  
  return results.slice(0, 5);
}

export function generateResponse(query: string, results: MatchResult[]): string {
  if (results.length === 0) {
    return `К сожалению, я не смог точно определить подходящую услугу по вашему описанию. Попробуйте описать проблему подробнее, или выберите услугу из каталога вручную.\n\nВы можете попробовать описать:\n• Что именно не работает?\n• Когда возникла проблема?\n• Какое оборудование или программа задействованы?`;
  }

  const topResult = results[0];
  
  if (results.length === 1) {
    return `На основе вашего описания, наиболее подходящая услуга:\n\n**${topResult.service.icon} ${topResult.service.name}**\n\n${topResult.service.description}\n\n⏱ Ориентировочное время решения: ${topResult.service.estimatedTime}\n🔴 Приоритет: ${getPriorityLabel(topResult.service.priority)}`;
  }

  let response = `На основе вашего описания, я нашёл несколько подходящих услуг:\n\n`;
  
  results.forEach((result, index) => {
    const confidence = Math.min(Math.round((result.score / results[0].score) * 100), 100);
    response += `${index + 1}. **${result.service.icon} ${result.service.name}** (${confidence}% соответствия)\n   ${result.service.description}\n   ⏱ ${result.service.estimatedTime}\n\n`;
  });

  response += `Рекомендую начать с первой услуги. Если это не ваша ситуация, выберите из списка выше.`;
  
  return response;
}

function getPriorityLabel(priority: string): string {
  switch (priority) {
    case 'critical': return '🔴 Критический';
    case 'high': return '🟠 Высокий';
    case 'medium': return '🟡 Средний';
    case 'low': return '🟢 Низкий';
    default: return priority;
  }
}

export function getQuickSuggestions(query: string): string[] {
  const suggestions: string[] = [];
  
  if (query.length < 3) {
    return ['Не работает компьютер', 'Проблемы с интернетом', 'Забыл пароль', 'Нужна программа'];
  }
  
  const results = analyzeQuery(query);
  for (const result of results.slice(0, 3)) {
    suggestions.push(result.service.name);
  }
  
  return suggestions;
}
