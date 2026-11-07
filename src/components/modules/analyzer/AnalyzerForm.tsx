'use client';

import { useState, type FormEvent } from 'react';
import { Inter } from 'next/font/google';
import {
  ArrowRight, Check, CircleCheck, FileText, LockKeyhole, Shield, Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  analysisInputSchema, MAX_CV_LENGTH, MAX_JOB_LENGTH,
  sampleInput, sampleReportSchema, type SampleReport,
} from '@/lib/analysis';
import AnalysisReport from './AnalysisReport';
import AnalyzerNavbar from './AnalyzerNavbar';

const inter = Inter({ subsets: ['latin'], display: 'swap' });
const frame = 'mx-auto max-w-[1184px] px-4 sm:px-8';
const caption = 'text-[13px] leading-[19.5px] text-[#596273]';
const field = 'h-56 resize-y rounded-[14px] border-[#8A94A6] bg-white px-4 py-3.5 text-sm leading-[1.55] text-[#111827] placeholder:text-[#6B7280]';
const marker = 'grid size-[26px] shrink-0 place-items-center rounded-full bg-[#111827] text-[13px] text-white';
const pdfMessage = 'PDF upload comes in the next feature. Choose Paste text to try the sample analysis.';
const benefits = [
  { Icon: FileText, title: 'Evidence for every point', text: 'Each score and each gap points to the exact words in your CV or the job posting.' },
  { Icon: CircleCheck, title: 'Never invents experience', text: 'Rewrite suggestions only reword facts that are already in your CV.' },
  { Icon: Shield, title: 'Private by default', text: 'Your PDF is read in memory and not stored. Saved results expire automatically.' },
];

