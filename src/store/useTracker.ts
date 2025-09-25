'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PreventiveItem, LogEntry } from '@/types/preventive';

type State = {
  items: PreventiveItem[];
  logs: LogEntry[];
  addItem: (i: Omit<PreventiveItem, 'id'|'createdAt'|'updatedAt'>) => void;
  updateItem: (id: string, patch: Partial<PreventiveItem>) => void;
  deleteItem: (id: string) => void;
  logEvent: (l: Omit<LogEntry, 'id'|'createdAt'>) => void;
};

export const useTracker = create<State>()(
  persist(
    (set, get) => ({
      items: [],
      logs: [],
      addItem: (i) =>
        set((s) => ({
          items: [
            ...s.items,
            {
              ...i,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),
      updateItem: (id, patch) =>
        set((s) => ({
          items: s.items.map((it) =>
            it.id === id
              ? { ...it, ...patch, updatedAt: new Date().toISOString() }
              : it
          ),
        })),
      deleteItem: (id) =>
        set((s) => ({
          items: s.items.filter((it) => it.id !== id),
          logs: s.logs.filter((l) => l.itemId !== id),
        })),
      logEvent: (l) =>
        set((s) => ({
          logs: [
            ...s.logs,
            { ...l, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
          ],
        })),
    }),
    {
      name: 'preventive-tracker',
      storage: createJSONStorage(() => localStorage),
    }
  )
);