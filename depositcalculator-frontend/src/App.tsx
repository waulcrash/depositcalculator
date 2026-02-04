import React, { useState } from 'react';
import './App.css';

// Типы данных
interface DepositRequest {
  amount: number;
  months: number;
  rate: number;
}

interface DepositResponse {
  total: number;
  profit: number;
}

const App: React.FC = () => {
  // Состояние формыа
  const [formData, setFormData] = useState({
    amount: '100000',
    months: '12',
    rate: '8.5',
  });

  // Состояние результатов
  const [result, setResult] = useState<DepositResponse | null>(null);
  
  // Состояние загрузки
  const [isLoading, setIsLoading] = useState(false);
  
  // Состояние ошибок
  const [error, setError] = useState<string | null>(null);
  
  // Состояние валидации
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Функция для преобразования строки в число с проверкой
  const parseNumber = (value: string): number => {
    // Запятая на точку 
    const normalizedValue = value.replace(',', '.');
    const num = parseFloat(normalizedValue);
    return isNaN(num) ? 0 : num;
  };

  // Валидация формы
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const amountNum = parseNumber(formData.amount);
    const monthsNum = parseNumber(formData.months);
    const rateNum = parseNumber(formData.rate);

    if (!formData.amount || amountNum <= 0) {
      newErrors.amount = 'Сумма должна быть больше 0';
    } else if (amountNum < 1000) {
      newErrors.amount = 'Минимальная сумма: 1 000 рублей';
    } else if (amountNum > 10000000) {
      newErrors.amount = 'Максимальная сумма: 10 000 000 рублей';
    }

    if (!formData.months || monthsNum <= 0) {
      newErrors.months = 'Срок должен быть больше 0';
    } else if (monthsNum < 1) {
      newErrors.months = 'Минимальный срок: 1 месяц';
    } else if (monthsNum > 60) {
      newErrors.months = 'Максимальный срок: 60 месяцев';
    }

    if (!formData.rate || rateNum <= 0) {
      newErrors.rate = 'Ставка должна быть больше 0';
    } else if (rateNum < 1) {
      newErrors.rate = 'Минимальная ставка: 1%';
    } else if (rateNum > 20) {
      newErrors.rate = 'Максимальная ставка: 20%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработка отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Data для отправки
      const requestData: DepositRequest = {
        amount: parseNumber(formData.amount),
        months: parseNumber(formData.months),
        rate: parseNumber(formData.rate),
      };

      const response = await fetch('http://localhost:8080/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Ошибка валидации данных');
        }
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const data: DepositResponse = await response.json();
      setResult(data);
      
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Произошла ошибка при расчете. Проверьте подключение к серверу.';
      setError(errorMessage);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Обработка изменения полей ввода
  const handleInputChange = (field: string, value: string) => {
    // Разрешения на символы
    const cleanedValue = value.replace(/[^0-9.,]/g, '');
    
    setFormData(prev => ({
      ...prev,
      [field]: cleanedValue,
    }));
    
    // Очищаем ошибку при вводе
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (error) setError(null);
  };

  // Форматирование чисел
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="app-container">
      {/* заголовок */}
      <div className="app-title">
        <h1>Калькулятор вклада</h1>
        <p>Рассчитайте доходность вклада с капитализацией процентов</p>
      </div>

      {/* ошибка */}
      {error && (
        <div className="error-message">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/*форма */}
      <form className="calculator-form" onSubmit={handleSubmit}>
        {/*сумма вклада */}
        <div className="form-group">
          <label className="form-label" htmlFor="amount">
            Сумма вклада (₽)
          </label>
          <input
            id="amount"
            type="text"
            inputMode="decimal"
            className="form-input"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            placeholder="100000"
          />
          {errors.amount && (
            <div className="form-error">
              <span>⚠️</span>
              <span>{errors.amount}</span>
            </div>
          )}
          <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>
            Примеры: 100000, 50000.50, 1 000 000
          </div>
        </div>

        {/* срок вклада */}
        <div className="form-group">
          <label className="form-label" htmlFor="months">
            Срок вклада (месяцев)
          </label>
          <input
            id="months"
            type="number"
            className="form-input"
            value={formData.months}
            onChange={(e) => handleInputChange('months', e.target.value)}
            placeholder="12"
            min="1"
            max="60"
            step="1"
          />
          {errors.months && (
            <div className="form-error">
              <span>⚠️</span>
              <span>{errors.months}</span>
            </div>
          )}
          <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>
            От 1 до 60 месяцев (1-5 лет)
          </div>
        </div>

        {/*процентная ставка */}
        <div className="form-group">
          <label className="form-label" htmlFor="rate">
            Годовая процентная ставка (%)
          </label>
          <input
            id="rate"
            type="text"
            inputMode="decimal"
            className="form-input"
            value={formData.rate}
            onChange={(e) => handleInputChange('rate', e.target.value)}
            placeholder="8.5"
          />
          {errors.rate && (
            <div className="form-error">
              <span>⚠️</span>
              <span>{errors.rate}</span>
            </div>
          )}
          <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>
            Примеры: 8.5, 7.25, 10.75
          </div>
        </div>

        {/*кнопка отправки */}
        <button
          type="submit"
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              Рассчитываем...
            </>
          ) : (
            'Рассчитать доход'
          )}
        </button>
      </form>

      {/*результаты */}
      {result && (
        <div className="results-container">
          <h2 className="results-title">Результаты расчета</h2>
          
          <div className="result-item">
            <span className="result-label">Начальная сумма:</span>
            <span className="result-value">
              {formatCurrency(parseNumber(formData.amount))} ₽
            </span>
          </div>
          
          <div className="result-item">
            <span className="result-label">Итоговая сумма:</span>
            <span className="result-value result-total">
              {formatCurrency(result.total)} ₽
            </span>
          </div>
          
          <div className="result-item">
            <span className="result-label">Доход от вклада:</span>
            <span className="result-value result-profit">
              +{formatCurrency(result.profit)} ₽
            </span>
          </div>
          
          <div className="result-item">
            <span className="result-label">Процент дохода:</span>
            <span className="result-value">
              {((result.profit / parseNumber(formData.amount)) * 100).toFixed(2)}%
            </span>
          </div>
        </div>
      )}

      {/*информация о формуле для удобства*/}
      <div className="formula-info">
        <h3>Как рассчитывается доход?</h3>
        <p>
          Расчет производится по формуле сложных процентов с ежемесячной капитализацией:
        </p>
        <div className="formula">
          Итог = Сумма × (1 + Ставка/100/12)<sup>Срок_в_месяцах</sup>
        </div>
        <p className="formula-note">
          * Капитализация означает, что проценты начисляются не только на начальную сумму, 
          но и на уже начисленные проценты.
        </p>
      </div>
    </div>
  );
};

export default App;