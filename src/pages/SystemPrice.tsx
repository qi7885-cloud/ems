import { useMemo, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, DollarSign, Zap, Droplets, Thermometer } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import MetricStrip from '../components/MetricStrip';
import type { MetricItem } from '../components/MetricStrip';
import Empty from '../components/Empty';

interface PricePlan {
  id: number;
  type: 'electricity' | 'water' | 'gas' | 'sewage';
  name: string;
  unit: string;
  price: number;
  startDate: string;
  endDate: string;
  description: string;
}

interface PriceForm {
  type: string;
  name: string;
  unit: string;
  price: string;
  startDate: string;
  endDate: string;
  description: string;
}

const INITIAL_PRICE_PLANS: PricePlan[] = [
  { id: 1, type: 'electricity', name: '尖峰电价', unit: '元/kWh', price: 1.25, startDate: '2024-01-01', endDate: '2024-12-31', description: '08:00-11:00, 17:00-21:00' },
  { id: 2, type: 'electricity', name: '高峰电价', unit: '元/kWh', price: 0.98, startDate: '2024-01-01', endDate: '2024-12-31', description: '07:00-08:00, 11:00-17:00, 21:00-22:00' },
  { id: 3, type: 'electricity', name: '平段电价', unit: '元/kWh', price: 0.65, startDate: '2024-01-01', endDate: '2024-12-31', description: '06:00-07:00, 22:00-23:00' },
  { id: 4, type: 'electricity', name: '低谷电价', unit: '元/kWh', price: 0.35, startDate: '2024-01-01', endDate: '2024-12-31', description: '23:00-06:00' },
  { id: 5, type: 'water', name: '工业用水', unit: '元/吨', price: 4.5, startDate: '2024-01-01', endDate: '2024-12-31', description: '生产用水' },
  { id: 6, type: 'water', name: '生活用水', unit: '元/吨', price: 3.2, startDate: '2024-01-01', endDate: '2024-12-31', description: '办公区生活用水' },
  { id: 7, type: 'gas', name: '天然气', unit: '元/m³', price: 3.8, startDate: '2024-01-01', endDate: '2024-12-31', description: '锅炉及食堂用气' },
  { id: 8, type: 'sewage', name: '排污费', unit: '元/吨', price: 1.2, startDate: '2024-01-01', endDate: '2024-12-31', description: '污水处理费' },
];

const createEmptyForm = (): PriceForm => ({
  type: 'electricity',
  name: '',
  unit: '元/kWh',
  price: '',
  startDate: '',
  endDate: '',
  description: '',
});

const typeConfig: Record<PricePlan['type'], { icon: typeof Zap; label: string; tag: string }> = {
  electricity: { icon: Zap, label: '电力', tag: 'tag-warn' },
  water: { icon: Droplets, label: '水', tag: 'tag-accent' },
  gas: { icon: Thermometer, label: '燃气', tag: 'tag-info' },
  sewage: { icon: DollarSign, label: '排污', tag: 'tag-ok' },
};

const typeTone: Record<PricePlan['type'], MetricItem['tone']> = {
  electricity: 'warn',
  water: 'accent',
  gas: 'default',
  sewage: 'ok',
};

