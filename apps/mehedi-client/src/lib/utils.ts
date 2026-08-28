import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('');
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatCurrency(amount: number, currency: 'USD' | 'BDT' = 'USD'): string {
  return new Intl.NumberFormat(currency === 'BDT' ? 'en-BD' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function whatsappLink(number: string, prefill?: string): string {
  const digits = number.replace(/[^\d]/g, '');
  const text = prefill ? `?text=${encodeURIComponent(prefill)}` : '';
  return `https://wa.me/${digits}${text}`;
}
