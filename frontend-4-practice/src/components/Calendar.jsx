import {
  MONTHS_NOMINATIVE,
  DAYS_SHORT,
  buildCalendarGrid,
  isDateSelectable
} from '../utils/dateUtils';

export default function Calendar({
  currentMonth,
  currentYear,
  selectedDate,
  today,
  onDaySelect,
  onMonthChange
}) {
  const weeks = buildCalendarGrid(currentYear, currentMonth);

  return (
    <section className="calendar">
      <div className="calendar__head">
        <h2 className="calendar__title">
          {MONTHS_NOMINATIVE[currentMonth]} {currentYear}
        </h2>
        <div className="calendar__arrows">
          <button
            className="calendar__arrow"
            type="button"
            onClick={() => onMonthChange(-1)}
            aria-label="Предыдущий месяц"
          >
            ‹
          </button>
          <button
            className="calendar__arrow"
            type="button"
            onClick={() => onMonthChange(1)}
            aria-label="Следующий месяц"
          >
            ›
          </button>
        </div>
      </div>

      <div className="calendar__grid">
        {DAYS_SHORT.map((name) => (
          <span key={name} className="calendar__day-name">{name}</span>
        ))}

        {weeks.map((week, weekIndex) =>
          week.map((cell, cellIndex) => {
            const selectable = isDateSelectable(cell.day, currentMonth, currentYear, today);
            const isSelected =
              !cell.otherMonth &&
              selectedDate &&
              cell.day === selectedDate.day &&
              currentMonth === selectedDate.month &&
              currentYear === selectedDate.year;

            let classes = 'calendar__day';
            if (cell.otherMonth || !selectable) classes += ' calendar__day_muted';
            if (isSelected) classes += ' calendar__day_selected';

            return (
              <button
                key={`${weekIndex}-${cellIndex}`}
                className={classes}
                type="button"
                disabled={!selectable || cell.otherMonth}
                onClick={() => onDaySelect(cell.day)}
              >
                {cell.day}
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}