import { analysisInputSchema } from '@/lib/analysis';
import { generateAnalysisDraft } from '@/lib/llm/analysis.service';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return Response.json(
      { error: { code: 'not_found', message: 'Route not found.' } },
      { status: 404 },
    );
  }

  const body: unknown = await request.json().catch(() => null);
  const input = analysisInputSchema.safeParse(body);

  if (!input.success) {
    return Response.json(
      {
        error: {
          code: 'invalid_input',
          message: input.error.issues[0]?.message ?? 'Check both fields.',
        },
      },
      { status: 400 },
    );
  }

  if (!process.env.OPENROUTER_API_KEY?.trim() || !process.env.OPENROUTER_MODEL?.trim()) {
    return Response.json(
      { error: { code: 'model_not_configured', message: 'The model is not configured.' } },
      { status: 500 },
    );
  }

  try {
    const draft = await generateAnalysisDraft(input.data);

    return Response.json(draft, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return Response.json(
      {
        error: {
          code: 'generation_failed',
          message: 'Could not generate an analysis draft.',
        },
      },
      { status: 502 },
    );
  }
}