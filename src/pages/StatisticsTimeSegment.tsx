import { useMemo, useState } from 'react';
import { electricityPricePlans, seededSeries, seededValue } from '../data/mockData';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import MetricStrip from '../components/MetricStrip';

/** 四个时段：电量取值范围，时段文案与电价统一取自 electricityPricePlans */
const segmentList = [
  { key: 'sharp', period: '尖峰时段', min: 12000, max: 18000 },
  { key: 'peak', period: '高峰时段', min: 10000, max: 16000 },
  { key: 'flat', period: '平段', min: 7000, max: 12000 },
  { key: 'valley', period: '低谷时段', min: 3000, max: 7000 },
] as const;

type SegmentKey = (typeof segmentList)[number]['key'];

const SEGMENT_KEYS: SegmentKey[] = segmentList.map((item) => item.key);

/**
 * 分时段配色（本页唯一的颜色真源，柱体 / 占比条 / 电费卡共用）：
 * 尖峰 danger #f87171 · 高峰 warn #f5a524 · 平段 info #38bdf8 · 低谷 ok #34d399
 * 颜色顺序按「用电紧张程度」递进，红→橙→蓝→绿便于快速识别时段性质。
 */
const SEGMENT_THEME: Record<SegmentKey, { color: string; bg: string; text: string }> = {
  sharp: { color: '#f87171', bg: 'bg-danger/10', text: 'text-danger' },
  peak: { color: '#f5a524', bg: 'bg-warn/10', text: 'text-warn' },
  flat: { color: '#38bdf8', bg: 'bg-info/10', text: 'text-info' },
  valley: { color: '#34d399', bg: 'bg-ok/10', text: 'text-ok' },
};

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);

/** 解析 electricityPricePlans 中的时段区间字符串，如 "08:00-11:00, 17:00-21:00" */
const parseHourRanges = (hours: string): Array<[number, number]> =>
  hours.split(',').map((part) => {
    const [start, end] = part.trim().split('-');
    return [Number(start.slice(0, 2)), Number(end.slice(0, 2))];
  });

/** 判断某小时属于哪个时段（支持低谷 23:00-06:00 的跨天区间） */
const segmentOfHour = (hour: number): SegmentKey => {
  for (const key of SEGMENT_KEYS) {
    for (const [start, end] of parseHourRanges(electricityPricePlans[key].hours)) {
      const inRange = start <= end ? hour >= start && hour < end : hour >= start || hour < end;
      if (inRange) return key;
    }
  }
  return 'flat';
};

const formatKwh = (value: number) => value.toLocaleString('zh-CN');
/** 金额保留到分，避免浮点误差 */
const roundMoney = (value: number) => Math.round(value * 100) / 100;
const formatMoney = (value: number) =>
  roundMoney(value).toLocaleString('zh-CN', { maximumFractionDigits: 2 });

