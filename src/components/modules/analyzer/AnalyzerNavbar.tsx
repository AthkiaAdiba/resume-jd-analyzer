'use client';

import { useState } from 'react';
import { Check, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const navItems = [
  { label: 'How scoring works', href: '#how' },
  { label: 'Evaluation' },
  { label: 'History' },
  { label: 'Privacy', href: '#privacy' },
];


export default function AnalyzerNavbar({}: {
  fontClassName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-[#E3E6EB] bg-white">
      <div className="mx-auto flex min-h-16 max-w-296 items-center justify-between gap-3 px-4 py-2 sm:px-8">
        <a
          href="#analyze"
          className="flex min-w-0 items-center gap-2.5 text-[15px] font-semibold text-[#111827]"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-[#4F46E5] text-white">
            <Check size={18} strokeWidth={2.4} aria-hidden="true" />
          </span>
          Resume and JD Analyzer
        </a>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 text-sm font-medium text-[#374151] md:flex"
        >
          {navItems.map(({ label, href }) =>
            href ? (
              <a key={label} href={href} className="hover:underline">
                {label}
              </a>
            ) : (
              <span key={label}>{label}</span>
            ),
          )}
        </nav>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-11 shrink-0 text-[#111827] md:hidden"
              aria-label="Open navigation"
            >
              <Menu aria-hidden="true" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-[min(320px,85vw)] gap-0 overflow-y-auto border-l border-[#E3E6EB] bg-white text-[#111827]"
          >
            <SheetHeader className="border-b border-[#E3E6EB] px-5 py-5">
              <SheetTitle>Navigation</SheetTitle>
              <SheetDescription className="sr-only">
                Resume and JD Analyzer navigation links
              </SheetDescription>
            </SheetHeader>

            <nav
              aria-label="Mobile navigation"
              className="flex flex-col gap-1 p-4 text-sm font-medium"
            >
              {navItems.map(({ label, href }) =>
                href ? (
                  <a
                    key={label}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className="flex min-h-11 items-center rounded-lg px-3 hover:bg-[#F5F6F8]"
                  >
                    {label}
                  </a>
                ) : (
                  <span
                    key={label}
                    className="flex min-h-11 items-center rounded-lg px-3 text-slate-500"
                  >
                    {label}
                  </span>
                ),
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}