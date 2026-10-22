import { useMemo } from 'react';
import { Gauge, TrendingUp, TrendingDown } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import MetricStrip from '../components/MetricStrip';
import Empty from '../components/Empty';

type PowerFactorLevel = 'good' | 'warning' | 'bad';

interface PowerFactorEvaluation {
  level: PowerFactorLevel;
  statusText: string;
  /** 调整比例（%）：负值=奖励，正值=罚款 */
  ratioPct: number;
  /** 调整电费（元）：负值=少收钱（奖励），正值=多收钱（罚款） */
  amount: number;
}

/** 力调电费调整基数（月度电度电费，元），调整电费 = 基数 × 调整比例 */
const BASE_FEE = 40000;
/** 柱状图基线：0.80 以下视为不达标，用它做基线才能拉开各月差异 */
const FACTOR_BASELINE = 0.8;
const FACTOR_MAX = 1.0;
/** 达标线（功率因数 0.90） */
const PASS_FACTOR = 0.9;
const CHART_HEIGHT = 200;
/** 0.90 达标线距基线的高度 */
const PASS_LINE_HEIGHT = ((PASS_FACTOR - FACTOR_BASELINE) / (FACTOR_MAX - FACTOR_BASELINE)) * CHART_HEIGHT;

/**
 * 统一「功率因数奖惩」业务逻辑：状态色、调整比例符号、调整电费符号三者均由本函数产出，严格一致。
 * - factor ≥ 0.90：达标，奖励，调整比例为负、调整电费为负（少收钱）
 * - 0.85 ≤ factor < 0.90：考核区间，轻微罚款，调整比例为正、调整电费为正（多收钱）
 * - factor < 0.85：不达标，罚款，调整比例为正、调整电费为正（多收钱）
 */
const evaluatePowerFactor = (factor: number): PowerFactorEvaluation => {
  let level: PowerFactorLevel;
  let statusText: string;
  let ratioPct: number;

  if (factor >= PASS_FACTOR) {
    level = 'good';
    statusText = '达标';
    ratioPct = -0.75;
  } else if (factor >= 0.85) {
    level = 'warning';
    statusText = '考核';
    ratioPct = 2;
  } else {
    level = 'bad';
    statusText = '不达标';
    ratioPct = 5;
  }

  return { level, statusText, ratioPct, amount: Math.round((BASE_FEE * ratioPct) / 100) };
};

const monthlyFactors = [
  { month: '1月', factor: 0.92 },
  { month: '2月', factor: 0.88 },
  { month: '3月', factor: 0.95 },
  { month: '4月', factor: 0.91 },
  { month: '5月', factor: 0.85 },
  { month: '6月', factor: 0.93 },
];

const statusConfig: Record<PowerFactorLevel, { tag: string; color: string; indicator: string }> = {
  good: { tag: 'tag-ok', color: 'text-ok', indicator: 'bg-ok' },
  warning: { tag: 'tag-warn', color: 'text-warn', indicator: 'bg-warn' },
  bad: { tag: 'tag-danger', color: 'text-danger', indicator: 'bg-danger' },
};

const formatAmount = (amount: number) =>
  `${amount >= 0 ? '+' : '-'}¥${Math.abs(amount).toLocaleString('zh-CN')}`;

export default function StatisticsPowerFactor() {
  const rows = useMemo(
    () =>
      monthlyFactors.map((item) => {
        const evaluation = evaluatePowerFactor(item.factor);
        return {
          ...item,
          ...evaluation,
          ratioLabel: `${evaluation.ratioPct > 0 ? '+' : ''}${evaluation.ratioPct}%`,
          barHeight: Math.max(
            6,
            Math.round(((item.factor - FACTOR_BASELINE) / (FACTOR_MAX - FACTOR_BASELINE)) * CHART_HEIGHT),
          ),
        };
      }),
    [],
  );

  const stats = useMemo(() => {
    const avg = rows.length > 0 ? rows.reduce((sum, item) => sum + item.factor, 0) / rows.length : 0;
    const maxFactor = rows.reduce((max, item) => Math.max(max, item.factor), 0);
    const passCount = rows.filter((item) => item.level === 'good').length;
    const cumulative = rows.reduce((sum, item) => sum + item.amount, 0);
    return { avg, maxFactor, passCount, cumulative };
  }, [rows]);

  const metrics = [
    { label: '平均功率因数', value: stats.avg.toFixed(2), icon: Gauge, tone: 'accent' as const },
    { label: '达标月数', value: stats.passCount, unit: '个月', icon: TrendingUp, tone: 'ok' as const },
    {
      label: '调整电费合计',
      value: formatAmount(stats.cumulative),
      note: stats.cumulative < 0 ? '合计奖励（少收钱）' : '合计罚款（多收钱）',
      icon: TrendingDown,
      tone: stats.cumulative < 0 ? ('ok' as const) : ('danger' as const),
    },
    { label: '最高功率因数', value: stats.maxFactor.toFixed(2) },
  ];

  return (
    <div className="space-y-3">
      <PageHeader title="力调电费" description="功率因数调整电费分析" />

      <MetricStrip cols={4} items={metrics} />

      <Panel
        title="功率因数趋势"
        description="柱体以 0.80 为基线、1.00 为满高映射，虚线为 0.90 达标线"
        aside={<span className="font-mono text-[11px]">基线 0.80</span>}
      >
        <div className="relative">
          <div
            className="pointer-events-none absolute inset-x-0 z-10"
            style={{ top: `${CHART_HEIGHT - PASS_LINE_HEIGHT}px` }}
          >
            <div className="border-t border-dashed border-line-strong" />
            <span className="absolute -top-4 right-0 font-mono text-[11px] text-ink-3">
              {PASS_FACTOR.toFixed(2)} 达标线
            </span>
          </div>
          <div className="grid grid-cols-6 gap-3">
            {rows.map((item) => {
              const config = statusConfig[item.level];
              return (
                <div key={item.month} className="flex flex-col items-center">
                  <div className="flex w-full items-end" style={{ height: `${CHART_HEIGHT}px` }}>
                    <div
                      className={`w-full rounded-t ${config.indicator}`}
                      style={{ height: `${item.barHeight}px` }}
                      title={`${item.month} 功率因数 ${item.factor.toFixed(2)}`}
                    />
                  </div>
                  <span className={`mt-2 ${config.tag}`}>{item.factor.toFixed(2)}</span>
                  <span className="mt-1 text-[11px] text-ink-3">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Panel>

      <Panel
        title="力调电费明细"
        description="规则：功率因数 ≥ 0.90 达标（调整电费为负，少收钱）；0.85~0.90 考核区间罚款；< 0.85 不达标罚款（调整电费为正，多收钱）"
        aside={<span className="font-mono text-[11px]">单位 元</span>}
        flush
      >
        {rows.length === 0 ? (
          <Empty title="暂无力调电费数据" description="当前没有可统计的功率因数记录" />
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>月份</th>
                  <th className="text-right">功率因数</th>
                  <th className="text-right">调整比例</th>
                  <th className="text-right">调整电费</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => {
                  const config = statusConfig[item.level];
                  return (
                    <tr key={item.month}>
                      <td className="font-medium text-ink">{item.month}</td>
                      <td className="text-right font-mono text-ink-2">{item.factor.toFixed(2)}</td>
                      <td className={`text-right font-mono ${config.color}`}>{item.ratioLabel}</td>
                      <td className={`text-right font-mono ${config.color}`}>{formatAmount(item.amount)}</td>
                      <td>
                        <span className={config.tag}>{item.statusText}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
