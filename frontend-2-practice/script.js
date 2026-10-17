// JavaScript для страницы выбора даты и времени.
//
// ЗАДАНИЕ
// ========
// Оживить свою свёрстанную страницу. Скорее всего на ней будет работать:
//   1. При открытии страницы выбрать день по умолчанию.
//   2. По клику на день — день становится выбранным,
//      слоты обновляются.
//   3. По клику на слот — время становится выбранным,
//      попадает в нижнюю панель.
//   4. Стрелки «‹» и «›» листают месяцы.
//   5. Дни раньше «сегодня» нельзя выбрать.
//   6. Нижняя панель обновляется при выборе дня и времени.
//
// ГДЕ ЖИВУТ ДАННЫЕ
// ----------------
// Слотов пока нет с сервера. Захардкодьте массив в этом файле.
// Формат слота: { time: "10:00", available: true }.
// «Сегодня» можно взять из new Date() или захардкодить —
// как удобнее для проверки.
//
// СТРУКТУРА КОДА
// --------------
// Разделите код на смысловые части комментариями:
//   1. Данные (слоты, «сегодня»).
//   2. Состояние (месяц, день, время, слоты).
//   3. Чистые функции (для работы с датами).
//   4. Отрисовка и обработчики.
//   5. Инициализация.
//
// ЧИСТЫЕ ФУНКЦИИ
// --------------
// Если понадобится строить сетку календаря — вот функция,
// которую можно использовать. Она не зависит от DOM,
// просто принимает год и месяц и возвращает массив недель.
//
// function buildCalendarGrid(year, month) {
//   const firstDay = new Date(year, month, 1);
//   const lastDay = new Date(year, month + 1, 0);
//   const daysInMonth = lastDay.getDate();
//   const startDayOfWeek = firstDay.getDay();
//   const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
//   const prevMonthLastDay = new Date(year, month, 0).getDate();
//
//   const cells = [];
//
//   for (let i = offset - 1; i >= 0; i--) {
//     cells.push({ day: prevMonthLastDay - i, otherMonth: true });
//   }
//   for (let d = 1; d <= daysInMonth; d++) {
//     cells.push({ day: d, otherMonth: false });
//   }
//   const totalCells = Math.ceil(cells.length / 7) * 7;
//   let nextDay = 1;
//   while (cells.length < totalCells) {
//     cells.push({ day: nextDay, otherMonth: true });
//     nextDay++;
//   }
//
//   const weeks = [];
//   for (let i = 0; i < cells.length; i += 7) {
//     weeks.push(cells.slice(i, i + 7));
//   }
//   return weeks;
// }

// Начните писать код здесь.

// ============================================================
// 1. ДАННЫЕ, КОТОРЫЕ ПРИХОДЯТ С СЕРВЕРА
// ============================================================
//
// Пока данных нет с настоящего сервера, но по структуре они
// выглядят так, как будто пришли оттуда. Когда появится backend,
// этот блок заменится на fetch-запросы.

// SERVER_DATA — стартовый ответ сервера при открытии страницы.
// today — сегодняшняя дата. slots — слоты по умолчанию.
const SERVER_DATA = {
  today: new Date(),       // настоящая дата, чтобы работали прошлые дни
  slots: [
    { time: '10:00', available: true },
    { time: '11:00', available: false },
    { time: '12:00', available: true },
    { time: '13:00', available: false },
    { time: '14:00', available: true },
    { time: '15:00', available: true },
    { time: '16:00', available: true },
    { time: '17:00', available: true }
  ]
};

// SLOTS_EVEN_DAY — слоты для чётных дней.
// SLOTS_ODD_DAY — слоты для нечётных дней.
// Разные наборы нужны, чтобы при клике на разные дни было видно,
// что слоты действительно обновляются. Когда появится backend,
// эти константы исчезнут, а данные будут приходить с сервера.
const SLOTS_EVEN_DAY = [
  { time: '10:00', available: true },
  { time: '11:00', available: true },
  { time: '12:00', available: false },
  { time: '13:00', available: false },
  { time: '14:00', available: true },
  { time: '15:00', available: true },
  { time: '16:00', available: true },
  { time: '17:00', available: true }
];

const SLOTS_ODD_DAY = [
  { time: '10:00', available: true },
  { time: '11:00', available: false },
  { time: '12:00', available: true },
  { time: '13:00', available: true },
  { time: '14:00', available: true },
  { time: '15:00', available: true },
  { time: '16:00', available: false },
  { time: '17:00', available: true }
];

