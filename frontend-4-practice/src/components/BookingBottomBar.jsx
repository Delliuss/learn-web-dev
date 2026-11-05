import { MONTHS_GENITIVE, DAYS_OF_WEEK } from '../utils/dateUtils';

export default function BookingBottomBar({
  selectedDate,
  selectedTime,
  onContinue
}) {
  let text = 'Выберите дату и время';

  if (selectedDate) {
    const monthName = MONTHS_GENITIVE[selectedDate.month];
    const dateObj = new Date(selectedDate.year, selectedDate.month, selectedDate.day);
    const dayName = DAYS_OF_WEEK[dateObj.getDay()];

    if (selectedTime) {
      text = (
        <>
          <strong>{dayName}, {selectedDate.day} {monthName} {selectedDate.year}</strong> • {selectedTime}
        </>
      );
    } else {
      text = (
        <>
          <strong>{dayName}, {selectedDate.day} {monthName} {selectedDate.year}</strong> — выберите время
        </>
      );
    }
  }

  return (
    <div className="bottom-bar">
      <div className="bottom-bar__info">
        <p className="bottom-bar__line">{text}</p>
      </div>
      <button className="button button_primary" type="button" onClick={onContinue}>
        Продолжить
      </button>
    </div>
  );
}