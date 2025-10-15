/**
 * Generate SEO-friendly slug from product title and ID
 * @param title - Product title
 * @param id - Product numeric ID or documentId
 * @returns URL-safe slug (e.g., "remera-dry-fit-premium-123")
 */
export function generateProductSlug(title: string, id: string | number): string {
  const sanitizedTitle = title
    .toLowerCase()
    .normalize('NFD') // Normalize to decomposed form
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics/accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove consecutive hyphens

  return `${sanitizedTitle}-${id}`;
}

/**
 * Extract product ID from slug
 * @param slug - URL slug (e.g., "remera-dry-fit-premium-abc123")
 * @returns Product documentId (e.g., "abc123")
 */
export function extractProductId(slug: string): string {
  const parts = slug.split('-');
  return parts[parts.length - 1];
}

/**
 * Validate slug format
 * @param slug - URL slug
 * @returns Boolean indicating valid format
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') {
    return false;
  }

  // Must contain at least one hyphen (to separate title from ID)
  if (!slug.includes('-')) {
    return false;
  }

  // Check for valid characters (lowercase alphanumeric and hyphens only)
  const validPattern = /^[a-z0-9-]+$/;
  return validPattern.test(slug);
}
