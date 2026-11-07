import { z } from 'zod';

export const MAX_CV_LENGTH = 20_000;
export const MAX_JOB_LENGTH = 10_000;

export const analysisInputSchema = z.strictObject({
  resumeText: z
    .string()
    .trim()
    .min(1, 'Paste your CV text.')
    .max(MAX_CV_LENGTH),
  jobDescription: z
    .string()
    .trim()
    .min(1, 'Paste the job description.')
    .max(MAX_JOB_LENGTH),
});

const score = z.number().int().min(0).max(100);

export const sampleReportSchema = z.object({
  kind: z.literal('sample'),
  role: z.string(),
  estimatedScore: score,
  breakdown: z.object({
    skills: score,
    experience: score,
    education: score,
  }),
  matches: z.array(
    z.object({
      requirement: z.string(),
      jobQuote: z.string(),
      cvQuote: z.string(),
    }),
  ),
  gaps: z.array(
    z.object({
      requirement: z.string(),
      jobQuote: z.string(),
    }),
  ),
  suggestion: z.string(),
});

export type SampleReport = z.infer<typeof sampleReportSchema>;

export const sampleInput = {
  resumeText:
    'Built and maintained REST APIs with Node.js and TypeScript. Designed a PostgreSQL schema for a portfolio project.',
  jobDescription:
    'Junior Full-Stack Developer. Build and maintain REST APIs with Node.js and TypeScript. Work with PostgreSQL. Experience with CI/CD pipelines is desirable.',
};

export const sampleReport: SampleReport = {
  kind: 'sample',
  role: 'Junior Full-Stack Developer',
  estimatedScore: 72,
  breakdown: { skills: 76, experience: 66, education: 70 },
  matches: [
    {
      requirement: 'REST APIs',
      jobQuote: 'Build and maintain REST APIs with Node.js and TypeScript.',
      cvQuote: 'Built and maintained REST APIs with Node.js and TypeScript.',
    },
    {
      requirement: 'PostgreSQL',
      jobQuote: 'Work with PostgreSQL.',
      cvQuote: 'Designed a PostgreSQL schema for a portfolio project.',
    },
  ],
  gaps: [
    {
      requirement: 'CI/CD pipelines',
      jobQuote: 'Experience with CI/CD pipelines is desirable.',
    },
  ],
  suggestion:
    'Lead with your REST API project. If you have used CI/CD, add a concrete example of what your pipeline automated.',
};