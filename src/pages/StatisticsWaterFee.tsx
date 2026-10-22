import { useMemo } from 'react';
import { Droplets, DollarSign, TrendingUp, CloudRain } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { waterPricePlans } from '../data/mockData';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import MetricStrip from '../components/MetricStrip';
import { useChartTheme, axisStyle, tooltipStyle, legendStyle } from '../hooks/useChartTheme';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/** 各月用水量（吨），费用全部由 waterPricePlans 单价派生 */
const monthlyUsage = [
  { month: '1月', usage: 24000 },
  { month: '2月', usage: 22000 },
  { month: '3月', usage: 26000 },
  { month: '4月', usage: 28000 },
  { month: '5月', usage: 30000 },
  { month: '6月', usage: 32000 },
];

/** 三类水费单价，单一数据源；综合单价 = 三项单价之和，合计 = 三项费用之和 */
const unitPriceRows = [
  { key: 'tap', label: waterPricePlans.tap.label, price: waterPricePlans.tap.price },
  { key: 'sewage', label: waterPricePlans.sewage.label, price: waterPricePlans.sewage.price },
  { key: 'resource', label: waterPricePlans.resource.label, price: waterPricePlans.resource.price },
] as const;

const RING_RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const formatMoney = (value: number) => `¥${Math.round(value).toLocaleString('zh-CN')}`;
const formatPrice = (value: number) =>
  value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function StatisticsWaterFee() {
  const ct = useChartTheme();
  const axis = axisStyle(ct);

  const waterRows = useMemo(
    () =>
      monthlyUsage.map(({ month, usage }) => {
        const tap = usage * waterPricePlans.tap.price;
        const sewage = usage * waterPricePlans.sewage.price;
        const resource = usage * waterPricePlans.resource.price;
        return { month, usage, tap, sewage, resource, total: tap + sewage + resource };
      }),
    [],
  );

  const latest = waterRows[waterRows.length - 1];

  const unitPriceTotal = unitPriceRows.reduce((sum, item) => sum + item.price, 0);

  const ring = useMemo(() => {
    const values = unitPriceRows.map((item, index) => ({
      ...item,
      index,
      amount: latest[item.key as 'tap' | 'sewage' | 'resource'],
    }));
    const total = values.reduce((sum, item) => sum + item.amount, 0);

    let roundedPercentage = 0;
    let drawnLength = 0;
    const segments = values.map((item, index) => {
      const ratio = total > 0 ? item.amount / total : 0;
      // 占比取整兜底：最后一项用 100 减去已累计值，保证占比之和为 100%
      const percentage =
        index === values.length - 1 ? 100 - roundedPercentage : Math.round(ratio * 100);
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

    return { segments, total };
  }, [latest]);

  const trendData = {
    labels: waterRows.map((row) => row.month),
    datasets: [
      {
        label: unitPriceRows[0].label,
        data: waterRows.map((row) => row.tap),
        backgroundColor: ct.series[0],
        hoverBackgroundColor: ct.series[0],
        stack: 'water',
        borderRadius: 2,
        borderSkipped: false as const,
      },
      {
        label: unitPriceRows[1].label,
        data: waterRows.map((row) => row.sewage),
        backgroundColor: ct.series[1],
        hoverBackgroundColor: ct.series[1],
        stack: 'water',
        borderRadius: 2,
        borderSkipped: false as const,
      },
      {
        label: unitPriceRows[2].label,
        data: waterRows.map((row) => row.resource),
        backgroundColor: ct.series[2],
        hoverBackgroundColor: ct.series[2],
        stack: 'water',
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
      x: { ...axis, stacked: true, grid: { display: false } },
      y: {
        ...axis,
        stacked: true,
        title: { display: true, text: '元', color: ct.tick, font: { size: 11 } },
        ticks: { ...axis.ticks, callback: (value: number | string) => `¥${Number(value).toLocaleString('zh-CN')}` },
      },
    },
  };

  const metrics = [
    { label: '本月用水量', value: latest.usage, unit: '吨', icon: Droplets, tone: 'accent' as const },
    { label: '自来水费', value: formatMoney(latest.tap), icon: DollarSign },
    { label: '排污费', value: formatMoney(latest.sewage), icon: CloudRain },
    { label: '水资源费', value: formatMoney(latest.resource), icon: Droplets },
    { label: '合计费用', value: formatMoney(latest.total), note: '本月用水量 × 综合单价', icon: TrendingUp, tone: 'ok' as const },
  ];

  return (
    <div className="space-y-3">
      <PageHeader title="综合水费" description="统计分析自来水费、排污费和水资源费支出情况" />

      <MetricStrip cols={5} items={metrics} />

      <Panel title="月度水费趋势" description="堆叠柱：三类水费逐月构成" aside={<span className="font-mono text-[11px]">单位 元</span>} flush>
        <div className="h-[260px] p-3">
          <Bar data={trendData} options={trendOptions} />
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Panel title="费用构成分析">
          <div className="flex items-center justify-center">
            <div className="relative h-48 w-48">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle className="stroke-line" cx="50" cy="50" r="40" fill="none" strokeWidth="12" />
                {ring.segments.map((segment) => (
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
                <span className="font-mono text-[22px] font-semibold text-ink">{formatMoney(ring.total)}</span>
                <span className="text-2xs text-ink-3">本月合计</span>
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {ring.segments.map((segment) => (
              <div key={segment.key} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: ct.series[segment.index] }}
                />
                <span className="flex-1 truncate text-[12px] text-ink-2">{segment.label}</span>
                <span className="font-mono text-[12px] text-ink-3">{formatMoney(segment.amount)}</span>
                <span className="w-10 text-right font-mono text-[12px] text-ink">{segment.percentage}%</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="单价与费用明细"
          aside={<span className="font-mono text-[11px]">本月 {latest.usage.toLocaleString('zh-CN')} 吨</span>}
          flush
        >
          <table>
            <thead>
              <tr>
                <th>项目</th>
                <th className="text-right">单价（元/吨）</th>
                <th className="text-right">金额（元）</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-ink-2">{unitPriceRows[0].label}</td>
                <td className="text-right font-mono text-ink-2">{formatPrice(unitPriceRows[0].price)}</td>
                <td className="text-right font-mono">{formatMoney(latest.tap)}</td>
              </tr>
              <tr>
                <td className="text-ink-2">{unitPriceRows[1].label}</td>
                <td className="text-right font-mono text-ink-2">{formatPrice(unitPriceRows[1].price)}</td>
                <td className="text-right font-mono">{formatMoney(latest.sewage)}</td>
              </tr>
              <tr>
                <td className="text-ink-2">{unitPriceRows[2].label}</td>
                <td className="text-right font-mono text-ink-2">{formatPrice(unitPriceRows[2].price)}</td>
                <td className="text-right font-mono">{formatMoney(latest.resource)}</td>
              </tr>
              <tr>
                <td className="border-t border-line-strong bg-inset font-semibold text-ink">综合单价 / 本月合计</td>
                <td className="border-t border-line-strong bg-inset text-right font-mono font-semibold text-ink">
                  {formatPrice(unitPriceTotal)}
                </td>
                <td className="border-t border-line-strong bg-inset text-right font-mono font-semibold text-ink">
                  {formatMoney(latest.total)}
                </td>
              </tr>
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}
