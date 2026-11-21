import LZString from 'lz-string';
import { CardData } from '../types/card';

const HASH_KEY = 'card=';

export function encodeCardData(data: CardData): string {
  try {
    const jsonStr = JSON.stringify(data);
    const compressed = LZString.compressToEncodedURIComponent(jsonStr);
    return compressed;
  } catch (error) {
    console.error('Failed to encode card data:', error);
    return '';
  }
}

export function decodeCardData(encodedStr: string): CardData | null {
  try {
    if (!encodedStr) return null;
    const decompressed = LZString.decompressFromEncodedURIComponent(encodedStr);
    if (!decompressed) return null;
    return JSON.parse(decompressed) as CardData;
  } catch (error) {
    console.error('Failed to decode card data:', error);
    return null;
  }
}

export function generateCardShareUrl(data: CardData): string {
  const encoded = encodeCardData(data);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#${HASH_KEY}${encoded}`;
}

export function getCardDataFromUrl(): CardData | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash;
  if (!hash) return null;

  const match = hash.match(new RegExp(`(?:#|&)${HASH_KEY}([^&]+)`));
  if (match && match[1]) {
    const decoded = decodeCardData(match[1]);
    if (decoded) return decoded;
  }

  return null;
}
