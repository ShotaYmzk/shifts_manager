// lib/utils/date.ts
export function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
  export function parseTime(time: string): Date {
    return new Date(`1970-01-01T${time}:00`);
  }