export default function SystemPrice() {
  const [priceData, setPriceData] = useState<PricePlan[]>(INITIAL_PRICE_PLANS);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PricePlan | null>(null);
  const [formData, setFormData] = useState<PriceForm>(createEmptyForm);
  const [formError, setFormError] = useState('');

  const { counts, total } = useMemo(
    () =>
      priceData.reduce(
        (acc, plan) => {
          acc.counts[plan.type] += 1;
          acc.total += 1;
          return acc;
        },
        {
          counts: { electricity: 0, water: 0, gas: 0, sewage: 0 } as Record<PricePlan['type'], number>,
          total: 0,
        },
      ),
    [priceData],
  );

  const stats: MetricItem[] = [
    { label: '电力方案', value: counts.electricity, unit: '项', icon: Zap, tone: typeTone.electricity },
    { label: '水价方案', value: counts.water, unit: '项', icon: Droplets, tone: typeTone.water },
    { label: '燃气方案', value: counts.gas, unit: '项', icon: Thermometer, tone: typeTone.gas },
    { label: '排污方案', value: counts.sewage, unit: '项', icon: DollarSign, tone: typeTone.sewage },
  ];

  const handleOpenModal = (item?: PricePlan) => {
    setFormError('');
    if (item) {
      setEditingItem(item);
      setFormData({
        type: item.type,
        name: item.name,
        unit: item.unit,
        price: item.price.toString(),
        startDate: item.startDate,
        endDate: item.endDate,
        description: item.description,
      });
    } else {
      setEditingItem(null);
      setFormData(createEmptyForm());
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormError('');
  };

  const handleSubmit = () => {
    const name = formData.name.trim();
    const price = Number(formData.price);

    if (!name) {
      setFormError('请输入方案名称');
      return;
    }
    if (!formData.price.trim() || Number.isNaN(price) || price <= 0) {
      setFormError('单价必须为正数');
      return;
    }

    const plan: PricePlan = {
      id: editingItem ? editingItem.id : Date.now(),
      type: formData.type as PricePlan['type'],
      name,
      unit: formData.unit,
      price,
      startDate: formData.startDate,
      endDate: formData.endDate,
      description: formData.description,
    };

    setPriceData((prev) =>
      editingItem ? prev.map((item) => (item.id === editingItem.id ? plan : item)) : [plan, ...prev],
    );
    handleCloseModal();
  };

  const handleDelete = (item: PricePlan) => {
    if (window.confirm(`确定删除价格方案「${item.name}」吗？`)) {
      setPriceData((prev) => prev.filter((plan) => plan.id !== item.id));
    }
  };

  return (
    <div className="space-y-3">
      <PageHeader title="用能价格管理" description="管理各类能源价格方案">
        <button onClick={() => handleOpenModal()} className="btn-primary">
          <Plus className="h-4 w-4" />
          新增方案
        </button>
      </PageHeader>

      <MetricStrip cols={4} items={stats} />

      <Panel
        title="价格方案列表"
        aside={<span className="font-mono">共 {total} 条</span>}
        flush
      >
        {priceData.length === 0 ? (
          <Empty title="暂无价格方案" description="点击右上角「新增方案」新增一条" />
        ) : (
          <table>
            <thead>
              <tr>
                <th>类型</th>
                <th>方案名称</th>
                <th className="text-right">单价</th>
                <th>有效期</th>
                <th>说明</th>
                <th className="text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {priceData.map((item) => {
                const config = typeConfig[item.type];
                const TypeIcon = config.icon;
                return (
                  <tr key={item.id}>
                    <td>
                      <span className={config.tag}>
                        <TypeIcon className="h-3 w-3" />
                        {config.label}
                      </span>
                    </td>
                    <td className="font-medium text-ink">{item.name}</td>
                    <td className="text-right">
                      <span className="font-mono text-accent">{item.price}</span>
                      <span className="ml-1 text-[11px] text-ink-3">{item.unit}</span>
                    </td>
                    <td className="font-mono text-ink-2">
                      {item.startDate} ~ {item.endDate}
                    </td>
                    <td className="max-w-xs truncate text-ink-3">{item.description}</td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="btn-ghost h-7 w-7 !px-0"
                          title="编辑"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="btn-ghost h-7 w-7 !px-0 text-danger"
                          title="删除"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Panel>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="mx-4 w-full max-w-lg rounded border border-line bg-panel">
            <div className="panel-head">
              <h2 className="panel-title">{editingItem ? '编辑价格方案' : '新增价格方案'}</h2>
              <button onClick={handleCloseModal} className="btn-ghost h-7 w-7 !px-0" title="关闭">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 p-4">
              {formError && (
                <div className="rounded-sm border border-danger/40 bg-danger/10 px-3 py-2 text-[12px] text-danger">
                  {formError}
                </div>
              )}
              <div>
                <label className="label">能源类型</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="field h-8 w-full"
                >
                  <option value="electricity">电力</option>
                  <option value="water">水</option>
                  <option value="gas">燃气</option>
                  <option value="sewage">排污</option>
                </select>
              </div>
              <div>
                <label className="label">方案名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="field h-8 w-full"
                  placeholder="输入方案名称"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">单价</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="field h-8 w-full"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="label">单位</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="field h-8 w-full"
                    placeholder="元/单位"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">生效日期</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="field h-8 w-full"
                  />
                </div>
                <div>
                  <label className="label">结束日期</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="field h-8 w-full"
                  />
                </div>
              </div>
              <div>
                <label className="label">说明</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="field h-auto w-full resize-y"
                  rows={3}
                  placeholder="输入方案说明"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-line px-4 py-2.5">
              <button onClick={handleCloseModal} className="btn-secondary">
                取消
              </button>
              <button onClick={handleSubmit} className="btn-primary">
                <Save className="h-4 w-4" />
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
