import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Search, Filter, Gauge, Wifi, WifiOff } from 'lucide-react';

export default function SystemMeterStatus() {
  const [searchTerm, setSearchTerm] = useState('');

  const meterData = [
    { id: 'M001', name: '主配电柜-1号', type: '电能表', location: '配电室A', status: 'online', lastSync: '2024-06-15 14:32:18', signal: 95 },
    { id: 'M002', name: '主配电柜-2号', type: '电能表', location: '配电室A', status: 'online', lastSync: '2024-06-15 14:32:15', signal: 88 },
    { id: 'M003', name: '变压器1#', type: '电能表', location: '配电室A', status: 'online', lastSync: '2024-06-15 14:32:12', signal: 92 },
    { id: 'M004', name: '变压器2#', type: '电能表', location: '配电室B', status: 'warning', lastSync: '2024-06-15 14:30:00', signal: 45 },
    { id: 'M005', name: '水表-1号', type: '水表', location: '综合楼', status: 'online', lastSync: '2024-06-15 14:32:08', signal: 90 },
    { id: 'M006', name: '水表-2号', type: '水表', location: '生产区', status: 'offline', lastSync: '2024-06-14 10:25:30', signal: 0 },
    { id: 'M007', name: '燃气表-1号', type: '燃气表', location: '锅炉房', status: 'online', lastSync: '2024-06-15 14:32:05', signal: 85 },
    { id: 'M008', name: '冷量表-1号', type: '冷量表', location: '制冷站', status: 'online', lastSync: '2024-06-15 14:32:00', signal: 93 },
    { id: 'M009', name: '热量表-1号', type: '热量表', location: '换热站', status: 'warning', lastSync: '2024-06-15 14:28:45', signal: 35 },
    { id: 'M010', name: '电能表-北区', type: '电能表', location: '北区厂房', status: 'online', lastSync: '2024-06-15 14:31:55', signal: 89 },
    { id: 'M011', name: '电能表-南区', type: '电能表', location: '南区厂房', status: 'online', lastSync: '2024-06-15 14:31:50', signal: 91 },
    { id: 'M012', name: '水表-3号', type: '水表', location: '南区厂房', status: 'offline', lastSync: '2024-06-13 09:15:00', signal: 0 },
  ];

  const statusConfig = {
    online: { icon: Wifi, color: 'text-green-600', bg: 'bg-green-100', text: '在线' },
    warning: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100', text: '信号弱' },
    offline: { icon: WifiOff, color: 'text-red-600', bg: 'bg-red-100', text: '离线' },
  };

  const filteredData = meterData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: meterData.length,
    online: meterData.filter((item) => item.status === 'online').length,
    warning: meterData.filter((item) => item.status === 'warning').length,
    offline: meterData.filter((item) => item.status === 'offline').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">仪表通讯状态</h1>
        <p className="text-gray-500 mt-1">监控所有仪表设备的通讯连接状态</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Gauge className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">仪表总数</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">在线</p>
              <p className="text-2xl font-bold text-green-600">{stats.online}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">信号弱</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.warning}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">离线</p>
              <p className="text-2xl font-bold text-red-600">{stats.offline}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索仪表名称、编号或位置..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-4 h-4" />
          刷新状态
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">仪表列表</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">仪表编号</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">仪表名称</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">类型</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">位置</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">信号强度</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">状态</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">最后同步</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.map((item) => {
              const config = statusConfig[item.status as keyof typeof statusConfig];
              const StatusIcon = config.icon;
              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-blue-600">{item.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-gray-600">{item.type}</td>
                  <td className="px-6 py-4 text-gray-600">{item.location}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.signal >= 80 ? 'bg-green-500' :
                            item.signal >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${item.signal}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{item.signal}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {config.text}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{item.lastSync}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">通讯状态概览</h2>
        <div className="flex items-center justify-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded-full" />
            <span className="text-gray-700">在线 {stats.online} 台 ({((stats.online / stats.total) * 100).toFixed(1)}%)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-yellow-500 rounded-full" />
            <span className="text-gray-700">信号弱 {stats.warning} 台 ({((stats.warning / stats.total) * 100).toFixed(1)}%)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-red-500 rounded-full" />
            <span className="text-gray-700">离线 {stats.offline} 台 ({((stats.offline / stats.total) * 100).toFixed(1)}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}