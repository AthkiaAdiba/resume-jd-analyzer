import { z } from 'zod';

const rating = z.number().int().min(0).max(100);
const requirement = z.string().min(1).max(160);
const quote = z.string().min(1).max(300);

export const analysisDraftSchema = z.object({
  role: z.string().min(1).max(120),
  breakdown: z.object({
    skills: rating,
    experience: rating,
    education: rating,
  }),
  matches: z.array(
    z.object({ requirement, jobQuote: quote, cvQuote: quote }),
  ).max(8),
  gaps: z.array(
    z.object({ requirement, jobQuote: quote }),
  ).max(8),
});