async function request(url) {
  const response = await fetch(url);

  if (!response.ok) {
    let message = `HTTP error ${response.status}`;
    try {
      const data = await response.json();
      if (data && data.error) message = data.error;
    } catch (e) {
      // Тело не JSON
    }
    throw new Error(message);
  }

  return response.json();
}

export async function fetchToday() {
  return request("/api/booking/today");
}

export async function fetchSlots(date) {
  const url = `/api/slots?day=${date.day}&month=${date.month}&year=${date.year}`;
  return request(url);
}