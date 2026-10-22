import { useTheme } from './useTheme';

/**
 * Chart.js 画在 canvas 上，读不到 CSS 变量，
 * 所以这里按主题各给一套与设计令牌对齐的颜色。
 * 所有用到 chart.js 的页面都应通过本 hook 取色，不要写死 hex。
 */
export interface ChartTheme {
  /** 网格线 */
  grid: string;
  /** 坐标轴刻度文字 */
  tick: string;
  /** 提示框背景 / 标题 / 正文 */
  tooltipBg: string;
  tooltipTitle: string;
  tooltipBody: string;
  /** 主序列配色（按顺序取用） */
  series: string[];
  /** 半透明填充（面积图用） */
  seriesFill: string[];
  accent: string;
  ok: string;
  warn: string;
  danger: string;
  info: string;
}

const PALETTES: Record<'dark' | 'light', ChartTheme> = {
  dark: {
    grid: 'rgba(150, 169, 188, 0.10)',
    tick: '#687c91',
    tooltipBg: '#111821',
    tooltipTitle: '#e0eaf3',
    tooltipBody: '#96a9bc',
    series: ['#22d3ee', '#38bdf8', '#34d399', '#f5a524', '#a78bfa', '#f87171'],
    seriesFill: [
      'rgba(34, 211, 238, 0.12)',
      'rgba(56, 189, 248, 0.12)',
      'rgba(52, 211, 153, 0.12)',
      'rgba(245, 165, 36, 0.12)',
      'rgba(167, 139, 250, 0.12)',
      'rgba(248, 113, 113, 0.12)',
    ],
    accent: '#22d3ee',
    ok: '#34d399',
    warn: '#f5a524',
    danger: '#f87171',
    info: '#38bdf8',
  },
  light: {
    grid: 'rgba(15, 26, 36, 0.08)',
    tick: '#6c7e90',
    tooltipBg: '#ffffff',
    tooltipTitle: '#0f1a24',
    tooltipBody: '#47576a',
    series: ['#0891b2', '#0284c7', '#059669', '#b45309', '#7c3aed', '#dc2626'],
    seriesFill: [
      'rgba(8, 145, 178, 0.10)',
      'rgba(2, 132, 199, 0.10)',
      'rgba(5, 150, 105, 0.10)',
      'rgba(180, 83, 9, 0.10)',
      'rgba(124, 58, 237, 0.10)',
      'rgba(220, 38, 38, 0.10)',
    ],
    accent: '#0891b2',
    ok: '#059669',
    warn: '#b45309',
    danger: '#dc2626',
    info: '#0284c7',
  },
};

export function useChartTheme(): ChartTheme {
  const { isDark } = useTheme();
  return isDark ? PALETTES.dark : PALETTES.light;
}

/** 统一的坐标轴样式 */
export function axisStyle(theme: ChartTheme) {
  return {
    grid: { color: theme.grid, drawTicks: false },
    border: { display: false },
    ticks: { font: { size: 11 }, color: theme.tick, padding: 8 },
  };
}

/** 统一的提示框样式 */
export function tooltipStyle(theme: ChartTheme) {
  return {
    backgroundColor: theme.tooltipBg,
    titleColor: theme.tooltipTitle,
    bodyColor: theme.tooltipBody,
    borderColor: theme.grid,
    borderWidth: 1,
    padding: 10,
    cornerRadius: 3,
    titleFont: { size: 12, weight: 600 as const },
    bodyFont: { size: 12 },
    displayColors: true,
    boxPadding: 4,
  };
}

/** 统一的图例样式 */
export function legendStyle(theme: ChartTheme, position: 'top' | 'bottom' | 'right' = 'top') {
  return {
    position,
    labels: {
      usePointStyle: true,
      boxWidth: 6,
      boxHeight: 6,
      padding: 14,
      font: { size: 11 },
      color: theme.tick,
    },
  };
}