// ============================================================
// 2. СОСТОЯНИЕ
// ============================================================
//
// BOOKING_STATE описывает то, что меняется при действиях пользователя
// и живёт только в браузере.
const BOOKING_STATE = {
  currentMonth: SERVER_DATA.today.getMonth(),
  currentYear: SERVER_DATA.today.getFullYear(),
  selectedDay: SERVER_DATA.today.getDate(),
  selectedTime: null
};

// ============================================================
// 3. ЛОГИКА ДЛЯ ИМИТАЦИИ РАБОТЫ С СЕРВЕРОМ
// ============================================================
//
// Когда появится backend, эта функция заменится на fetch-запрос.
// Пока она просто возвращает разные слоты для чётных и нечётных дней.
function getSlotsForDay(day, month, year) {
  const isEven = day % 2 === 0;
  const slots = isEven ? SLOTS_EVEN_DAY : SLOTS_ODD_DAY;
  return { day, month, year, slots };
}

// Сохраняем выбранную дату и время в localStorage, чтобы
// использовать их на следующей странице.
function saveSelectedDate(date, time) {
  const raw = localStorage.getItem('topor-booking');
  let booking = {};
  if (raw) {
    try {
      booking = JSON.parse(raw);
    } catch (e) {
      booking = {};
    }
  }
  booking.date = date;
  booking.time = time;
  localStorage.setItem('topor-booking', JSON.stringify(booking));
}

// ============================================================
// 4. ЧИСТЫЕ ФУНКЦИИ И КОНСТАНТЫ
// ============================================================
//
// Чистые — не зависят ни от DOM, ни от проекта. Принимают
// аргументы, возвращают результат. Можно копировать куда угодно.

const MONTHS_NOMINATIVE = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const MONTHS_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

// Порядок как у getDay(): 0 — воскресенье.
const DAYS_OF_WEEK = [
  'Воскресенье', 'Понедельник', 'Вторник', 'Среда',
  'Четверг', 'Пятница', 'Суббота'
];

// Короткие имена для шапки календаря. У нас неделя начинается
// с понедельника.
const DAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

// Сравнение двух дат без времени. Возвращает -1, 0 или 1.
function compareDates(date1, date2) {
  const d1 = new Date(date1.year, date1.month, date1.day);
  const d2 = new Date(date2.year, date2.month, date2.day);
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

// Можно ли выбрать указанный день. Нельзя дни раньше today.
function isDateSelectable(day, month, year) {
  const today = {
    day: SERVER_DATA.today.getDate(),
    month: SERVER_DATA.today.getMonth(),
    year: SERVER_DATA.today.getFullYear()
  };
  return compareDates({ day, month, year }, today) >= 0;
}

// Построение сетки календаря. Возвращает массив недель,
// каждая неделя — массив из 7 ячеек.
// Ячейка: { day, otherMonth }.
function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // getDay(): 0 — воскресенье. Приводим к понедельнику как началу.
  const startDayOfWeek = firstDay.getDay();
  const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  // Последний день предыдущего месяца (числа 28–31).
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const cells = [];

  // Хвост предыдущего месяца
  for (let i = offset - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLastDay - i, otherMonth: true });
  }

  // Дни текущего месяца
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, otherMonth: false });
  }

  // Добиваем до полного числа недель
  const totalCells = Math.ceil(cells.length / 7) * 7;
  let nextDay = 1;
  while (cells.length < totalCells) {
    cells.push({ day: nextDay, otherMonth: true });
    nextDay++;
  }

  // Нарезаем на недели
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

// ============================================================
// 5. ОТРИСОВКА
// ============================================================
//
// Работаем с DOM: формируем HTML-строки, вставляем через innerHTML,
// после вставки вешаем обработчики на новые элементы.

const calendarGrid = document.getElementById('calendarGrid');
const calendarTitle = document.getElementById('calendarTitle');
const slotsGrid = document.getElementById('slotsGrid');
const slotsTitle = document.getElementById('slotsTitle');
const bottomBar = document.getElementById('bottomBar');

