'use client';

import dayjs from 'dayjs';
import Link from 'next/link';
import { useMemo } from 'react';
import { useTracker } from '@/store/useTracker';

export default function LogPage() {
  const { items, logs } = useTracker();

  const nameById = useMemo(() => {
    const m = new Map<string, string>();
    items.forEach((i) => m.set(i.id, i.name));
    return m;
  }, [items]);

  const sorted = useMemo(
    () => [...logs].sort((a, b) => b.performedOn.localeCompare(a.performedOn)),
    [logs]
  );

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Log</h1>
        <nav className="flex gap-4 text-sm">
          <Link className="text-[#0EA5E9] hover:underline" href="/">Dashboard</Link>
          <Link className="text-[#0EA5E9] hover:underline" href="/library">Library</Link>
        </nav>
      </header>

      {sorted.length === 0 ? (
        <div className="p-6 rounded-[16px] border shadow-sm bg-white">
          <p className="mb-2 text-[#111827]">No log entries yet.</p>
          <p className="text-sm text-gray-500">Mark an item as done from the Dashboard to see it here.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {sorted.map((l) => (
            <li key={l.id} className="p-4 rounded-[16px] border shadow-sm bg-white">
              <div className="font-medium text-[#111827]">
                {nameById.get(l.itemId) ?? 'Unknown item'}
              </div>
              <div className="text-sm text-gray-500">
                Performed on {dayjs(l.performedOn).format('MMM D, YYYY, h:mm A')}
                {l.notes ? ` • ${l.notes}` : ''}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}