export default function StatisticsTimeSegment() {
  const [selectedDate, setSelectedDate] = useState('2024-06-07');

  const data = useMemo(() => {
    const rows = segmentList.map((meta) => {
      const plan = electricityPricePlans[meta.key];
      const power = seededValue(`timesegment-${selectedDate}-${meta.key}`, meta.min, meta.max);
      return {
        key: meta.key,
        period: meta.period,
        time: plan.hours,
        price: plan.price,
        power,
      };
    });

    const total = rows.reduce((sum, row) => sum + row.power, 0);

    let roundedPercentage = 0;
    const rowsWithPercentage = rows.map((row, index) => {
      // 占比取整兜底：最后一项用 100 减去已累计值，保证四段占比之和正好 100%
      const percentage =
        index === rows.length - 1 ? 100 - roundedPercentage : Math.round((row.power / total) * 100);
      roundedPercentage += percentage;
      return { ...row, percentage };
    });

    // 24 小时负荷：先把每小时确定性权重分配到所属时段，再按该时段总电量等比缩放，
    // 从而保证曲线内各时段小时电量之和对应该时段卡片电量，避免两处数据打架
    const weights = seededSeries(`timesegment-hourly-${selectedDate}`, 24, 20, 100);
    const hoursBySegment: Record<SegmentKey, number[]> = { sharp: [], peak: [], flat: [], valley: [] };
    HOURS.forEach((hour) => hoursBySegment[segmentOfHour(hour)].push(hour));

    const powerByHour = new Array<number>(24).fill(0);
    rowsWithPercentage.forEach((row) => {
      const hoursInSegment = hoursBySegment[row.key];
      const weightSum = hoursInSegment.reduce((sum, hour) => sum + weights[hour], 0) || 1;
      hoursInSegment.forEach((hour) => {
        powerByHour[hour] = Math.round((row.power * weights[hour]) / weightSum);
      });
    });

    const hourly = HOURS.map((hour) => {
      const key = segmentOfHour(hour);
      return {
        hour: `${String(hour).padStart(2, '0')}:00`,
        power: powerByHour[hour],
        segmentKey: key,
      };
    });

    // 每段电费先取整到分再求和，保证「合计 = 各段相加」在任何情况下都成立
    const rowsWithFee = rowsWithPercentage.map((row) => ({ ...row, fee: roundMoney(row.power * row.price) }));
    const feeTotal = rowsWithFee.reduce((sum, row) => sum + row.fee, 0);
    const hourlyMax = Math.max(...hourly.map((item) => item.power), 1);

    return { rows: rowsWithFee, total, hourly, hourlyMax, feeTotal };
  }, [selectedDate]);

  const metrics = [
    { label: '总电量', value: data.total, unit: 'kWh', tone: 'accent' as const },
    { label: '尖峰占比', value: `${data.rows[0].percentage}%`, note: '尖峰时段', tone: 'danger' as const },
    { label: '高峰占比', value: `${data.rows[1].percentage}%`, note: '高峰时段', tone: 'warn' as const },
    { label: '平段占比', value: `${data.rows[2].percentage}%`, note: '平段', tone: 'accent' as const },
    { label: '低谷占比', value: `${data.rows[3].percentage}%`, note: '低谷时段', tone: 'ok' as const },
  ];

  return (
    <div className="space-y-3">
      <PageHeader title="分时段报表" description="按尖峰 / 高峰 / 平段 / 低谷时段统计能耗">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="field h-7"
        />
      </PageHeader>

      <MetricStrip cols={5} items={metrics} />

      <Panel title="时段电量与占比" aside={<span className="font-mono text-[11px]">合计 {formatKwh(data.total)} kWh</span>}>
        <div className="space-y-3">
          {data.rows.map((item) => {
            const theme = SEGMENT_THEME[item.key];
            return (
              <div key={item.key} className="grid grid-cols-[80px_1fr_140px_48px] items-center gap-3">
                <span className={`text-[12px] font-medium ${theme.text}`}>{item.period}</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${item.percentage}%`, backgroundColor: theme.color }} />
                </div>
                <span className="font-mono text-[12px] text-ink-2">{formatKwh(item.power)} kWh</span>
                <span className="text-right font-mono text-[12px] text-ink">{item.percentage}%</span>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel
        title="24 小时负荷曲线"
        description="单位 kWh · 每小时采集，柱体颜色对应时段划分"
        aside={<span className="font-mono text-[11px]">峰值 {formatKwh(data.hourlyMax)} kWh</span>}
      >
        <div className="flex h-[200px] items-end justify-between gap-1">
          {data.hourly.map((item, index) => (
            <div key={item.hour} className="flex h-full flex-1 flex-col items-center justify-end">
              <div
                className="w-full rounded-t"
                style={{ height: `${(item.power / data.hourlyMax) * 180}px`, backgroundColor: SEGMENT_THEME[item.segmentKey].color }}
                title={`${item.hour} 负荷 ${formatKwh(item.power)} kWh`}
              />
              <span className="mt-2 h-4 font-mono text-[11px] text-ink-3">{index % 3 === 0 ? item.hour : ''}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-center gap-4">
          {segmentList.map((item) => (
            <div key={item.key} className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: SEGMENT_THEME[item.key].color }}
              />
              <span className="text-[12px] text-ink-2">{item.period.replace('时段', '')}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="时段电费估算" aside={<span className="font-mono text-[11px]">单位 元</span>}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {data.rows.map((item) => {
            const theme = SEGMENT_THEME[item.key];
            return (
              <div key={item.key} className={`rounded border border-line px-3 py-2.5 ${theme.bg}`}>
                <p className={`text-2xs ${theme.text}`}>{item.period.replace('时段', '')}电费</p>
                <p className={`mt-1 font-mono text-[20px] font-semibold ${theme.text}`}>¥{formatMoney(item.fee)}</p>
                <p className="mt-1 font-mono text-[11px] text-ink-3">
                  电价 {item.price} 元/kWh · 电量 {formatKwh(item.power)} kWh
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-between rounded border-t border-line-strong bg-inset px-3 py-2.5">
          <span className="text-[12px] text-ink-2">合计电费</span>
          <span className="font-mono text-[18px] font-semibold text-ink">¥{formatMoney(data.feeTotal)}</span>
        </div>
      </Panel>
    </div>
  );
}
