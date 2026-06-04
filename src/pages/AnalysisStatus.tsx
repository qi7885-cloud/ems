import { Activity, Clock, TrendingUp, Pause } from 'lucide-react';

export default function AnalysisStatus() {
  const statusData = [
    { period: '工作时间', power: 95000, water: 7200, percentage: 76 },
    { period: '非工作时间', power: 30000, water: 1300, percentage: 24 },
  ];

  const workingHours = [
    { hour: '08:00', power: 8500, status: '工作' },
    { hour: '09:00', power: 9200, status: '工作' },
    { hour: '10:00', power: 9500, status: '工作' },
    { hour: '11:00', power: 9800, status: '工作' },
    { hour: '12:00', power: 7500, status: '午休' },
    { hour: '13:00', power: 8800, status: '工作' },
    { hour: '14:00', power: 9300, status: '工作' },
    { hour: '15:00', power: 9600, status: '工作' },
    { hour: '16:00', power: 9400, status: '工作' },
    { hour: '17:00', power: 8200, status: '工作' },
    { hour: '18:00', power: 4500, status: '下班' },
    { hour: '19:00', power: 2500, status: '非工作' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">能耗状态分析</h1>
        <p className="text-gray-500 mt-1">分析工作与非工作时段的能耗差异</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">工作状态能耗占比</h2>
          <div className="flex items-center justify-center h-48">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="12" strokeDasharray={`${76 * 2.51} 251`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">76%</span>
                <span className="text-sm text-gray-500">工作时段</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">状态对比</h2>
          <div className="space-y-4">
            {statusData.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-12 h-12 ${index === 0 ? 'bg-green-100' : 'bg-gray-100'} rounded-xl flex items-center justify-center`}>
                  {index === 0 ? (
                    <Activity className="w-6 h-6 text-green-600" />
                  ) : (
                    <Pause className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{item.period}</span>
                    <span className="text-gray-600">{item.power.toLocaleString()} kWh</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${index === 0 ? 'bg-green-500' : 'bg-gray-400'} rounded-full`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">24小时能耗曲线</h2>
        <div className="h-48 flex items-end justify-between gap-2">
          {workingHours.map((hour, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className={`w-full rounded-t ${
                  hour.status === '工作' ? 'bg-green-500' :
                  hour.status === '午休' ? 'bg-yellow-500' : 'bg-gray-400'
                }`}
                style={{ height: `${(hour.power / 10000) * 180}px` }}
              />
              <span className="text-xs text-gray-500 mt-2">{hour.hour}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-sm text-gray-600">工作</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span className="text-sm text-gray-600">午休</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-gray-400 rounded-full" />
            <span className="text-sm text-gray-600">非工作</span>
          </div>
        </div>
      </div>
    </div>
  );
}
