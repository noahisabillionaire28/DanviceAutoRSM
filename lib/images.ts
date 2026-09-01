import { ALLOWED_IMAGE_HOSTS } from './image-hosts.mjs';

export type ResolvedImage =
  | { kind: 'local'; url: string }
  | { kind: 'remote'; url: string }
  | { kind: 'invalid'; url: null };

const INVALID: ResolvedImage = { kind: 'invalid', url: null };

/**
 * Decide whether an image ref is safe to hand to next/image.
 *
 * This exists because next/image THROWS a hard runtime error for a remote host
 * that is missing from next.config remotePatterns — and onError cannot catch
 * that, because the failure happens while constructing the element rather than
 * while loading it. So an unrecognised host must be rejected here, before
 * <Image> is ever rendered. See components/vehicles/VehicleImage.tsx.
 */
export function resolveVehicleImage(ref: string | null | undefined): ResolvedImage {
  if (!ref || typeof ref !== 'string') return INVALID;

  const trimmed = ref.trim();
  if (!trimmed) return INVALID;

  // Local: served straight from /public, can never be a remotePatterns problem.
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return { kind: 'local', url: trimmed };
  }

  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    let host: string;
    try {
      host = new URL(trimmed).hostname;
    } catch {
      return INVALID;
    }
    return ALLOWED_IMAGE_HOSTS.includes(host)
      ? { kind: 'remote', url: trimmed }
      : INVALID;
  }

  return INVALID;
}

/** First usable image in the array, or null if none resolve. */
export function firstUsableImage(images: string[] | null | undefined): string | null {
  if (!images?.length) return null;
  for (const ref of images) {
    const r = resolveVehicleImage(ref);
    if (r.url) return r.url;
  }
  return null;
}

export function usableImages(images: string[] | null | undefined): string[] {
  if (!images?.length) return [];
  return images
    .map((ref) => resolveVehicleImage(ref).url)
    .filter((u): u is string => u !== null);
}

/** Tiny navy blur used for the fade-in. Inline so it costs no request. */
export const BLUR_DATA_URL =
  'data:image/svg+xml;base64,' +
  Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="6"><rect width="8" height="6" fill="#4E060A"/></svg>',
  ).toString('base64');

export const DEFAULT_CARD_SIZES =
  '(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw';
