import { useState } from 'react';
import { Database, Upload, Save, X } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import MetricStrip from '../components/MetricStrip';
import Empty from '../components/Empty';

interface SupplementRecord {
  id: number;
  equipment: string;
  date: string;
  type: string;
  value: string;
  unit: string;
  operator: string;
  time: string;
  status: 'pending' | 'approved';
}

interface SupplementForm {
  equipment: string;
  date: string;
  type: string;
  value: string;
  unit: string;
  remark: string;
}

const INITIAL_RECORDS: SupplementRecord[] = [
  { id: 1, equipment: '主配电柜', date: '2024-06-05', type: '电量', value: '125000', unit: 'kWh', operator: '张三', time: '2024-06-06 10:30', status: 'approved' },
  { id: 2, equipment: '水表-1号', date: '2024-06-04', type: '水量', value: '8500', unit: '吨', operator: '李四', time: '2024-06-05 09:15', status: 'approved' },
  { id: 3, equipment: '变压器A', date: '2024-06-03', type: '电量', value: '68000', unit: 'kWh', operator: '张三', time: '2024-06-04 14:20', status: 'pending' },
];

const createEmptyForm = (): SupplementForm => ({
  equipment: '',
  date: '',
  type: 'electricity',
  value: '',
  unit: 'kWh',
  remark: '',
});

const pad = (value: number) => value.toString().padStart(2, '0');

const formatNow = () => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

export default function StatisticsSupplement() {
  const [records, setRecords] = useState<SupplementRecord[]>(INITIAL_RECORDS);
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState<SupplementForm>(createEmptyForm);

  const totalCount = records.length;
  const pendingCount = records.filter((record) => record.status === 'pending').length;
  const approvedCount = records.filter((record) => record.status === 'approved').length;

  const metrics = [
    { label: '补录总数', value: totalCount, unit: '条', icon: Database, tone: 'accent' as const },
    { label: '待审核', value: pendingCount, unit: '条', icon: Upload, tone: 'warn' as const },
    { label: '已审核', value: approvedCount, unit: '条', icon: Save, tone: 'ok' as const },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const equipment = formData.equipment.trim();
    const date = formData.date.trim();
    const value = formData.value.trim();

    if (!equipment) {
      setFormError('请选择设备名称');
      return;
    }
    if (!date) {
      setFormError('请选择日期');
      return;
    }
    if (!value) {
      setFormError('请输入数值');
      return;
    }

    const newRecord: SupplementRecord = {
      id: Date.now(),
      equipment,
      date,
      type: formData.type === 'electricity' ? '电量' : '水量',
      value,
      unit: formData.unit,
      operator: '当前用户',
      time: formatNow(),
      status: 'pending',
    };

    setRecords((prev) => [newRecord, ...prev]);
    setShowModal(false);
    setFormData(createEmptyForm());
    setFormError('');
  };

  const handleApprove = (id: number) => {
    setRecords((prev) =>
      prev.map((record) => (record.id === id ? { ...record, status: 'approved' as const } : record)),
    );
  };

  return (
    <div className="space-y-3">
      <PageHeader title="能耗数据补录" description="补录缺失的能耗数据">
        <button type="button" onClick={() => setShowModal(true)} className="btn-primary h-7">
          <Database className="h-3.5 w-3.5" />
          新增补录
        </button>
      </PageHeader>

      <MetricStrip cols={3} items={metrics} />

      <Panel title="补录记录" aside={<span className="font-mono text-[11px]">共 {totalCount} 条</span>} flush>
        {records.length === 0 ? (
          <Empty title="暂无补录记录" description="点击右上角「新增补录」添加一条" />
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>设备名称</th>
                  <th>日期</th>
                  <th>类型</th>
                  <th className="text-right">数值</th>
                  <th>操作人</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td className="font-medium text-ink">{record.equipment}</td>
                    <td className="font-mono text-ink-2">{record.date}</td>
                    <td className="text-ink-2">{record.type}</td>
                    <td className="text-right font-mono text-ink">
                      {record.value} {record.unit}
                    </td>
                    <td className="text-ink-2">{record.operator}</td>
                    <td>
                      <span className={record.status === 'approved' ? 'tag-ok' : 'tag-warn'}>
                        {record.status === 'approved' ? '已审核' : '待审核'}
                      </span>
                    </td>
                    <td>
                      {record.status === 'pending' ? (
                        <button type="button" onClick={() => handleApprove(record.id)} className="btn-secondary h-7">
                          审核
                        </button>
                      ) : (
                        <span className="text-ink-3">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="mx-4 w-full max-w-lg rounded border border-line bg-panel">
            <div className="panel-head">
              <h2 className="panel-title">新增数据补录</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn-ghost h-7 w-7 !px-0"
                aria-label="关闭"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 p-4">
              {formError && (
                <div className="rounded-sm bg-danger/10 px-3 py-2 text-[12px] text-danger">{formError}</div>
              )}
              <div>
                <label className="label">设备名称</label>
                <select
                  value={formData.equipment}
                  onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                  className="field h-8 w-full"
                >
                  <option value="">请选择设备</option>
                  <option value="主配电柜">主配电柜</option>
                  <option value="变压器A">变压器A</option>
                  <option value="变压器B">变压器B</option>
                  <option value="水表-1号">水表-1号</option>
                </select>
              </div>
              <div>
                <label className="label">日期</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="field h-8 w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">类型</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value, unit: e.target.value === 'electricity' ? 'kWh' : '吨' })}
                    className="field h-8 w-full"
                  >
                    <option value="electricity">电量</option>
                    <option value="water">水量</option>
                  </select>
                </div>
                <div>
                  <label className="label">数值</label>
                  <div className="flex">
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="field h-8 w-full rounded-r-none"
                      placeholder="请输入数值"
                    />
                    <span className="inline-flex items-center rounded-r-sm border border-l-0 border-line bg-panel-2 px-2 text-[12px] text-ink-2">
                      {formData.unit}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <label className="label">备注</label>
                <textarea
                  value={formData.remark}
                  onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                  className="w-full px-2 py-1.5"
                  rows={3}
                  placeholder="请输入备注信息"
                />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                  取消
                </button>
                <button type="submit" className="btn-primary flex-1">
                  <Save className="h-3.5 w-3.5" />
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
