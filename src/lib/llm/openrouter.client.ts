import 'server-only';

import { createOpenRouter } from '@openrouter/ai-sdk-provider';

export function getAnalysisModel() {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  const modelId = process.env.OPENROUTER_MODEL?.trim();

  if (!apiKey || !modelId) {
    throw new Error('OpenRouter configuration is missing.');
  }

  return createOpenRouter({ apiKey }).chat(modelId);
}