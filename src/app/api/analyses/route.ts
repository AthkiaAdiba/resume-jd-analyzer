import {
  analysisInputSchema,
  sampleReport,
  sampleReportSchema,
} from '@/lib/analysis';

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: 'Send a valid JSON request.' },
      { status: 400 },
    );
  }

  const input = analysisInputSchema.safeParse(body);

  if (!input.success) {
    return Response.json(
      { error: input.error.issues[0]?.message ?? 'Check both fields.' },
      { status: 400 },
    );
  }

  return Response.json(sampleReportSchema.parse(sampleReport));
}