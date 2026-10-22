import { useEffect, useRef, useState } from 'react';
import { Bell, Settings, Save, Check } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import Empty from '../components/Empty';

interface Threshold {
  id: number;
  type: string;
  equipment: string;
  min: number;
  max: number;
  warning: number;
  critical: number;
  unit: string;
}

const INITIAL_THRESHOLDS: Threshold[] = [
  { id: 1, type: '电流', equipment: '主配电柜', min: 0, max: 500, warning: 400, critical: 450, unit: 'A' },
  { id: 2, type: '电压', equipment: '主配电柜', min: 10, max: 11, warning: 10.6, critical: 10.9, unit: 'kV' },
  { id: 3, type: '温度', equipment: '变压器A', min: 0, max: 100, warning: 65, critical: 80, unit: '°C' },
  { id: 4, type: '负载率', equipment: '变压器A', min: 0, max: 100, warning: 75, critical: 85, unit: '%' },
];

const WARNINGS = [
  { id: 1, type: '用电预警', equipment: '主配电柜', threshold: '80%', current: '78%', status: 'pending', time: '2024-06-07 14:30' },
  { id: 2, type: '用水预警', equipment: '水表-1号', threshold: '500吨/日', current: '480吨', status: 'pending', time: '2024-06-07 13:45' },
  { id: 3, type: '负载预警', equipment: '变压器A', threshold: '75%', current: '72%', status: 'resolved', time: '2024-06-07 10:20' },
];

/** 范围较窄（如电压 10~11）时用 0.1 步长，避免无法选到小数 */
const sliderStep = (threshold: Threshold) => (threshold.max - threshold.min <= 20 ? 0.1 : 1);

const TABS = [
  { key: 'warnings', label: '预警列表', icon: Bell },
  { key: 'config', label: '阈值配置', icon: Settings },
] as const;

