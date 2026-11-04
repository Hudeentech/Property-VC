import { jsPDF } from 'jspdf';
import type { ConstructionVariable, LandData, RentalUnit, ValuationSummary } from '../types/valuation.ts';
import { calculateConstructionItem, calculateRentalItem, formatCurrency } from './calculator.ts';
import type { ReportTemplateType } from '../components/ReportModal.tsx';

interface ExportPdfParams {
  template: ReportTemplateType;
  reportTitle?: string;
  constructionVariables: ConstructionVariable[];
  land: LandData;
  rentalUnits: RentalUnit[];
  summary: ValuationSummary;
  currencyCode: string;
  locale: string;
}

// Strict Black & White / Grayscale palette for printer-friendly output
const BW_BLACK = '#000000';
const BW_INK = '#111111';
const BW_DARK_GRAY = '#333333';
const BW_MUTED_GRAY = '#555555';
const BW_BORDER_STRONG = '#111111';
const BW_BORDER_MID = '#888888';
const BW_BORDER_LIGHT = '#D4D4D4';
const BW_SURFACE_ALT = '#F5F5F5';
const BW_WHITE = '#FFFFFF';

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.closePath();
}

function truncateText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 1 && ctx.measureText(truncated + '…').width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + '…';
}

/**
 * Generates a Black & White, printer-friendly PDF that always retains
 * the full desktop A4 layout (side-by-side header, 3-column bento cards,
 * and multi-column desktop tables) even when exported from a mobile device.
 */
