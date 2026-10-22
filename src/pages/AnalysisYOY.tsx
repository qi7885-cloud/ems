import { useMemo, useState } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { yearOptions, seededValue } from '../data/mockData';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import MetricStrip from '../components/MetricStrip';
import { cn } from '../lib/utils';

const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月'];
// 本期柱色：强调青（#22d3ee，深色主题下即 bg-accent）；去年同期用 bg-line-strong 对比
const SERIES_CURRENT = '#22d3ee';

export default function AnalysisYOY() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const prevYear = String(parseInt(selectedYear) - 1);

  // 本期与去年同期都随所选年份派生，切换年份数字必变
  const yoyData = useMemo(
    () =>
      MONTHS.map((label, index) => {
        const mm = String(index + 1).padStart(2, '0');
        const current = seededValue(`yoy-${selectedYear}-current-${mm}`, 2600000, 3850000, 0);
        const previous = seededValue(`yoy-${selectedYear}-previous-${mm}`, 2450000, 3600000, 0);
        // 同比 = (本期 - 去年同期) / 去年同期 × 100%
        const change = Number((((current - previous) / previous) * 100).toFixed(1));
        return { month: label, current, previous, change };
      }),
    [selectedYear],
  );

  const totalCurrent = yoyData.reduce((sum, item) => sum + item.current, 0);
  const totalPrevious = yoyData.reduce((sum, item) => sum + item.previous, 0);
  const totalChange = Number((((totalCurrent - totalPrevious) / totalPrevious) * 100).toFixed(1));
  // 日均：按 30 天/月估算本期累计的日均值
  const dailyAvg = Math.round(totalCurrent / (MONTHS.length * 30));
  // 图柱高度基准：与原有量级保持一致
  const barMax = 4000000;

  return (
    <div className="space-y-3">
      <PageHeader title="能耗同比分析" description="与去年同期数据进行对比分析">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="field h-7"
          aria-label="选择年份"
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}年
            </option>
          ))}
        </select>
      </PageHeader>

      <MetricStrip
        cols={4}
        items={[
          { label: '本期累计', value: totalCurrent, unit: 'kWh', tone: 'accent', note: `${selectedYear} 年` },
          { label: '去年同期', value: totalPrevious, unit: 'kWh', note: `${prevYear} 年` },
          {
            label: '同比',
            value: `${totalChange > 0 ? '+' : ''}${totalChange}`,
            unit: '%',
            // 国内工业口径：能耗同比上升=恶化=danger 红，下降=改善=ok 绿
            tone: totalChange > 0 ? 'danger' : 'ok',
            note: totalChange > 0 ? '能耗同比上升' : '能耗同比下降',
          },
          { label: '日均', value: dailyAvg, unit: 'kWh', note: '按 30 天/月估算' },
        ]}
      />

      <Panel
        title="月度同比对比"
        aside={
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: SERIES_CURRENT }} />
              {selectedYear} 年
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm border border-line bg-line-strong" />
              {prevYear} 年
            </span>
          </span>
        }
      >
        <div className="flex h-56 items-end gap-3">
          {yoyData.map((month) => (
            <div key={month.month} className="flex h-full flex-1 flex-col items-center">
              <div className="flex w-full flex-1 items-end justify-center gap-1">
                <div
                  className="w-1/2 rounded-t-sm"
                  style={{ height: `${(month.current / barMax) * 100}%`, backgroundColor: SERIES_CURRENT }}
                  title={`${month.month} 本期 ${month.current.toLocaleString()} kWh`}
                />
                <div
                  className="w-1/2 rounded-t-sm border border-line bg-line-strong"
                  style={{ height: `${(month.previous / barMax) * 100}%` }}
                  title={`${month.month} 去年同期 ${month.previous.toLocaleString()} kWh`}
                />
              </div>
              <span className="mt-1.5 font-mono text-[11px] text-ink-3">{month.month}</span>
              <span
                className={cn(
                  'mt-1 inline-flex items-center gap-0.5 font-mono text-[11px]',
                  month.change > 0 ? 'text-danger' : 'text-ok',
                )}
              >
                {month.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {month.change > 0 ? '+' : ''}
                {month.change}%
              </span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="同比明细" aside={<span className="font-mono text-[11px]">单位 kWh</span>} flush>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>月份</th>
                <th className="text-right">本期 ({selectedYear})</th>
                <th className="text-right">去年同期 ({prevYear})</th>
                <th className="text-right">同比</th>
              </tr>
            </thead>
            <tbody>
              {yoyData.map((month) => (
                <tr key={month.month}>
                  <td className="text-ink">{month.month}</td>
                  <td className="text-right font-mono">{month.current.toLocaleString()}</td>
                  <td className="text-right font-mono text-ink-2">{month.previous.toLocaleString()}</td>
                  <td className="text-right">
                    <span
                      className={cn(
                        'inline-flex items-center justify-end gap-1 font-mono',
                        month.change > 0 ? 'text-danger' : 'text-ok',
                      )}
                    >
                      {month.change > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {month.change > 0 ? '+' : ''}
                      {month.change}%
                    </span>
                  </td>
                </tr>
              ))}
              <tr>
                <td className="font-medium text-ink">合计</td>
                <td className="text-right font-mono font-medium text-ink">{totalCurrent.toLocaleString()}</td>
                <td className="text-right font-mono font-medium text-ink-2">
                  {totalPrevious.toLocaleString()}
                </td>
                <td className="text-right">
                  <span
                    className={cn(
                      'font-mono font-medium',
                      totalChange > 0 ? 'text-danger' : 'text-ok',
                    )}
                  >
                    {totalChange > 0 ? '+' : ''}
                    {totalChange}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="同比分析报告">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded border border-ok/40 bg-ok/10 p-3">
            <h3 className="text-[13px] font-semibold text-ok">节能成效</h3>
            <p className="mt-1 text-[12px] text-ink-2">通过技术改造和管理优化，上半年单位产品能耗同比下降3.2%。</p>
          </div>
          <div className="rounded border border-warn/40 bg-warn/10 p-3">
            <h3 className="text-[13px] font-semibold text-warn">关注事项</h3>
            <p className="mt-1 text-[12px] text-ink-2">6月份能耗同比增长4.7%，主要受生产任务增加影响。</p>
          </div>
          <div className="rounded border border-accent/40 bg-accent/10 p-3">
            <h3 className="text-[13px] font-semibold text-accent">改进建议</h3>
            <p className="mt-1 text-[12px] text-ink-2">建议加强非工作时段能耗管控，优化设备运行调度。</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
