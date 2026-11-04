import React from 'react';
import { ActiveTab, ThemeMode } from '../types/valuation';
import { ArrowUpRight } from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: ActiveTab) => void;
  onToggleTheme: () => void;
  theme: ThemeMode;
  historyCount: number;
}

export const BrandLogo: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 44 44" fill="none" className={className} aria-hidden="true">
    {/* Top-Left White Rounded Square */}
    <rect x="2" y="2" width="17" height="17" rx="4" fill="currentColor" />
    {/* Bottom-Left White Rounded Square */}
    <rect x="2" y="23" width="17" height="17" rx="4" fill="currentColor" />
    {/* Bottom-Right White Rounded Square */}
    <rect x="23" y="23" width="17" height="17" rx="4" fill="currentColor" />
    {/* Top-Right Rotated Peach Diamond */}
    <rect
      x="31.5"
      y="1.5"
      width="15"
      height="15"
      rx="3.5"
      transform="rotate(45 31.5 1.5)"
      fill="#F9C083"
    />
  </svg>
);

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onToggleTheme,
  theme,
  historyCount,
}) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between select-none">
      {/* Architectural Background Photo (No Blur) */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/assets/aistudio/Property_valuation___Minimal_redesign_46e891c7.jpg')`,
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-5 sm:px-10 md:px-14 pt-8 sm:pt-12 pb-8 sm:pb-14 flex-1 flex flex-col justify-between">
        {/* Top Brand Header */}
        <header className="flex items-start justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-3 text-white">
              <BrandLogo className="w-9 h-9 sm:w-11 sm:h-11 text-white shrink-0" />
              <span className="text-3xl sm:text-4xl md:text-[42px] font-bold tracking-tight text-white">
                Property VC
              </span>
            </div>
            <p className="text-white/85 text-sm sm:text-base mt-2.5 max-w-md leading-snug font-normal">
              Estimate your property’s capital and rental value in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('settings')}
            className="text-white/90 hover:text-white text-base sm:text-lg font-medium py-1.5 px-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            Settings
          </button>
        </header>

        {/* Bento Card Grid matching Mobile & Desktop Reference Mockups */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 my-auto">
          {/* Card 1: Capital Value (Deep Brand Navy #1B3352) */}
          <button
            type="button"
            onClick={() => onNavigate('capital')}
            className="lg:col-span-4 group relative overflow-hidden rounded-[26px] bg-[#1B3352] hover:bg-[#203B5E] text-white p-7 sm:p-8 min-h-[230px] sm:min-h-[300px] lg:min-h-[500px] flex flex-col justify-between text-left shadow-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          >
            {/* Decorative Subtle Arc in Top/Right matching design */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-12 w-72 h-72 lg:w-96 lg:h-96 rounded-full border-[30px] border-white/[0.06]"
            />

            <div className="relative z-10 flex justify-end w-full">
              <ArrowUpRight className="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[2.25] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>

            <div className="relative z-10 mt-auto pt-8">
              <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight leading-[1.06] text-white mb-3">
                Capital{' '}
                <span className="lg:block">Value</span>
              </h2>
              <p className="text-white/90 text-sm sm:text-base font-normal leading-snug max-w-[260px]">
                Click 👆🏾 Here, to open Capital value calculator
              </p>
            </div>
          </button>

          {/* Card 2: Rental Value (Warm Brand Peach #F9C083) */}
          <button
            type="button"
            onClick={() => onNavigate('rental')}
            className="lg:col-span-4 group relative overflow-hidden rounded-[26px] bg-[#F9C083] hover:bg-[#fbd7ad] text-[#1E1E1E] p-7 sm:p-8 min-h-[230px] sm:min-h-[300px] lg:min-h-[500px] flex flex-col justify-between text-left shadow-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          >
            {/* Decorative Terracotta Ring in Top-Left matching design */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 -left-16 w-48 h-48 sm:w-64 sm:h-64 rounded-full border-[18px] sm:border-[22px] border-[#D68B42]/75"
            />

            <div className="relative z-10 flex justify-end w-full">
              <ArrowUpRight className="w-7 h-7 sm:w-8 sm:h-8 text-[#1E1E1E] stroke-[2.25] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>

            <div className="relative z-10 mt-auto pt-8">
              <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight leading-[1.06] text-[#1E1E1E] mb-3">
                Rental{' '}
                <span className="lg:block">Value</span>
              </h2>
              <p className="text-[#2C2620] text-sm sm:text-base font-normal leading-snug max-w-[260px]">
                Click 👆🏾 Here ,to open Rental value calculator
              </p>
            </div>
          </button>

          {/* Right Column on Desktop (History + Theme) / Bottom 2-col Row on Mobile */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 lg:grid-rows-[1fr_1.35fr] gap-4 sm:gap-5">
            {/* Theme Card: First on mobile (left col), Second on desktop (bottom row) */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="order-1 lg:order-2 group relative overflow-hidden rounded-[26px] bg-white hover:bg-slate-50 text-[#1E1E1E] p-5 sm:p-7 min-h-[190px] sm:min-h-[220px] flex flex-col justify-between text-left shadow-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="relative z-10 flex justify-end w-full">
                <ArrowUpRight className="w-6 h-6 sm:w-7 sm:h-7 text-[#1E1E1E] stroke-[2.25] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>

              <div className="relative z-10 mt-auto">
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#222325] mb-2">
                  Theme
                </h2>
                <p className="text-[#3C3C3C] text-xs sm:text-sm font-normal leading-snug">
                  Tap 👆🏾 here, the button to switch themes ({theme === 'dark' ? 'Dark' : 'Light'})
                </p>
              </div>
            </button>

            {/* History Card: Second on mobile (right col), First on desktop (top row) */}
            <button
              type="button"
              onClick={() => onNavigate('history')}
              className="order-2 lg:order-1 group relative overflow-hidden rounded-[26px] bg-[#222325] hover:bg-[#2B2C2F] text-white p-5 sm:p-7 min-h-[190px] sm:min-h-[200px] flex flex-col justify-between text-left shadow-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              {/* Subtle dark circle accent in bottom right matching reference */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-10 -right-8 w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-white/[0.04]"
              />

              <div className="relative z-10 flex justify-end w-full">
                <ArrowUpRight className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2.25] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>

              <div className="relative z-10 mt-auto">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-2">
                    History
                  </h2>
                  {historyCount > 0 && (
                    <span className="text-xs font-semibold text-[#F9C083]">
                      ({historyCount})
                    </span>
                  )}
                </div>
                <p className="text-white/85 text-xs sm:text-sm font-normal leading-snug lg:hidden">
                  Tap 👆🏾 here, To visit recent reports
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