function renderCalendar() {
  const year = BOOKING_STATE.currentYear;
  const month = BOOKING_STATE.currentMonth;

  // Заголовок «Май 2026»
  calendarTitle.textContent = MONTHS_NOMINATIVE[month] + ' ' + year;

  const weeks = buildCalendarGrid(year, month);
  const today = SERVER_DATA.today;

  // Собираем HTML строками
  let html = '';

  // Дни недели
  DAYS_SHORT.forEach(function (name) {
    html += '<span class="calendar__day-name">' + name + '</span>';
  });

  // Сами дни
  weeks.forEach(function (week) {
    week.forEach(function (cell) {
      let classes = 'calendar__day';

      // Дни из соседнего месяца — серые
      if (cell.otherMonth) {
        classes += ' calendar__day_muted';
      }

      // Сегодняшний день — жирный (но не выбираем его тут, только класс)
      const isToday =
        !cell.otherMonth &&
        cell.day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      // Выбранный день
      const isSelected =
        !cell.otherMonth &&
        cell.day === BOOKING_STATE.selectedDay &&
        month === BOOKING_STATE.currentMonth &&
        year === BOOKING_STATE.currentYear;

      if (isSelected) classes += ' calendar__day_selected';

      // Прошлые дни — disabled
      const selectable = isDateSelectable(cell.day, month, year);
      const isDisabled = !cell.otherMonth && !selectable;

      // data-атрибуты нужны, чтобы в обработчике понять, на что кликнули
      const dataAttrs =
        'data-day="' + cell.day + '"' +
        ' data-month="' + month + '"' +
        ' data-year="' + year + '"' +
        ' data-selectable="' + (selectable && !cell.otherMonth) + '"';

      const disabledAttr = isDisabled ? 'disabled' : '';

      html +=
        '<button class="' + classes + '" type="button" ' +
        dataAttrs + ' ' + disabledAttr + '>' + cell.day + '</button>';
    });
  });

  calendarGrid.innerHTML = html;

  // Вешаем обработчики только на кликабельные дни
  const selectableCells = calendarGrid.querySelectorAll('[data-selectable="true"]');
  selectableCells.forEach(function (btn) {
    btn.addEventListener('click', onDayClick);
  });
}

function renderTimeSlots() {
  const day = BOOKING_STATE.selectedDay;
  const month = BOOKING_STATE.currentMonth;
  const year = BOOKING_STATE.currentYear;

  // Если день не выбран — заглушка
  if (day === null) {
    slotsTitle.textContent = 'Доступное время';
    slotsGrid.innerHTML = '<p class="slots__empty">Выберите день в календаре</p>';
    return;
  }

  // Заголовок блока слотов: «9 мая»
  slotsTitle.textContent = day + ' ' + MONTHS_GENITIVE[month];

  const slots = SERVER_DATA.slots;

  // Если слотов нет — заглушка
  if (!slots || slots.length === 0) {
    slotsGrid.innerHTML = '<p class="slots__empty">На этот день нет доступного времени</p>';
    return;
  }

  let html = '';
  slots.forEach(function (slot) {
    let classes = 'slot';
    if (!slot.available) {
      classes += ' slot_busy';
    } else if (slot.time === BOOKING_STATE.selectedTime) {
      classes += ' slot_selected';
    }

    const disabledAttr = slot.available ? '' : 'disabled';
    const note = slot.available ? '' : '<br><span class="slot__note">Занято</span>';

    html +=
      '<button class="' + classes + '" type="button" ' +
      'data-time="' + slot.time + '" ' + disabledAttr + '>' +
      slot.time + note + '</button>';
  });

  slotsGrid.innerHTML = html;

  // Обработчики только на доступные слоты
  const availableSlots = slotsGrid.querySelectorAll('.slot:not(.slot_busy)');
  availableSlots.forEach(function (btn) {
    btn.addEventListener('click', onTimeSlotClick);
  });
}

function updateBottomBar() {
  const day = BOOKING_STATE.selectedDay;
  const month = BOOKING_STATE.currentMonth;
  const year = BOOKING_STATE.currentYear;

  // Ничего не выбрано
  if (day === null) {
    bottomBar.innerHTML = 'Выберите дату и время';
    return;
  }

  // Выбран день, но не время
  if (!BOOKING_STATE.selectedTime) {
    bottomBar.innerHTML =
      '<strong>' + day + ' ' + MONTHS_GENITIVE[month] + ' ' + year + '</strong>' +
      ' — выберите время';
    return;
  }

  // Выбрано и день, и время
  const dateObj = new Date(year, month, day);
  const dayName = DAYS_OF_WEEK[dateObj.getDay()];
  const monthName = MONTHS_GENITIVE[month];

  bottomBar.innerHTML =
    '<strong>' + dayName + ', ' + day + ' ' + monthName + ' ' + year + '</strong>' +
    ' • ' + BOOKING_STATE.selectedTime;
}

