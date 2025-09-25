'use client';

import Link from 'next/link';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useTracker } from '@/store/useTracker';
import { downloadIcs } from '@/lib/ics';
import { PreventiveCard } from '@/components/PreventiveCard';
import { Button } from '@/components/Button';

export default function Dashboard() {
  const { items, updateItem, logEvent, deleteItem } = useTracker();

  const sorted = useMemo(
    () => [...items].sort((a, b) => a.nextDue.localeCompare(b.nextDue)),
    [items]
  );

  function markDone(id: string, frequencyDays: number) {
    const performedOn = new Date();
    const performedISO = performedOn.toISOString();
    const nextDue = dayjs(performedISO).add(frequencyDays, 'day').toISOString();

    updateItem(id, { lastDone: performedISO, nextDue });
    logEvent({ itemId: id, performedOn: performedISO, notes: 'Completed' });
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
          Preventive Tracker
        </h1>
        <nav className="flex gap-4 text-sm">
          <Link className="text-[#0EA5E9] hover:underline" href="/library">Library</Link>
          <Link className="text-[#0EA5E9] hover:underline" href="/log">Log</Link>
        </nav>
      </header>

      {sorted.length === 0 ? (
        <div className="p-6 rounded-[16px] border shadow-sm bg-white">
          <p className="mb-2 text-[#111827]">No items yet.</p>
          <Link className="text-[#0EA5E9] underline" href="/library">Add your first item →</Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {sorted.map((it) => {
            const days = dayjs(it.nextDue).diff(dayjs(), 'day');
            const status =
              days < 0 ? 'Overdue' : days === 0 ? 'Due today' : `Due in ${days}d`;

            const pillClass =
              days < 0
                ? 'bg-red-100 text-red-800'
                : days <= 7
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800';

            return (
              <li key={it.id}>
                <PreventiveCard
                  name={it.name}
                  nextDue={it.nextDue}
                  statusPill={
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${pillClass}`}>
                      {status}
                    </span>
                  }
                  actions={
                    <>
                      <Button
                        onClick={() => markDone(it.id, it.frequencyDays)}
                        className="!px-3 !py-1 !text-sm !bg-white !text-[#111827] !border !border-gray-300 hover:bg-gray-50"
                      >
                        Mark as done
                      </Button>
                      <button
                        className="text-[#0EA5E9] hover:underline"
                        onClick={() => downloadIcs(it.name, it.nextDue)}
                      >
                        Add to calendar
                      </button>
                      <Link className="text-[#0EA5E9] hover:underline" href="/library">
                        Edit
                      </Link>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => {
                          const ok = confirm(`Delete "${it.name}"? This removes the item and its log entries.`);
                          if (ok) deleteItem(it.id);
                        }}
                      >
                        Delete
                      </button>
                    </>
                  }
                />
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}