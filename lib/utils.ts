import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getServerRootURL() {
  const url = process.env.NEXT_PUBLIC_API_URL;
  return url ?? "";
}

export function getHeaders() {
  return new Headers({
    "Content-Type": "application/json"
  });
}
