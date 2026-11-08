import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { SampleReport } from '@/lib/analysis';

const card = 'min-w-0 gap-0 rounded-[20px] border-[#E3E6EB] bg-white p-5 text-[#111827] shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-7';
const categories = [
  { key: 'skills', label: 'Skills match', weight: '50%' },
  { key: 'experience', label: 'Experience', weight: '35%' },
  { key: 'education', label: 'Education', weight: '15%' },
] as const;

type AnalysisReportProps = {
  report: SampleReport;
  onEdit: () => void;
};

export default function AnalysisReport({ report, onEdit }: AnalysisReportProps) {
  const requirements = [
    ...report.matches.map((match) => ({ ...match, matched: true })),
    ...report.gaps.map((gap) => ({ ...gap, cvQuote: null, matched: false })),
  ];

  return (
    <section aria-labelledby="report-heading">
      <Button type="button" variant="ghost" className="-ml-3" onClick={onEdit}>
        <span aria-hidden="true">←</span> Edit inputs
      </Button>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 id="report-heading" className="text-[26px] font-bold tracking-tight sm:text-[32px]">{report.role}</h1>
        <span className="rounded-full bg-[#EDEDFC] px-3 py-1 text-xs font-semibold text-indigo-800">Sample result</span>
      </div>
      <p role="status" className="mt-1 text-sm text-[#596273]">This fictional report demonstrates the layout. No analysis was saved.</p>

      <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.375fr)]">
        <div className="min-w-0 space-y-6">
          <Card className={card}>
            <div className="flex flex-wrap items-center gap-5 sm:gap-7">
              <div className="grid size-25 shrink-0 place-items-center rounded-full p-2 sm:size-32" style={{ background: `conic-gradient(#4F46E5 ${report.estimatedScore}%, #E5E7EB 0)` }}>
                <div className="grid size-full place-content-center rounded-full bg-white text-center">
                  <span className="text-4xl leading-none font-bold">{report.estimatedScore}</span>
                  <span className="mt-1 text-xs text-[#596273]">out of 100</span>
                </div>
              </div>
              <div className="min-w-0 flex-1 basis-36">
                <p className="text-[13px] font-semibold text-[#596273]">Estimated match</p>
                <h2 className="mt-1 text-xl leading-tight font-bold sm:text-2xl">
                  {report.gaps.length === 1 ? '1 requirement to review' : `${report.gaps.length} requirements to review`}
                </h2>
                <p className="mt-2 text-sm text-[#4B5563]">See where the sample CV supports the job requirements.</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 border-t border-[#E3E6EB] pt-5">
              <p className="text-[13px] font-semibold text-[#596273]">How the score is built</p>
              {categories.map(({ key, label, weight }) => (
                <div key={key} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 text-sm sm:grid-cols-[12rem_1fr_2rem]">
                  <p className="font-semibold">{label} <span className="font-normal text-[#596273]">({weight})</span></p>
                  <div aria-hidden="true" className="col-span-2 row-start-2 h-2 overflow-hidden rounded-full bg-[#E5E7EB] sm:col-span-1 sm:row-start-auto">
                    <div className="h-full rounded-full bg-[#4F46E5]" style={{ width: `${report.breakdown[key]}%` }} />
                  </div>
                  <span className="col-start-2 row-start-1 text-right font-semibold sm:col-start-3">{report.breakdown[key]}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className={card}>
            <h2 className="text-lg font-bold">Skills against the job requirements</h2>
            {requirements.map(({ requirement, jobQuote, cvQuote, matched }) => (
              <article key={requirement} className="mt-5 border-t border-[#E3E6EB] pt-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">{requirement}</h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${matched ? 'bg-[#E6F4ED] text-emerald-800' : 'bg-[#FFF1E5] text-amber-900'}`}>
                    {matched ? '✓ Matched' : 'Not evidenced'}
                  </span>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-[#F5F6F8] p-3.5">
                    <p className="text-xs font-semibold text-[#596273]">The job asks for</p>
                    <blockquote className="mt-1 text-sm wrap-break-word">{jobQuote}</blockquote>
                  </div>
                  <div className={`rounded-xl p-3.5 ${cvQuote ? 'bg-[#F5F6F8]' : 'border border-dashed border-[#8A94A6]'}`}>
                    <p className="text-xs font-semibold text-[#596273]">The sample CV shows</p>
                    {cvQuote ? <blockquote className="mt-1 text-sm wrap-break-word">{cvQuote}</blockquote> : <p className="mt-1 text-sm">No supporting evidence appears in the sample CV.</p>}
                  </div>
                </div>
              </article>
            ))}
          </Card>

          <Card className={card}>
            <h2 className="text-lg font-bold">What to improve first</h2>
            <p className="mt-3 rounded-xl bg-[#EDEDFC] p-3.5 text-sm text-[#374151]">{report.suggestion}</p>
          </Card>
        </div>

        <aside>
          <Card className={card}>
            <h2 className="font-bold">Analysis details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-[#596273]">Mode</dt><dd className="font-semibold">Sample</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-[#596273]">Storage</dt><dd className="font-semibold">Unsaved</dd></div>
            </dl>
          </Card>
        </aside>
      </div>
    </section>
  );
}