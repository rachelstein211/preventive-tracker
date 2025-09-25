'use client';

import dayjs from 'dayjs';

export function PreventiveCard({
  name,
  nextDue,
  statusPill,
  actions,
}: {
  name: string;
  nextDue: string;
  statusPill?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-[16px] border shadow-sm bg-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[#111827] font-semibold text-base">{name}</div>
          {statusPill ? <div className="mt-1">{statusPill}</div> : null}
          <div className="text-sm text-gray-500 mt-1">
            Next due: {dayjs(nextDue).format('MMM D, YYYY')}
          </div>
        </div>
        <div className="flex flex-col gap-1 text-sm shrink-0">
          {actions}
        </div>
      </div>
    </div>
  );
}