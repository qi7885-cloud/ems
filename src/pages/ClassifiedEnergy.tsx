import { categoryEnergyData } from '../data/mockData';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import MetricStrip from '../components/MetricStrip';
import { cn } from '../lib/utils';
import { Droplets, Zap, Factory, Building2, Lightbulb, TrendingDown, TrendingUp } from 'lucide-react';

const categoryIcons = {
  造纸车间: Factory,
  水处理车间: Droplets,
  配电室: Zap,
  办公楼: Building2,
  其他: Lightbulb,
};

/** 分类占比条配色，全部来自语义令牌 */
const categoryColors = {
  造纸车间: 'bg-accent',
  水处理车间: 'bg-accent',
  配电室: 'bg-ok',
  办公楼: 'bg-warn',
  其他: 'bg-info',
};

export default function ClassifiedEnergy() {
  // 汇总指标全部由现有分类数据派生
  const totalPower = categoryEnergyData.reduce((sum, item) => sum + item.power, 0);
  const maxUnitEnergy = categoryEnergyData.length
    ? Math.max(...categoryEnergyData.map((item) => item.unitEnergy))
    : 0;
  const avgYoy = categoryEnergyData.length
    ? categoryEnergyData.reduce((sum, item) => sum + item.yoy, 0) / categoryEnergyData.length
    : 0;

  return (
    <div className="space-y-3">
      <PageHeader title="分类能耗监测" description="按部门/区域/设备分类监测能耗数据" />

      <MetricStrip
        cols={4}
        items={[
          { label: '总能耗', value: totalPower, unit: 'kWh', icon: Zap, note: '分类之和' },
          { label: '分类数', value: categoryEnergyData.length, unit: '类', icon: Building2, note: '在用分类' },
          {
            label: '最高单位能耗',
            value: maxUnitEnergy,
            unit: 'kWh/吨',
            icon: Factory,
            tone: 'warn',
            note: '需重点管控',
          },
          {
            label: '平均同比',
            value: avgYoy.toFixed(1),
            unit: '%',
            icon: TrendingDown,
            tone: avgYoy <= 0 ? 'ok' : 'danger',
            note: avgYoy <= 0 ? '同比下降' : '同比上升',
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {categoryEnergyData.map((item) => {
          const IconComponent = categoryIcons[item.category as keyof typeof categoryIcons] || Lightbulb;
          const colorClass = categoryColors[item.category as keyof typeof categoryColors] || 'bg-ink-3';

          return (
            <Panel
              key={item.category}
              title={item.category}
              aside={<IconComponent className="h-3.5 w-3.5 text-ink-3" />}
            >
              <div className="flex items-baseline justify-between">
                <span className="metric-value">{item.percentage}<span className="metric-unit">%</span></span>
                <span className="font-mono text-[11px] text-ink-3">{item.power.toLocaleString()} kWh</span>
              </div>
              <div className="progress-bar mt-3">
                <div className={cn('progress-fill', colorClass)} style={{ width: `${item.percentage}%` }} />
              </div>
              <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-ink-3">
                <span>占比</span>
                <span
                  className={cn(
                    'inline-flex items-center gap-1',
                    item.yoy <= 0 ? 'text-ok' : 'text-danger',
                  )}
                >
                  {item.yoy <= 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                  {item.yoy > 0 ? '+' : ''}
                  {item.yoy}%
                </span>
              </div>
            </Panel>
          );
        })}
      </div>

      <Panel title="分类能耗明细" flush>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>分类</th>
                <th className="text-right">用电量 (kWh)</th>
                <th className="text-right">占比</th>
                <th className="text-right">单位能耗 (kWh/吨)</th>
                <th className="text-right">同比</th>
              </tr>
            </thead>
            <tbody>
              {categoryEnergyData.map((item) => {
                const Icon = categoryIcons[item.category as keyof typeof categoryIcons];
                return (
                  <tr key={item.category}>
                    <td>
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className="h-3.5 w-3.5 text-ink-3" />}
                        <span className="font-medium text-ink">{item.category}</span>
                      </div>
                    </td>
                    <td className="text-right font-mono">{item.power.toLocaleString()}</td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <div className="progress-bar w-20">
                          <div
                            className={cn(
                              'progress-fill',
                              categoryColors[item.category as keyof typeof categoryColors] || 'bg-ink-3',
                            )}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="w-10 text-right font-mono">{item.percentage}%</span>
                      </div>
                    </td>
                    <td className="text-right font-mono">{item.unitEnergy}</td>
                    <td className="text-right">
                      <span
                        className={cn(
                          'inline-flex items-center justify-end gap-1 font-mono',
                          item.yoy <= 0 ? 'text-ok' : 'text-danger',
                        )}
                      >
                        {item.yoy <= 0 ? (
                          <TrendingDown className="h-3 w-3" />
                        ) : (
                          <TrendingUp className="h-3 w-3" />
                        )}
                        {item.yoy > 0 ? '+' : ''}
                        {item.yoy}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
