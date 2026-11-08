import { extractText, getDocumentProxy } from "unpdf";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 3_000_000;
const MAX_PAGES = 10;
const MAX_TEXT_LENGTH = 20_000;

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { error: "Send the PDF as a form upload." },
      { status: 400 },
    );
  }

  const file = formData.get("resume");

  if (Array.from(formData.keys()).length !== 1 || !(file instanceof File)) {
    return Response.json(
      { error: "Upload one PDF resume." },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_BYTES) {
    return Response.json(
      { error: "The PDF must be 3 MB or smaller." },
      { status: 413 },
    );
  }

  const header = await file.slice(0, 5).text();

  if (header !== "%PDF-") {
    return Response.json(
      { error: "The uploaded file is not a valid PDF." },
      { status: 415 },
    );
  }

  try {
    const pdf = await getDocumentProxy(await file.arrayBuffer());

    try {
      if (pdf.numPages > MAX_PAGES) {
        return Response.json(
          { error: `The PDF must have ${MAX_PAGES} pages or fewer.` },
          { status: 422 },
        );
      }

      const { text } = await extractText(pdf, { mergePages: true });
      const cleanedText = text
        .split("\n")
        .map((line) => line.trim())
        .join("\n")
        .trim();

      if (cleanedText.length === 0) {
        return Response.json(
          { error: "No selectable text was found. Use a text-based PDF or paste your resume." },
          { status: 422 },
        );
      }

      return Response.json(
        {
          resumeText: cleanedText.slice(0, MAX_TEXT_LENGTH),
          truncated: cleanedText.length > MAX_TEXT_LENGTH,
        },
        { headers: { "Cache-Control": "no-store" } },
      );
    } finally {
      await pdf.loadingTask.destroy();
    }
  } catch {
    return Response.json(
      { error: "The PDF could not be read. Try exporting a fresh, password-free copy." },
      { status: 422 },
    );
  }
}