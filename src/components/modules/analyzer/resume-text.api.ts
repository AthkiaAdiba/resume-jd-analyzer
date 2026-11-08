type ResumeTextResponse = {
  resumeText?: unknown;
  error?: unknown;
};

export async function extractResumeText(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await fetch('/api/resume-text', {
    method: 'POST',
    body: formData,
  });

  const result: ResumeTextResponse | null = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    throw new Error(
      typeof result?.error === 'string'
        ? result.error
        : `PDF upload failed (HTTP ${response.status}).`,
    );
  }

  if (typeof result?.resumeText !== 'string') {
    throw new Error('The PDF endpoint did not return resume text.');
  }

  return result.resumeText;
}