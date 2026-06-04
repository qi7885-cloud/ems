import { useState } from 'react';
import { AlertTriangle, Bell, Settings, Save, TrendingUp } from 'lucide-react';

export default function EnergyWarning() {
  const [activeTab, setActiveTab] = useState('warnings');

  const warnings = [
    { id: 1, type: '用电预警', equipment: '主配电柜', threshold: '80%', current: '78%', status: 'pending', time: '2024-06-07 14:30' },
    { id: 2, type: '用水预警', equipment: '水表-1号', threshold: '500吨/日', current: '480吨', status: 'pending', time: '2024-06-07 13:45' },
    { id: 3, type: '负载预警', equipment: '变压器A', threshold: '75%', current: '72%', status: 'resolved', time: '2024-06-07 10:20' },
  ];

  const thresholds = [
    { id: 1, type: '电流', equipment: '主配电柜', min: 0, max: 500, warning: 400, critical: 450, unit: 'A' },
    { id: 2, type: '电压', equipment: '主配电柜', min: 10, max: 11, warning: 10.2, critical: 10, unit: 'kV' },
    { id: 3, type: '温度', equipment: '变压器A', min: 0, max: 100, warning: 65, critical: 80, unit: '°C' },
    { id: 4, type: '负载率', equipment: '变压器A', min: 0, max: 100, warning: 75, critical: 85, unit: '%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">用能预警</h1>
        <p className="text-gray-500 mt-1">配置预警阈值并查看预警信息</p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setActiveTab('warnings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === 'warnings'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Bell className="w-5 h-5" />
          预警列表
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === 'config'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Settings className="w-5 h-5" />
          阈值配置
        </button>
      </div>

      {activeTab === 'warnings' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">预警类型</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">设备名称</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">预警阈值</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">当前值</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">状态</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {warnings.map((warning) => (
                <tr key={warning.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium text-gray-900">{warning.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{warning.equipment}</td>
                  <td className="px-6 py-4 text-gray-600">{warning.threshold}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-sm font-medium">
                      {warning.current}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      warning.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {warning.status === 'pending' ? '待处理' : '已解除'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{warning.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'config' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">预警阈值配置</h2>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors">
              <Save className="w-5 h-5" />
              保存配置
            </button>
          </div>
          <div className="space-y-4">
            {thresholds.map((threshold) => (
              <div key={threshold.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-medium text-gray-900">{threshold.equipment}</span>
                    <span className="text-gray-500 ml-2">{threshold.type}</span>
                  </div>
                  <span className="text-sm text-gray-500">单位: {threshold.unit}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">正常范围</span>
                    <span className="text-sm font-medium text-gray-900">
                      {threshold.min} - {threshold.max} {threshold.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">预警阈值</label>
                      <div className="relative">
                        <input
                          type="range"
                          min={threshold.min}
                          max={threshold.max}
                          defaultValue={threshold.warning}
                          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                        />
                        <span className="absolute right-0 -top-6 text-sm font-medium text-yellow-600">
                          {threshold.warning} {threshold.unit}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">告警阈值</label>
                      <div className="relative">
                        <input
                          type="range"
                          min={threshold.min}
                          max={threshold.max}
                          defaultValue={threshold.critical}
                          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                        />
                        <span className="absolute right-0 -top-6 text-sm font-medium text-red-600">
                          {threshold.critical} {threshold.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex-1 h-3 bg-green-100 rounded-full relative">
                      <div
                        className="absolute top-0 left-0 h-full bg-yellow-200 rounded-full"
                        style={{ width: `${((threshold.warning - threshold.min) / (threshold.max - threshold.min)) * 100}%` }}
                      />
                      <div
                        className="absolute top-0 left-0 h-full bg-red-200 rounded-full"
                        style={{ width: `${((threshold.critical - threshold.min) / (threshold.max - threshold.min)) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-green-500 rounded-full" />
                        正常
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-yellow-500 rounded-full" />
                        预警
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-red-500 rounded-full" />
                        告警
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
