import { offlineEvents } from '../data/mockData';
import { WifiOff, Clock, AlertTriangle, RefreshCw } from 'lucide-react';

export default function OfflineEvents() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">离线事件</h1>
          <p className="text-gray-500 mt-1">查看设备离线记录和原因分析</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors">
          <RefreshCw className="w-5 h-5" />
          刷新
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <WifiOff className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">本月离线次数</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">平均离线时长</p>
              <p className="text-2xl font-bold text-gray-900">15分钟</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">当前在线率</p>
              <p className="text-2xl font-bold text-gray-900">98.5%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">设备名称</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">开始时间</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">结束时间</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">持续时长</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">原因</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {offlineEvents.map((event) => {
              const start = new Date(event.start_time);
              const end = event.end_time ? new Date(event.end_time) : new Date();
              const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
              
              return (
                <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <WifiOff className="w-5 h-5 text-red-500" />
                      <span className="font-medium text-gray-900">{event.equipment_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{event.start_time}</td>
                  <td className="px-6 py-4 text-gray-600">{event.end_time || '未恢复'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      duration > 30 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {duration}分钟
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{event.reason}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">离线原因分析</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm text-red-600 mb-2">网络中断</p>
            <p className="text-2xl font-bold text-red-700">5次</p>
            <div className="mt-2 h-1.5 bg-red-200 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-red-500 rounded-full" />
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-yellow-600 mb-2">设备维护</p>
            <p className="text-2xl font-bold text-yellow-700">3次</p>
            <div className="mt-2 h-1.5 bg-yellow-200 rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-yellow-500 rounded-full" />
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-600 mb-2">电源故障</p>
            <p className="text-2xl font-bold text-blue-700">2次</p>
            <div className="mt-2 h-1.5 bg-blue-200 rounded-full overflow-hidden">
              <div className="w-1/4 h-full bg-blue-500 rounded-full" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">其他原因</p>
            <p className="text-2xl font-bold text-gray-700">2次</p>
            <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="w-1/4 h-full bg-gray-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
