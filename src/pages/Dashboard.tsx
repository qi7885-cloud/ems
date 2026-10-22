import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { categoryEnergyData, dailyStats, generateTimeLabels, seededSeries } from '../data/mockData';
import { AlertTriangle, ArrowRight, RefreshCw, TrendingDown, TrendingUp } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import type { TooltipItem } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useTheme } from '../hooks/useTheme';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

/**
 * 图表配色：canvas 不能读 CSS 变量，因此按主题各备一套。
 * 深色用高饱和的「控制青」，浅色下压一档保证在白底上的对比度。
 */
const chartPalettes = {
  dark: {
    grid: 'rgba(150, 169, 188, 0.10)',
    tick: '#687c91',
    tooltipBg: '#111821',
    tooltipTitle: '#e0eaf3',
    tooltipBody: '#96a9bc',
    power: '#22d3ee',
    water: '#34d399',
    series: ['#22d3ee', '#38bdf8', '#34d399', '#f5a524', '#a78bfa'],
  },
  light: {
    grid: 'rgba(15, 26, 36, 0.08)',
    tick: '#6c7e90',
    tooltipBg: '#ffffff',
    tooltipTitle: '#0f1a24',
    tooltipBody: '#47576a',
    power: '#0891b2',
    water: '#059669',
    series: ['#0891b2', '#0284c7', '#059669', '#b45309', '#7c3aed'],
  },
} as const;

