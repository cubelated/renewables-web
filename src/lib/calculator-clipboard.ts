/** Called only after the visitor explicitly requests a copy. */
export async function copyResult(text: string, clipboard: Pick<Clipboard, "writeText"> | undefined = globalThis.navigator?.clipboard): Promise<boolean> {
  if (!clipboard || !text) return false;
  try { await clipboard.writeText(text); return true; } catch { return false; }
}
