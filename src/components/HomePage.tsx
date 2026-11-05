import React, { useState, useEffect } from 'react';
import { ActiveTab, ThemeMode } from '../types/valuation';
import { ArrowUpRight, Settings, Moon } from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: ActiveTab) => void;
  onToggleTheme: () => void;
  theme: ThemeMode;
  historyCount: number;
}

export const BrandLogo: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
    {/* Outer Rounded Frame matching the updated logo design */}
    <path
      d="M27 3H11C6.58172 3 3 6.58172 3 11V37C3 41.4183 6.58172 45 11 45H37C41.4183 45 45 41.4183 45 37V21"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    {/* Top-Left White Rounded Square */}
    <rect x="6.5" y="6.5" width="15.5" height="15.5" rx="3.5" fill="currentColor" />
    {/* Bottom-Left White Rounded Square */}
    <rect x="6.5" y="25.5" width="15.5" height="15.5" rx="3.5" fill="currentColor" />
    {/* Bottom-Right White Rounded Square */}
    <rect x="25.5" y="25.5" width="15.5" height="15.5" rx="3.5" fill="currentColor" />
    {/* Top-Right Rotated Warm Peach Diamond */}
    <rect
      x="33.5"
      y="3.5"
      width="14"
      height="14"
      rx="3"
      transform="rotate(45 33.5 3.5)"
      fill="#F9C083"
    />
  </svg>
);

export const SunDotsIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <circle cx="16" cy="16" r="6.5" stroke="currentColor" strokeWidth="2" />
    <circle cx="16" cy="4.5" r="1.4" fill="currentColor" />
    <circle cx="16" cy="27.5" r="1.4" fill="currentColor" />
    <circle cx="4.5" cy="16" r="1.4" fill="currentColor" />
    <circle cx="27.5" cy="16" r="1.4" fill="currentColor" />
    <circle cx="7.87" cy="7.87" r="1.4" fill="currentColor" />
    <circle cx="24.13" cy="24.13" r="1.4" fill="currentColor" />
    <circle cx="24.13" cy="7.87" r="1.4" fill="currentColor" />
    <circle cx="7.87" cy="24.13" r="1.4" fill="currentColor" />
  </svg>
);

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

function formatClockTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  return `${hh}:${mm} ${ampm}`;
}

