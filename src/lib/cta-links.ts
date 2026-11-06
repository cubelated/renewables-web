export const campaignKeys = [
  "utm_source", "utm_medium", "utm_campaign", "utm_id", "utm_term", "utm_content",
] as const;

const webOrigin = "https://app.renewables.cubelated.com";
const playOrigin = "https://play.google.com";

// Forward explicit campaign tags only, never arbitrary query strings, hashes,
// account IDs, document data, authentication tokens, or advertising click IDs.
export function campaignUrl(destination: string, search: string): string {
  const url = new URL(destination);
  if (url.origin !== webOrigin && url.origin !== playOrigin) return destination;
  const incoming = new URLSearchParams(search);
  const campaign = new URLSearchParams();
  for (const key of campaignKeys) {
    const value = incoming.get(key);
    if (value && /^[a-zA-Z0-9_.~-]{1,100}$/.test(value)) campaign.set(key, value);
  }
  if (!campaign.size) return destination;
  if (url.origin === playOrigin) {
    // Google Play's install referrer keeps the app's package ID intact.
    url.searchParams.set("referrer", campaign.toString());
  } else {
    campaign.forEach((value, key) => url.searchParams.set(key, value));
  }
  return url.toString();
}
