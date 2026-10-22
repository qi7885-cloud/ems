import { useMemo, useState } from 'react';
import { Gauge, Zap } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { monthOptions, seededValue } from '../data/mockData';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import MetricStrip from '../components/MetricStrip';
import { useChartTheme, axisStyle, tooltipStyle, legendStyle } from '../hooks/useChartTheme';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const DEMAND_TARGET = 650;
// 需量罚款按超出目标的部分计收（元/kW）
const PENALTY_RATE = 200;
const SAMPLE_DAYS = ['01', '05', '10', '15', '20', '25', '30'];

export default function AnalysisMaxDemand() {
  const [selectedMonth, setSelectedMonth] = useState('2024-06');
  const ct = useChartTheme();

  // 采样点随所选月份派生；高峰 > 平均 > 低谷，保证量纲关系恒成立
  const demandData = useMemo(
    () =>
      SAMPLE_DAYS.map((day) => {
        const demand = seededValue(`demand-${selectedMonth}-${day}`, 560, 640, 0);
        const peak = seededValue(`demand-peak-${selectedMonth}-${day}`, demand + 20, demand + 70, 0);
        const offpeak = seededValue(`demand-offpeak-${selectedMonth}-${day}`, demand - 160, demand - 100, 0);
        return { date: `${selectedMonth.slice(5)}-${day}`, demand, peak, offpeak };
      }),
    [selectedMonth],
  );

  // 最大需量取各采样点的高峰值；平均需量 = 采样序列均值（sum / length）
  // 由于每个采样点 peak > demand ≥ 均值，所以「最大需量 ≥ 平均需量」恒成立
  const monthlyStats = useMemo(() => {
    const sum = demandData.reduce((acc, item) => acc + item.demand, 0);
    const avgDemand = Number((sum / demandData.length).toFixed(1));
    const maxDemand = Math.max(...demandData.map((item) => item.peak));
    return {
      maxDemand,
      avgDemand,
      peakHours: 186,
      target: DEMAND_TARGET,
      penaltyFee: maxDemand > DEMAND_TARGET ? (maxDemand - DEMAND_TARGET) * PENALTY_RATE : 0,
    };
  }, [demandData]);

  // 需量率 = 实际最大需量 / 合同需量 × 100%，>100% 视为超限
  const demandRate = ((monthlyStats.maxDemand / monthlyStats.target) * 100).toFixed(1);
  const overCount = demandData.filter((item) => item.peak > DEMAND_TARGET).length;

  const historyData = [
    { month: '1月', maxDemand: 640, target: DEMAND_TARGET },
    { month: '2月', maxDemand: 620, target: DEMAND_TARGET },
    { month: '3月', maxDemand: 655, target: DEMAND_TARGET },
    { month: '4月', maxDemand: 668, target: DEMAND_TARGET },
    { month: '5月', maxDemand: 672, target: DEMAND_TARGET },
    { month: '6月', maxDemand: 680, target: DEMAND_TARGET },
  ];

  const axis = axisStyle(ct);

  const demandChartData = {
    labels: demandData.map((item) => item.date),
    datasets: [
      {
        label: '高峰需量',
        data: demandData.map((item) => item.peak),
        borderColor: ct.danger,
        backgroundColor: ct.danger,
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
        fill: false,
      },
      {
        label: '平均需量',
        data: demandData.map((item) => item.demand),
        borderColor: ct.accent,
        backgroundColor: ct.accent,
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
        fill: false,
      },
      {
        label: '低谷需量',
        data: demandData.map((item) => item.offpeak),
        borderColor: ct.ok,
        backgroundColor: ct.ok,
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
        fill: false,
      },
      {
        // 合同需量参考线：恒定值 + 虚线，直观看出超限位置
        label: '合同需量',
        data: demandData.map(() => DEMAND_TARGET),
        borderColor: ct.danger,
        borderWidth: 1.5,
        borderDash: [6, 4],
        pointRadius: 0,
        tension: 0,
        fill: false,
      },
    ],
  };

  const demandChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: { legend: legendStyle(ct, 'top'), tooltip: tooltipStyle(ct) },
    scales: {
      x: { ...axis, grid: { display: false }, ticks: { ...axis.ticks, maxRotation: 0, autoSkipPadding: 10 } },
      y: { ...axis, title: { display: true, text: 'kW', color: ct.tick, font: { size: 11 } } },
    },
    elements: { point: { hoverBorderWidth: 2 } },
  };

  return (
    <div className="space-y-3">
      <PageHeader title="最大需量分析" description="分析最大需量变化趋势与费用影响">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="field h-7"
          aria-label="选择月份"
        >
          {monthOptions.map((month) => (
            <option key={month} value={month}>
              {month.replace('-', '年')}月
            </option>
          ))}
        </select>
      </PageHeader>

      <MetricStrip
        cols={4}
        items={[
          {
            label: '最大需量',
            value: monthlyStats.maxDemand,
            unit: 'kW',
            icon: Gauge,
            tone: monthlyStats.maxDemand > monthlyStats.target ? 'danger' : 'accent',
            note: `合同需量 ${monthlyStats.target} kW`,
          },
          { label: '平均需量', value: monthlyStats.avgDemand, unit: 'kW', icon: Zap, note: '采样序列均值' },
          {
            label: '需量率',
            value: demandRate,
            unit: '%',
            // 超过合同需量为恶化（danger 红），否则正常（ok 绿）
            tone: monthlyStats.maxDemand > monthlyStats.target ? 'danger' : 'ok',
            note: '实际 / 合同',
          },
          {
            label: '超限次数',
            value: overCount,
            unit: '次',
            tone: overCount > 0 ? 'warn' : 'ok',
            note:
              monthlyStats.penaltyFee > 0
                ? `罚款 ¥${monthlyStats.penaltyFee.toLocaleString()}`
                : '本月未超限',
          },
        ]}
      />

      <Panel title="需量采样曲线" aside={<span className="font-mono text-[11px]">单位 kW · 虚线为合同需量</span>}>
        <div className="h-[260px]">
          <Line data={demandChartData} options={demandChartOptions} />
        </div>
      </Panel>

      <Panel title="历史最大需量对比" aside={<span className="font-mono text-[11px]">合同需量 {DEMAND_TARGET} kW</span>} flush>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>月份</th>
                <th className="text-right">最大需量 (kW)</th>
                <th className="text-right">合同需量 (kW)</th>
                <th className="text-right">差额 (kW)</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((item) => {
                const over = item.maxDemand > item.target;
                return (
                  <tr key={item.month}>
                    <td className="text-ink">{item.month}</td>
                    <td className={`text-right font-mono ${over ? 'text-danger' : 'text-ink'}`}>
                      {item.maxDemand}
                    </td>
                    <td className="text-right font-mono text-ink-2">{item.target}</td>
                    <td className={`text-right font-mono ${over ? 'text-danger' : 'text-ok'}`}>
                      {over ? '+' : ''}
                      {item.maxDemand - item.target}
                    </td>
                    <td>
                      <span className={over ? 'tag-danger' : 'tag-ok'}>{over ? '超限' : '达标'}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="需量控制建议">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded border border-warn/40 bg-warn/10 p-3">
            <h3 className="text-[13px] font-semibold text-warn">削峰建议</h3>
            <p className="mt-1 text-[12px] text-ink-2">
              在尖峰时段(08:00-11:00, 17:00-21:00)合理安排大型设备错峰运行。
            </p>
          </div>
          <div className="rounded border border-accent/40 bg-accent/10 p-3">
            <h3 className="text-[13px] font-semibold text-accent">负荷转移</h3>
            <p className="mt-1 text-[12px] text-ink-2">将部分生产任务转移至平段和低谷时段，降低高峰负荷。</p>
          </div>
          <div className="rounded border border-ok/40 bg-ok/10 p-3">
            <h3 className="text-[13px] font-semibold text-ok">节能改造</h3>
            <p className="mt-1 text-[12px] text-ink-2">对高耗能设备进行节能改造，降低单位产量能耗。</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