export default function EnergyWarning() {
  const [activeTab, setActiveTab] = useState('warnings');
  const [thresholds, setThresholds] = useState<Threshold[]>(INITIAL_THRESHOLDS);
  const [savedThresholds, setSavedThresholds] = useState<Threshold[]>(INITIAL_THRESHOLDS);
  const [toast, setToast] = useState(false);
  const toastTimer = useRef<number | null>(null);

  const isDirty = JSON.stringify(thresholds) !== JSON.stringify(savedThresholds);

  useEffect(() => {
    return () => {
      if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const updateThreshold = (id: number, field: 'warning' | 'critical', value: number) => {
    if (Number.isNaN(value)) return;
    setThresholds((prev) =>
      prev.map((threshold) => {
        if (threshold.id !== id) return threshold;
        if (field === 'warning') {
          // 不得越过告警阈值
          const warning = Math.max(threshold.min, Math.min(value, threshold.critical));
          return { ...threshold, warning };
        }
        // 不得低于预警阈值
        const critical = Math.min(threshold.max, Math.max(value, threshold.warning));
        return { ...threshold, critical };
      }),
    );
  };

  const handleSave = () => {
    setSavedThresholds(thresholds);
    setToast(true);
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="space-y-3">
      {toast && (
        <div className="fixed left-1/2 top-4 z-50 flex -translate-x-1/2 items-center gap-2 rounded border border-ok/40 bg-ok/10 px-4 py-2.5 text-ok">
          <Check className="h-4 w-4" />
          阈值配置已保存
        </div>
      )}

      <PageHeader title="用能预警" description="配置预警阈值并查看预警信息">
        <div className="inline-flex rounded-sm border border-line bg-inset p-0.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-1.5 rounded-sm px-3 py-1 text-[12px] font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'border border-accent/40 bg-accent/10 text-accent'
                    : 'border border-transparent text-ink-2 hover:bg-hover'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </PageHeader>

      {activeTab === 'warnings' && (
        <Panel flush>
          <table>
            <thead>
              <tr>
                <th>预警类型</th>
                <th>设备名称</th>
                <th>预警阈值</th>
                <th>当前值</th>
                <th>状态</th>
                <th>时间</th>
              </tr>
            </thead>
            <tbody>
              {WARNINGS.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <Empty title="暂无预警信息" />
                  </td>
                </tr>
              ) : (
                WARNINGS.map((warning) => (
                  <tr key={warning.id}>
                    <td className="font-medium text-ink">{warning.type}</td>
                    <td className="text-ink-2">{warning.equipment}</td>
                    <td className="font-mono text-ink-2">{warning.threshold}</td>
                    <td>
                      <span className="tag-warn font-mono">{warning.current}</span>
                    </td>
                    <td>
                      <span className={warning.status === 'pending' ? 'tag-warn' : 'tag-ok'}>
                        {warning.status === 'pending' ? '待处理' : '已解除'}
                      </span>
                    </td>
                    <td className="font-mono text-[12px] text-ink-2">{warning.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Panel>
      )}

      {activeTab === 'config' && (
        <Panel
          title="预警阈值配置"
          aside={
            <>
              {isDirty ? (
                <span className="text-warn">有未保存修改</span>
              ) : (
                <span className="text-ok">已保存</span>
              )}
              <button onClick={handleSave} className="btn-primary h-7">
                <Save className="h-3.5 w-3.5" />
                保存配置
              </button>
            </>
          }
        >
          <div className="space-y-3">
            {thresholds.map((threshold) => {
              const range = threshold.max - threshold.min;
              const warningPct = ((threshold.warning - threshold.min) / range) * 100;
              const criticalPct = ((threshold.critical - threshold.min) / range) * 100;
              const step = sliderStep(threshold);
              return (
                <div key={threshold.id} className="rounded border border-line bg-inset p-3">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-ink">{threshold.equipment}</span>
                      <span className="text-[12px] text-ink-3">{threshold.type}</span>
                    </div>
                    <span className="text-[12px] text-ink-3">单位: {threshold.unit}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-ink-2">正常范围</span>
                      <span className="font-mono text-[13px] font-medium text-ink">
                        {threshold.min} - {threshold.max} {threshold.unit}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="label">预警阈值</label>
                        <div className="relative">
                          <input
                            type="range"
                            min={threshold.min}
                            max={threshold.max}
                            step={step}
                            value={threshold.warning}
                            onChange={(e) => updateThreshold(threshold.id, 'warning', Number(e.target.value))}
                            className="w-full cursor-pointer"
                          />
                          <span className="absolute -top-4 right-0 font-mono text-[12px] font-medium text-warn">
                            {threshold.warning} {threshold.unit}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="label">告警阈值</label>
                        <div className="relative">
                          <input
                            type="range"
                            min={threshold.min}
                            max={threshold.max}
                            step={step}
                            value={threshold.critical}
                            onChange={(e) => updateThreshold(threshold.id, 'critical', Number(e.target.value))}
                            className="w-full cursor-pointer"
                          />
                          <span className="absolute -top-4 right-0 font-mono text-[12px] font-medium text-danger">
                            {threshold.critical} {threshold.unit}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      {/* 单条轨道：黄色预警段 [0, warning)，红色告警段 [warning, critical) */}
                      <div className="progress-bar relative h-3 flex-1">
                        <div className="absolute inset-y-0 left-0 bg-warn" style={{ width: `${warningPct}%` }} />
                        <div
                          className="absolute inset-y-0 bg-danger"
                          style={{ left: `${warningPct}%`, width: `${criticalPct - warningPct}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-ink-3">
                        <span className="flex items-center gap-1">
                          <span className="h-2.5 w-2.5 rounded-sm bg-ok" />
                          正常
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="h-2.5 w-2.5 rounded-sm bg-warn" />
                          预警
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="h-2.5 w-2.5 rounded-sm bg-danger" />
                          告警
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      )}
    </div>
  );
}
