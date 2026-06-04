import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, DollarSign, Zap, Droplets, Thermometer } from 'lucide-react';

export default function SystemPrice() {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<typeof priceData[0] | null>(null);

  const [formData, setFormData] = useState({
    type: 'electricity',
    name: '',
    unit: '元/kWh',
    price: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const priceData = [
    { id: 1, type: 'electricity', name: '尖峰电价', unit: '元/kWh', price: 1.25, startDate: '2024-01-01', endDate: '2024-12-31', description: '08:00-11:00, 17:00-21:00' },
    { id: 2, type: 'electricity', name: '高峰电价', unit: '元/kWh', price: 0.98, startDate: '2024-01-01', endDate: '2024-12-31', description: '07:00-08:00, 11:00-17:00, 21:00-22:00' },
    { id: 3, type: 'electricity', name: '平段电价', unit: '元/kWh', price: 0.65, startDate: '2024-01-01', endDate: '2024-12-31', description: '06:00-07:00, 22:00-23:00' },
    { id: 4, type: 'electricity', name: '低谷电价', unit: '元/kWh', price: 0.35, startDate: '2024-01-01', endDate: '2024-12-31', description: '23:00-06:00' },
    { id: 5, type: 'water', name: '工业用水', unit: '元/吨', price: 4.5, startDate: '2024-01-01', endDate: '2024-12-31', description: '生产用水' },
    { id: 6, type: 'water', name: '生活用水', unit: '元/吨', price: 3.2, startDate: '2024-01-01', endDate: '2024-12-31', description: '办公区生活用水' },
    { id: 7, type: 'gas', name: '天然气', unit: '元/m³', price: 3.8, startDate: '2024-01-01', endDate: '2024-12-31', description: '锅炉及食堂用气' },
    { id: 8, type: 'sewage', name: '排污费', unit: '元/吨', price: 1.2, startDate: '2024-01-01', endDate: '2024-12-31', description: '污水处理费' },
  ];

  const typeConfig = {
    electricity: { icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-100', label: '电力' },
    water: { icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-100', label: '水' },
    gas: { icon: Thermometer, color: 'text-orange-600', bg: 'bg-orange-100', label: '燃气' },
    sewage: { icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100', label: '排污' },
  };

  const handleOpenModal = (item?: typeof priceData[0]) => {
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
      setFormData({
        type: 'electricity',
        name: '',
        unit: '元/kWh',
        price: '',
        startDate: '',
        endDate: '',
        description: '',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const stats = [
    { label: '电价方案', value: '4', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
    { label: '水价方案', value: '2', icon: Droplets, color: 'bg-blue-100 text-blue-600' },
    { label: '气价方案', value: '1', icon: Thermometer, color: 'bg-orange-100 text-orange-600' },
    { label: '排污方案', value: '1', icon: DollarSign, color: 'bg-green-100 text-green-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">用能价格管理</h1>
          <p className="text-gray-500 mt-1">管理各类能源价格方案</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          添加价格方案
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">价格方案列表</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">类型</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">方案名称</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">单价</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">有效期</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">说明</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {priceData.map((item) => {
              const config = typeConfig[item.type as keyof typeof typeConfig];
              const TypeIcon = config.icon;
              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                      <TypeIcon className="w-3 h-3" />
                      {config.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4">
                    <span className="text-blue-600 font-semibold">{item.price} {item.unit}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.startDate} ~ {item.endDate}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm max-w-xs truncate">{item.description}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="编辑"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingItem ? '编辑价格方案' : '添加价格方案'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingItem(null);
                }}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">能源类型</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="electricity">电力</option>
                  <option value="water">水</option>
                  <option value="gas">燃气</option>
                  <option value="sewage">排污</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">方案名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入方案名称"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">单价</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">单位</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="元/单位"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">生效日期</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">说明</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="输入方案说明"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}