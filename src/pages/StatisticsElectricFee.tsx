import { useMemo } from 'react';
import { Zap, DollarSign, TrendingUp } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { electricityPricePlans, monthOptions, seededValue } from '../data/mockData';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import MetricStrip from '../components/MetricStrip';
import { useChartTheme, axisStyle, tooltipStyle, legendStyle } from '../hooks/useChartTheme';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface FeeItem {
  key: string;
  label: string;
  kwh: number;
  price: number;
  isFixed?: boolean;
}

/**
 * 单一数据源：本页所有金额、合计、圆环占比均由此数组派生，禁止再手写合计数字。
 * basic 为按容量计收的固定费用（kwh = 0），其余为「电量 × 单价」。
 */
const feeItems: FeeItem[] = [
  { key: 'basic', label: '基本电费', kwh: 0, price: electricityPricePlans.basic.price, isFixed: true },
  { key: 'sharp', label: '尖峰电费', kwh: 15000, price: electricityPricePlans.sharp.price },
  { key: 'peak', label: '高峰电费', kwh: 25000, price: electricityPricePlans.peak.price },
  { key: 'flat', label: '平段电费', kwh: 20000, price: electricityPricePlans.flat.price },
  { key: 'valley', label: '低谷电费', kwh: 12000, price: electricityPricePlans.valley.price },
];

/** 明细行语义色：与圆环序列色（ct.series[i]）配合，用作行底轻微着色 */
type Tone = 'accent' | 'danger' | 'warn' | 'ok' | 'info';

const FEE_TONE: Record<string, Tone> = {
  basic: 'accent',
  sharp: 'danger',
  peak: 'warn',
  flat: 'ok',
  valley: 'info',
};

const TONE_BG: Record<Tone, string> = {
  accent: 'bg-accent/10',
  danger: 'bg-danger/10',
  warn: 'bg-warn/10',
  ok: 'bg-ok/10',
  info: 'bg-info/10',
};