const pad = (n: number) => String(n).padStart(2, '0');
const stamp = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const energyStats = useStore((state) => state.energyStats);
  const alarms = useStore((state) => state.alarms);
  const equipments = useStore((state) => state.equipments);

  // 与「设备故障」页同源：处理完告警后这里会同步更新
  const pendingAlarms = useMemo(() => alarms.filter((a) => a.status === 'pending'), [alarms]);
  const equipmentName = (id: number) => equipments.find((e) => e.id === id)?.name ?? '未知设备';

  // 「刷新」按钮的真实效果：换一个种子键 → 曲线重新采样，并更新同步时间
  const [seed, setSeed] = useState(0);
  const [syncedAt, setSyncedAt] = useState(stamp);

  const p = isDark ? chartPalettes.dark : chartPalettes.light;

  const lineChartData = useMemo(
    () => ({
      labels: generateTimeLabels(24),
      datasets: [
        {
          label: '用电量 (kWh)',
          data: seededSeries(`dashboard-power-24h-${seed}`, 24, 5000, 12000),
          borderColor: p.power,
          backgroundColor: isDark ? 'rgba(34, 211, 238, 0.10)' : 'rgba(8, 145, 178, 0.10)',
          fill: true,
        },
      ],
    }),
    [seed, p, isDark],
  );

  const barChartData = useMemo(
    () => ({
      labels: dailyStats.map((d) => d.date),
      datasets: [
        {
          label: '用电量 (MWh)',
          data: dailyStats.map((d) => Number((d.power / 1000).toFixed(1))),
          backgroundColor: p.power,
          hoverBackgroundColor: p.power,
          borderRadius: 2,
          borderSkipped: false as const,
          yAxisID: 'y',
        },
        {
          label: '用水量 (吨)',
          data: dailyStats.map((d) => d.water),
          backgroundColor: p.water,
          hoverBackgroundColor: p.water,
          borderRadius: 2,
          borderSkipped: false as const,
          yAxisID: 'y1',
        },
      ],
    }),
    [p],
  );

  const doughnutData = useMemo(
    () => ({
      labels: categoryEnergyData.map((c) => c.category),
      datasets: [
        {
          data: categoryEnergyData.map((c) => c.percentage),
          backgroundColor: [...p.series],
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    }),
    [p],
  );

  const axis = {
    grid: { color: p.grid, drawTicks: false },
    border: { display: false },
    ticks: { font: { size: 11 }, color: p.tick, padding: 8 },
  };

  const tooltipStyle = {
    backgroundColor: p.tooltipBg,
    titleColor: p.tooltipTitle,
    bodyColor: p.tooltipBody,
    borderColor: p.grid,
    borderWidth: 1,
    padding: 10,
    cornerRadius: 3,
    titleFont: { size: 12, weight: 600 as const },
    bodyFont: { size: 12 },
    displayColors: true,
    boxPadding: 4,
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: { legend: { display: false }, tooltip: tooltipStyle },
    scales: {
      x: { ...axis, grid: { display: false }, ticks: { ...axis.ticks, maxRotation: 0, autoSkipPadding: 12 } },
      y: {
        ...axis,
        ticks: { ...axis.ticks, callback: (value: number | string) => `${value}` },
        title: { display: true, text: 'kWh', color: p.tick, font: { size: 11 } },
      },
    },
    elements: {
      line: { tension: 0.35, borderWidth: 2 },
      point: { radius: 0, hoverRadius: 4, hoverBorderWidth: 2 },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          boxHeight: 6,
          padding: 16,
          font: { size: 11 },
          color: p.tick,
        },
      },
      tooltip: tooltipStyle,
    },
    scales: {
      x: { ...axis, grid: { display: false } },
      y: {
        ...axis,
        title: { display: true, text: '用电量 (MWh)', color: p.power, font: { size: 10 } },
      },
      // 用水量与用电量量级相差约 70 倍，必须用独立右轴，否则用电量柱会被压平
      y1: {
        ...axis,
        position: 'right' as const,
        grid: { drawOnChartArea: false },
        title: { display: true, text: '用水量 (吨)', color: p.water, font: { size: 10 } },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'right' as const,
        align: 'center' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          boxHeight: 6,
          padding: 12,
          font: { size: 11 },
          color: p.tick,
        },
      },
      tooltip: {
        ...tooltipStyle,
        callbacks: {
          label: (context: TooltipItem<'doughnut'>) => `${context.label}: ${context.parsed}%`,
        },
      },
    },
  };

  /** 指标条：遵循国内习惯，用电/用水/费用上涨记为红（需关注） */
  const metrics = [
    {
      label: '今日用电量',
      value: (energyStats.total_power / 1000).toFixed(1),
      unit: 'MWh',
      trend: '+5.2%',
      up: true,
      note: '较昨日',
    },
    {
      label: '今日用水量',
      value: energyStats.total_water.toLocaleString(),
      unit: '吨',
      trend: '+2.1%',
      up: true,
      note: '较昨日',
    },
    {
      label: '电费支出',
      value: `¥${energyStats.power_cost.toLocaleString()}`,
      unit: '',
      trend: '+3.8%',
      up: true,
      note: '较昨日',
    },
    {
      label: '水费支出',
      value: `¥${energyStats.water_cost.toLocaleString()}`,
      unit: '',
      trend: '-1.4%',
      up: false,
      note: '较昨日',
    },
    {
      label: '峰值功率',
      value: energyStats.peak_power.toLocaleString(),
      unit: 'kW',
      trend: '',
      up: false,
      note: `均值 ${energyStats.avg_power.toLocaleString()} kW`,
    },
    {
      label: '待处理告警',
      value: String(pendingAlarms.length),
      unit: '条',
      trend: '',
      up: false,
      note: pendingAlarms.length > 0 ? '需及时处理' : '全部已处理',
      alert: pendingAlarms.length > 0,
    },
  ];

  /** 告警等级配色：严重 / 一般 / 轻微 */
  const levelTone = (level: string) => {
    if (level === '严重') return { bar: 'bg-danger', text: 'text-danger', tag: 'tag-danger' };
    if (level === '一般') return { bar: 'bg-warn', text: 'text-warn', tag: 'tag-warn' };
    return { bar: 'bg-info', text: 'text-info', tag: 'tag-info' };
  };

  const handleRefresh = () => {
    setSeed((v) => v + 1);
    setSyncedAt(stamp());
  };

  return (
    <div className="space-y-3">
      {/* 页头 */}
      <div className="page-head">
        <div>
          <h1 className="page-title">综合看板</h1>
          <p className="page-desc">全厂能源实时监控 · 采集周期 5 秒 · 采集点 {equipments.length} 个</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 rounded-sm border border-line bg-panel px-2.5 py-1.5">
            <span className="status-dot status-online animate-pulse-soft" />
            <span className="font-mono text-[11px] text-ink-2">同步于 {syncedAt}</span>
          </span>
          <button onClick={handleRefresh} className="btn-secondary">
            <RefreshCw className="h-3.5 w-3.5" />
            刷新
          </button>
        </div>
      </div>

      {/* 指标条 */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
        {metrics.map((m) => (
          <div key={m.label} className="metric">
            <div className="metric-label">{m.label}</div>
            <div className="mt-2 flex items-baseline">
              <span className={`metric-value ${m.alert ? 'text-danger' : ''}`}>{m.value}</span>
              {m.unit && <span className="metric-unit">{m.unit}</span>}
            </div>
            <div className="mt-1.5 flex items-center gap-1.5">
              {m.trend &&
                (m.up ? (
                  <TrendingUp className="h-3.5 w-3.5 shrink-0 text-danger" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 shrink-0 text-ok" />
                ))}
              <span
                className={`font-mono text-[11px] ${
                  m.trend ? (m.up ? 'text-danger' : 'text-ok') : 'text-ink-3'
                }`}
              >
                {m.trend || m.note}
              </span>
              {m.trend && <span className="truncate text-[11px] text-ink-3">{m.note}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* 主图表区 */}
      <div className="grid gap-3 xl:grid-cols-3">
        <section className="panel xl:col-span-2">
          <div className="panel-head">
            <h2 className="panel-title">24 小时用电负荷曲线</h2>
            <span className="font-mono text-[11px] text-ink-3">单位 kWh · 整点采样</span>
          </div>
          <div className="h-[264px] p-3">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2 className="panel-title">分类能耗占比</h2>
            <span className="font-mono text-[11px] text-ink-3">本月</span>
          </div>
          <div className="h-[264px] p-3">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </section>
      </div>

      {/* 次级图表区 */}
      <div className="grid gap-3 xl:grid-cols-3">
        <section className="panel xl:col-span-2">
          <div className="panel-head">
            <h2 className="panel-title">近 7 日能耗对比</h2>
            <span className="font-mono text-[11px] text-ink-3">双轴：MWh / 吨</span>
          </div>
          <div className="h-[248px] p-3">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </section>

        <section className="panel flex flex-col">
          <div className="panel-head">
            <h2 className="panel-title">实时告警</h2>
            <button
              onClick={() => navigate('/alarm/equipment-fault')}
              className="flex items-center gap-1 text-[12px] text-accent transition-colors hover:underline"
            >
              全部
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="flex-1 divide-y divide-line">
            {pendingAlarms.length === 0 && (
              <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-2 text-[12px] text-ink-3">
                <span className="status-dot status-online" />
                当前无待处理告警
              </div>
            )}
            {pendingAlarms.slice(0, 4).map((alarm) => {
              const tone = levelTone(alarm.level);
              return (
                <div key={alarm.id} className="relative flex gap-3 px-3 py-2.5">
                  <span className={`absolute left-0 top-0 h-full w-[2px] ${tone.bar}`} aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={tone.tag}>{alarm.level}</span>
                      <span className="truncate text-[12px] font-medium text-ink">{alarm.message}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-ink-3">
                      <span>{equipmentName(alarm.equipment_id)}</span>
                      <span className="text-line-strong">|</span>
                      <span>{alarm.type}</span>
                      <span className="text-line-strong">|</span>
                      <span>{alarm.created_at}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* 设备状态矩阵 */}
      <section className="panel">
        <div className="panel-head">
          <h2 className="panel-title">设备运行状态</h2>
          <span className="font-mono text-[11px] text-ink-3">
            在线 {equipments.filter((e) => e.status === 'active').length} / {equipments.length}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2 xl:grid-cols-4">
          {equipments.map((eq) => {
            const running = eq.status === 'active';
            return (
              <div
                key={eq.id}
                className="flex items-center gap-3 rounded-sm border border-line bg-inset px-3 py-2.5"
              >
                <span className={`status-dot ${running ? 'status-online' : 'status-danger animate-led'}`} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium text-ink">{eq.name}</div>
                  <div className="mt-0.5 truncate font-mono text-[11px] text-ink-3">
                    {eq.model} · {eq.location}
                  </div>
                </div>
                <span className={running ? 'tag-ok' : 'tag-danger'}>{running ? '运行' : '离线'}</span>
              </div>
            );
          })}
          {equipments.length === 0 && (
            <div className="col-span-full flex items-center justify-center gap-2 py-6 text-[12px] text-ink-3">
              <AlertTriangle className="h-4 w-4" />
              暂无设备数据
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
