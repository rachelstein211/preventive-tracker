export type Category = 'vaccine' | 'dental' | 'screening';

export type PreventiveItem = {
  id: string;
  name: string;
  category: Category;
  frequencyDays: number; // e.g., 365 for annual
  lastDone?: string;     // ISO date
  nextDue: string;       // ISO date
  notes?: string;
  guidelineUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type LogEntry = {
  id: string;
  itemId: string;
  performedOn: string;   // ISO date
  notes?: string;
  createdAt: string;
};