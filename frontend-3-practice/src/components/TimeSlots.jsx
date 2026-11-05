import { MONTHS_GENITIVE } from '../utils/dateUtils';

export default function TimeSlots({
  selectedDate,
  selectedTime,
  slots,
  onTimeSelect
}) {
  const title = selectedDate
    ? `${selectedDate.day} ${MONTHS_GENITIVE[selectedDate.month]}`
    : 'Доступное время';

  return (
    <section className="slots">
      <h2 className="slots__title">{title}</h2>
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
                onClick={() => onTimeSelect(slot.time)}
              >
                {slot.time}
                {!slot.available && (
                  <>
                    <br />
                    <span className="slot__note">Занято</span>
                  </>
                )}
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}