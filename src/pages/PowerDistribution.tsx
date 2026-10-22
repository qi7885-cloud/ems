import { powerDistributionData } from '../data/mockData';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import MetricStrip from '../components/MetricStrip';
import { cn } from '../lib/utils';
import { Zap, Gauge, TrendingUp, Server } from 'lucide-react';

/** 负载率 = 电流 / 额定电流 × 100%，额定电流由数据层提供，不再对所有设备硬编码 500A */
const getLoadRate = (current: number, ratedCurrent: number): number =>
  ratedCurrent > 0 ? (current / ratedCurrent) * 100 : 0;

/** 负载率分级：< 60% 绿，60~85% 黄，≥ 85% 红 */
const getLoadColor = (rate: number): string => {
  if (rate >= 85) return 'bg-danger';
  if (rate >= 60) return 'bg-warn';
  return 'bg-ok';
};

const getLoadTextColor = (rate: number): string => {
  if (rate >= 85) return 'text-danger';
  if (rate >= 60) return 'text-warn';
  return 'text-ok';
};

export default function PowerDistribution() {
  // 顶部指标全部由现有设备数据派生
  const totalRated = powerDistributionData.reduce((sum, item) => sum + item.ratedCurrent, 0);
  const loadRates = powerDistributionData.map((item) => getLoadRate(item.current, item.ratedCurrent));
  const avgRate = loadRates.length ? loadRates.reduce((a, b) => a + b, 0) / loadRates.length : 0;
  const maxRate = loadRates.length ? Math.max(...loadRates) : 0;

  return (
    <div className="space-y-3">
      <PageHeader title="配电监测" description="实时监测配电系统的运行状态">
        <span className="flex items-center gap-2 rounded-sm border border-line bg-panel px-2.5 py-1.5">
          <span className="status-dot status-online animate-pulse-soft" />
          <span className="font-mono text-[11px] text-ink-2">数据采集中</span>
        </span>
      </PageHeader>

      <MetricStrip
        cols={4}
        items={[
          { label: '额定总容量', value: totalRated, unit: 'A', icon: Zap, note: '按额定电流合计' },
          { label: '平均负载率', value: avgRate.toFixed(0), unit: '%', icon: Gauge, note: '全部回路均值' },
          {
            label: '最高负载率',
            value: maxRate.toFixed(0),
            unit: '%',
            icon: TrendingUp,
            tone: maxRate >= 85 ? 'danger' : maxRate >= 60 ? 'warn' : 'ok',
            note: maxRate >= 85 ? '存在超载风险' : '处于安全区间',
          },
          { label: '在线设备数', value: powerDistributionData.length, unit: '台', icon: Server, note: '全部在线' },
        ]}
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {powerDistributionData.map((item) => {
          const loadRate = getLoadRate(item.current, item.ratedCurrent);
          return (
            <Panel
              key={item.name}
              title={item.name}
              aside={
                <span className="flex items-center gap-1.5">
                  <span className="status-dot status-online" />
                  <span className="text-ok">正常运行</span>
                </span>
              }
            >
              <div className="space-y-2">
                {[
                  { label: '电流', value: item.current, unit: 'A' },
                  { label: '电压', value: item.voltage, unit: 'kV' },
                  { label: '功率', value: item.power, unit: 'kW' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-[12px]">
                    <span className="text-ink-3">{row.label}</span>
                    <span className="font-mono text-ink">
                      {row.value}
                      <span className="ml-1 text-ink-3">{row.unit}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 border-t border-line pt-3">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-ink-3">负载率</span>
                  <span className={cn('font-mono font-medium', getLoadTextColor(loadRate))}>
                    {loadRate.toFixed(0)}%
                  </span>
                </div>
                <div className="progress-bar mt-2">
                  <div
                    className={cn('progress-fill', getLoadColor(loadRate))}
                    style={{ width: `${Math.min(100, loadRate)}%` }}
                  />
                </div>
                <div className="mt-2 font-mono text-[11px] text-ink-3">额定电流 {item.ratedCurrent} A</div>
              </div>
            </Panel>
          );
        })}
      </div>

      <Panel title="配电系统拓扑图" aside={<span>电网 → 主配电柜 → 变压器 → 出线</span>}>
        <div className="rounded-sm border border-line bg-inset p-5">
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-5 flex justify-center">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent font-bold text-canvas">
                  电网
                </div>
                <div className="h-1 w-20 bg-line-strong" />
                <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-warn text-sm font-bold text-canvas">
                  主配电柜
                </div>
              </div>
            </div>
            <div className="col-span-5 mt-5 flex justify-center">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-warn text-sm font-bold text-canvas">
                  变压器A
                </div>
                <div className="h-1 w-12 bg-line-strong" />
                <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-warn text-sm font-bold text-canvas">
                  主配电柜
                </div>
                <div className="h-1 w-12 bg-line-strong" />
                <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-warn text-sm font-bold text-canvas">
                  变压器B
                </div>
              </div>
            </div>
            <div className="col-span-5 mt-5 flex justify-center">
              <div className="flex items-center gap-5">
                {['出线1', '出线2', '出线3'].map((name) => (
                  <div key={name} className="flex flex-col items-center">
                    <div className="h-12 w-0.5 bg-line-strong" />
                    <div className="mt-2 flex h-12 w-12 items-center justify-center rounded-sm bg-ok text-xs font-medium text-canvas">
                      {name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
