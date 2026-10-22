import { useMemo, useState } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { monthOptions, seededValue } from '../data/mockData';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import MetricStrip from '../components/MetricStrip';
import { cn } from '../lib/utils';

// 各项指标的取值范围，本月/上月都由所选月份作为 key 派生，切换月份数字必变
const metricConfigs = [
  { key: 'electricity', label: '用电量', unit: 'kWh', currentRange: [3600000, 3900000], prevRange: [3400000, 3650000] },
  { key: 'water', label: '用水量', unit: '吨', currentRange: [23000, 25500], prevRange: [21500, 23600] },
  { key: 'gas', label: '用气量', unit: 'm³', currentRange: [82000, 90000], prevRange: [78000, 85000] },
  { key: 'cost', label: '总费用', unit: '元', currentRange: [2550000, 2780000], prevRange: [2400000, 2620000] },
] as const;

const monthLabel = (month: string) => `${Number(month.slice(5))}月`;

export default function AnalysisMOM() {
  const [selectedMonth, setSelectedMonth] = useState('2024-06');

  // 环比 = (本月 - 上月) / 上月 × 100%
  const momData = useMemo(
    () =>
      metricConfigs.map((metric) => {
        const current = seededValue(`mom-${selectedMonth}-${metric.key}-current`, metric.currentRange[0], metric.currentRange[1], 0);
        const previous = seededValue(`mom-${selectedMonth}-${metric.key}-previous`, metric.prevRange[0], metric.prevRange[1], 0);
        const change = Number((((current - previous) / previous) * 100).toFixed(1));
        return { category: metric.label, unit: metric.unit, current, previous, change };
      }),
    [selectedMonth],
  );

  // 趋势图各月取该月「用电量-本月」的同一派生值，所选月份的柱子与上方卡片一致；
  // 上月序列沿用同一生成规则（区间取用电量 prevRange），用于本月/上月分组对比。
  const monthlyTrend = useMemo(
    () =>
      monthOptions.map((month) => ({
        month,
        label: monthLabel(month),
        current: seededValue(`mom-${month}-electricity-current`, 3600000, 3900000, 0),
        previous: seededValue(`mom-${month}-electricity-previous`, 3400000, 3650000, 0),
        active: month === selectedMonth,
      })),
    [selectedMonth],
  );

  // 指标条以「用电量」为主口径（不同能源量纲不可相加）
  const primary = momData.find((item) => item.category === '用电量') ?? momData[0];
  const diff = primary.current - primary.previous;

  const risingItems = momData.filter((item) => item.change > 0);
  const fallingItems = momData.filter((item) => item.change < 0);
  const barMax = 4000000;

  return (
    <div className="space-y-3">
      <PageHeader title="能耗环比分析" description="本月与上月数据进行对比分析">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="field h-7"
          aria-label="选择月份"
        >
          {monthOptions.map((month) => (
            <option key={month} value={month}>
              {month.replace('-', '年')}月
            </option>
          ))}
        </select>
      </PageHeader>

      <MetricStrip
        cols={4}
        items={[
          { label: '本月用电量', value: primary.current, unit: 'kWh', tone: 'accent', note: monthLabel(selectedMonth) },
          { label: '上月用电量', value: primary.previous, unit: 'kWh', note: '上月同期' },
          {
            label: '环比',
            value: `${primary.change > 0 ? '+' : ''}${primary.change}`,
            unit: '%',
            // 国内工业口径：能耗环比上升=恶化=danger 红，下降=改善=ok 绿
            tone: primary.change > 0 ? 'danger' : 'ok',
            note: primary.change > 0 ? '环比上升' : '环比下降',
          },
          {
            label: '差值',
            value: diff,
            unit: 'kWh',
            tone: primary.change > 0 ? 'danger' : 'ok',
            note: '本月 − 上月',
          },
        ]}
      />

      <Panel
        title="本月与上月用电量对比"
        aside={
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-accent" />
              本月
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm border border-line bg-line-strong" />
              上月
            </span>
          </span>
        }
      >
        <div className="flex h-56 items-end gap-3">
          {monthlyTrend.map((month) => (
            <div key={month.month} className="flex h-full flex-1 flex-col items-center">
              <div className="flex w-full flex-1 items-end justify-center gap-1">
                <div
                  className={cn('w-1/2 rounded-t-sm bg-accent', !month.active && 'bg-accent/60')}
                  style={{ height: `${(month.current / barMax) * 100}%` }}
                  title={`${month.label} 本月 ${month.current.toLocaleString()} kWh`}
                />
                <div
                  className="w-1/2 rounded-t-sm border border-line bg-line-strong"
                  style={{ height: `${(month.previous / barMax) * 100}%` }}
                  title={`${month.label} 上月 ${month.previous.toLocaleString()} kWh`}
                />
              </div>
              <span
                className={cn('mt-1.5 font-mono text-[11px]', month.active ? 'text-accent' : 'text-ink-3')}
              >
                {month.label}
              </span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="各指标本月对比上月" flush>
        <ul className="divide-y divide-line">
          {momData.map((item) => {
            const percentage = (item.current / (item.current + item.previous)) * 100;
            return (
              <li key={item.category} className="flex items-center gap-3 px-4 py-2.5">
                <span className="w-20 shrink-0 text-[13px] text-ink">{item.category}</span>
                <div className="progress-bar flex flex-1">
                  <div className="progress-fill bg-accent" style={{ width: `${percentage}%` }} />
                  <div className="progress-fill bg-line-strong" style={{ width: `${100 - percentage}%` }} />
                </div>
                <span className="w-32 shrink-0 text-right font-mono text-[12px] text-ink-2">
                  {(item.current / 10000).toFixed(1)} / {(item.previous / 10000).toFixed(1)} 万{item.unit}
                </span>
                <span
                  className={cn(
                    'inline-flex w-20 shrink-0 items-center justify-end gap-1 font-mono text-[12px]',
                    item.change > 0 ? 'text-danger' : 'text-ok',
                  )}
                >
                  {item.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {item.change > 0 ? '+' : ''}
                  {item.change}%
                </span>
              </li>
            );
          })}
        </ul>
      </Panel>

      <Panel title="环比分析摘要">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="rounded border border-ok/40 bg-ok/10 p-3">
            <h3 className="text-[13px] font-semibold text-ok">下降项</h3>
            <p className="mt-1 text-[12px] text-ink-2">
              {fallingItems.length > 0 ? fallingItems.map((item) => item.category).join('、') : '无'}
            </p>
          </div>
          <div className="rounded border border-danger/40 bg-danger/10 p-3">
            <h3 className="text-[13px] font-semibold text-danger">上升项</h3>
            <p className="mt-1 text-[12px] text-ink-2">
              {risingItems.length > 0 ? risingItems.map((item) => item.category).join('、') : '无'}
            </p>
          </div>
          <div className="rounded border border-warn/40 bg-warn/10 p-3">
            <h3 className="text-[13px] font-semibold text-warn">主要原因</h3>
            <p className="mt-1 text-[12px] text-ink-2">生产任务增加约12%</p>
          </div>
          <div className="rounded border border-accent/40 bg-accent/10 p-3">
            <h3 className="text-[13px] font-semibold text-accent">建议措施</h3>
            <p className="mt-1 text-[12px] text-ink-2">优化生产排班，合理安排设备运行</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
