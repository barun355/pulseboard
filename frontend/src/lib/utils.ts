import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}s`
  return `${m}m ${s}s`
}

export function deriveOptionValues(
  options: { id?: string; name: string }[]
): { id?: string; name: string; value: string; order: number }[] {
  const seen = new Map<string, number>()
  return options.map((opt, i) => {
    let value = slugify(opt.name) || `option-${i + 1}`
    const count = seen.get(value) ?? 0
    seen.set(value, count + 1)
    if (count > 0) value = `${value}-${count + 1}`
    return { ...(opt.id ? { id: opt.id } : {}), name: opt.name, value, order: i + 1 }
  })
}
