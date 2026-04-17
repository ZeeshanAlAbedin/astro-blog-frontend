import quoteJson from '../quotes.json';
import { sanityClient } from "sanity:client";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";


export function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quoteJson.length);
  return quoteJson[randomIndex];
}

/**
 * Convert YYYY-MM-DD format to "Full Month Name, Date Year" format
 * Example: "2026-01-15" -> "January 15, 2026"
 */
export function formatDateFull(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getSanityImageUrl(image: string)
{
    const { projectId, dataset } = sanityClient.config();
    const urlFor = (source: SanityImageSource) =>
    projectId && dataset
    ? createImageUrlBuilder({ projectId, dataset }).image(source)
    : null;
    
    const postImageUrl = image
    ? urlFor(image)?.width(550).height(310).url()
    : null;

    return postImageUrl;
}

/**
 * Extract and truncate text from Sanity Portable Text blocks
 * Useful for previews/excerpts
 */
export function extractExcerpt(blocks: any[], maxLength: number = 150): string {
  if (!Array.isArray(blocks)) return '';
  
  let text = '';
  
  for (const block of blocks) {
    if (block._type === 'block' && block.children) {
      for (const child of block.children) {
        if (child.text) {
          text += child.text;
          if (text.length >= maxLength) {
            break;
          }
        }
      }
    }
    if (text.length >= maxLength) break;
  }
  
  // Truncate and add ellipsis if needed
  return text.length > maxLength ? text.slice(0, maxLength).trim() + '...' : text;
}