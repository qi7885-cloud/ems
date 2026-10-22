import { useState } from 'react';
import { AlertTriangle, Bell, Check, CheckCircle2, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import MetricStrip from '../components/MetricStrip';
import Empty from '../components/Empty';

/** 将时间字符串统一格式化为 YYYY-MM-DD HH:mm，兼容 'YYYY-MM-DD HH:mm' 与 ISO 字符串 */
const formatTime = (value?: string): string => {
  if (!value) return '—';
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/**
 * 级别语义色：严重→danger / 一般→warn / 轻微→info。
 * 同一条告警的「左侧色条 / 级别标签 / 状态灯」三处颜色都取自本函数的同一次返回值，
 * 保证颜色绝不会各说各话。
 */
const levelTone = (level: string) => {
  switch (level) {
    case '严重':
      return { bar: 'bg-danger', tag: 'tag-danger', dot: 'bg-danger' };
    case '一般':
      return { bar: 'bg-warn', tag: 'tag-warn', dot: 'bg-warn' };
    case '轻微':
      return { bar: 'bg-info', tag: 'tag-info', dot: 'bg-info' };
    default:
      return { bar: 'bg-offline', tag: 'tag-offline', dot: 'bg-offline' };
  }
};

const FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待处理' },
  { key: 'resolved', label: '已处理' },
] as const;

export default function EquipmentFault() {
  const alarms = useStore((state) => state.alarms);
  const resolveAlarm = useStore((state) => state.resolveAlarm);
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredAlarms = alarms.filter((alarm) => {
    if (statusFilter === 'all') return true;
    return alarm.status === statusFilter;
  });

  const handleResolve = (id: number) => {
    resolveAlarm(id);
  };

  const pendingCount = alarms.filter((a) => a.status === 'pending').length;
  const resolvedCount = alarms.filter((a) => a.status === 'resolved').length;
  const severeCount = alarms.filter((a) => a.level === '严重').length;

  return (
    <div className="space-y-3">
      <PageHeader title="设备故障" description="实时监测和记录设备故障信息">
        <span className="font-mono text-[11px] text-ink-3">共 {filteredAlarms.length} 条记录</span>
      </PageHeader>

      <MetricStrip
        cols={4}
        items={[
          { label: '全部告警', value: alarms.length, unit: '条', icon: Bell },
          { label: '待处理', value: pendingCount, unit: '条', icon: Clock, tone: 'warn', note: pendingCount > 0 ? '需及时处理' : '全部已处理' },
          { label: '严重', value: severeCount, unit: '条', icon: AlertTriangle, tone: 'danger' },
          { label: '已处理', value: resolvedCount, unit: '条', icon: CheckCircle2, tone: 'ok' },
        ]}
      />

      <Panel
        flush
        toolbar={
          <div className="inline-flex rounded-sm border border-line bg-inset p-0.5">
            {FILTERS.map((item) => (
              <button
                key={item.key}
                onClick={() => setStatusFilter(item.key)}
                className={`rounded-sm px-3 py-1 text-[12px] font-medium transition-colors ${
                  statusFilter === item.key
                    ? 'border border-accent/40 bg-accent/10 text-accent'
                    : 'border border-transparent text-ink-2 hover:bg-hover'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        }
      >
        <table>
          <thead>
            <tr>
              <th>告警信息</th>
              <th>级别</th>
              <th>状态</th>
              <th>时间</th>
              <th className="text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlarms.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <Empty title="没有符合条件的告警" description="试试放宽筛选条件" />
                </td>
              </tr>
            ) : (
              filteredAlarms.map((alarm) => {
                const tone = levelTone(alarm.level);
                return (
                  <tr key={alarm.id}>
                    <td>
                      <div className="flex items-stretch gap-2.5">
                        <span className={`w-0.5 shrink-0 rounded-sm ${tone.bar}`} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`status-dot ${tone.dot}`} />
                            <p className="font-medium text-ink">{alarm.message}</p>
                          </div>
                          <p className="mt-0.5 text-[12px] text-ink-3">类型: {alarm.type}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={tone.tag}>{alarm.level}</span>
                    </td>
                    <td>
                      <span className={alarm.status === 'pending' ? 'tag-warn' : 'tag-ok'}>
                        {alarm.status === 'pending' ? '待处理' : '已处理'}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-[12px] text-ink-2">{alarm.created_at}</span>
                    </td>
                    <td className="text-right">
                      {alarm.status === 'pending' ? (
                        <button onClick={() => handleResolve(alarm.id)} className="btn-primary h-7">
                          <Check className="h-3.5 w-3.5" />
                          处理
                        </button>
                      ) : (
                        <span className="text-[12px] text-ink-3">
                          已处理于 {alarm.resolved_at ? formatTime(alarm.resolved_at) : '—'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
