import { useMemo, useState } from 'react';
import { transformerData, seededSeries, generateTimeLabels } from '../data/mockData';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import MetricStrip from '../components/MetricStrip';
import Empty from '../components/Empty';
import { cn } from '../lib/utils';
import { Thermometer, Activity, TrendingUp, AlertTriangle, Gauge } from 'lucide-react';

/** 温度分级阈值（℃）：< 70 正常(绿)，70~85 偏高(黄)，> 85 危险(红) */
const TEMP_WARNING = 70;
const TEMP_DANGER = 85;

/** 将温度映射为柱高百分比（40℃ 起算，100℃ 对应 140%，再做上下限保护） */
const toBarHeight = (temperature: number): number =>
  Math.min(100, Math.max(8, ((temperature - 40) / (100 - 40)) * 140));

const toBarColor = (temperature: number): string => {
  if (temperature > TEMP_DANGER) return 'bg-danger';
  if (temperature >= TEMP_WARNING) return 'bg-warn';
  return 'bg-ok';
};

/** 温度状态文案与标签配色，与柱状图共用同一套阈值 */
const tempStatus = (temperature: number): { label: string; tag: string } => {
  if (temperature > TEMP_DANGER) return { label: '危险', tag: 'tag-danger' };
  if (temperature >= TEMP_WARNING) return { label: '偏高', tag: 'tag-warn' };
  return { label: '良好', tag: 'tag-ok' };
};

/** 负载状态文案与标签配色（沿用原有 60 / 80 分档） */
const loadStatus = (loadRate: number): { label: string; tag: string } => {
  if (loadRate > 80) return { label: '过载', tag: 'tag-danger' };
  if (loadRate > 60) return { label: '正常', tag: 'tag-warn' };
  return { label: '偏低', tag: 'tag-ok' };
};

