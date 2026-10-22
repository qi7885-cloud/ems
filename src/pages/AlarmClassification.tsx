import { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Settings,
  X,
  Save,
  Trash2,
  Layers,
  type LucideIcon,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import PageHeader from '../components/PageHeader';
import MetricStrip from '../components/MetricStrip';
import Empty from '../components/Empty';

type ColorKey = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';

interface Classification {
  level: string;
  icon: LucideIcon;
  color: ColorKey;
  description: string;
  responseTime: string;
  count: number;
  actions: string[];
}

/** 至少保留的报警级别数量 */
const MIN_LEVELS = 3;

const initialClassifications: Classification[] = [
  {
    level: '严重',
    icon: AlertTriangle,
    color: 'red',
    description: '设备故障或严重异常，需立即处理',
    responseTime: '15分钟',
    count: 2,
    actions: ['立即通知负责人', '生成工单', '短信告警'],
  },
  {
    level: '一般',
    icon: AlertCircle,
    color: 'yellow',
    description: '性能异常或接近阈值，需关注',
    responseTime: '1小时',
    count: 5,
    actions: ['记录日志', '定时检查', '邮件通知'],
  },
  {
    level: '轻微',
    icon: Info,
    color: 'blue',
    description: '一般性提示或信息，定期处理',
    responseTime: '24小时',
    count: 12,
    actions: ['记录日志', '定期汇总', '周报上报'],
  },
];

/**
 * 级别语义色严格固定：严重→danger / 一般→warn / 轻微→info。
 * 卡片左侧色条、级别名、动作标签都取同一份返回值。
 */
const levelTone = (level: string) => {
  if (level === '严重') return { bar: 'bg-danger', text: 'text-danger', tag: 'tag-danger' };
  if (level === '一般') return { bar: 'bg-warn', text: 'text-warn', tag: 'tag-warn' };
  return { bar: 'bg-info', text: 'text-info', tag: 'tag-info' };
};

export default function AlarmClassification() {
  const alarms = useStore((state) => state.alarms);
  const [classifications, setClassifications] = useState<Classification[]>(initialClassifications);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [draft, setDraft] = useState<Classification[]>([]);
  const [toast, setToast] = useState('');

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2000);
  };

  const openConfigModal = () => {
    setDraft(classifications.map((item) => ({ ...item })));
    setShowConfigModal(true);
  };

  const updateDraft = (index: number, patch: Partial<Classification>) => {
    setDraft((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const removeDraftRow = (index: number) => {
    if (draft.length <= MIN_LEVELS) {
      showToast(`至少保留 ${MIN_LEVELS} 个级别`);
      return;
    }
    setDraft((prev) => prev.filter((_, i) => i !== index));
  };

  const saveConfig = () => {
    if (draft.some((item) => item.level.trim() === '' || item.responseTime.trim() === '')) {
      showToast('名称和响应时限不能为空');
      return;
    }
    setClassifications(draft);
    setShowConfigModal(false);
    showToast('报警分级配置已保存');
  };

  const severeCount = alarms.filter((a) => a.level === '严重').length;
  const generalCount = alarms.filter((a) => a.level === '一般').length;
  const minorCount = alarms.filter((a) => a.level === '轻微').length;

  return (
    <div className="space-y-3">
      <PageHeader title="报警分级" description="管理报警等级配置和响应策略">
        <button onClick={openConfigModal} className="btn-secondary h-7">
          <Settings className="h-3.5 w-3.5" />
          编辑配置
        </button>
      </PageHeader>

      <MetricStrip
        cols={4}
        items={[
          { label: '级别数', value: classifications.length, unit: '级', icon: Layers },
          { label: '严重告警', value: severeCount, unit: '条', icon: AlertTriangle, tone: 'danger' },
          { label: '一般告警', value: generalCount, unit: '条', icon: AlertCircle, tone: 'warn' },
          { label: '轻微告警', value: minorCount, unit: '条', icon: Info, tone: 'accent' },
        ]}
      />

      {classifications.length === 0 ? (
        <div className="panel">
          <Empty title="暂无报警分级配置" description="点击下方按钮新增分级" />
          <div className="flex justify-center pb-4">
            <button onClick={openConfigModal} className="btn-secondary">
              <Settings className="h-3.5 w-3.5" />
              编辑配置
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {classifications.map((item) => {
            const tone = levelTone(item.level);
            return (
              <div key={item.level} className="panel flex items-stretch overflow-hidden">
                <span className={`w-[3px] shrink-0 ${tone.bar}`} />
                <div className="min-w-0 flex-1 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[14px] font-semibold ${tone.text}`}>{item.level}</span>
                    <span className="font-mono text-[12px] text-ink-3">
                      响应时限 <span className="text-ink">{item.responseTime}</span>
                    </span>
                  </div>
                  <p className="mt-1.5 text-[12px] text-ink-2">{item.description}</p>

                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {item.actions.map((action, index) => (
                      <span key={index} className={tone.tag}>
                        {action}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-[12px] text-ink-3">
                      当前 <span className={`font-mono font-semibold ${tone.text}`}>{item.count}</span> 条
                    </span>
                    <button onClick={openConfigModal} className="btn-secondary h-7">
                      <Settings className="h-3.5 w-3.5" />
                      编辑配置
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="panel">
        <div className="panel-head">
          <h2 className="panel-title">分级策略说明</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-3">
          <div className="rounded border border-line bg-danger/10 p-3">
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-danger" />
              <h3 className="text-[13px] font-semibold text-danger">严重告警</h3>
            </div>
            <ul className="space-y-1.5 text-[12px] text-ink-2">
              <li>设备停机或严重故障</li>
              <li>参数超过安全阈值</li>
              <li>可能导致生产中断</li>
              <li>需要立即响应处理</li>
            </ul>
          </div>
          <div className="rounded border border-line bg-warn/10 p-3">
            <div className="mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-warn" />
              <h3 className="text-[13px] font-semibold text-warn">一般告警</h3>
            </div>
            <ul className="space-y-1.5 text-[12px] text-ink-2">
              <li>设备性能下降</li>
              <li>参数接近预警阈值</li>
              <li>可能影响生产效率</li>
              <li>需要及时关注处理</li>
            </ul>
          </div>
          <div className="rounded border border-line bg-info/10 p-3">
            <div className="mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-info" />
              <h3 className="text-[13px] font-semibold text-info">轻微告警</h3>
            </div>
            <ul className="space-y-1.5 text-[12px] text-ink-2">
              <li>日常巡检提示</li>
              <li>周期性维护提醒</li>
              <li>性能优化建议</li>
              <li>定期汇总处理</li>
            </ul>
          </div>
        </div>
      </div>

      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="panel flex max-h-[90vh] w-full max-w-2xl flex-col">
            <div className="panel-head">
              <h2 className="panel-title">编辑报警分级</h2>
              <button
                onClick={() => setShowConfigModal(false)}
                className="btn-ghost h-7 w-7 !px-0"
                title="关闭"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-3">
              {draft.map((item, index) => {
                const tone = levelTone(item.level);
                return (
                  <div key={index} className="flex items-end gap-3 rounded border border-line bg-inset p-3">
                    <span className={`mb-1 h-8 w-[3px] shrink-0 ${tone.bar}`} />
                    <div className="flex-1">
                      <label className="label">等级名称</label>
                      <input
                        type="text"
                        value={item.level}
                        onChange={(e) => updateDraft(index, { level: e.target.value })}
                        className="field h-8 w-full"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="label">响应时限</label>
                      <input
                        type="text"
                        value={item.responseTime}
                        onChange={(e) => updateDraft(index, { responseTime: e.target.value })}
                        className="field h-8 w-full"
                      />
                    </div>
                    <button
                      onClick={() => removeDraftRow(index)}
                      disabled={draft.length <= MIN_LEVELS}
                      title={draft.length <= MIN_LEVELS ? `至少保留 ${MIN_LEVELS} 个级别` : '删除该级别'}
                      className={`h-8 w-8 !px-0 ${
                        draft.length <= MIN_LEVELS ? 'btn-ghost cursor-not-allowed opacity-40' : 'btn-danger'
                      }`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 border-t border-line p-3">
              <button onClick={() => setShowConfigModal(false)} className="btn-secondary flex-1">
                取消
              </button>
              <button onClick={saveConfig} className="btn-primary flex-1">
                <Save className="h-3.5 w-3.5" />
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded border border-line bg-panel-2 px-4 py-2.5 text-[12px] text-ink">
          {toast}
        </div>
      )}
    </div>
  );
}
