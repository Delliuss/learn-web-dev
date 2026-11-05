import { useState, useEffect } from 'react';
import { MONTHS_GENITIVE } from './utils/dateUtils';
import { fetchToday, fetchSlots } from './api';
import Calendar from './components/Calendar';
import TimeSlots from './components/TimeSlots';
import BookingBottomBar from './components/BookingBottomBar';
import './index.css';

export default function App() {
  // --- Стейт для «Сегодня» (загружается с сервера) ---
  const [today, setToday] = useState(null);
  const [loadingToday, setLoadingToday] = useState(true);
  const [errorToday, setErrorToday] = useState(null);

  // --- Стейт для календаря ---
  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDate, setSelectedDate] = useState(null);

  // --- Стейт для слотов (загружаются с сервера) ---
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errorSlots, setErrorSlots] = useState(null);

  // 1. Загружаем "сегодня" при открытии
  useEffect(() => {
    async function loadToday() {
      try {
        setLoadingToday(true);
        setErrorToday(null);
        const data = await fetchToday();
        setToday(data);
        
        // Инициализируем календарь
        setCurrentMonth(data.month);
        setCurrentYear(data.year);
        setSelectedDate(data);
      } catch (err) {
        setErrorToday(err.message);
      } finally {
        setLoadingToday(false);
      }
    }
    loadToday();
  }, []);

  // 2. Загружаем слоты при смене даты
  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      return;
    }

    // Защита от гонок (если пользователь быстро кликает)
    const controller = new AbortController();

    async function loadSlots() {
      try {
        setLoadingSlots(true);
        setErrorSlots(null);
        setSelectedTime(null); // Сбрасываем время при смене дня

        const response = await fetchSlots(selectedDate);

        // Если пользователь успел кликнуть на другой день, игнорируем устаревший ответ
        if (
          response.date.day !== selectedDate.day ||
          response.date.month !== selectedDate.month ||
          response.date.year !== selectedDate.year
        ) {
          return;
        }

        setSlots(response.slots);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setErrorSlots(err.message);
        }
      } finally {
        setLoadingSlots(false);
      }
    }

    loadSlots();

    // Отменяем запрос, если компонент перерисовывается на другую дату
    return () => controller.abort();
  }, [selectedDate]);

  // --- Обработчики ---
  const handleDaySelect = (day) => {
    setSelectedDate({ day, month: currentMonth, year: currentYear });
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleMonthChange = (direction) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    
    // При смене месяца полностью сбрасываем выбранную дату
    setSelectedDate(null);
    setSelectedTime(null);
    setSlots([]);
  };

  const handleContinue = () => {
    if (!selectedTime) {
      alert('Пожалуйста, выберите время');
      return;
    }
    alert(`Вы записаны на ${selectedDate.day} ${MONTHS_GENITIVE[selectedDate.month]} в ${selectedTime}`);
  };

  // --- Рендер состояний загрузки всего приложения ---
  if (loadingToday) {
    return (
      <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px' }}>
        Загрузка календаря...
      </div>
    );
  }

  if (errorToday) {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'red' }}>
        <p>Ошибка загрузки данных:</p>
        <p>{errorToday}</p>
        <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '10px 20px' }}>Повторить</button>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="header">
        <a className="header__logo" href="#">ТОПОР</a>
        <nav className="header__nav">
          <ul className="nav">
            <li className="nav__item"><a className="nav__link" href="#">Услуги</a></li>
            <li className="nav__item"><a className="nav__link" href="#">Галерея</a></li>
            <li className="nav__item"><a className="nav__link" href="#">Команда</a></li>
            <li className="nav__item"><a className="nav__link" href="#">Отзывы</a></li>
            <li className="nav__item"><a className="nav__link" href="#">Контакты</a></li>
          </ul>
        </nav>
      </header>

      <main className="main">
        <section className="steps">
          <div className="steps__item steps__item_done">
            <span className="steps__num">1</span>
            <span className="steps__line"></span>
          </div>
          <div className="steps__item steps__item_done">
            <span className="steps__num">2</span>
            <span className="steps__line"></span>
          </div>
          <div className="steps__item steps__item_active">
            <span className="steps__num">3</span>
            <span className="steps__line"></span>
          </div>
          <div className="steps__item">
            <span className="steps__num">4</span>
            <span className="steps__line"></span>
          </div>
          <div className="steps__item">
            <span className="steps__num">5</span>
          </div>
        </section>

        <h1 className="main__title">ПЛАНИРОВАНИЕ ВИЗИТА</h1>

        <div className="booking">
          <Calendar
            currentMonth={currentMonth}
            currentYear={currentYear}
            selectedDate={selectedDate}
            today={today}
            onDaySelect={handleDaySelect}
            onMonthChange={handleMonthChange}
          />
          <TimeSlots
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            slots={slots}
            onTimeSelect={handleTimeSelect}
            loading={loadingSlots}
            error={errorSlots}
          />
        </div>

        <BookingBottomBar
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onContinue={handleContinue}
        />
      </main>

      <footer className="footer">
        <div className="footer__brand">
          <p className="footer__tagline">Джентльмены предпочитают</p>
          <p className="footer__logo">ТОПОР</p>
        </div>
        <div className="footer__block">
          <h3 className="footer__heading">Контакты</h3>
          <p className="footer__line">📍 ул. Садовая, 15, Москва</p>
          <p className="footer__line">📞 +7 (495) 123-45-67</p>
        </div>
        <div className="footer__block">
          <h3 className="footer__heading">Режим работы</h3>
          <p className="footer__line">Пн–Пт: 9:00 – 21:00</p>
          <p className="footer__line">Сб–Вс: 10:00 – 19:00</p>
        </div>
        <div className="footer__bottom">
          <p className="footer__copyright">© 2026. Все права защищены.</p>
          <a className="footer__link" href="#">Политика конфиденциальности</a>
        </div>
      </footer>
    </div>
  );
}