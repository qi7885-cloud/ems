import { useMemo } from 'react';
import { Activity, ArrowDown, ArrowUp, Network, Zap } from 'lucide-react';
import { categoryEnergyData } from '../data/mockData';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import MetricStrip from '../components/MetricStrip';
import Empty from '../components/Empty';

// 与全站语义色一致的循环取色：强调青 / 信息蓝 / 正常绿 / 预警橙 / 紫。
// 分支数量固定为 5，写成一处常量，能流图与明细列表共用同一套颜色。
const BRANCH_COLORS = ['#22d3ee', '#38bdf8', '#34d399', '#f5a524', '#a78bfa'];

export default function AnalysisFlow() {
  // 与「分类能耗」页共用同一份 categoryEnergyData，避免两处流向数值不一致
  // 按 power 降序展示各分支流向
  const branches = useMemo(() => [...categoryEnergyData].sort((a, b) => b.power - a.power), []);

  const totalPower = useMemo(() => branches.reduce((sum, item) => sum + item.power, 0), [branches]);
  // 能流图条形宽度基准取最大分支，不写死像素
  const maxPower = branches.length > 0 ? branches[0].power : 1;
  const minPower = branches.length > 0 ? branches[branches.length - 1].power : 0;

  // 明细占比 = 分支 / 总输入；前 n-1 项四舍五入，最后一项用 100 减前面之和兜底，
  // 保证各分支占比之和恒等于 100%。
  const shares = useMemo(() => {
    let acc = 0;
    return branches.map((item, index) => {
      const share =
        index === branches.length - 1
          ? 100 - acc
          : Math.round((item.power / totalPower) * 100);
      acc += share;
      return share;
    });
  }, [branches, totalPower]);

  return (
    <div className="space-y-3">
      <PageHeader title="能源流向图" description="可视化展示能源从源头到各消耗端的流动情况" />

      <MetricStrip
        cols={4}
        items={[
          { label: '总输入', value: totalPower, unit: 'kWh', icon: Zap, note: '各分支之和' },
          { label: '分支数', value: branches.length, unit: '路', icon: Network, note: '在用分支' },
          {
            label: '最大分支',
            value: maxPower,
            unit: 'kWh',
            icon: ArrowUp,
            tone: 'accent',
            note: branches[0]?.category ?? '—',
          },
          {
            label: '最小分支',
            value: minPower,
            unit: 'kWh',
            icon: ArrowDown,
            note: branches[branches.length - 1]?.category ?? '—',
          },
        ]}
      />

      <Panel title="能源流向示意图" aside={<span className="font-mono text-[11px]">单位 kWh</span>} flush>
        <div className="flex flex-col items-center px-4 py-5">
          {/* 电源节点：唯一入口，控制青高亮 */}
          <div className="inline-flex items-center gap-2 rounded border border-accent/40 bg-accent/10 px-6 py-3 text-accent">
            <Zap className="h-4 w-4" />
            <span className="font-mono text-[14px] font-semibold">{totalPower.toLocaleString()}</span>
            <span className="text-[12px] text-ink-3">kWh · 电网总输入</span>
          </div>

          <ArrowDown className="my-3 h-5 w-5 text-ink-3" aria-hidden="true" />

          <div className="w-full max-w-3xl space-y-2">
            {branches.map((item, index) => (
              <div key={item.category} className="flex items-center gap-3">
                <span className="w-24 shrink-0 truncate text-right text-[12px] text-ink-2">{item.category}</span>
                {/* 分支节点：凹陷底 + 常规边框；填充宽度仍按 power / 最大分支 的比例 */}
                <div className="h-8 flex-1 overflow-hidden rounded-sm border border-line bg-inset">
                  <div
                    className="h-full rounded-sm"
                    style={{
                      width: `${(item.power / maxPower) * 100}%`,
                      backgroundColor: BRANCH_COLORS[index % BRANCH_COLORS.length],
                    }}
                  />
                </div>
                <span className="w-24 shrink-0 text-right font-mono text-[12px] text-ink">
                  {item.power.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <Panel title="流向数据明细" aside={<span className="font-mono text-[11px]">合计 {totalPower.toLocaleString()} kWh</span>} flush>
        {branches.length === 0 ? (
          <Empty title="暂无流向数据" description="请检查分类能耗采集是否正常" />
        ) : (
          <ul className="divide-y divide-line">
            {branches.map((item, index) => (
              <li key={item.category} className="flex items-center gap-3 px-4 py-2.5">
                <span className="flex w-24 shrink-0 items-center gap-1.5 truncate text-[13px] text-ink">
                  <Activity className="h-3.5 w-3.5 shrink-0 text-ink-3" />
                  {item.category}
                </span>
                <div className="progress-bar flex-1">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${shares[index]}%`,
                      backgroundColor: BRANCH_COLORS[index % BRANCH_COLORS.length],
                    }}
                  />
                </div>
                <span className="w-12 shrink-0 text-right font-mono text-[12px] text-ink-2">{shares[index]}%</span>
                <span className="w-24 shrink-0 text-right font-mono text-[12px] text-ink">
                  {item.power.toLocaleString()} kWh
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
