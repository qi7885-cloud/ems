import { useState } from 'react';
import { useStore } from '../store/useStore';
import { AlertTriangle, Check, Clock, Filter } from 'lucide-react';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case '严重':
        return 'bg-red-100 text-red-700 border-red-500';
      case '一般':
        return 'bg-yellow-100 text-yellow-700 border-yellow-500';
      case '轻微':
        return 'bg-blue-100 text-blue-700 border-blue-500';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">设备故障</h1>
        <p className="text-gray-500 mt-1">实时监测和记录设备故障信息</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              待处理
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === 'resolved'
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              已处理
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          共 {filteredAlarms.length} 条记录
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">告警信息</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">级别</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">状态</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">时间</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredAlarms.map((alarm) => (
              <tr key={alarm.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-medium text-gray-900">{alarm.message}</p>
                      <p className="text-sm text-gray-500">类型: {alarm.type}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getLevelColor(alarm.level)}`}>
                    {alarm.level}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(alarm.status)}`}>
                    {alarm.status === 'pending' ? '待处理' : '已处理'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{alarm.created_at}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {alarm.status === 'pending' ? (
                    <button
                      onClick={() => handleResolve(alarm.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      处理
                    </button>
                  ) : (
                    <span className="text-sm text-gray-500">已处理于 {alarm.resolved_at}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