const RING_RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const formatMoney = (value: number) => `¥${Math.round(value).toLocaleString('zh-CN')}`;
const formatPrice = (value: number) =>
  value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function StatisticsElectricFee() {
  const ct = useChartTheme();
  const axis = axisStyle(ct);

  const fee = useMemo(() => {
    const rows = feeItems.map((item, index) => ({
      ...item,
      index,
      amount: item.isFixed ? item.price : item.kwh * item.price,
    }));
    const total = rows.reduce((sum, item) => sum + item.amount, 0);
    const totalKwh = rows.reduce((sum, item) => sum + item.kwh, 0);
    const basicTotal = rows.filter((item) => item.isFixed).reduce((sum, item) => sum + item.amount, 0);
    const electricityTotal = total - basicTotal;

    let roundedPercentage = 0;
    let drawnLength = 0;
    const segments = rows.map((item, index) => {
      const ratio = total > 0 ? item.amount / total : 0;
      // 占比取整兜底：前 n-1 项四舍五入，最后一项用 100 减去已累计值，保证加起来正好 100%
      const percentage =
        index === rows.length - 1 ? 100 - roundedPercentage : Math.round(ratio * 100);
      roundedPercentage += percentage;

      const length = ratio * CIRCUMFERENCE;
      const segment = {
        ...item,
        percentage,
        dasharray: `${length} ${CIRCUMFERENCE - length}`,
        dashoffset: -drawnLength,
      };
      drawnLength += length;
      return segment;
    });

    // 数据校验：各明细相加应恒等于合计，理论上恒为 true，仅作兜底提示
    const balanced = Math.abs(rows.reduce((sum, item) => sum + item.amount, 0) - total) < 0.01;

    return { rows, segments, total, totalKwh, basicTotal, electricityTotal, balanced };
  }, []);

  const monthlyTrend = useMemo(() => {
    const blendedPrice = fee.totalKwh > 0 ? fee.electricityTotal / fee.totalKwh : 0;
    const rows = monthOptions.map((month, index) => {
      const kwh = seededValue(`electric-fee-${month}`, 48000, 76000);
      const electricity = Math.round(kwh * blendedPrice);
      return {
        month: `${index + 1}月`,
        kwh,
        basic: fee.basicTotal,
        electricity,
      };
    });
    return { rows };
  }, [fee.totalKwh, fee.electricityTotal, fee.basicTotal]);

  const trendData = {
    labels: monthlyTrend.rows.map((row) => row.month),
    datasets: [
      {
        label: '基本电费（元）',
        data: monthlyTrend.rows.map((row) => row.basic),
        backgroundColor: ct.series[0],
        hoverBackgroundColor: ct.series[0],
        borderRadius: 2,
        borderSkipped: false as const,
      },
      {
        label: '电度电费（元）',
        data: monthlyTrend.rows.map((row) => row.electricity),
        backgroundColor: ct.series[1],
        hoverBackgroundColor: ct.series[1],
        borderRadius: 2,
        borderSkipped: false as const,
      },
    ],
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: { legend: legendStyle(ct, 'bottom'), tooltip: tooltipStyle(ct) },
    scales: {
      x: { ...axis, grid: { display: false } },
      y: {
        ...axis,
        title: { display: true, text: '元', color: ct.tick, font: { size: 11 } },
        ticks: { ...axis.ticks, callback: (value: number | string) => `¥${Number(value).toLocaleString('zh-CN')}` },
      },
    },
  };

  const metrics = [
    { label: '本月电费', value: formatMoney(fee.total), note: '基本 + 电度合计', icon: DollarSign, tone: 'accent' as const },
    { label: '基本电费', value: formatMoney(fee.basicTotal), note: electricityPricePlans.basic.hours, icon: Zap },
    { label: '电度电费', value: formatMoney(fee.electricityTotal), note: '尖峰 / 高峰 / 平段 / 低谷合计', icon: TrendingUp, tone: 'ok' as const },
  ];

  return (
    <div className="space-y-3">
      <PageHeader title="电度电费" description="统计分析电费支出情况" />

      <MetricStrip cols={3} items={metrics} />

      <Panel title="月度电费趋势" aside={<span className="font-mono text-[11px]">单位 元</span>} flush>
        <div className="h-[260px] p-3">
          <Bar data={trendData} options={trendOptions} />
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Panel title="电费构成分析">
          <div className="flex items-center justify-center">
            <div className="relative h-48 w-48">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle className="stroke-line" cx="50" cy="50" r="40" fill="none" strokeWidth="12" />
                {fee.segments.map((segment) => (
                  <circle
                    key={segment.key}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={ct.series[segment.index]}
                    strokeWidth="12"
                    strokeDasharray={segment.dasharray}
                    strokeDashoffset={segment.dashoffset}
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-[22px] font-semibold text-ink">{formatMoney(fee.total)}</span>
                <span className="text-2xs text-ink-3">本月合计</span>
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {fee.segments.map((segment) => (
              <div key={segment.key} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: ct.series[segment.index] }}
                />
                <span className="flex-1 truncate text-[12px] text-ink-2">{segment.label}</span>
                <span className="font-mono text-[12px] text-ink">{segment.percentage}%</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="电费明细" aside={<span className="font-mono text-[11px]">单位 元</span>} flush>
          <table>
            <thead>
              <tr>
                <th>项目</th>
                <th>计算说明</th>
                <th className="text-right">金额</th>
              </tr>
            </thead>
            <tbody>
              {fee.rows.map((item) => {
                const desc = item.isFixed
                  ? electricityPricePlans.basic.hours
                  : `${item.kwh.toLocaleString('zh-CN')} kWh × ${formatPrice(item.price)} 元/kWh`;
                // 行着色写到单元格上：全局隔行底色作用于 tr，写到 td 才不会被覆盖
                const tint = TONE_BG[FEE_TONE[item.key]];
                return (
                  <tr key={item.key}>
                    <td className={tint}>
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3.5 w-[2px] shrink-0 rounded-sm"
                          style={{ backgroundColor: ct.series[item.index] }}
                          aria-hidden="true"
                        />
                        <span className="font-medium text-ink">{item.label}</span>
                      </div>
                    </td>
                    <td className={`text-ink-2 ${tint}`}>{desc}</td>
                    <td className={`text-right font-mono ${tint}`}>{formatMoney(item.amount)}</td>
                  </tr>
                );
              })}
              <tr>
                <td className="border-t border-line-strong bg-inset font-semibold text-ink">合计</td>
                <td className="border-t border-line-strong bg-inset text-ink-3">
                  {fee.totalKwh.toLocaleString('zh-CN')} kWh
                </td>
                <td className="border-t border-line-strong bg-inset text-right font-mono font-semibold text-ink">
                  {formatMoney(fee.total)}
                </td>
              </tr>
            </tbody>
          </table>
          {!fee.balanced && (
            <p className="px-3 py-2 text-[12px] text-danger">数据校验未通过：明细合计与合计金额不一致</p>
          )}
        </Panel>
      </div>
    </div>
  );
}
