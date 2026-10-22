import { useState } from 'react';
import { Phone, Check, X, Search, Plus, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import MetricStrip from '../components/MetricStrip';
import Empty from '../components/Empty';

type SmsStatus = 'success' | 'failed';

interface SmsLogItem {
  id: number;
  phone: string;
  content: string;
  status: SmsStatus;
  time: string;
  type: string;
}

const smsLogs: SmsLogItem[] = [
  { id: 1, phone: '138****8888', content: '【EMS系统】变压器A温度过高，当前65°C，请及时处理', status: 'success', time: '2024-06-07 14:30', type: '告警通知' },
  { id: 2, phone: '139****9999', content: '【EMS系统】主配电柜电流接近阈值，当前450A', status: 'success', time: '2024-06-07 14:25', type: '预警通知' },
  { id: 3, phone: '137****7777', content: '【EMS系统】水表-1号离线，请检查网络连接', status: 'failed', time: '2024-06-07 13:45', type: '离线通知' },
  { id: 4, phone: '138****8888', content: '【EMS系统】变压器A温度恢复正常，当前58°C', status: 'success', time: '2024-06-07 12:30', type: '恢复通知' },
  { id: 5, phone: '139****9999', content: '【EMS系统】每日能耗报表已生成，请查看', status: 'success', time: '2024-06-07 08:00', type: '日报通知' },
];

const statusFilters: { key: 'all' | SmsStatus; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'success', label: '成功' },
  { key: 'failed', label: '失败' },
];

export default function SmsLog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SmsStatus>('all');
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [recipients, setRecipients] = useState<string[]>(['138****8888', '139****9999', '137****7777']);
  const [draftRecipients, setDraftRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2000);
  };

  const term = searchTerm.trim().toLowerCase();
  const filteredLogs = smsLogs.filter((log) => {
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesSearch = !term || log.phone.toLowerCase().includes(term) || log.content.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  const total = smsLogs.length;
  const successCount = smsLogs.filter((log) => log.status === 'success').length;
  const failedCount = smsLogs.filter((log) => log.status === 'failed').length;
  const successRate = total > 0 ? Math.round((successCount / total) * 100) : 0;

  const openRecipientModal = () => {
    setDraftRecipients(recipients);
    setNewRecipient('');
    setShowRecipientModal(true);
  };

  const addRecipient = () => {
    const value = newRecipient.trim();
    if (!value) return;
    if (draftRecipients.includes(value)) {
      showToast('该号码已存在');
      return;
    }
    setDraftRecipients([...draftRecipients, value]);
    setNewRecipient('');
  };

  const removeRecipient = (phone: string) => {
    setDraftRecipients(draftRecipients.filter((item) => item !== phone));
  };

  const saveRecipients = () => {
    setRecipients(draftRecipients);
    setShowRecipientModal(false);
    showToast('接收人已保存');
  };

  return (
    <div className="space-y-3">
      <PageHeader title="短信日志" description="查看短信发送记录和配置管理">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-3" />
          <input
            type="text"
            placeholder="搜索手机号或内容..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="field h-7 w-56 pl-7"
          />
        </div>
        <button onClick={openRecipientModal} className="btn-primary h-7">
          配置接收人
        </button>
      </PageHeader>

      <MetricStrip
        cols={4}
        items={[
          { label: '发送总数', value: total, unit: '条', icon: Phone },
          { label: '成功', value: successCount, unit: '条', icon: Check, tone: 'ok' },
          { label: '失败', value: failedCount, unit: '条', icon: X, tone: 'danger' },
          { label: '成功率', value: successRate, unit: '%', tone: 'ok' },
        ]}
      />

      <Panel
        flush
        toolbar={
          <div className="inline-flex rounded-sm border border-line bg-inset p-0.5">
            {statusFilters.map((item) => (
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
              <th>接收号码</th>
              <th>短信内容</th>
              <th>类型</th>
              <th>状态</th>
              <th>发送时间</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <Empty title="没有匹配的短信记录" description="试试更换搜索关键词或筛选条件" />
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td className="font-mono text-ink">{log.phone}</td>
                  <td className="max-w-xs truncate text-ink-2">{log.content}</td>
                  <td>
                    <span className="tag-accent">{log.type}</span>
                  </td>
                  <td>
                    {log.status === 'success' ? (
                      <span className="tag-ok">
                        <Check className="h-3 w-3" />
                        成功
                      </span>
                    ) : (
                      <span className="tag-danger">
                        <X className="h-3 w-3" />
                        失败
                      </span>
                    )}
                  </td>
                  <td className="font-mono text-[12px] text-ink-2">{log.time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Panel>

      {showRecipientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="panel flex w-full max-w-md flex-col">
            <div className="panel-head">
              <h2 className="panel-title">配置接收人</h2>
              <button
                onClick={() => setShowRecipientModal(false)}
                className="btn-ghost h-7 w-7 !px-0"
                title="关闭"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex gap-2 border-b border-line p-3">
              <input
                type="text"
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addRecipient();
                  }
                }}
                placeholder="输入手机号后点击添加"
                className="field h-8 flex-1"
              />
              <button onClick={addRecipient} className="btn-primary h-8">
                <Plus className="h-3.5 w-3.5" />
                添加
              </button>
            </div>

            <div className="max-h-60 space-y-2 overflow-y-auto p-3">
              {draftRecipients.length === 0 ? (
                <Empty title="暂无接收人" description="请在上方添加手机号" />
              ) : (
                draftRecipients.map((phone) => (
                  <div
                    key={phone}
                    className="flex items-center justify-between rounded border border-line bg-inset px-3 py-2"
                  >
                    <span className="font-mono text-ink">{phone}</span>
                    <button
                      onClick={() => removeRecipient(phone)}
                      className="btn-ghost h-7 w-7 !px-0 hover:text-danger"
                      title="移除"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-3 border-t border-line p-3">
              <button onClick={() => setShowRecipientModal(false)} className="btn-secondary flex-1">
                取消
              </button>
              <button onClick={saveRecipients} className="btn-primary flex-1">
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
