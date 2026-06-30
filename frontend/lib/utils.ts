import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function money(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function compactNumber(value: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function titleCase(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function relativeTime(value: string) {
  const seconds = Math.round((new Date(value).getTime() - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const ranges: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 31_536_000],
    ["month", 2_592_000],
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
  ];
  for (const [unit, size] of ranges) {
    if (Math.abs(seconds) >= size) return formatter.format(Math.round(seconds / size), unit);
  }
  return formatter.format(seconds, "second");
}

export const learningModeLabel = (mode: string) =>
  mode === "database_and_skill_patch" ? "Database + experimental patch" : "Database learning";

const nextActionLabels: Record<string, string> = {
  generate_strategy: "Generate strategy",
  approve_strategy: "Approve strategy",
  create_funding_session: "Create funding session",
  complete_funding: "Confirm funding",
  launch_campaign: "Launch creator discovery",
  approve_creator: "Approve creator",
  send_outreach: "Send creator outreach",
  approve_service_spend: "Approve service spend",
  request_payout: "Review creator payout",
  record_metrics: "Record final metrics",
  review_learning: "Review learning",
};

export function nextActionLabel(action: string) {
  return nextActionLabels[action] ?? titleCase(action);
}

export function apiErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 409) return `${error.message} Reload the latest campaign state and try again.`;
    if (error.status === 422) return error.message || "Check the highlighted values.";
    return error.message;
  }
  return "The request could not be completed. Check system status and retry.";
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
