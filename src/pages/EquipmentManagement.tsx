import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Equipment } from '../types';
import { Plus, Edit, Trash2, Search, X, Save, Cpu, CheckCircle2, PowerOff, Layers } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import MetricStrip from '../components/MetricStrip';
import Empty from '../components/Empty';

export default function EquipmentManagement() {
  const equipments = useStore((state) => state.equipments);
  const addEquipment = useStore((state) => state.addEquipment);
  const updateEquipment = useStore((state) => state.updateEquipment);
  const deleteEquipment = useStore((state) => state.deleteEquipment);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    manufacturer: '',
    location: '',
    installation_date: '',
    status: 'active',
  });

  const filteredEquipments = equipments.filter((eq) =>
    eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = equipments.filter((eq) => eq.status === 'active').length;
  const modelCount = new Set(equipments.map((eq) => eq.model)).size;

  const handleOpenModal = (equipment?: Equipment) => {
    if (equipment) {
      setEditingEquipment(equipment);
      setFormData({
        name: equipment.name,
        model: equipment.model,
        manufacturer: equipment.manufacturer,
        location: equipment.location,
        installation_date: equipment.installation_date.split('T')[0],
        status: equipment.status,
      });
    } else {
      setEditingEquipment(null);
      setFormData({
        name: '',
        model: '',
        manufacturer: '',
        location: '',
        installation_date: '',
        status: 'active',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEquipment(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEquipment) {
      updateEquipment({
        ...editingEquipment,
        ...formData,
      });
    } else {
      addEquipment(formData);
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (confirm('确定要删除该设备吗？')) {
      deleteEquipment(id);
    }
  };

  return (
    <div className="space-y-3">
      <PageHeader title="设备管理" description="管理各类设备的信息">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-3" />
          <input
            type="text"
            placeholder="搜索设备名称、型号或位置..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="field h-7 w-56 pl-7"
          />
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary">
          <Plus className="h-4 w-4" />
          新增设备
        </button>
      </PageHeader>

      <MetricStrip
        cols={4}
        items={[
          { label: '设备总数', value: equipments.length, unit: '台', icon: Cpu, tone: 'accent' },
          { label: '在用设备', value: activeCount, unit: '台', icon: CheckCircle2, tone: 'ok' },
          { label: '停用设备', value: equipments.length - activeCount, unit: '台', icon: PowerOff, tone: 'default' },
          { label: '设备型号', value: modelCount, unit: '种', icon: Layers, tone: 'default' },
        ]}
      />

      <Panel
        title="设备列表"
        aside={<span className="font-mono">共 {filteredEquipments.length} 台</span>}
        flush
      >
        {filteredEquipments.length === 0 ? (
          <Empty
            title="没有找到匹配的设备"
            description="试试更换搜索关键词"
            action={
              <button onClick={() => handleOpenModal()} className="btn-primary">
                <Plus className="h-4 w-4" />
                新增设备
              </button>
            }
          />
        ) : (
          <table>
            <thead>
              <tr>
                <th>设备名称</th>
                <th>型号</th>
                <th>厂家</th>
                <th>位置</th>
                <th>安装日期</th>
                <th>状态</th>
                <th className="text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipments.map((equipment) => (
                <tr key={equipment.id}>
                  <td className="font-medium text-ink">{equipment.name}</td>
                  <td className="font-mono text-ink-3">{equipment.model}</td>
                  <td className="font-mono text-ink-3">{equipment.manufacturer}</td>
                  <td className="text-ink-2">{equipment.location}</td>
                  <td className="font-mono text-ink-2">{equipment.installation_date.split('T')[0]}</td>
                  <td>
                    <span className={equipment.status === 'active' ? 'tag-ok' : 'tag-offline'}>
                      {equipment.status === 'active' ? '运行中' : '停用'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenModal(equipment)}
                        className="btn-ghost h-7 w-7 !px-0 text-accent"
                        title="编辑"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(equipment.id)}
                        className="btn-ghost h-7 w-7 !px-0 text-danger"
                        title="删除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="mx-4 w-full max-w-md rounded border border-line bg-panel">
            <div className="panel-head">
              <h2 className="panel-title">{editingEquipment ? '编辑设备' : '新增设备'}</h2>
              <button onClick={handleCloseModal} className="btn-ghost h-7 w-7 !px-0" title="关闭">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 p-4">
              <div>
                <label className="label">设备名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="field h-8 w-full"
                  required
                />
              </div>

              <div>
                <label className="label">型号</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="field h-8 w-full"
                />
              </div>

              <div>
                <label className="label">厂家</label>
                <input
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  className="field h-8 w-full"
                />
              </div>

              <div>
                <label className="label">位置</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="field h-8 w-full"
                />
              </div>

              <div>
                <label className="label">安装日期</label>
                <input
                  type="date"
                  value={formData.installation_date}
                  onChange={(e) => setFormData({ ...formData, installation_date: e.target.value })}
                  className="field h-8 w-full"
                />
              </div>

              <div>
                <label className="label">状态</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="field h-8 w-full"
                >
                  <option value="active">运行中</option>
                  <option value="inactive">停用</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={handleCloseModal} className="btn-secondary flex-1">
                  取消
                </button>
                <button type="submit" className="btn-primary flex-1">
                  <Save className="h-4 w-4" />
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
