// src/lib/ics.ts
import { createEvent } from 'ics';
import dayjs from 'dayjs';

/**
 * Downloads an .ics calendar file for a given item title and due date (ISO string).
 * Keeps typing simple so there are no TypeScript squiggles.
 */
export function downloadIcs(title: string, dueISO: string) {
  // Fallbacks if inputs are odd
  const safeTitle = title?.trim() || 'Preventive item';
  const start = dayjs(dueISO).isValid() ? dayjs(dueISO) : dayjs();

  // Build the event in a TS-friendly way
  const event: any = {
    title: safeTitle,
    start: [start.year(), start.month() + 1, start.date(), 9, 0], // 9:00 AM local
    duration: { hours: 1 },
  };

  createEvent(event, (error: any, value: string | undefined) => {
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