// src/lib/ics.ts
import { createEvent } from 'ics';
import type { EventAttributes, DateArray } from 'ics';
import dayjs from 'dayjs';

/** Downloads an .ics calendar file for a given title and due date (ISO). */
export function downloadIcs(title: string, dueISO: string) {
  const safeTitle = (title ?? '').trim() || 'Preventive item';
  const start = dayjs(dueISO).isValid() ? dayjs(dueISO) : dayjs();

  const startArr: DateArray = [
    start.year(),
    start.month() + 1, // 1-based months
    start.date(),
    9, // 9:00 AM
    0,
  ];

  const event: EventAttributes = {
    title: safeTitle,
    start: startArr,
    duration: { hours: 1 },
  };

  createEvent(event, (error: Error | undefined, value: string | undefined) => {
    if (error || !value) {
      console.error('ICS creation error:', error);
      return;
    }
    const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeTitle}.ics`;
    a.click();

    URL.revokeObjectURL(url);
  });
}