export default function Transformer() {
  const [selectedTransformer, setSelectedTransformer] = useState(0);
  const [showTrend, setShowTrend] = useState(true);

  // 数组为空时兜底，避免直接下标访问出现 undefined
  const transformer = transformerData[selectedTransformer] ?? transformerData[0];

  const trendLabels = useMemo(() => generateTimeLabels(24), []);

  // 以所选变压器的实际温度为中心上下浮动；切换变压器时序列随之变化
  const trendValues = useMemo(() => {
    const center = transformer?.temperature ?? 60;
    return seededSeries(`transformer-trend-${selectedTransformer}`, 24, center - 8, center + 8, 1);
  }, [selectedTransformer, transformer?.temperature]);

  // 顶部指标全部由现有变压器数据派生
  const maxTemp = transformerData.length ? Math.max(...transformerData.map((t) => t.temperature)) : 0;
  const avgLoad = transformerData.length
    ? transformerData.reduce((sum, t) => sum + t.load_rate, 0) / transformerData.length
    : 0;
  const maxLoad = transformerData.length ? Math.max(...transformerData.map((t) => t.load_rate)) : 0;
  const tempMeta = tempStatus(maxTemp);

  if (!transformer) {
    return (
      <div className="space-y-3">
        <PageHeader title="变压器监测" description="实时监测变压器的运行状态" />
        <Panel flush>
          <Empty title="暂无变压器数据" />
        </Panel>
      </div>
    );
  }

  const currentTempStatus = tempStatus(transformer.temperature);
  const currentLoadStatus = loadStatus(transformer.load_rate);

  return (
    <div className="space-y-3">
      <PageHeader title="变压器监测" description="实时监测变压器的运行状态" />

      <MetricStrip
        cols={4}
        items={[
          { label: '变压器台数', value: transformerData.length, unit: '台', icon: Activity, note: '在网运行' },
          {
            label: '最高温度',
            value: maxTemp,
            unit: '°C',
            icon: Thermometer,
            tone: maxTemp > TEMP_DANGER ? 'danger' : maxTemp >= TEMP_WARNING ? 'warn' : 'ok',
            note: tempMeta.label,
          },
          { label: '平均负载率', value: avgLoad.toFixed(0), unit: '%', icon: Gauge, note: '全部变压器均值' },
          {
            label: '最高负载率',
            value: maxLoad.toFixed(0),
            unit: '%',
            icon: TrendingUp,
            tone: maxLoad > 80 ? 'danger' : maxLoad > 60 ? 'warn' : 'ok',
            note: maxLoad > 80 ? '存在过载' : '负载正常',
          },
        ]}
      />

      <div className="flex flex-wrap gap-2">
        {transformerData.map((item, index) => (
          <button
            key={item.name}
            onClick={() => setSelectedTransformer(index)}
            className={selectedTransformer === index ? 'btn-primary' : 'btn-secondary'}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Panel title="温度">
          <div className="flex items-baseline justify-between">
            <span className="metric-value">
              {transformer.temperature}
              <span className="metric-unit">°C</span>
            </span>
            <span className={currentTempStatus.tag}>{currentTempStatus.label}</span>
          </div>
          <div className="progress-bar mt-3">
            <div
              className={cn('progress-fill', toBarColor(transformer.temperature))}
              style={{ width: `${transformer.temperature}%` }}
            />
          </div>
          <div className="mt-2 font-mono text-[11px] text-ink-3">
            预警阈值 {TEMP_WARNING}°C · 危险阈值 {TEMP_DANGER}°C
          </div>
        </Panel>

        <Panel title="负载率">
          <div className="flex items-baseline justify-between">
            <span className="metric-value">
              {transformer.load_rate}
              <span className="metric-unit">%</span>
            </span>
            <span className={currentLoadStatus.tag}>{currentLoadStatus.label}</span>
          </div>
          <div className="progress-bar mt-3">
            <div
              className={cn(
                'progress-fill',
                transformer.load_rate > 80 ? 'bg-danger' : transformer.load_rate > 60 ? 'bg-warn' : 'bg-ok',
              )}
              style={{ width: `${transformer.load_rate}%` }}
            />
          </div>
          <div className="mt-2 font-mono text-[11px] text-ink-3">额定负载 100%</div>
        </Panel>

        <Panel title="电流">
          <div className="flex items-baseline justify-between">
            <span className="metric-value">
              {transformer.current}
              <span className="metric-unit">A</span>
            </span>
            <Activity className="h-3.5 w-3.5 text-ink-3" />
          </div>
          <div className="mt-3 font-mono text-[11px] text-ink-3">额定电流 300 A</div>
        </Panel>

        <Panel title="电压">
          <div className="flex items-baseline justify-between">
            <span className="metric-value">
              {transformer.voltage}
              <span className="metric-unit">kV</span>
            </span>
            <TrendingUp className="h-3.5 w-3.5 text-ink-3" />
          </div>
          <div className="mt-3 font-mono text-[11px] text-ink-3">额定电压 10.5 kV</div>
        </Panel>
      </div>

      <Panel
        title="温度趋势"
        aside={
          <button onClick={() => setShowTrend(!showTrend)} className="btn-secondary">
            {showTrend ? '隐藏趋势' : '显示趋势'}
          </button>
        }
        flush
      >
        {showTrend ? (
          <div className="h-64 bg-inset p-3">
            <div className="flex h-full items-end justify-between gap-2">
              {trendValues.map((value, i) => (
                <div key={i} className="flex flex-1 flex-col items-center">
                  <div
                    className={cn('w-full rounded-t-sm transition-colors', toBarColor(value))}
                    style={{ height: `${toBarHeight(value)}%` }}
                    title={`${trendLabels[i]} ${value}°C`}
                  />
                  <span className="mt-2 font-mono text-[11px] text-ink-3">{trendLabels[i]}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 py-10 text-[12px] text-ink-3">
            <Thermometer className="h-4 w-4" />
            趋势已隐藏
          </div>
        )}
      </Panel>

      <Panel title="运行日志">
        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-sm border border-line bg-inset p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
            <div>
              <p className="text-[13px] font-medium text-ink">温度预警</p>
              <p className="mt-1 font-mono text-[11px] text-ink-3">
                2024-06-01 10:30 · {transformer.name}温度达到 {transformer.temperature}°C，接近预警阈值
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-sm border border-line bg-inset p-3">
            <Activity className="mt-0.5 h-4 w-4 shrink-0 text-ok" />
            <div>
              <p className="text-[13px] font-medium text-ink">例行巡检</p>
              <p className="mt-1 font-mono text-[11px] text-ink-3">2024-06-01 08:00 · 设备运行正常</p>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
