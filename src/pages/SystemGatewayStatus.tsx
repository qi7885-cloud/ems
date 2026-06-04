import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Search, Server, Wifi, Activity, Clock } from 'lucide-react';

export default function SystemGatewayStatus() {
  const [searchTerm, setSearchTerm] = useState('');

  const gatewayData = [
    { id: 'GW001', name: '主网关-A', ip: '192.168.1.101', location: '中控室', status: 'online', devices: 24, lastSync: '2024-06-15 14:32:18', uptime: '99.8%' },
    { id: 'GW002', name: '主网关-B', ip: '192.168.1.102', location: '中控室', status: 'online', devices: 22, lastSync: '2024-06-15 14:32:15', uptime: '99.5%' },
    { id: 'GW003', name: '北区网关', ip: '192.168.1.103', location: '北区厂房', status: 'online', devices: 18, lastSync: '2024-06-15 14:32:10', uptime: '98.9%' },
    { id: 'GW004', name: '南区网关', ip: '192.168.1.104', location: '南区厂房', status: 'warning', devices: 15, lastSync: '2024-06-15 14:28:30', uptime: '95.2%' },
    { id: 'GW005', name: '生产区网关', ip: '192.168.1.105', location: '生产区', status: 'online', devices: 32, lastSync: '2024-06-15 14:32:05', uptime: '99.2%' },
    { id: 'GW006', name: '锅炉房网关', ip: '192.168.1.106', location: '锅炉房', status: 'online', devices: 8, lastSync: '2024-06-15 14:32:00', uptime: '99.9%' },
    { id: 'GW007', name: '综合楼网关', ip: '192.168.1.107', location: '综合楼', status: 'offline', devices: 12, lastSync: '2024-06-14 16:45:20', uptime: '0%' },
    { id: 'GW008', name: '制冷站网关', ip: '192.168.1.108', location: '制冷站', status: 'online', devices: 6, lastSync: '2024-06-15 14:31:55', uptime: '99.7%' },
  ];

  const statusConfig = {
    online: { icon: Wifi, color: 'text-green-600', bg: 'bg-green-100', text: '在线' },
    warning: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100', text: '异常' },
    offline: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', text: '离线' },
  };

  const filteredData = gatewayData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ip.includes(searchTerm)
  );

  const stats = {
    total: gatewayData.length,
    online: gatewayData.filter((item) => item.status === 'online').length,
    warning: gatewayData.filter((item) => item.status === 'warning').length,
    offline: gatewayData.filter((item) => item.status === 'offline').length,
    totalDevices: gatewayData.reduce((sum, item) => sum + item.devices, 0),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">网关通讯状态</h1>
        <p className="text-gray-500 mt-1">监控所有网关设备的运行状态和连接情况</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Server className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">网关总数</p>
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
              <p className="text-sm text-gray-500">在线网关</p>
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
              <p className="text-sm text-gray-500">异常网关</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.warning}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">接入设备</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalDevices}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {gatewayData.map((gateway) => {
          const config = statusConfig[gateway.status as keyof typeof statusConfig];
          const StatusIcon = config.icon;
          return (
            <div key={gateway.id} className={`bg-white rounded-xl p-5 shadow-sm border transition-all ${
              gateway.status === 'offline' ? 'border-red-200 bg-red-50' :
              gateway.status === 'warning' ? 'border-yellow-200 bg-yellow-50' :
              'border-gray-100'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Server className={`w-5 h-5 ${config.color}`} />
                  <span className="font-medium text-gray-900">{gateway.name}</span>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  {config.text}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">IP地址</span>
                  <span className="text-gray-700 font-mono">{gateway.ip}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">位置</span>
                  <span className="text-gray-700">{gateway.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">接入设备</span>
                  <span className="text-gray-700">{gateway.devices} 台</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">在线率</span>
                  <span className={`font-medium ${parseFloat(gateway.uptime) >= 99 ? 'text-green-600' : parseFloat(gateway.uptime) >= 95 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {gateway.uptime}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>最后同步: {gateway.lastSync}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索网关名称、编号或IP..."
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
          <h2 className="text-lg font-semibold text-gray-900">网关详细列表</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">网关编号</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">网关名称</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">IP地址</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">位置</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">接入设备</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">在线率</th>
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
                  <td className="px-6 py-4 text-gray-600 font-mono">{item.ip}</td>
                  <td className="px-6 py-4 text-gray-600">{item.location}</td>
                  <td className="px-6 py-4 text-gray-600">{item.devices} 台</td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${parseFloat(item.uptime) >= 99 ? 'text-green-600' : parseFloat(item.uptime) >= 95 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {item.uptime}
                    </span>
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
    </div>
  );
}