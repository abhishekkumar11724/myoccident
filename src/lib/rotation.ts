import { LAUNCH_DATE } from '@/themes/order';

const IST_OFFSET_MS = 5.5 * 3600 * 1000;
const dayNumber = (ms: number) => Math.floor((ms + IST_OFFSET_MS) / 86400000); // IST calendar day

/** Index into `ids` for the given moment. Same for every visitor on the same IST day. */
export function styleIndexFor(count: number, now: number = Date.now()): number {
  const launch = dayNumber(Date.parse(`${LAUNCH_DATE}T00:00:00+05:30`));
  const n = dayNumber(now) - launch;
  return ((n % count) + count) % count;
}
export const styleOfTheDay = (ids: string[], now?: number) => ids[styleIndexFor(ids.length, now)];
