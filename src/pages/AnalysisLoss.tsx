import { useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import { monthOptions, seededValue } from '../data/mockData';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import MetricStrip from '../components/MetricStrip';
import { useChartTheme, axisStyle, tooltipStyle, legendStyle } from '../hooks/useChartTheme';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

// 各分项损耗：供电量基准(kWh) + 损耗量区间(kWh) + 目标损耗率(%)
// 损耗率 = 该项损耗量 / 该项供电量 × 100%，不再手写一个对不上的 rate
const lossCategories = [
  { name: '线损', target: 5.0, supply: 3750000, lossMin: 170000, lossMax: 215000 },
  { name: '变损', target: 3.0, supply: 3750000, lossMin: 85000, lossMax: 120000 },
  { name: '表损', target: 0.8, supply: 3750000, lossMin: 14000, lossMax: 24000 },
  { name: '不明损耗', target: 1.0, supply: 3750000, lossMin: 35000, lossMax: 56000 },
];

// 总目标由各分项目标相加派生，杜绝与分项之和矛盾（5.0 + 3.0 + 0.8 + 1.0 = 9.8）
const totalTarget = lossCategories.reduce((sum, item) => sum + item.target, 0);

// 损耗明细的基础参数，按所选月份在其上做确定性浮动
const lossDetailBase = [
  { equipment: '主配电柜A', type: '线损', base: 3.2, threshold: 5.0 },
  { equipment: '主配电柜B', type: '线损', base: 2.8, threshold: 5.0 },
  { equipment: '变压器1#', type: '变损', base: 2.5, threshold: 3.0 },
  { equipment: '变压器2#', type: '变损', base: 3.1, threshold: 3.0 },
  { equipment: '计量表-01', type: '表损', base: 0.3, threshold: 0.8 },
  { equipment: '计量表-02', type: '表损', base: 0.6, threshold: 0.8 },
  { equipment: '线路-北区', type: '线损', base: 5.8, threshold: 5.0 },
  { equipment: '线路-南区', type: '线损', base: 4.8, threshold: 5.0 },
];

export default function AnalysisLoss() {
  const [selectedMonth, setSelectedMonth] = useState('2024-06');
  const ct = useChartTheme();

  // 分项损耗量随所选月份派生，损耗率由「损耗量 / 供电量」计算
  const lossData = useMemo(
    () =>
      lossCategories.map((item) => {
        const value = seededValue(`loss-${selectedMonth}-${item.name}`, item.lossMin, item.lossMax, 1);
        const rate = Number(((value / item.supply) * 100).toFixed(1));
        return {
          category: item.name,
          target: item.target,
          value,
          rate,
          status: rate > item.target ? 'warning' : 'normal',
        };
      }),
    [selectedMonth],
  );

  const totalLoss = useMemo(() => lossData.reduce((sum, item) => sum + item.value, 0), [lossData]);
  const totalRate = useMemo(
    () => Number(lossData.reduce((sum, item) => sum + item.rate, 0).toFixed(1)),
    [lossData],
  );

  // 月度趋势与分项同源同算法：每个月 = 该月各分项损耗率之和
  // 因此当选到某个月时，趋势图中该月的损耗率与上方「总损耗率」完全一致
  const monthlyLoss = useMemo(
    () =>
      monthOptions.map((key) => {
        const rate = Number(
          lossCategories
            .reduce((sum, item) => {
              const value = seededValue(`loss-${key}-${item.name}`, item.lossMin, item.lossMax, 1);
              return sum + (value / item.supply) * 100;
            }, 0)
            .toFixed(1),
        );
        return { month: `${Number(key.slice(5))}月`, loss: rate, target: totalTarget };
      }),
    [],
  );

  const lossDetail = useMemo(
    () =>
      lossDetailBase.map((item) => {
        const delta = seededValue(`loss-detail-${selectedMonth}-${item.equipment}`, -0.4, 0.4, 1);
        const rate = Number((item.base + delta).toFixed(1));
        return {
          equipment: item.equipment,
          type: item.type,
          rate,
          status: rate > item.threshold ? 'warning' : 'normal',
        };
      }),
    [selectedMonth],
  );

  const unknownLossRate = lossData.find((item) => item.category === '不明损耗')?.rate ?? 0;

  // 最高分项损耗：取损耗量最大的分项，用于提示重点管控对象
  const maxLossItem = lossData.reduce(
    (max, item) => (item.value > max.value ? item : max),
    lossData[0],
  );

  const axis = axisStyle(ct);

  const chartData: ChartData<'bar' | 'line', number[], string> = {
    labels: monthlyLoss.map((item) => item.month),
    datasets: [
      {
        type: 'bar' as const,
        label: '实际损耗率',
        data: monthlyLoss.map((item) => item.loss),
        backgroundColor: monthlyLoss.map((item) => (item.loss > item.target ? ct.danger : ct.accent)),
        borderRadius: 2,
        borderSkipped: false as const,
        order: 2,
      },
      {
        // 目标损耗率参考线：恒定值 + 虚线
        type: 'line' as const,
        label: `目标损耗率 ${totalTarget}%`,
        data: monthlyLoss.map((item) => item.target),
        borderColor: ct.danger,
        borderWidth: 1.5,
        borderDash: [6, 4],
        pointRadius: 0,
        tension: 0,
        fill: false,
        order: 1,
      },
    ],
  };

  const chartOptions: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: { legend: legendStyle(ct, 'top'), tooltip: tooltipStyle(ct) },
    scales: {
      x: { ...axis, grid: { display: false } },
      y: {
        ...axis,
        ticks: { ...axis.ticks, callback: (value: number | string) => `${value}%` },
        title: { display: true, text: '损耗率 (%)', color: ct.tick, font: { size: 11 } },
      },
    },
  };

  return (
    <div className="space-y-3">
      <PageHeader title="损耗分析" description="分析各类能源损耗情况，定位损耗异常">
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
          { label: '总损耗', value: Math.round(totalLoss), unit: 'kWh', tone: 'warn', note: '各分项之和' },
          {
            label: '总损耗率',
            value: totalRate,
            unit: '%',
            // 损耗率越低越好：超过总目标=恶化=danger 红，达标=ok 绿
            tone: totalRate > totalTarget ? 'danger' : 'ok',
            note: `目标 ${totalTarget}%`,
          },
          {
            label: '最高分项损耗',
            value: Math.round(maxLossItem.value),
            unit: 'kWh',
            tone: 'danger',
            note: maxLossItem.category,
          },
          { label: '目标损耗率', value: totalTarget, unit: '%', note: '分项目标之和' },
        ]}
      />

      <Panel
        title="分项损耗"
        aside={<span className="font-mono text-[11px]">单位 kWh / %</span>}
        flush
      >
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>分项</th>
                <th className="text-right">损耗量 (kWh)</th>
                <th className="text-right">损耗率</th>
                <th className="text-right">目标</th>
                <th className="w-40">占目标</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              {lossData.map((item) => {
                const over = item.status === 'warning';
                return (
                  <tr key={item.category}>
                    <td className="text-ink">{item.category}</td>
                    <td className="text-right font-mono">{item.value.toFixed(1)}</td>
                    <td className={`text-right font-mono ${over ? 'text-danger' : 'text-ok'}`}>
                      {item.rate}%
                    </td>
                    <td className="text-right font-mono text-ink-2">{item.target}%</td>
                    <td>
                      <div className="progress-bar">
                        <div
                          className={`progress-fill ${over ? 'bg-danger' : 'bg-ok'}`}
                          style={{ width: `${Math.min((item.rate / (item.target * 1.5)) * 100, 100)}%` }}
                        />
                      </div>
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

      <Panel
        title="月度损耗率趋势"
        aside={
          <span className="flex items-center gap-3 font-mono text-[11px]">
            <span className={totalRate > totalTarget ? 'text-danger' : 'text-ok'}>
              总损耗率 {totalRate.toFixed(1)}%
            </span>
            <span className="text-ink-3">总损耗量 {Math.round(totalLoss).toLocaleString()} kWh</span>
          </span>
        }
      >
        <div className="h-[260px]">
          <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
      </Panel>

      <Panel title="损耗明细" flush>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>设备名称</th>
                <th>损耗类型</th>
                <th className="text-right">损耗率</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              {lossDetail.map((item) => {
                const over = item.status === 'warning';
                return (
                  <tr key={item.equipment}>
                    <td className="font-medium text-ink">{item.equipment}</td>
                    <td className="text-ink-2">{item.type}</td>
                    <td className={`text-right font-mono ${over ? 'text-danger' : 'text-ok'}`}>{item.rate}%</td>
                    <td>
                      <span className={over ? 'tag-danger' : 'tag-ok'}>{over ? '超限' : '正常'}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="损耗分析建议">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded border border-danger/40 bg-danger/10 p-3">
            <h3 className="text-[13px] font-semibold text-danger">重点关注</h3>
            <p className="mt-1 text-[12px] text-ink-2">
              不明损耗率达{unknownLossRate}%，建议检查计量表计准确性及线路是否存在漏电情况。
            </p>
          </div>
          <div className="rounded border border-warn/40 bg-warn/10 p-3">
            <h3 className="text-[13px] font-semibold text-warn">待优化项</h3>
            <p className="mt-1 text-[12px] text-ink-2">
              变压器2#和北区线路损耗率偏高，建议安排专业人员进行检修维护。
            </p>
          </div>
          <div className="rounded border border-ok/40 bg-ok/10 p-3">
            <h3 className="text-[13px] font-semibold text-ok">正常项</h3>
            <p className="mt-1 text-[12px] text-ink-2">
              变损和表损控制良好，建议继续保持当前维护频率。
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
