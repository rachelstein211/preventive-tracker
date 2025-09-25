'use client';

import Link from 'next/link';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useTracker } from '@/store/useTracker';
import { downloadIcs } from '@/lib/ics';

export default function Dashboard() {
  const { items } = useTracker();

  // Sort items by next due date (soonest first)
  const sorted = useMemo(
    () => [...items].sort((a, b) => a.nextDue.localeCompare(b.nextDue)),
    [items]
  );

  return (
    <main className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
          Preventive Tracker
        </h1>
        <nav className="flex gap-4 text-sm">
          <Link className="text-[#0EA5E9] hover:underline" href="/library">
            Library
          </Link>
          <Link className="text-[#0EA5E9] hover:underline" href="/log">
            Log
          </Link>
        </nav>
      </header>

      {/* Empty state */}
      {sorted.length === 0 ? (
        <div className="p-6 rounded-[16px] border shadow-sm bg-white">
          <p className="mb-2 text-[#111827]">No items yet.</p>
          <Link className="text-[#0EA5E9] underline" href="/library">
            Add your first item →
          </Link>
        </div>
      ) : (
        // List of items
        <ul className="space-y-3">
          {sorted.map((it) => {
            const days = dayjs(it.nextDue).diff(dayjs(), 'day');
            const status =
              days < 0 ? 'Overdue' : days === 0 ? 'Due today' : `Due in ${days}d`;

            return (
              <li
                key={it.id}
                className="p-4 rounded-[16px] border shadow-sm bg-white flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-[#111827]">{it.name}</div>
                  <div className="text-sm text-gray-500">
                    Next due: {dayjs(it.nextDue).format('MMM D, YYYY')} • {status}
                  </div>
                </div>

                <div className="flex gap-3 text-sm">
                  <Link
                    className="text-[#0EA5E9] hover:underline"
                    href={`/library`}
                  >
                    Edit
                  </Link>
                  <button
                    className="text-[#0EA5E9] hover:underline"
                    onClick={() => downloadIcs(it.name, it.nextDue)}
                  >
                    Add to calendar
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}