export default function AnalyzerForm() {
  const [mode, setMode] = useState<'pdf' | 'text'>('pdf');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [report, setReport] = useState<SampleReport | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  async function requestReport(input: typeof sampleInput) {
    setError('');
    setPending(true);
    try {
      const response = await fetch('/api/analyses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error('Analysis request failed');
      const result = sampleReportSchema.safeParse(await response.json());
      if (!result.success) throw new Error('Unexpected report format');
      setReport(result.data);
    } catch {
      setError('The sample report could not be loaded. Try again.');
    } finally {
      setPending(false);
    }
  }

  function analyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    if (mode === 'pdf') {
      setError(pdfMessage);
      return;
    }
    const input = analysisInputSchema.safeParse({ resumeText, jobDescription });
    if (!input.success) {
      setError(input.error.issues[0]?.message ?? 'Check both fields.');
      return;
    }
    void requestReport(input.data);
  }

  return (
    <div className={`${inter.className} bg-[#F5F6F8] text-[#111827]`}>
      <AnalyzerNavbar fontClassName={inter.className} />
      <main id="analyze" className={`${frame} pb-[72px] ${report ? 'pt-8' : 'pt-10 sm:pt-14'}`}>
        {report ? (
          <AnalysisReport report={report} onEdit={() => setReport(null)} />
        ) : (
          <>
            <section className="flex flex-col items-center gap-4 text-center">
              <p className="inline-flex min-h-[30px] items-center gap-2 rounded-full bg-[#EDEDFC] px-3.5 text-[13px] font-semibold text-[#4F46E5]">
                <LockKeyhole size={14} strokeWidth={2.2} aria-hidden="true" />
                No account needed. Your PDF is never stored.
              </p>
              <h1 className="max-w-[720px] text-[clamp(30px,5vw,46px)] leading-[1.1] font-bold tracking-[-0.025em]">
                See how well your CV fits the job
              </h1>
              <p className="max-w-[620px] text-lg leading-[27px] text-[#4B5563]">
                Add your CV and a job description. You get an estimated match score, with evidence from your own CV for every point.
              </p>
            </section>
            <Card className="mt-10 block rounded-[20px] border-[#E3E6EB] bg-white p-4 text-[#111827] shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-7">
              <form aria-label="Start an analysis" aria-busy={pending} onSubmit={analyze}>
                <div className="flex flex-wrap gap-7">
                  <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-3.5">
                    <div className="flex min-h-[42px] flex-wrap items-center justify-between gap-3">
                      <h2 className="flex items-center gap-2.5 font-semibold"><span className={marker}>1</span>Your CV</h2>
                      <div role="group" aria-label="CV input method" className="inline-flex gap-1 rounded-xl bg-[#EEF0F4] p-1">
                        {(['pdf', 'text'] as const).map((option) => (
                          <Button
                            key={option} type="button" variant="ghost" aria-pressed={mode === option} disabled={pending}
                            className={`h-[34px] rounded-[9px] px-4 text-sm font-semibold ${mode === option ? 'bg-white text-[#111827] shadow-sm' : 'text-[#4B5563]'}`}
                            onClick={() => { setMode(option); setError(''); }}
                          >{option === 'pdf' ? 'Upload PDF' : 'Paste text'}</Button>
                        ))}
                      </div>
                    </div>
                    {mode === 'pdf' ? (
                      <button type="button" disabled={pending} onClick={() => setError(pdfMessage)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => { event.preventDefault(); if (!pending) setError(pdfMessage); }}
                        className="flex min-h-56 w-full cursor-pointer flex-col items-center justify-center gap-2.5 rounded-[14px] border-[1.5px] border-dashed border-[#8A94A6] bg-[#FAFAFC] p-7 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F46E5]">
                        <span className="grid size-12 place-items-center rounded-[14px] bg-[#EDEDFC] text-[#4F46E5]"><Upload size={22} aria-hidden="true" /></span>
                        <span className="text-[15px] font-semibold">Drop your CV here, or <span className="text-[#4F46E5] underline">browse files</span></span>
                        <span className={`max-w-80 ${caption}`}>PDF only, up to 3 MB. Text-based PDFs work best. Scanned images are not supported.</span>
                      </button>
                    ) : (
                      <Textarea aria-label="Your CV text" className={field} placeholder="Paste your CV text here." value={resumeText}
                        onChange={(event) => setResumeText(event.target.value)} maxLength={MAX_CV_LENGTH} required disabled={pending} />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-3.5">
                    <label htmlFor="jd" className="flex min-h-[42px] items-center gap-2.5 font-semibold"><span className={marker}>2</span>Job description</label>
                    <Textarea id="jd" className={field} placeholder="Paste the full job posting here, including the requirements section."
                      value={jobDescription} onChange={(event) => setJobDescription(event.target.value)}
                      maxLength={MAX_JOB_LENGTH} required disabled={pending} aria-describedby="jd-tip" />
                    <div className={`flex justify-between gap-3 ${caption}`}>
                      <span id="jd-tip">Tip: include the requirements and responsibilities.</span>
                      <span className="shrink-0">{jobDescription.length.toLocaleString('en-US')} / {MAX_JOB_LENGTH.toLocaleString('en-US')}</span>
                    </div>
                  </div>
                </div>
                {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-5 border-t border-[#E3E6EB] pt-6">
                  <label className="flex max-w-[520px] items-start gap-3 text-sm font-medium">
                    <input type="checkbox" disabled aria-describedby="save-note" className="mt-[3px] size-[18px] shrink-0 accent-[#4F46E5]" />
                    <span>Save this analysis for 30 days so I can compare versions
                      <span id="save-note" className={`block font-normal ${caption}`}>Off by default. Only the result is saved, never the PDF. You can delete it any time.</span>
                    </span>
                  </label>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button type="button" variant="outline" disabled={pending} onClick={() => void requestReport(sampleInput)}
                      className="h-[54px] rounded-[14px] border-[#8A94A6] px-[22px] text-[15px] font-semibold">
                      Try a sample
                    </Button>
                    <span className={caption}>Takes about 20 seconds</span>
                    <Button type="submit" disabled={pending}
                      className="h-[52px] gap-2.5 rounded-[14px] bg-[#4F46E5] px-7 text-base font-semibold text-white hover:bg-indigo-700">
                      {pending ? 'Loading…' : 'Analyze match'}
                      <ArrowRight className="size-[18px]" strokeWidth={2.2} aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </form>
            </Card>
            <section aria-label="About the analysis" className="mt-10 flex flex-wrap gap-5">
              {benefits.map(({ Icon, title, text }) => (
                <div key={title} className="flex flex-[1_1_280px] gap-3.5">
                  <span className="grid size-[42px] shrink-0 place-items-center rounded-xl border border-[#E3E6EB] bg-white">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <div><h3 className="text-[15px] font-semibold">{title}</h3><p className="mt-1 text-sm leading-[21px] text-[#4B5563]">{text}</p></div>
                </div>
              ))}
            </section>
          </>
        )}
        <p id="how" className={`mt-10 text-center ${caption}`}>The match score is an estimate from a published rubric. It does not predict the result of any employer&apos;s applicant tracking system.</p>
      </main>
      <p id="privacy" className={`bg-white py-4 ${frame} ${caption}`}>
        Design preview. Sample reports use fictional data. PDF processing, live scoring, and saving are planned features.
      </p>
    </div>
  );
}
