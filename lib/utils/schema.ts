import { z } from 'zod'

/**
 * Returns a Set of field names that are NOT optional in the given z.object() schema.
 * Used to auto-derive required indicators on forms.
 */
export function getRequiredFields<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
): Set<string> {
  const set = new Set<string>()
  for (const [key, field] of Object.entries(schema.shape)) {
    if (!(field instanceof z.ZodOptional)) set.add(key)
  }
  return set
}
