import type { LucideIcon } from 'lucide-react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MetricItem {
  label: string;
  value: string | number;
  unit?: string;
  /** 变化幅度，如 '+5.2%' */
  trend?: string;
  /** 变化方向（配合国内习惯：涨=红，跌=绿） */
  up?: boolean;
  /** trend 为空时的补充说明 */
  note?: string;
  icon?: LucideIcon;
  /** 语义色：需要强调的指标（告警、超限）用 danger / warn */
  tone?: 'default' | 'accent' | 'ok' | 'warn' | 'danger';
}

const COL_CLASS: Record<number, string> = {
  2: 'xl:grid-cols-2',
  3: 'xl:grid-cols-3',
  4: 'xl:grid-cols-4',
  5: 'xl:grid-cols-5',
  6: 'xl:grid-cols-6',
};

const TONE_VALUE: Record<string, string> = {
  default: 'text-ink',
  accent: 'text-accent',
  ok: 'text-ok',
  warn: 'text-warn',
  danger: 'text-danger',
};

interface MetricStripProps {
  items: MetricItem[];
  /** 宽屏下的列数，默认按条目数自动取（最多 6 列） */
  cols?: number;
  className?: string;
}

/**
 * 紧凑指标条：一屏内并排展示多个关键数值，比大号统计卡片更省纵向空间，
 * 也更符合工业上位机「参数一览」的读图习惯。
 */
export default function MetricStrip({ items, cols, className }: MetricStripProps) {
  const count = cols ?? Math.min(items.length, 6);
  return (
    <div className={cn('grid grid-cols-2 gap-2 md:grid-cols-3', COL_CLASS[count] ?? 'xl:grid-cols-4', className)}>
      {items.map((m) => (
        <div key={m.label} className="metric">
          <div className="flex items-center justify-between gap-2">
            <span className="metric-label truncate">{m.label}</span>
            {m.icon && <m.icon className="h-3.5 w-3.5 shrink-0 text-ink-3" />}
          </div>
          <div className="mt-2 flex items-baseline">
            <span className={cn('metric-value', TONE_VALUE[m.tone ?? 'default'])}>
              {typeof m.value === 'number' ? m.value.toLocaleString() : m.value}
            </span>
            {m.unit && <span className="metric-unit">{m.unit}</span>}
          </div>
          {(m.trend || m.note) && (
            <div className="mt-1.5 flex items-center gap-1.5">
              {m.trend &&
                (m.up ? (
                  <TrendingUp className="h-3.5 w-3.5 shrink-0 text-danger" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 shrink-0 text-ok" />
                ))}
              <span
                className={cn(
                  'font-mono text-[11px]',
                  m.trend ? (m.up ? 'text-danger' : 'text-ok') : 'text-ink-3',
                )}
              >
                {m.trend || m.note}
              </span>
              {m.trend && m.note && <span className="truncate text-[11px] text-ink-3">{m.note}</span>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