export async function exportValuationReportToPdf({
  template,
  reportTitle,
  constructionVariables,
  land,
  rentalUnits,
  summary,
  currencyCode,
  locale,
}: ExportPdfParams): Promise<void> {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // fallback to system sans-serif
    }
  }

  const fontFamily = `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

  // Fixed Desktop / A4 Logical Canvas Dimensions (independent of mobile viewport)
  const PAGE_W = 800;
  const PAGE_H = 1131;
  const SCALE = 2.5; // High-DPI crisp monochrome rendering
  const PAD = 44;
  const CONTENT_W = PAGE_W - PAD * 2;

  const pages: HTMLCanvasElement[] = [];
  let currentCanvas!: HTMLCanvasElement;
  let ctx!: CanvasRenderingContext2D;
  let cursorY = PAD;

  const startNewPage = () => {
    currentCanvas = document.createElement('canvas');
    currentCanvas.width = PAGE_W * SCALE;
    currentCanvas.height = PAGE_H * SCALE;
    ctx = currentCanvas.getContext('2d')!;
    ctx.scale(SCALE, SCALE);

    ctx.fillStyle = BW_WHITE;
    ctx.fillRect(0, 0, PAGE_W, PAGE_H);

    pages.push(currentCanvas);
    cursorY = PAD;
  };

  const ensureSpace = (neededHeight: number) => {
    if (cursorY + neededHeight > PAGE_H - PAD) {
      startNewPage();
    }
  };

  startNewPage();

  const today = new Date().toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const totalLettableArea = rentalUnits.reduce(
    (sum, u) => sum + (Number(u.area) > 0 ? Number(u.area) : 0),
    0
  );

  // 1. HEADER BANNER (Printer-Friendly Black & White with Brand Geometry)
  const bannerH = 112;
  ctx.save();
  drawRoundedRect(ctx, PAD, cursorY, CONTENT_W, bannerH, 20);
  ctx.fillStyle = BW_WHITE;
  ctx.fill();
  ctx.clip();

  // Subtle monochrome architectural ring motif (matching brand card aesthetic without wasting toner)
  ctx.beginPath();
  if (template === 'rental') {
    ctx.arc(PAD + 12, cursorY + 12, 66, 0, Math.PI * 2);
  } else {
    ctx.arc(PAD + CONTENT_W - 20, cursorY + 10, 78, 0, Math.PI * 2);
  }
  ctx.strokeStyle = '#EAEAEA';
  ctx.lineWidth = 14;
  ctx.stroke();
  ctx.restore();

  // Crisp outer border on header banner
  ctx.save();
  drawRoundedRect(ctx, PAD, cursorY, CONTENT_W, bannerH, 20);
  ctx.strokeStyle = BW_BORDER_STRONG;
  ctx.lineWidth = 1.75;
  ctx.stroke();

  // Left Title & Date
  ctx.fillStyle = BW_BLACK;
  ctx.font = `700 27px ${fontFamily}`;
  ctx.textAlign = 'left';
  const defaultHeading =
    template === 'rental'
      ? 'Rental Value'
      : template === 'capital'
      ? 'Capital Value'
      : 'Property Valuation';
  const titleStr = truncateText(ctx, reportTitle || defaultHeading, CONTENT_W * 0.54);
  ctx.fillText(titleStr, PAD + 26, cursorY + 54);

  ctx.fillStyle = BW_MUTED_GRAY;
  ctx.font = `500 12px ${fontFamily}`;
  ctx.fillText(today, PAD + 26, cursorY + 78);

  // Right Hero Metric
  ctx.textAlign = 'right';
  ctx.fillStyle = BW_MUTED_GRAY;
  ctx.font = `600 11.5px ${fontFamily}`;
  ctx.fillText(
    template === 'rental' ? 'Annual Rental Value' : 'Total Capital Value',
    PAD + CONTENT_W - 26,
    cursorY + 44
  );

  ctx.fillStyle = BW_BLACK;
  ctx.font = `700 24px ${fontFamily}`;
  const heroVal =
    template === 'rental'
      ? formatCurrency(summary.totalAnnualRentalValue, currencyCode, locale)
      : formatCurrency(summary.totalCapitalValue, currencyCode, locale);
  ctx.fillText(truncateText(ctx, heroVal, CONTENT_W * 0.42), PAD + CONTENT_W - 26, cursorY + 76);
  ctx.restore();

  cursorY += bannerH + 18;

  // 2. THREE DESKTOP BENTO SUMMARY CARDS (Monochrome Outlined Cards)
  const cardGap = 14;
  const cardW = (CONTENT_W - cardGap * 2) / 3;
  const cardH = 86;

  const cards =
    template === 'rental'
      ? [
          {
            isPrimary: true,
            label: 'Annual Rent',
            value: formatCurrency(summary.totalAnnualRentalValue, currencyCode, locale),
          },
          {
            isPrimary: false,
            label: 'Monthly Rent',
            value: formatCurrency(summary.totalMonthlyRentalValue, currencyCode, locale),
          },
          {
            isPrimary: false,
            label: 'Lettable Area',
            value: `${totalLettableArea.toLocaleString()} m²`,
          },
        ]
      : template === 'capital'
      ? [
          {
            isPrimary: true,
            label: 'Capital Value',
            value: formatCurrency(summary.totalCapitalValue, currencyCode, locale),
          },
          {
            isPrimary: false,
            label: 'Buildings (Net)',
            value: formatCurrency(summary.constructionNetTotal, currencyCode, locale),
          },
          {
            isPrimary: false,
            label: 'Land Value',
            value: formatCurrency(summary.landValueTotal, currencyCode, locale),
          },
        ]
      : [
          {
            isPrimary: true,
            label: 'Capital Value',
            value: formatCurrency(summary.totalCapitalValue, currencyCode, locale),
          },
          {
            isPrimary: false,
            label: 'Annual Rent',
            value: formatCurrency(summary.totalAnnualRentalValue, currencyCode, locale),
          },
          {
            isPrimary: false,
            label: 'Rental Yield',
            value:
              summary.grossRentalYieldPercent > 0
                ? `${summary.grossRentalYieldPercent.toFixed(2)}%`
                : '—',
          },
        ];

  cards.forEach((c, idx) => {
    const cx = PAD + idx * (cardW + cardGap);
    ctx.fillStyle = c.isPrimary ? BW_SURFACE_ALT : BW_WHITE;
    drawRoundedRect(ctx, cx, cursorY, cardW, cardH, 16);
    ctx.fill();

    ctx.strokeStyle = c.isPrimary ? BW_BORDER_STRONG : BW_BORDER_MID;
    ctx.lineWidth = c.isPrimary ? 1.5 : 1;
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = BW_MUTED_GRAY;
    ctx.font = `600 11.5px ${fontFamily}`;
    ctx.fillText(c.label, cx + 16, cursorY + 30);

    ctx.fillStyle = BW_BLACK;
    ctx.font = `700 18.5px ${fontFamily}`;
    ctx.fillText(truncateText(ctx, c.value, cardW - 32), cx + 16, cursorY + 60);
  });

  cursorY += cardH + 24;

  const showCapital = template === 'capital' || template === 'combined';
  const showRental = template === 'rental' || template === 'combined';

  // Helper to draw a clean Black & White table section
  const drawTableSection = (
    sectionTitle: string,
    columns: { label: string; widthRatio: number; align: 'left' | 'right' }[],
    rows: string[][],
    footerRow?: { cells: string[] }
  ) => {
    const rowH = 36;
    const headerH = 38;
    ensureSpace(headerH + rowH * 2 + 30);

    // Section Label
    ctx.textAlign = 'left';
    ctx.fillStyle = BW_INK;
    ctx.font = `700 12px ${fontFamily}`;
    ctx.fillText(sectionTitle, PAD, cursorY + 12);
    cursorY += 20;

    const tableTopY = cursorY;

    // Table Header (Light gray fill + crisp black text & bottom border for printer efficiency)
    ctx.save();
    drawRoundedRect(ctx, PAD, cursorY, CONTENT_W, headerH, 12);
    ctx.fillStyle = BW_SURFACE_ALT;
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = BW_SURFACE_ALT;
    ctx.fillRect(PAD, cursorY + headerH - 12, CONTENT_W, 12);

    ctx.strokeStyle = BW_BORDER_STRONG;
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(PAD, cursorY + headerH);
    ctx.lineTo(PAD + CONTENT_W, cursorY + headerH);
    ctx.stroke();

    ctx.fillStyle = BW_BLACK;
    ctx.font = `700 11.5px ${fontFamily}`;
    let colX = PAD;
    columns.forEach((col) => {
      const colW = CONTENT_W * col.widthRatio;
      if (col.align === 'left') {
        ctx.textAlign = 'left';
        ctx.fillText(col.label, colX + 14, cursorY + 23);
      } else {
        ctx.textAlign = 'right';
        ctx.fillText(col.label, colX + colW - 14, cursorY + 23);
      }
      colX += colW;
    });
    cursorY += headerH;

    // Data Rows
    rows.forEach((row, rIdx) => {
      if (cursorY + rowH > PAGE_H - PAD - 40) {
        ctx.strokeStyle = BW_BORDER_MID;
        ctx.lineWidth = 1;
        drawRoundedRect(ctx, PAD, tableTopY, CONTENT_W, cursorY - tableTopY, 12);
        ctx.stroke();
        startNewPage();
      }

      ctx.fillStyle = BW_WHITE;
      ctx.fillRect(PAD, cursorY, CONTENT_W, rowH);

      if (rIdx > 0) {
        ctx.strokeStyle = BW_BORDER_LIGHT;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(PAD, cursorY);
        ctx.lineTo(PAD + CONTENT_W, cursorY);
        ctx.stroke();
      }

      let rx = PAD;
      row.forEach((cellText, cIdx) => {
        const col = columns[cIdx];
        const colW = CONTENT_W * col.widthRatio;
        const isLast = cIdx === row.length - 1;
        const isFirst = cIdx === 0;

        ctx.font = isLast
          ? `700 11.5px ${fontFamily}`
          : isFirst
          ? `500 11.5px ${fontFamily}`
          : `400 11.5px ${fontFamily}`;
        ctx.fillStyle = isLast || isFirst ? BW_BLACK : BW_DARK_GRAY;

        const cleanCell = truncateText(ctx, cellText, colW - 24);
        if (col.align === 'left') {
          ctx.textAlign = 'left';
          ctx.fillText(cleanCell, rx + 14, cursorY + 22);
        } else {
          ctx.textAlign = 'right';
          ctx.fillText(cleanCell, rx + colW - 14, cursorY + 22);
        }
        rx += colW;
      });

      cursorY += rowH;
    });

    // Footer Row
    if (footerRow) {
      ctx.fillStyle = BW_SURFACE_ALT;
      ctx.fillRect(PAD, cursorY, CONTENT_W, rowH + 2);

      ctx.strokeStyle = BW_BORDER_STRONG;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.moveTo(PAD, cursorY);
      ctx.lineTo(PAD + CONTENT_W, cursorY);
      ctx.stroke();

      let fx = PAD;
      footerRow.cells.forEach((cellText, cIdx) => {
        const col = columns[cIdx];
        const colW = CONTENT_W * col.widthRatio;

        ctx.font = `700 11.5px ${fontFamily}`;
        ctx.fillStyle = BW_BLACK;

        const cleanCell = truncateText(ctx, cellText, colW - 24);
        if (col.align === 'left') {
          ctx.textAlign = 'left';
          ctx.fillText(cleanCell, fx + 14, cursorY + 23);
        } else {
          ctx.textAlign = 'right';
          ctx.fillText(cleanCell, fx + colW - 14, cursorY + 23);
        }
        fx += colW;
      });
      cursorY += rowH + 2;
    }

    // Outer Rounded Table Border
    ctx.strokeStyle = BW_BORDER_STRONG;
    ctx.lineWidth = 1.25;
    drawRoundedRect(ctx, PAD, tableTopY, CONTENT_W, cursorY - tableTopY, 12);
    ctx.stroke();

    cursorY += 22;
  };

  // 3. RENTAL BREAKDOWN TABLE
  if (showRental) {
    const rentalCols = [
      { label: 'Description', widthRatio: 0.32, align: 'left' as const },
      { label: 'Area (m²)', widthRatio: 0.16, align: 'right' as const },
      { label: 'Rate / m²', widthRatio: 0.18, align: 'right' as const },
      { label: 'Monthly', widthRatio: 0.17, align: 'right' as const },
      { label: 'Annual Rent', widthRatio: 0.17, align: 'right' as const },
    ];

    const rentalRows = rentalUnits.map((u, i) => {
      const c = calculateRentalItem(u);
      return [
        u.title || `Space ${i + 1}`,
        `${u.area.toLocaleString()} m²`,
        `${formatCurrency(u.rentRatePerSqM, currencyCode, locale)}${u.period === 'monthly' ? '/mo' : '/yr'}`,
        formatCurrency(c.monthlyValue, currencyCode, locale),
        formatCurrency(c.annualValue, currencyCode, locale),
      ];
    });

    drawTableSection('Rental Breakdown', rentalCols, rentalRows, {
      cells: [
        'Total',
        `${totalLettableArea.toLocaleString()} m²`,
        '—',
        formatCurrency(summary.totalMonthlyRentalValue, currencyCode, locale),
        formatCurrency(summary.totalAnnualRentalValue, currencyCode, locale),
      ],
    });
  }

  // 4. CAPITAL BREAKDOWN TABLES (Construction + Land)
  if (showCapital) {
    const constructionCols = [
      { label: 'Component', widthRatio: 0.26, align: 'left' as const },
      { label: 'Area (m²)', widthRatio: 0.14, align: 'right' as const },
      { label: 'Cost / m²', widthRatio: 0.17, align: 'right' as const },
      { label: 'Gross', widthRatio: 0.17, align: 'right' as const },
      { label: 'Depr.', widthRatio: 0.09, align: 'right' as const },
      { label: 'Net Value', widthRatio: 0.17, align: 'right' as const },
    ];

    const constructionRows = constructionVariables.map((v, i) => {
      const c = calculateConstructionItem(v);
      return [
        v.title || `Component ${i + 1}`,
        `${v.area.toLocaleString()} m²`,
        formatCurrency(v.costPerSqM, currencyCode, locale),
        formatCurrency(c.grossValue, currencyCode, locale),
        `${v.depreciationPercent}%`,
        formatCurrency(c.finalValue, currencyCode, locale),
      ];
    });

    drawTableSection('Construction Components', constructionCols, constructionRows, {
      cells: [
        'Buildings Total',
        `${summary.totalBuiltAreaSqM.toLocaleString()} m²`,
        '—',
        formatCurrency(summary.constructionGrossTotal, currencyCode, locale),
        `−${formatCurrency(summary.constructionDepreciationTotal, currencyCode, locale)}`,
        formatCurrency(summary.constructionNetTotal, currencyCode, locale),
      ],
    });

    const landCols = [
      { label: 'Description', widthRatio: 0.4, align: 'left' as const },
      { label: 'Area (m²)', widthRatio: 0.2, align: 'right' as const },
      { label: 'Cost / m²', widthRatio: 0.2, align: 'right' as const },
      { label: 'Land Value', widthRatio: 0.2, align: 'right' as const },
    ];

    const landRows = [
      [
        land.title || 'Main property land',
        `${land.area.toLocaleString()} m²`,
        formatCurrency(land.costPerSqM, currencyCode, locale),
        formatCurrency(summary.landValueTotal, currencyCode, locale),
      ],
    ];

    drawTableSection('Land Value', landCols, landRows);
  }

  // Assemble Desktop A4 PDF Document
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  pages.forEach((canvas, index) => {
    if (index > 0) {
      pdf.addPage();
    }
    const imgData = canvas.toDataURL('image/png', 1.0);
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
  });

  const slug = (
    reportTitle ||
    (template === 'rental'
      ? 'rental-value-report'
      : template === 'capital'
      ? 'capital-value-report'
      : 'property-valuation-report')
  )
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  pdf.save(`${slug || 'property-report'}.pdf`);
}
