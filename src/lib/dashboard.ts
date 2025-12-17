import type { ShiftLog } from "@/data/logs";

export function getTodayLogs(logs: ShiftLog[], today: string) {
  return logs.filter((log) => log.date === today);
}

export function getStreak(logs: ShiftLog[], today: Date) {
  const sorted = [...logs].sort((a, b) => (a.date > b.date ? -1 : 1));
  let streak = 0;
  const cursor = new Date(today);

  for (const log of sorted) {
    const logDate = new Date(log.date);
    if (
      logDate.getFullYear() === cursor.getFullYear() &&
      logDate.getMonth() === cursor.getMonth() &&
      logDate.getDate() === cursor.getDate()
    ) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }
    if (logDate < cursor) break;
  }
  return streak;
}
