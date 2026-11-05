// App — корневой компонент приложения.
//
// ЗАДАНИЕ
// --------
// Перенесите свою страницу выбора даты и времени из нативного JS
// на React. У вас уже есть:
//   - готовая вёрстка (HTML);
//   - готовые стили (CSS);
//   - рабочий код на нативном JS (валидация дат, рендер календаря,
//     обработчики кликов, выбор слота).
//
// Теперь нужно то же самое сделать в React.
//
// ЧТО НУЖНО СДЕЛАТЬ
// ------------------
// 1. Разбить страницу на компоненты. Как именно — решайте сами.
//    Обычно выделяют: шапку, подвал, календарь, сетку слотов,
//    нижнюю панель.
//
// 2. Перенести вёрстку из HTML в JSX. Стили оставить как есть,
//    просто положить их в тот же проект (например, в src/styles/
//    или рядом с компонентами).
//
// 3. Заменить нативное состояние (переменные + прямые манипуляции
//    с DOM) на useState. Какие именно данные должны жить в состоянии —
//    подумайте сами. Скорее всего: текущий месяц, выбранный день,
//    выбранное время, массив слотов.
//
// 4. Рендер календаря и слотов делать через JSX и .map(),
//    без innerHTML и querySelector.
//
// 5. Обработчики кликов — через onClick прямо в JSX,
//    без addEventListener.
//
// 6. Функции для работы с датами, которые вы уже написали
//    на нативном JS (построение сетки календаря, сравнение дат,
//    проверка «не раньше сегодня»), можно переиспользовать.
//    Они чистые — не зависят от React. Создайте файл
//    src/utils/date.js и перенесите их туда.
//
//
// ПОДСКАЗКА
// ---------
// Если что-то не работает или непонятно, как перевести нативный
// код на React — вернитесь к лекции. Там разбирались все
// основные приёмы: состояние, пропсы, рендер списков, колбэки.
//
// Ниже — пустой каркас. Здесь можно начать писать.
import { useState } from 'react';
import { MONTHS_GENITIVE } from './utils/dateUtils';
import { getSlotsForDay } from './data/slots';
import Calendar from './components/Calendar';
import TimeSlots from './components/TimeSlots';
import BookingBottomBar from './components/BookingBottomBar';
import './index.css';

const TODAY = new Date();
const TODAY_OBJ = {
  day: TODAY.getDate(),
  month: TODAY.getMonth(),
  year: TODAY.getFullYear()
};

export default function App() {
  const [currentMonth, setCurrentMonth] = useState(TODAY.getMonth());
  const [currentYear, setCurrentYear] = useState(TODAY.getFullYear());
  const [selectedDate, setSelectedDate] = useState(TODAY_OBJ);
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState(getSlotsForDay(TODAY.getDate()));

  // --- Обработчики ---
  const handleDaySelect = (day) => {
    setSelectedDate({ day, month: currentMonth, year: currentYear });
    setSelectedTime(null);
    setSlots(getSlotsForDay(day));
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
    
    // Сбрасываем выбранную дату, время и слоты
    setSelectedDate(null);
    setSelectedTime(null);
    setSlots([]);
  };

  const handleContinue = () => {
    if (!selectedTime) {
      alert('Выберите время');
      return;
    }
    alert(`Вы записаны на ${selectedDate.day} ${MONTHS_GENITIVE[selectedDate.month]} в ${selectedTime}`);
  };

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
            today={TODAY}
            onDaySelect={handleDaySelect}
            onMonthChange={handleMonthChange}
          />
          <TimeSlots
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            slots={slots}
            onTimeSelect={handleTimeSelect}
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