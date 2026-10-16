/**
 * Utility for normalizing, repairing, and safely loading image URLs from all sources
 * (Postimg, Imgur, Google Drive, Unsplash, Cloudinary, Supabase, etc.)
 */

export const FALLBACK_IMAGES = {
  development: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  creative: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  data: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
  cybersecurity: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
  default: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
};

export function getFallbackImage(category?: string): string {
  if (!category) return FALLBACK_IMAGES.default;
  const lower = category.toLowerCase();
  if (lower.includes('creative') || lower.includes('brand') || lower.includes('design') || lower.includes('ui') || lower.includes('ux')) {
    return FALLBACK_IMAGES.creative;
  }
  if (lower.includes('ai') || lower.includes('data') || lower.includes('auto') || lower.includes('bi')) {
    return FALLBACK_IMAGES.data;
  }
  if (lower.includes('cyber') || lower.includes('sec') || lower.includes('audit')) {
    return FALLBACK_IMAGES.cybersecurity;
  }
  if (lower.includes('dev') || lower.includes('web') || lower.includes('app') || lower.includes('engineer')) {
    return FALLBACK_IMAGES.development;
  }
  return FALLBACK_IMAGES.default;
}

/**
 * Normalizes, repairs, and transforms an image URL into a direct, browser-renderable image resource.
 * Handles:
 * - Trimming spaces and carriage returns
 * - Google Drive share/view links -> Direct LH3 stream URLs (lh3.googleusercontent.com/d/FILE_ID)
 * - Dropbox viewer links -> Direct raw streaming URLs (?raw=1)
 * - Imgur gallery/page links -> Direct image file URLs (i.imgur.com/ID.jpg)
 * - GitHub blob links -> raw.githubusercontent.com
 * - Missing protocol prefixes (e.g. "images.unsplash.com/..." -> "https://images.unsplash.com/...")
 */
export function formatImageUrl(rawUrl?: string | null, fallbackCategory?: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return getFallbackImage(fallbackCategory);
  }

  let url = rawUrl.trim();
  if (!url) {
    return getFallbackImage(fallbackCategory);
  }

  // 1. Data URLs and Blob URLs are already local resources
  if (url.startsWith('data:image/') || url.startsWith('blob:')) {
    return url;
  }

  // 2. Local relative root paths (e.g. /assets/logo.png, /contact-illustration.png)
  if (url.startsWith('/') && !url.startsWith('//')) {
    return url;
  }

  // 3. Protocol-relative URLs (//example.com/img.jpg)
  if (url.startsWith('//')) {
    url = `https:${url}`;
  }

  // 4. Missing protocol: prepend https:// if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  // 5. Google Drive Share Links:
  // Examples:
  // https://drive.google.com/file/d/1X2Y3Z.../view?usp=sharing
  // https://drive.google.com/open?id=1X2Y3Z...
  // https://drive.google.com/uc?id=1X2Y3Z...
  if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1];
      // lh3.googleusercontent.com/d/FILE_ID is Google's ultra-reliable, high-speed direct CDN endpoint
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  }

  // 6. Dropbox Links:
  // e.g. https://www.dropbox.com/s/xyz/photo.png?dl=0 -> ?raw=1
  if (url.includes('dropbox.com')) {
    if (url.includes('dl=0')) {
      return url.replace('dl=0', 'raw=1');
    }
    if (!url.includes('raw=1')) {
      return url.includes('?') ? `${url}&raw=1` : `${url}?raw=1`;
    }
  }

  // 7. Imgur Page Links:
  // e.g. https://imgur.com/aBcDeFg -> https://i.imgur.com/aBcDeFg.jpg
  const imgurMatch = url.match(/^https?:\/\/(?:www\.)?imgur\.com\/([a-zA-Z0-9]+)$/);
  if (imgurMatch && imgurMatch[1]) {
    return `https://i.imgur.com/${imgurMatch[1]}.jpg`;
  }

  // 8. GitHub Blob Links:
  // e.g. https://github.com/user/repo/blob/main/img.png -> https://raw.githubusercontent.com/user/repo/main/img.png
  if (url.includes('github.com') && url.includes('/blob/')) {
    return url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
  }

  return url;
}

/**
 * Safe Image error event handler that gracefully replaces broken images
 * with category-appropriate fallbacks without creating infinite error loops.
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackUrl?: string,
  category?: string
) {
  const target = e.currentTarget as HTMLImageElement;
  const fallback = fallbackUrl || getFallbackImage(category);

  // Prevent infinite loops if fallback itself fails
  if (target.src === fallback) {
    return;
  }

  target.onerror = null;
  target.src = fallback;
}
