import { useMemo } from 'react';
import { Activity, CheckCircle, XCircle, PauseCircle } from 'lucide-react';
import { getHourlyIntensity, generateTimeLabels } from '../data/mockData';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import MetricStrip from '../components/MetricStrip';
import Empty from '../components/Empty';

type OperationStatus = 'normal' | 'warning' | 'error';

interface OperationRow {
  equipment: string;
  status: OperationStatus;
  uptime: string;
  today: string;
  efficiency: string;
}

/** 设备运行清单：汇总指标与表格均由此派生，保证数量口径一致 */
const operationData: OperationRow[] = [
  { equipment: '主配电柜', status: 'normal', uptime: '99.8%', today: '14小时30分', efficiency: '95%' },
  { equipment: '变压器A', status: 'normal', uptime: '99.5%', today: '14小时', efficiency: '92%' },
  { equipment: '变压器B', status: 'warning', uptime: '98.2%', today: '13小时45分', efficiency: '88%' },
  { equipment: '水表-1号', status: 'normal', uptime: '99.9%', today: '14小时30分', efficiency: '100%' },
  { equipment: '空压机', status: 'error', uptime: '95.0%', today: '12小时', efficiency: '75%' },
];

const statusConfig: Record<OperationStatus, { icon: typeof CheckCircle; tag: string; text: string }> = {
  normal: { icon: CheckCircle, tag: 'tag-ok', text: '正常运行' },
  warning: { icon: PauseCircle, tag: 'tag-warn', text: '性能下降' },
  error: { icon: XCircle, tag: 'tag-danger', text: '故障' },
};

const CHART_HEIGHT = 120;

/** 运行效率分档配色：≥90 ok / ≥80 warn / 其余 danger */
const efficiencyBar = (efficiency: string) => {
  const value = parseInt(efficiency);
  if (value >= 90) return 'bg-ok';
  if (value >= 80) return 'bg-warn';
  return 'bg-danger';
};

export default function StatisticsOperation() {
  // 确定性序列：同一 key 永远得到同一组柱高，避免重渲染时柱子跳动
  const hourlyIntensity = useMemo(() => getHourlyIntensity('operation-hourly', 24), []);
  const hourLabels = useMemo(() => generateTimeLabels(24), []);

  const metrics = useMemo(
    () => [
      { label: '设备总数', value: operationData.length, unit: '台', icon: Activity },
      {
        label: '运行中',
        value: operationData.filter((i) => i.status === 'normal').length,
        unit: '台',
        icon: CheckCircle,
        tone: 'ok' as const,
      },
      {
        label: '维护中',
        value: operationData.filter((i) => i.status === 'warning').length,
        unit: '台',
        icon: PauseCircle,
        tone: 'warn' as const,
      },
      {
        label: '故障',
        value: operationData.filter((i) => i.status === 'error').length,
        unit: '台',
        icon: XCircle,
        tone: 'danger' as const,
      },
    ],
    [],
  );

  return (
    <div className="space-y-3">
      <PageHeader title="运行报表" description="设备运行状态统计和效率分析" />

      <MetricStrip cols={4} items={metrics} />

      <Panel title="设备运行清单" aside={<span className="font-mono text-[11px]">共 {operationData.length} 台</span>} flush>
        {operationData.length === 0 ? (
          <Empty title="暂无运行数据" description="当前没有可统计的设备运行记录" />
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>设备名称</th>
                  <th>运行状态</th>
                  <th className="text-right">设备可用率</th>
                  <th className="text-right">今日运行时长</th>
                  <th>运行效率</th>
                </tr>
              </thead>
              <tbody>
                {operationData.map((item) => {
                  const config = statusConfig[item.status];
                  const StatusIcon = config.icon;
                  return (
                    <tr key={item.equipment}>
                      <td className="font-medium text-ink">{item.equipment}</td>
                      <td>
                        <span className={config.tag}>
                          <StatusIcon className="h-3 w-3" />
                          {config.text}
                        </span>
                      </td>
                      <td className="text-right font-mono text-ink-2">{item.uptime}</td>
                      <td className="text-right font-mono text-ink-2">{item.today}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="progress-bar w-16 shrink-0">
                            <div className={`progress-fill ${efficiencyBar(item.efficiency)}`} style={{ width: item.efficiency }} />
                          </div>
                          <span className="font-mono text-[12px] text-ink">{item.efficiency}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Panel
        title="今日运行趋势"
        description="纵轴：设备运行强度（相对值 0–100，每小时采样，数值越高表示该小时设备负载越高）"
        aside={<span className="font-mono text-[11px]">0 – 100</span>}
      >
        <div className="flex items-end justify-between gap-2" style={{ height: `${CHART_HEIGHT + 24}px` }}>
          {hourlyIntensity.map((value, index) => (
            <div key={hourLabels[index]} className="flex h-full flex-1 flex-col items-center justify-end">
              <div
                className="w-full rounded-t bg-accent"
                style={{ height: `${Math.max(8, Math.round(8 + value * 1.2))}px` }}
                title={`${hourLabels[index]} 运行强度 ${value}`}
              />
              <span className="mt-2 font-mono text-[11px] text-ink-3">{hourLabels[index]}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