function formatTodayDate(date: Date): string {
  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `Today is ${day}${suffix}, ${month} ${year}`;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onToggleTheme,
  theme,
  historyCount,
}) => {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const timeString = formatClockTime(now);
  const dateString = formatTodayDate(now);

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between select-none">
      {/* Architectural Background Photo (205KB compressed, No Blur) */}
      <div
        className="fixed inset-0 z-0 bg-[#2C3539] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/assets/aistudio/Property_valuation___Minimal_redesign__1__28fbeb0d.jpg')`,
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-4 sm:px-8 md:px-12 pt-7 sm:pt-11 pb-8 sm:pb-12 flex-1 flex flex-col justify-between">
        {/* Top Brand Header */}
        <header className="flex items-start justify-between gap-4 mb-6 sm:mb-10">
          <div>
            <div className="flex items-center gap-2.5 sm:gap-3 text-white">
              <BrandLogo className="w-10 h-10 sm:w-11 sm:h-11 text-white shrink-0" />
              <span className="text-3xl sm:text-4xl md:text-[42px] font-bold tracking-tight text-white">
                Property VC
              </span>
            </div>
            <p className="text-white/90 italic lg:not-italic text-sm sm:text-base mt-2.5 max-w-[280px] sm:max-w-xl leading-snug font-normal">
              Estimate your property’s capital and rental value in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('settings')}
            aria-label="Open Settings"
            title="Settings & Preferences"
            className="text-white/90 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer mt-1"
          >
            <Settings className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        </header>

        {/* =========================================================
            MOBILE & TABLET BENTO GRID (< lg)
            Matches iPhone_17_-_1_c1daaf2e.jpg layout
           ========================================================= */}
        <div className="grid lg:hidden gap-3.5 my-auto">
          {/* Row 1: Clock Card (Left) + Rental Value Card (Right) */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Clock & Smile Quote Card */}
            <div className="rounded-[24px] bg-white text-[#222325] p-4 sm:p-6 min-h-[205px] flex flex-col justify-between shadow-xl">
              <div className="pt-2">
                <div className="text-[26px] sm:text-3xl font-bold tracking-tight text-[#222325] tabular-nums leading-none">
                  {timeString}
                </div>
                <p className="text-xs font-medium text-[#222325] mt-1.5">
                  {dateString}
                </p>
              </div>

              <div className="border-t border-[#E8E8E8] pt-3 mt-auto">
                <p className="italic text-[#4A4A4A] text-xs sm:text-sm leading-snug">
                  Turn a bad day to a good one with a smile 😊😉
                </p>
              </div>
            </div>

            {/* Rental Value Card (Warm Peach #F9C083) */}
            <button
              type="button"
              onClick={() => onNavigate('rental')}
              className="group relative overflow-hidden rounded-[24px] bg-[#F9C083] hover:bg-[#fbd09e] text-[#1E1E1E] p-4 sm:p-6 min-h-[205px] flex flex-col justify-between text-left shadow-xl transition-transform duration-200 active:scale-[0.99] cursor-pointer"
            >
              {/* Top-left terracotta arc */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-14 -left-14 w-36 h-36 rounded-full border-[14px] border-[#D68B42]/80"
              />

              <div className="relative z-10 flex justify-end w-full">
                <ArrowUpRight className="w-6 h-6 text-[#1E1E1E] stroke-[2.25]" />
              </div>

              <div className="relative z-10 mt-auto pt-3">
                <h2 className="text-[28px] sm:text-4xl font-bold tracking-tight leading-[1.06] text-[#222325] mb-1.5">
                  Rental
                  <span className="block">Value</span>
                </h2>
                <p className="text-[#2C2620] text-[11px] sm:text-xs leading-snug">
                  Click Here ,to open Rental value calculator
                </p>
              </div>
            </button>
          </div>

          {/* Row 2: Capital Value Card (Full width, Deep Navy #1B3352) */}
          <button
            type="button"
            onClick={() => onNavigate('capital')}
            className="group relative overflow-hidden rounded-[24px] bg-[#1B3352] hover:bg-[#203B5E] text-white p-6 sm:p-7 min-h-[215px] flex flex-col justify-between text-left shadow-xl transition-transform duration-200 active:scale-[0.99] cursor-pointer"
          >
            {/* Subtle top-right curve */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-12 w-72 h-72 rounded-full border-[28px] border-white/[0.05]"
            />

            <div className="relative z-10 flex justify-end w-full">
              <ArrowUpRight className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2.25]" />
            </div>

            <div className="relative z-10 mt-auto pt-4">
              <h2 className="text-[36px] sm:text-5xl font-bold tracking-tight leading-[1.08] text-white mb-2">
                Capital Value
              </h2>
              <p className="text-white/90 text-sm sm:text-base leading-snug max-w-[260px]">
                Click Here, to open Capital value calculator
              </p>
            </div>
          </button>

          {/* Row 3: Mortgage Value Card (Full width, Soft Lavender #E4CEFA) */}
          <button
            type="button"
            onClick={() => onNavigate('mortgage')}
            className="group relative overflow-hidden rounded-[24px] bg-[#E4CEFA] hover:bg-[#ead8fc] text-[#222325] p-6 sm:p-7 min-h-[220px] flex flex-col justify-between text-left shadow-xl transition-transform duration-200 active:scale-[0.99] cursor-pointer"
          >
            {/* Concentric Purple Circles in Top-Left */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 -left-12 w-56 h-56 rounded-full bg-[#D5ADFA]/75 flex items-center justify-center"
            >
              <div className="w-32 h-32 rounded-full bg-[#C388F8]/85" />
            </div>

            <div className="relative z-10 flex justify-end w-full">
              <ArrowUpRight className="w-6 h-6 sm:w-7 sm:h-7 text-[#1E1E1E] stroke-[2.25]" />
            </div>

            <div className="relative z-10 mt-auto pt-2">
              <h2 className="text-[38px] sm:text-5xl font-bold tracking-tight leading-[1.06] text-[#222325] mb-2">
                Mortgage
                <span className="block">Value</span>
              </h2>
              <p className="text-[#2C2620] text-sm sm:text-base leading-snug max-w-[280px]">
                Click Here ,to open Mortgage value calculator
              </p>
            </div>
          </button>

          {/* Row 4: Theme Card (Left) + History Card (Right) */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Theme Card */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="group relative overflow-hidden rounded-[24px] bg-white hover:bg-slate-50 text-[#222325] p-5 sm:p-6 min-h-[190px] flex flex-col justify-between text-left shadow-xl transition-transform duration-200 active:scale-[0.99] cursor-pointer"
            >
              <div className="relative z-10 flex justify-end w-full">
                {theme === 'dark' ? (
                  <Moon className="w-6 h-6 sm:w-7 sm:h-7 text-[#1E1E1E]" />
                ) : (
                  <SunDotsIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#1E1E1E]" />
                )}
              </div>

              <div className="relative z-10 mt-auto">
                <h2 className="text-[30px] sm:text-4xl font-bold tracking-tight text-[#222325] mb-1.5">
                  Theme
                </h2>
                <p className="text-[#3C3C3C] text-xs sm:text-sm leading-snug">
                  Tap 👆🏾 here, the button to switch themes
                </p>
              </div>
            </button>

            {/* History Card */}
            <button
              type="button"
              onClick={() => onNavigate('history')}
              className="group relative overflow-hidden rounded-[24px] bg-[#222325] hover:bg-[#2B2C2F] text-white p-5 sm:p-6 min-h-[190px] flex flex-col justify-between text-left shadow-xl transition-transform duration-200 active:scale-[0.99] cursor-pointer"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-10 -right-8 w-40 h-40 rounded-full bg-white/[0.04]"
              />

              <div className="relative z-10 flex justify-end w-full">
                <ArrowUpRight className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2.25]" />
              </div>

              <div className="relative z-10 mt-auto">
                <div className="flex items-baseline gap-1.5">
                  <h2 className="text-[30px] sm:text-4xl font-bold tracking-tight text-white mb-1.5">
                    History
                  </h2>
                  {historyCount > 0 && (
                    <span className="text-xs font-semibold text-[#F9C083]">
                      ({historyCount})
                    </span>
                  )}
                </div>
                <p className="text-white/85 text-xs sm:text-sm leading-snug">
                  Tap 👆🏾 here, To visit recent reports
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* =========================================================
            DESKTOP BENTO GRID (lg: 4 Columns × 2 Rows)
            Matches Property_valuation___Minimal_redesign_4097899b.jpg
           ========================================================= */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:grid-rows-2 gap-5 my-auto min-h-[540px]">
          {/* Col 1, Rows 1-2: Capital Value (Tall Left Card, #1B3352) */}
          <button
            type="button"
            onClick={() => onNavigate('capital')}
            className="lg:col-span-1 lg:row-span-2 group relative overflow-hidden rounded-[22px] bg-[#1B3352] hover:bg-[#203B5E] text-white p-8 flex flex-col justify-end text-left shadow-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          >
            {/* Large Subtle Ring Arc across Top Half */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-20 w-[340px] h-[340px] rounded-full border-[28px] border-white/[0.05]"
            />

            <div className="relative z-10 mt-auto">
              <h2 className="text-[44px] xl:text-[50px] font-bold tracking-tight leading-[1.08] text-white mb-3.5">
                Capital
                <span className="block">Value</span>
              </h2>
              <p className="text-white/90 text-sm xl:text-[15px] font-normal leading-snug max-w-[230px]">
                Click Here, to open Capital value calculator
              </p>
            </div>
          </button>

          {/* Col 2, Row 1: Rental Value (#F9C083) */}
          <button
            type="button"
            onClick={() => onNavigate('rental')}
            className="lg:col-span-1 lg:row-span-1 group relative overflow-hidden rounded-[22px] bg-[#F9C083] hover:bg-[#fbd09e] text-[#1E1E1E] p-7 flex flex-col justify-between text-left shadow-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer min-h-[260px]"
          >
            {/* Large Terracotta Ring Arc */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-14 -left-24 w-72 h-72 rounded-full border-[22px] border-[#D68B42]/75"
            />

            <div className="relative z-10 flex justify-end w-full">
              <ArrowUpRight className="w-6 h-6 text-[#1E1E1E] stroke-[2.25] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>

            <div className="relative z-10 mt-auto">
              <h2 className="text-[32px] xl:text-[38px] font-bold tracking-tight leading-[1.08] text-[#222325] whitespace-nowrap mb-2">
                Rental Value
              </h2>
              <p className="text-[#2C2620] text-xs xl:text-sm font-normal leading-snug max-w-[220px]">
                Click Here ,to open Rental value calculator
              </p>
            </div>
          </button>

          {/* Col 3, Row 1: Live Clock & Date Card (#FFFFFF) */}
          <div className="lg:col-span-1 lg:row-span-1 rounded-[22px] bg-white text-[#222325] p-7 flex flex-col justify-between shadow-xl min-h-[260px]">
            <div className="pt-1">
              <div className="text-[36px] xl:text-[42px] font-bold tracking-tight text-[#222325] tabular-nums leading-none">
                {timeString}
              </div>
              <p className="text-xs xl:text-sm font-medium text-[#222325] mt-2">
                {dateString}
              </p>
            </div>

            <div className="border-t border-[#EAEAEA] pt-3.5 mt-auto">
              <p className="italic text-[#555555] text-xs xl:text-sm leading-snug max-w-[210px]">
                Turn a bad day to a good one with a smile 😊😉
              </p>
            </div>
          </div>

          {/* Col 4, Row 1: Theme Card (#FFFFFF) */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="lg:col-span-1 lg:row-span-1 group relative overflow-hidden rounded-[22px] bg-white hover:bg-slate-50 text-[#222325] p-7 flex flex-col justify-between text-left shadow-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer min-h-[260px]"
          >
            <div className="relative z-10 flex justify-end w-full">
              {theme === 'dark' ? (
                <Moon className="w-7 h-7 text-[#1E1E1E] transition-transform duration-300 group-hover:-rotate-12" />
              ) : (
                <SunDotsIcon className="w-7 h-7 text-[#1E1E1E] transition-transform duration-300 group-hover:rotate-45" />
              )}
            </div>

            <div className="relative z-10 mt-auto">
              <h2 className="text-[40px] xl:text-[44px] font-bold tracking-tight leading-none text-[#222325] mb-2.5">
                Theme
              </h2>
              <p className="text-[#3C3C3C] text-xs xl:text-sm font-normal leading-snug max-w-[190px]">
                Tap 👆🏾 here, the button to switch themes
              </p>
            </div>
          </button>

          {/* Cols 2-3, Row 2: Mortgage Value (Wide Lavender Card, #E4CEFA) */}
          <button
            type="button"
            onClick={() => onNavigate('mortgage')}
            className="lg:col-span-2 lg:row-span-1 group relative overflow-hidden rounded-[22px] bg-[#E4CEFA] hover:bg-[#ead8fc] text-[#222325] p-7 xl:p-8 flex flex-col justify-between text-left shadow-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer min-h-[260px]"
          >
            {/* Concentric Purple Circles in Top-Left */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -left-6 w-64 h-64 rounded-full bg-[#D5ADFA]/80 flex items-center justify-center"
            >
              <div className="w-36 h-36 rounded-full bg-[#C388F8]/90" />
            </div>

            <div className="relative z-10 flex justify-end w-full">
              <ArrowUpRight className="w-6 h-6 text-[#1E1E1E] stroke-[2.25] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>

            <div className="relative z-10 mt-auto">
              <h2 className="text-[40px] xl:text-[46px] font-bold tracking-tight leading-[1.08] text-[#222325] mb-2">
                Mortgage Value
              </h2>
              <p className="text-[#2C2620] text-xs xl:text-sm font-normal leading-snug max-w-[230px]">
                Click Here ,to open Mortgage value calculator
              </p>
            </div>
          </button>

          {/* Col 4, Row 2: History Card (#222325) */}
          <button
            type="button"
            onClick={() => onNavigate('history')}
            className="lg:col-span-1 lg:row-span-1 group relative overflow-hidden rounded-[22px] bg-[#222325] hover:bg-[#2B2C2F] text-white p-7 flex flex-col justify-between text-left shadow-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer min-h-[260px]"
          >
            {/* Subtle Dark Circle Accent */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-12 right-8 w-44 h-44 rounded-full bg-white/[0.04]"
            />

            <div className="relative z-10 flex justify-end w-full">
              <ArrowUpRight className="w-6 h-6 text-white stroke-[2.25] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>

            <div className="relative z-10 mt-auto">
              <div className="flex items-baseline gap-2">
                <h2 className="text-[40px] xl:text-[44px] font-bold tracking-tight leading-none text-white mb-2.5">
                  History
                </h2>
                {historyCount > 0 && (
                  <span className="text-xs font-semibold text-[#F9C083]">
                    ({historyCount})
                  </span>
                )}
              </div>
              <p className="text-white/85 text-xs xl:text-sm font-normal leading-snug max-w-[180px]">
                Tap here, To visit recent reports
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
