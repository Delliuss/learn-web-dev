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
import {
  MONTHS_NOMINATIVE,
  MONTHS_GENITIVE,
  DAYS_OF_WEEK,
  DAYS_SHORT,
  buildCalendarGrid,
  isDateSelectable
} from './utils/dateUtils';
import { getSlotsForDay } from './data/slots';
import './index.css';

// «Сегодня» выносим за пределы компонента
const TODAY = new Date();

function App() {
  // --- СОСТОЯНИЕ ---
  const [currentMonth, setCurrentMonth] = useState(TODAY.getMonth());
  const [currentYear, setCurrentYear] = useState(TODAY.getFullYear());
  
  // Храним полную дату, а не просто число
  const [selectedDate, setSelectedDate] = useState({
    day: TODAY.getDate(),
    month: TODAY.getMonth(),
    year: TODAY.getFullYear()
  });
  
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState(getSlotsForDay(TODAY.getDate()));

  // --- ОБРАБОТЧИКИ ---
  const handleDayClick = (day) => {
    // При клике сохраняем день, текущий месяц и год
    setSelectedDate({ day, month: currentMonth, year: currentYear });
    setSelectedTime(null); // Сброс времени
    setSlots(getSlotsForDay(day));
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedTime(null); 
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedTime(null);
  };

  // --- ВЫЧИСЛЯЕМЫЕ ЗНАЧЕНИЯ ---
  const weeks = buildCalendarGrid(currentYear, currentMonth);

  let bottomBarText = 'Выберите дату и время';
  if (selectedDate) {
    const monthName = MONTHS_GENITIVE[selectedDate.month];
    
    if (selectedTime) {
      const dateObj = new Date(selectedDate.year, selectedDate.month, selectedDate.day);
      const dayName = DAYS_OF_WEEK[dateObj.getDay()];
      bottomBarText = (
        <>
          <strong>{dayName}, {selectedDate.day} {monthName} {selectedDate.year}</strong> • {selectedTime}
        </>
      );
    } else {
      bottomBarText = (
        <>
          <strong>{selectedDate.day} {monthName} {selectedDate.year}</strong> — выберите время
        </>
      );
    }
  }

  // --- РЕНДЕР ---
  return (
    <div className="page">
      {/* Шапка */}
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
        {/* Шаги */}
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
          {/* Календарь */}
          <section className="calendar">
            <div className="calendar__head">
              <h2 className="calendar__title">
                {MONTHS_NOMINATIVE[currentMonth]} {currentYear}
              </h2>
              <div className="calendar__arrows">
                <button className="calendar__arrow" type="button" onClick={handlePrevMonth} aria-label="Предыдущий месяц">‹</button>
                <button className="calendar__arrow" type="button" onClick={handleNextMonth} aria-label="Следующий месяц">›</button>
              </div>
            </div>

            <div className="calendar__grid">
              {/* Дни недели */}
              {DAYS_SHORT.map((name) => (
                <span key={name} className="calendar__day-name">{name}</span>
              ))}

              {/* Сетка дней */}
              {weeks.map((week, weekIndex) => (
                week.map((cell, cellIndex) => {
                  const selectable = isDateSelectable(cell.day, currentMonth, currentYear, TODAY);
                  
                  // Проверяем, совпадает ли ячейка с сохраненной полной датой
                  const isSelected = 
                    !cell.otherMonth && 
                    cell.day === selectedDate.day && 
                    currentMonth === selectedDate.month && 
                    currentYear === selectedDate.year;
                  
                  let classes = 'calendar__day';
                  if (cell.otherMonth || !selectable) {
                    classes += ' calendar__day_muted';
                  }
                  if (isSelected) {
                    classes += ' calendar__day_selected';
                  }

                  return (
                    <button
                      key={`${weekIndex}-${cellIndex}`}
                      className={classes}
                      type="button"
                      disabled={!selectable || cell.otherMonth}
                      onClick={() => handleDayClick(cell.day)}
                    >
                      {cell.day}
                    </button>
                  );
                })
              ))}
            </div>
          </section>

          {/* Слоты */}
          <section className="slots">
            <h2 className="slots__title">
              {selectedDate ? `${selectedDate.day} ${MONTHS_GENITIVE[selectedDate.month]}` : 'Доступное время'}
            </h2>
            <div className="slots__grid">
              {!selectedDate ? (
                <p className="slots__empty">Выберите день в календаре</p>
              ) : slots.length === 0 ? (
                <p className="slots__empty">На этот день нет доступного времени</p>
              ) : (
                slots.map((slot) => {
                  let slotClass = 'slot';
                  if (!slot.available) slotClass += ' slot_busy';
                  else if (slot.time === selectedTime) slotClass += ' slot_selected';

                  return (
                    <button
                      key={slot.time}
                      className={slotClass}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => handleTimeClick(slot.time)}
                    >
                      {slot.time}
                      {!slot.available && <><br /><span className="slot__note">Занято</span></>}
                    </button>
                  );
                })
              )}
            </div>
          </section>
        </div>

        {/* Нижняя панель */}
        <div className="bottom-bar">
          <div className="bottom-bar__info">
            <p className="bottom-bar__line">{bottomBarText}</p>
          </div>
          <button className="button button_primary" type="button" onClick={() => {
            if (!selectedTime) return alert('Выберите время');
            alert(`Вы записаны на ${selectedDate.day} ${MONTHS_GENITIVE[selectedDate.month]} в ${selectedTime}`);
          }}>
            Продолжить
          </button>
        </div>
      </main>

      {/* Подвал */}
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

export default App;