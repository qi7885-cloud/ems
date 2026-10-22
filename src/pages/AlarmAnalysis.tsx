import { useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Calendar } from 'lucide-react';
import { getTimeLabels, periodConfig, seededSeries } from '../data/mockData';
import type { PeriodKey } from '../data/mockData';
import { useStore } from '../store/useStore';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import MetricStrip from '../components/MetricStrip';
import { useChartTheme, axisStyle, tooltipStyle, legendStyle } from '../hooks/useChartTheme';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// 只维护各类型的 count，percentage 完全由 count / 总数 派生，避免两者对不上
const alarmTypeCounts = [
  { type: '设备故障', count: 125 },
  { type: '参数越限', count: 98 },
  { type: '通讯异常', count: 72 },
  { type: '用能预警', count: 56 },
  { type: '维护提醒', count: 25 },
  { type: '其他', count: 10 },
];

export default function AlarmAnalysis() {
  const [timeRange, setTimeRange] = useState<PeriodKey>('week');
  const alarms = useStore((state) => state.alarms);
  const ct = useChartTheme();
  const axis = axisStyle(ct);

  const pendingCount = alarms.filter((alert) => alert.status === 'pending').length;

  // 趋势数据随所选周期派生：点数、X 轴标签、数据都在变，切换周期图形必然变化
  const chartData = useMemo(() => {
    const points = periodConfig[timeRange].points;
    return {
      labels: getTimeLabels(timeRange),
      datasets: [
        {
          label: '严重',
          data: seededSeries(`alarm-severe-${timeRange}`, points, 1, 8),
          backgroundColor: ct.danger,
          borderRadius: 2,
        },
        {
          label: '一般',
          data: seededSeries(`alarm-general-${timeRange}`, points, 6, 20),
          backgroundColor: ct.warn,
          borderRadius: 2,
        },
        {
          label: '轻微',
          data: seededSeries(`alarm-minor-${timeRange}`, points, 12, 36),
          backgroundColor: ct.info,
          borderRadius: 2,
        },
      ],
    };
  }, [timeRange, ct]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: legendStyle(ct, 'top'),
      tooltip: tooltipStyle(ct),
    },
    scales: {
      x: { ...axis, grid: { display: false } },
      y: { ...axis },
    },
  };

  // 涨跌语义：isImprovement 显式声明「这个变化是否代表变好」，颜色只依赖它。
  // MetricStrip 的 up 同时决定箭头与颜色（up=true → 红 + 向上），
  // 本页各指标的改善方向恰好与「下降」一致，故 up = !isImprovement：
  //   平均响应时间下降 = 改善 → up=false（绿 + 向下箭头）
  //   重复告警率上升 = 恶化 → up=true（红 + 向上箭头）
  const statistics = [
    { label: '告警总数', value: 386, unit: '条', change: '+12%', isImprovement: false },
    { label: '待处理', value: pendingCount, unit: '条', change: '', isImprovement: true },
    { label: '平均响应时间', value: '28', unit: '分钟', change: '-15%', isImprovement: true },
    { label: '重复告警率', value: '8', unit: '%', change: '+2%', isImprovement: false },
  ];

  // 百分比由 count / 总数 派生；最后一项取「100 - 前面已取整之和」兜底，保证加和恰好 100%
  const alarmTypeDistribution = useMemo(() => {
    const total = alarmTypeCounts.reduce((sum, item) => sum + item.count, 0);
    let acc = 0;
    return alarmTypeCounts.map((item, index) => {
      if (index === alarmTypeCounts.length - 1) {
        return { ...item, percentage: 100 - acc };
      }
      const percentage = Math.round((item.count / total) * 100);
      acc += percentage;
      return { ...item, percentage };
    });
  }, []);

  const topDevices = [
    { name: '变压器A', count: 45, type: '温度过高' },
    { name: '主配电柜', count: 38, type: '电流波动' },
    { name: '水表-1号', count: 28, type: '流量异常' },
    { name: '变压器B', count: 22, type: '负载偏高' },
  ];

  return (
    <div className="space-y-3">
      <PageHeader title="报警分析" description="分析报警趋势和统计数据">
        <span className="flex items-center gap-1.5 text-ink-3">
          <Calendar className="h-3.5 w-3.5" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as PeriodKey)}
            className="field h-7"
          >
            <option value="week">本周</option>
            <option value="month">本月</option>
            <option value="quarter">本季度</option>
            <option value="year">本年</option>
          </select>
        </span>
      </PageHeader>

      <MetricStrip
        cols={4}
        items={statistics.map((stat) => ({
          label: stat.label,
          value: stat.value,
          unit: stat.unit,
          trend: stat.change || undefined,
          up: !stat.isImprovement,
          tone: stat.label === '待处理' ? (pendingCount > 0 ? 'warn' : 'ok') : 'default',
        }))}
      />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Panel title="告警趋势分析" className="lg:col-span-2" aside={<span>单位 条</span>}>
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </Panel>

        <Panel title="告警设备排行">
          <div className="space-y-3">
            {topDevices.map((device, index) => (
              <div key={device.name} className="flex items-center gap-3">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-sm font-mono text-[12px] font-bold ${
                    index === 0
                      ? 'bg-danger text-canvas'
                      : index === 1
                        ? 'bg-warn text-canvas'
                        : index === 2
                          ? 'bg-accent text-canvas'
                          : 'bg-panel-2 text-ink-2'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink">{device.name}</p>
                  <p className="text-[12px] text-ink-3">{device.type}</p>
                </div>
                <span className="font-mono text-[15px] font-semibold text-ink">{device.count}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="告警类型分布" aside={<span>共 {alarmTypeCounts.reduce((s, i) => s + i.count, 0)} 条</span>}>
        <div className="space-y-2.5">
          {alarmTypeDistribution.map((item, index) => (
            <div key={item.type} className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-[12px] text-ink-2">{item.type}</span>
              <div className="progress-bar flex-1">
                <div
                  className="progress-fill"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: ct.series[index % ct.series.length],
                  }}
                />
              </div>
              <span className="w-10 shrink-0 text-right font-mono text-[12px] text-ink">{item.count}</span>
              <span className="w-11 shrink-0 text-right font-mono text-[12px] text-ink-3">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
