import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeImageUrl(url?: string) {
  if (!url) return "/assets/image/not-found/no-image-found.png";
  if (!/\.(jpe?g|png|gif|svg)(\?.*)?$/i.test(url)) {
    return "/assets/image/not-found/no-image-found.png";
  }
  return url;
}
