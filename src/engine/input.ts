export const MAX_MESSAGE_BYTES = 256 * 1024;

export type ValidationResult = { ok: true } | { ok: false; error: string };

export function validateMessage(source: string): ValidationResult {
  if (!source.trim()) return { ok: false, error: 'Paste an email message before analyzing.' };
  if (new TextEncoder().encode(source).byteLength > MAX_MESSAGE_BYTES) {
    return { ok: false, error: `Message exceeds the ${MAX_MESSAGE_BYTES / 1024} KiB limit.` };
  }
  return { ok: true };
}
