import { useMemo, useState } from 'react';
import { offlineEvents } from '../data/mockData';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import MetricStrip from '../components/MetricStrip';
import { cn } from '../lib/utils';
import { WifiOff, Clock, Timer, Activity, Server, RefreshCw } from 'lucide-react';

/** 各离线原因对应的语义色，未命中的原因走灰色兜底 */
const reasonStyles: Record<string, { text: string; bar: string }> = {
  网络中断: { text: 'text-danger', bar: 'bg-danger' },
  设备维护: { text: 'text-warn', bar: 'bg-warn' },
  网关重启: { text: 'text-accent', bar: 'bg-accent' },
};

const fallbackStyle = { text: 'text-ink-2', bar: 'bg-ink-3' };

/** 单条事件的离线时长（分钟），未恢复的按当前时间计算 */
const eventDuration = (startTime: string, endTime: string | null): number => {
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime).getTime() : Date.now();
  return Math.max(0, Math.round((end - start) / 60000));
};

export default function OfflineEvents() {
  const [lastRefresh, setLastRefresh] = useState(() => new Date().toLocaleTimeString('zh-CN'));
  const [justRefreshed, setJustRefreshed] = useState(false);

  // 按原因分组统计次数，柱宽按「次数 / 最大次数」比例计算
  const reasonStats = useMemo(() => {
    const counter = new Map<string, number>();
    offlineEvents.forEach((event) => counter.set(event.reason, (counter.get(event.reason) ?? 0) + 1));
    return Array.from(counter, ([reason, count]) => ({ reason, count }));
  }, []);

  const maxReasonCount = reasonStats.reduce((max, item) => Math.max(max, item.count), 0);

  // 累计离线时长与平均离线时长均由当前数据派生
  const totalDuration = useMemo(
    () => offlineEvents.reduce((sum, event) => sum + eventDuration(event.start_time, event.end_time), 0),
    [],
  );

  const avgDuration = useMemo(() => {
    if (offlineEvents.length === 0) return 0;
    return Math.round(totalDuration / offlineEvents.length);
  }, [totalDuration]);

  // 涉及设备数 = 出现过的设备去重数量
  const equipmentCount = useMemo(
    () => new Set(offlineEvents.map((event) => event.equipment_id)).size,
    [],
  );

  const handleRefresh = () => {
    setLastRefresh(new Date().toLocaleTimeString('zh-CN'));
    setJustRefreshed(true);
    window.setTimeout(() => setJustRefreshed(false), 1500);
  };

  return (
    <div className="space-y-3">
      <PageHeader title="离线事件" description="查看设备离线记录和原因分析">
        <span className="font-mono text-[11px] text-ink-3">最后刷新 {lastRefresh}</span>
        <button onClick={handleRefresh} className="btn-secondary">
          <RefreshCw className={cn('h-3.5 w-3.5', justRefreshed && 'animate-spin')} />
          {justRefreshed ? '已刷新' : '刷新'}
        </button>
      </PageHeader>

      <MetricStrip
        cols={5}
        items={[
          { label: '本月离线次数', value: offlineEvents.length, unit: '次', icon: WifiOff, tone: 'danger' },
          { label: '涉及设备数', value: equipmentCount, unit: '台', icon: Server, note: '去重统计' },
          { label: '累计离线时长', value: totalDuration, unit: '分钟', icon: Clock },
          { label: '平均离线时长', value: avgDuration, unit: '分钟', icon: Timer, note: '单次平均' },
          { label: '当前在线率', value: '98.5', unit: '%', icon: Activity, tone: 'ok' },
        ]}
      />

      <Panel title="离线记录" flush>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>设备名称</th>
                <th>开始时间</th>
                <th>结束时间</th>
                <th className="text-right">持续时长</th>
                <th>原因</th>
              </tr>
            </thead>
            <tbody>
              {offlineEvents.map((event) => {
                const duration = eventDuration(event.start_time, event.end_time);

                return (
                  <tr key={event.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <WifiOff className="h-3.5 w-3.5 text-danger" />
                        <span className="font-medium text-ink">{event.equipment_name}</span>
                      </div>
                    </td>
                    <td className="font-mono text-ink-2">{event.start_time}</td>
                    <td className="font-mono text-ink-2">{event.end_time || '未恢复'}</td>
                    <td className="text-right">
                      <span className={duration > 30 ? 'tag-danger' : 'tag-warn'}>{duration} 分钟</span>
                    </td>
                    <td className="text-ink-2">{event.reason}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="离线原因分析">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {reasonStats.map(({ reason, count }) => {
            const style = reasonStyles[reason] ?? fallbackStyle;
            const pct = maxReasonCount > 0 ? (count / maxReasonCount) * 100 : 0;
            return (
              <div key={reason} className="rounded-sm border border-line bg-inset p-3">
                <div className="flex items-baseline justify-between">
                  <span className={cn('text-[12px]', style.text)}>{reason}</span>
                  <span className="font-mono text-[18px] font-semibold text-ink">
                    {count}
                    <span className="ml-1 text-[11px] font-normal text-ink-3">次</span>
                  </span>
                </div>
                <div className="progress-bar mt-2">
                  <div className={cn('progress-fill', style.bar)} style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-1.5 font-mono text-[11px] text-ink-3">相对最高次数 {pct.toFixed(0)}%</div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