// ============================================================
// 6. ОБРАБОТЧИКИ
// ============================================================

function onDayClick(event) {
  // event.currentTarget — сама кнопка, а не вложенный элемент
  const btn = event.currentTarget;
  const day = parseInt(btn.dataset.day, 10);
  const month = parseInt(btn.dataset.month, 10);
  const year = parseInt(btn.dataset.year, 10);

  BOOKING_STATE.selectedDay = day;
  BOOKING_STATE.currentMonth = month;
  BOOKING_STATE.currentYear = year;

  // Обязательный сброс времени: на новом дне слоты другие
  BOOKING_STATE.selectedTime = null;

  // «Запрашиваем» слоты у сервера (пока — из имитации)
  const response = getSlotsForDay(day, month, year);
  SERVER_DATA.slots = response.slots;

  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

function onTimeSlotClick(event) {
  const btn = event.currentTarget;
  BOOKING_STATE.selectedTime = btn.dataset.time;
  renderTimeSlots();
  updateBottomBar();
}

function setupMonthNavigation() {
  const prevBtn = document.getElementById('prevMonth');
  const nextBtn = document.getElementById('nextMonth');

  prevBtn.addEventListener('click', function () {
    BOOKING_STATE.currentMonth -= 1;
    if (BOOKING_STATE.currentMonth < 0) {
      BOOKING_STATE.currentMonth = 11;
      BOOKING_STATE.currentYear -= 1;
    }
    // Выбранный день сбрасываем, если он не в этом месяце
    BOOKING_STATE.selectedDay = null;
    BOOKING_STATE.selectedTime = null;
    renderCalendar();
    renderTimeSlots();
    updateBottomBar();
  });

  nextBtn.addEventListener('click', function () {
    BOOKING_STATE.currentMonth += 1;
    if (BOOKING_STATE.currentMonth > 11) {
      BOOKING_STATE.currentMonth = 0;
      BOOKING_STATE.currentYear += 1;
    }
    BOOKING_STATE.selectedDay = null;
    BOOKING_STATE.selectedTime = null;
    renderCalendar();
    renderTimeSlots();
    updateBottomBar();
  });
}

function setupContinueButton() {
  const btn = document.getElementById('continueBtn');
  btn.addEventListener('click', function () {
    if (!BOOKING_STATE.selectedDay) {
      alert('Пожалуйста, выберите дату');
      return;
    }
    if (!BOOKING_STATE.selectedTime) {
      alert('Пожалуйста, выберите время');
      return;
    }

    saveSelectedDate(
      {
        day: BOOKING_STATE.selectedDay,
        month: BOOKING_STATE.currentMonth,
        year: BOOKING_STATE.currentYear
      },
      BOOKING_STATE.selectedTime
    );

    alert(
      'Вы записаны на ' +
      BOOKING_STATE.selectedDay + ' ' +
      MONTHS_GENITIVE[BOOKING_STATE.currentMonth] + ' ' +
      BOOKING_STATE.currentYear +
      ' в ' + BOOKING_STATE.selectedTime
    );
  });
}

// ============================================================
// 7. ИНИЦИАЛИЗАЦИЯ
// ============================================================

function init() {
  // Начальное состояние — из SERVER_DATA
  const today = SERVER_DATA.today;
  BOOKING_STATE.currentMonth = today.getMonth();
  BOOKING_STATE.currentYear = today.getFullYear();
  BOOKING_STATE.selectedDay = today.getDate();
  BOOKING_STATE.selectedTime = null;

  // Слоты на сегодня
  const response = getSlotsForDay(
    BOOKING_STATE.selectedDay,
    BOOKING_STATE.currentMonth,
    BOOKING_STATE.currentYear
  );
  SERVER_DATA.slots = response.slots;

  // Первый рендер
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();

  // Обработчики на стрелки и кнопку
  setupMonthNavigation();
  setupContinueButton();
}

// Запуск, когда DOM готов
document.addEventListener('DOMContentLoaded', init);