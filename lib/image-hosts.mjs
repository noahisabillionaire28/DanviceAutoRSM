// Single source of truth for remote image hosts.
// Imported by BOTH next.config.mjs (remotePatterns) and lib/images.ts (runtime guard)
// so the two can never drift. A host missing from remotePatterns makes next/image
// throw at render time, which onError cannot catch — see lib/images.ts.
export const ALLOWED_IMAGE_HOSTS = [
  'spanropvanyhskbrcwab.supabase.co',
  'upload.wikimedia.org',
  // The Commons imageinfo API returns thumburl on this host rather than
  // upload.wikimedia.org. Missing it here would make resolveVehicleImage
  // reject the URL and silently render the placeholder instead.
  'thumb.wikimedia.org',
];
