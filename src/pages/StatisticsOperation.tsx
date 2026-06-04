import { Activity, Clock, CheckCircle, XCircle, PauseCircle } from 'lucide-react';

export default function StatisticsOperation() {
  const operationData = [
    { equipment: '主配电柜', status: 'normal', uptime: '99.8%', today: '14小时30分', efficiency: '95%' },
    { equipment: '变压器A', status: 'normal', uptime: '99.5%', today: '14小时', efficiency: '92%' },
    { equipment: '变压器B', status: 'warning', uptime: '98.2%', today: '13小时45分', efficiency: '88%' },
    { equipment: '水表-1号', status: 'normal', uptime: '99.9%', today: '14小时30分', efficiency: '100%' },
    { equipment: '空压机', status: 'error', uptime: '95.0%', today: '12小时', efficiency: '75%' },
  ];

  const statusConfig = {
    normal: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', text: '正常运行' },
    warning: { icon: PauseCircle, color: 'text-yellow-600', bg: 'bg-yellow-100', text: '性能下降' },
    error: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', text: '故障' },
  };

  const dailyStats = [
    { label: '设备总数', value: '24', icon: Activity },
    { label: '运行中', value: '21', icon: CheckCircle },
    { label: '维护中', value: '2', icon: PauseCircle },
    { label: '故障', value: '1', icon: XCircle },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">运行报表</h1>
        <p className="text-gray-500 mt-1">设备运行状态统计和效率分析</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {dailyStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-blue-600" />
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
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">设备名称</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">运行状态</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">设备可用率</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">今日运行时长</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">运行效率</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {operationData.map((item, index) => {
              const config = statusConfig[item.status as keyof typeof statusConfig];
              const StatusIcon = config.icon;
              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.equipment}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {config.text}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.uptime}</td>
                  <td className="px-6 py-4 text-gray-600">{item.today}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            parseInt(item.efficiency) >= 90 ? 'bg-green-500' :
                            parseInt(item.efficiency) >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: item.efficiency }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{item.efficiency}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">今日运行趋势</h2>
        <div className="h-48 flex items-end justify-between gap-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-blue-500 rounded-t"
                style={{ height: `${30 + Math.sin(i * 0.5) * 30 + Math.random() * 20}px` }}
              />
              <span className="text-xs text-gray-500 mt-2">{i}:00</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
