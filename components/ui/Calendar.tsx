'use client';

import React, { useState } from 'react';
import type { JSX } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import type { Locale } from 'date-fns';

interface CalendarProps {
  mode: 'single';
  selected: Date | null;
  onSelect: (date: Date) => void;
  locale?: Locale;
  className?: string;
  disabled?: (date: Date) => boolean;
}

export function Calendar({
  mode,
  selected,
  onSelect,
  locale,
  className = '',
  disabled,
}: CalendarProps) {
  // Use current date as fallback locale if not provided.
  const currentLocale = locale || undefined;
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<Date>(
    selected ? new Date(selected.getFullYear(), selected.getMonth()) : new Date(today.getFullYear(), today.getMonth())
  );

  // Define header date format (e.g. "September 2023")
  const headerDateFormat = 'MMMM yyyy';
  // Define day number format (e.g. "1", "2", etc.)
  const dayFormat = 'd';

  // Calculate the start and end dates for the grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { locale: currentLocale });
  const endDate = endOfWeek(monthEnd, { locale: currentLocale });

  const rows = [];
  let days: JSX.Element[] = [];
  let day = startDate;

  // Build the calendar grid (weeks)
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, dayFormat, { locale: currentLocale });
      const cloneDay = day;
      const isDisabled = disabled ? disabled(cloneDay) : false;
      const isSelected = selected ? isSameDay(day, selected) : false;
      days.push(
        <div
          key={day.toISOString()}
          className={`w-10 h-10 flex items-center justify-center text-sm cursor-pointer 
            ${!isSameMonth(day, monthStart) ? 'text-gray-400' : 'text-gray-800'} 
            ${isSelected ? 'bg-indigo-600 text-white rounded-full' : 'hover:bg-gray-200 rounded-full'}
            ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => {
            if (!isDisabled) {
              onSelect(cloneDay);
            }
          }}
        >
          {formattedDate}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toISOString()} className="grid grid-cols-7 gap-2">
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className={`p-2 ${className}`}>
      {/* Header with navigation */}
      <div className="flex justify-between items-center mb-2">
        <button
          type="button"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-1"
        >
          &lt;
        </button>
        <div className="font-semibold">
          {format(currentMonth, headerDateFormat, { locale: currentLocale })}
        </div>
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-1"
        >
          &gt;
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {['日', '月', '火', '水', '木', '金', '土'].map((dayName, index) => (
          <div key={index} className="text-center font-medium text-gray-600">
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div>{rows}</div>
    </div>
  );
}