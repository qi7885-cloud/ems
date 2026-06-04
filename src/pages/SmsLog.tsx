import { useState } from 'react';
import { Phone, Clock, Check, X, Search, Filter } from 'lucide-react';

export default function SmsLog() {
  const [searchTerm, setSearchTerm] = useState('');

  const smsLogs = [
    { id: 1, phone: '138****8888', content: '【EMS系统】变压器A温度过高，当前65°C，请及时处理', status: 'success', time: '2024-06-07 14:30', type: '告警通知' },
    { id: 2, phone: '139****9999', content: '【EMS系统】主配电柜电流接近阈值，当前450A', status: 'success', time: '2024-06-07 14:25', type: '预警通知' },
    { id: 3, phone: '137****7777', content: '【EMS系统】水表-1号离线，请检查网络连接', status: 'failed', time: '2024-06-07 13:45', type: '离线通知' },
    { id: 4, phone: '138****8888', content: '【EMS系统】变压器A温度恢复正常，当前58°C', status: 'success', time: '2024-06-07 12:30', type: '恢复通知' },
    { id: 5, phone: '139****9999', content: '【EMS系统】每日能耗报表已生成，请查看', status: 'success', time: '2024-06-07 08:00', type: '日报通知' },
  ];

  const filteredLogs = smsLogs.filter((log) =>
    log.phone.includes(searchTerm) || log.content.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">短信日志</h1>
        <p className="text-gray-500 mt-1">查看短信发送记录和配置管理</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">今日发送</p>
              <p className="text-2xl font-bold text-gray-900">28</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">成功送达</p>
              <p className="text-2xl font-bold text-gray-900">25</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">发送失败</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索手机号或内容..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" />
              筛选
            </button>
            <button className="px-4 py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors">
              配置接收人
            </button>
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">接收号码</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">短信内容</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">类型</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">状态</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">发送时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{log.phone}</td>
                <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{log.content}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                    {log.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {log.status === 'success' ? (
                    <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                      <Check className="w-4 h-4" />
                      成功
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-600 text-sm">
                      <X className="w-4 h-4" />
                      失败
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{log.time}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
