export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-')     // Replace multiple - with single -
}

export function generateGigSlug(title: string, id: string): string {
  return `${slugify(title)}-${id}`
}

export function extractIdFromSlug(slug: string): string {
  const parts = slug.split('-')
  return parts.length > 1 ? parts[parts.length - 1] : slug
}
