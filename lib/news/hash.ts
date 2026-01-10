import { createHash } from 'crypto';

export function hashContent(input: string) {
  return createHash('sha256').update(input).digest('hex');
}
