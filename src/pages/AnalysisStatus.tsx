import { Activity, Pause } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import MetricStrip from '../components/MetricStrip';
import Empty from '../components/Empty';
import { cn } from '../lib/utils';

// 24 小时状态柱状图的语义配色：工作=正常绿、午休=预警橙、下班=强调青、非工作=停（弱灰）
const HOUR_TONE: Record<string, string> = {
  工作: 'bg-ok',
  午休: 'bg-warn',
  下班: 'bg-accent',
  非工作: 'bg-ink-3',
};

const HOUR_LEGEND = [
  { label: '工作', cls: 'bg-ok' },
  { label: '午休', cls: 'bg-warn' },
  { label: '下班', cls: 'bg-accent' },
  { label: '非工作', cls: 'bg-ink-3' },
];

export default function AnalysisStatus() {
  const statusData = [
    { period: '工作时间', power: 95000, water: 7200, percentage: 76 },
    { period: '非工作时间', power: 30000, water: 1300, percentage: 24 },
  ];

  const workingHours = [
    { hour: '08:00', power: 8500, status: '工作' },
    { hour: '09:00', power: 9200, status: '工作' },
    { hour: '10:00', power: 9500, status: '工作' },
    { hour: '11:00', power: 9800, status: '工作' },
    { hour: '12:00', power: 7500, status: '午休' },
    { hour: '13:00', power: 8800, status: '工作' },
    { hour: '14:00', power: 9300, status: '工作' },
    { hour: '15:00', power: 9600, status: '工作' },
    { hour: '16:00', power: 9400, status: '工作' },
    { hour: '17:00', power: 8200, status: '工作' },
    { hour: '18:00', power: 4500, status: '下班' },
    { hour: '19:00', power: 2500, status: '非工作' },
  ];

  // 指标全部由现有 12 个整点采样派生（每个采样点视作一个设备状态读数）：
  // 设备总数=采样点数；运行中/待机/离线=对应状态计数；平均负载率=平均功率/峰值功率。
  const sampleCount = workingHours.length;
  const runningCount = workingHours.filter((h) => h.status === '工作').length;
  const standbyCount = workingHours.filter((h) => h.status === '午休').length;
  const offlineCount = workingHours.filter((h) => h.status === '下班' || h.status === '非工作').length;
  const maxHourlyPower = Math.max(...workingHours.map((h) => h.power));
  const sumHourlyPower = workingHours.reduce((sum, h) => sum + h.power, 0);
  const avgLoadRate = sampleCount > 0 ? ((sumHourlyPower / sampleCount / maxHourlyPower) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-3">
      <PageHeader title="能耗状态分析" description="分析工作与非工作时段的能耗差异" />

      <MetricStrip
        cols={5}
        items={[
          { label: '设备总数', value: sampleCount, unit: '台', note: '整点采样点' },
          { label: '运行中', value: runningCount, unit: '台', tone: 'ok', note: '工作时段' },
          { label: '待机', value: standbyCount, unit: '台', tone: 'warn', note: '午休时段' },
          { label: '离线', value: offlineCount, unit: '台', note: '下班/非工作' },
          { label: '平均负载率', value: avgLoadRate, unit: '%', tone: 'accent', note: '相对峰值功率' },
        ]}
      />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Panel title="工作状态能耗占比">
          <div className="flex items-center gap-6">
            <div className="relative h-36 w-36 shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" strokeWidth="10" className="stroke-line-strong" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  strokeWidth="10"
                  strokeLinecap="round"
                  className="stroke-ok"
                  strokeDasharray={`${statusData[0].percentage * 2.51} 251`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="metric-value text-ok">{statusData[0].percentage}%</span>
                <span className="mt-1 text-[11px] text-ink-3">工作时段占比</span>
              </div>
            </div>
            <div className="min-w-0 flex-1 space-y-2 text-[12px]">
              <div className="flex items-center justify-between">
                <span className="text-ink-2">工作时段能耗</span>
                <span className="font-mono text-ink">{statusData[0].power.toLocaleString()} kWh</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-2">非工作时段能耗</span>
                <span className="font-mono text-ink">{statusData[1].power.toLocaleString()} kWh</span>
              </div>
              <div className="flex items-center justify-between border-t border-line pt-2">
                <span className="text-ink-2">工作 / 非工作</span>
                <span className="font-mono text-accent">
                  {(statusData[0].power / statusData[1].power).toFixed(1)} : 1
                </span>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="状态对比" aside={<span className="font-mono text-[11px]">kWh</span>}>
          <div className="space-y-4">
            {statusData.map((item, index) => (
              <div key={item.period} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-line bg-inset">
                  {index === 0 ? (
                    <Activity className="h-4 w-4 text-ok" />
                  ) : (
                    <Pause className="h-4 w-4 text-ink-3" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-ink">{item.period}</span>
                    <span className="font-mono text-[12px] text-ink-2">{item.power.toLocaleString()}</span>
                  </div>
                  <div className="progress-bar mt-1.5">
                    <div
                      className={cn('progress-fill', index === 0 ? 'bg-ok' : 'bg-ink-3')}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
                <span className="w-10 shrink-0 text-right font-mono text-[12px] text-ink-2">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="24 小时能耗与状态" aside={<span className="font-mono text-[11px]">单位 kW</span>}>
        {workingHours.length === 0 ? (
          <Empty title="暂无数据" description="未采集到整点能耗数据" />
        ) : (
          <>
            <div className="flex h-48 items-end gap-1.5">
              {workingHours.map((hour) => (
                <div key={hour.hour} className="flex h-full flex-1 flex-col items-center">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className={cn('w-full rounded-t-sm', HOUR_TONE[hour.status] ?? 'bg-ink-3')}
                      style={{ height: `${(hour.power / 10000) * 100}%` }}
                      title={`${hour.hour} · ${hour.power} kW`}
                    />
                  </div>
                  <span className="mt-1.5 font-mono text-[10px] text-ink-3">{hour.hour.slice(0, 2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-line pt-3">
              {HOUR_LEGEND.map((item) => (
                <span key={item.label} className="flex items-center gap-1.5 text-[12px] text-ink-2">
                  <span className={cn('h-3 w-3 rounded-sm', item.cls)} />
                  {item.label}
                </span>
              ))}
            </div>
          </>
        )}
      </Panel>
    </div>
  );
}
