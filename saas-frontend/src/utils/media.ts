const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

export function resolvePublicImageUrl(pathOrUrl?: string | null): string {
  if (!pathOrUrl) return "https://via.placeholder.com/150";
  const trimmed = String(pathOrUrl).trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const base = SUPABASE_URL?.replace(/\/$/, "");
  const path = trimmed.replace(/^\//, "");
  // Default consultant pictures bucket
  return `${base}/storage/v1/object/public/consultant-pictures/${path}`;
}


