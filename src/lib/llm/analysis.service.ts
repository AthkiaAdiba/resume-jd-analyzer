import 'server-only';

import { generateText, NoObjectGeneratedError, Output } from 'ai';
import type { z } from 'zod';
import type { analysisInputSchema } from '@/lib/analysis';
import { analysisInstructions } from './analysis.prompt';
import { analysisDraftSchema } from './analysis.schema';
import { getAnalysisModel } from './openrouter.client';

type AnalysisInput = z.infer<typeof analysisInputSchema>;

export async function generateAnalysisDraft(input: AnalysisInput) {
  const model = getAnalysisModel();
  const prompt = JSON.stringify(input);

  const generate = async (instructions: string) => {
    const { output } = await generateText({
      model,
      instructions,
      prompt,
      output: Output.object({ schema: analysisDraftSchema }),
      maxOutputTokens: 1800,
      maxRetries: 0,
    });

    return output;
  };

  try {
    return await generate(analysisInstructions);
  } catch (error) {
    if (!NoObjectGeneratedError.isInstance(error)) throw error;

    return generate(
      `${analysisInstructions}\nKeep quotes brief and return fewer items if needed.`,
    );
  }
}