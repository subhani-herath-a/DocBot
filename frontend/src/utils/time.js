export function generateTimeSlots(startTime, endTime, interval = 30) {
  const slots = [];
  const start = new Date(`1970-01-01T${startTime}:00`);
  const end = new Date(`1970-01-01T${endTime}:00`);

  while (start < end) {
    const time = start.toTimeString().slice(0, 5); // HH:mm
    slots.push(time);
    start.setMinutes(start.getMinutes() + interval);
  }

  return slots;
}
