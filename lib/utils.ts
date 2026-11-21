import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSafeRedirectUrl(target: string | null | undefined, defaultUrl = "/"): string {
  if (!target || typeof target !== "string") return defaultUrl;
  const trimmed = target.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return defaultUrl;

  // Reject ASCII control characters (CR, LF, Tab, etc.) and null bytes
  if (/[\x00-\x1F\x7F]/.test(trimmed)) return defaultUrl;

  // Reject encoded control characters, backslashes, or protocol-relative sequences
  if (/%0[0-9a-fA-F]|%1[0-9a-fA-F]|%7[fF]|%5[cC]|%2[fF]%2[fF]/.test(trimmed)) return defaultUrl;
  if (trimmed.includes("\\")) return defaultUrl;

  try {
    const dummyOrigin = "http://fixmate.local";
    const parsed = new URL(trimmed, dummyOrigin);
    // Ensure origin, protocol, and host did not shift to an external destination
    if (parsed.origin !== dummyOrigin || parsed.protocol !== "http:" || parsed.host !== "fixmate.local") {
      return defaultUrl;
    }
    const resolvedPath = parsed.pathname + parsed.search + parsed.hash;
    if (!resolvedPath.startsWith("/") || resolvedPath.startsWith("//") || resolvedPath.includes("\\")) {
      return defaultUrl;
    }
    return resolvedPath;
  } catch {
    return defaultUrl;
  }
}

export function formatCalendarDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, year, month, day] = match;
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  }
  return dateStr;
}
