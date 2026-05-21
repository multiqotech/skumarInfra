/**
 * Generate a URL-safe slug from a string.
 * Appends a short random suffix to ensure uniqueness.
 */
const generateSlug = (text) => {
  const base = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

  const suffix = Math.random().toString(36).substring(2, 7);
  return `${base}-${suffix}`;
};

module.exports = { generateSlug };
