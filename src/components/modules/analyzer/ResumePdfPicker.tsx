'use client';

import { useRef } from 'react';
import { Upload } from 'lucide-react';

type ResumePdfPickerProps = {
  selectedFile: File | null;
  disabled: boolean;
  onSelect: (file: File) => void;
};

const caption = 'text-[13px] leading-[19.5px] text-[#596273]';

export default function ResumePdfPicker({
  selectedFile,
  disabled,
  onSelect,
}: ResumePdfPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        hidden
        disabled={disabled}
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          event.currentTarget.value = '';

          if (file) onSelect(file);
        }}
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          if (disabled) return;

          const file = event.dataTransfer.files[0];
          if (file) onSelect(file);
        }}
        className="flex min-h-56 w-full cursor-pointer flex-col items-center justify-center gap-2.5 rounded-[14px] border-[1.5px] border-dashed border-[#8A94A6] bg-[#FAFAFC] p-7 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F46E5]"
      >
        <span className="grid size-12 place-items-center rounded-[14px] bg-[#EDEDFC] text-[#4F46E5]">
          <Upload size={22} aria-hidden="true" />
        </span>

        <span className="text-[15px] font-semibold">
          Drop your CV here, or{' '}
          <span className="text-[#4F46E5] underline">browse files</span>
        </span>

        <span className={`max-w-80 ${caption}`}>
          PDF only, up to 3 MB. Text-based PDFs work best. Scanned images are
          not supported.
        </span>
      </button>

      {selectedFile && (
        <p role="status" className={`break-all ${caption}`}>
          Selected PDF: {selectedFile.name}
        </p>
      )}
    </>
  );
}