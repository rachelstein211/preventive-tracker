'use client';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useTracker } from '@/store/useTracker';
import type { Category } from '@/types/preventive';

export default function Library() {
  const router = useRouter();
  const { items, addItem } = useTracker();
  const [form, setForm] = useState({
    name: '',
    category: 'vaccine' as Category,
    frequencyDays: 365,
    lastDone: '',
    guidelineUrl: '',
    notes: '',
  });

  function computeNextDue(last: string, freq: number) {
    return last ? dayjs(last).add(freq, 'day').toISOString() : dayjs().toISOString();
  }

  function add() {
    if (!form.name) return;
    const nextDue = computeNextDue(form.lastDone, form.frequencyDays);

    // Store handles id/createdAt/updatedAt
    addItem({
      name: form.name,
      category: form.category,
      frequencyDays: form.frequencyDays,
      lastDone: form.lastDone ? new Date(form.lastDone).toISOString() : undefined,
      nextDue,
      notes: form.notes || undefined,
      guidelineUrl: form.guidelineUrl || undefined,
    });

    setForm({
      name: '',
      category: 'vaccine',
      frequencyDays: 365,
      lastDone: '',
      guidelineUrl: '',
      notes: '',
    });
    router.push('/');
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight text-[#111827] mb-4">Library</h1>

      <div className="p-4 rounded-[16px] border shadow-sm bg-white mb-6">
        <h2 className="font-semibold text-[#111827] mb-3">Add item</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className="border rounded-md p-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <select
            className="border rounded-md p-2"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
          >
            <option value="vaccine">Vaccine</option>
            <option value="dental">Dental</option>
            <option value="screening">Screening</option>
          </select>
          <input
            className="border rounded-md p-2"
            type="number"
            placeholder="Frequency (days)"
            value={form.frequencyDays}
            onChange={(e) => setForm({ ...form, frequencyDays: +e.target.value })}
          />
          <input
            className="border rounded-md p-2"
            type="date"
            value={form.lastDone}
            onChange={(e) => setForm({ ...form, lastDone: e.target.value })}
          />
          <input
            className="border rounded-md p-2 sm:col-span-2"
            placeholder="Guideline URL (optional)"
            value={form.guidelineUrl}
            onChange={(e) => setForm({ ...form, guidelineUrl: e.target.value })}
          />
          <textarea
            className="border rounded-md p-2 sm:col-span-2"
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
        <button
          onClick={add}
          className="mt-3 px-4 py-2 rounded-full bg-[#0EA5E9] text-white font-semibold"
        >
          Add
        </button>
      </div>

      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.id} className="p-3 rounded-[16px] border shadow-sm bg-white">
            <div className="font-medium text-[#111827]">{it.name}</div>
            <div className="text-sm text-gray-500">
              {it.category} • every {it.frequencyDays} days
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}