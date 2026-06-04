import { Zap, DollarSign, TrendingUp, Calendar } from 'lucide-react';

export default function StatisticsElectricFee() {
  const monthlyData = [
    { month: '1月', basic: 2000, quantity: 52000, total: 54000 },
    { month: '2月', basic: 2000, quantity: 48000, total: 50000 },
    { month: '3月', basic: 2000, quantity: 58000, total: 60000 },
    { month: '4月', basic: 2000, quantity: 62000, total: 64000 },
    { month: '5月', basic: 2000, quantity: 68000, total: 70000 },
    { month: '6月', basic: 2000, quantity: 72000, total: 74000 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">电度电费</h1>
        <p className="text-gray-500 mt-1">统计分析电度电费支出情况</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">本月电费</p>
              <p className="text-2xl font-bold text-gray-900">¥74,000</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">基本电费</p>
              <p className="text-2xl font-bold text-gray-900">¥2,000</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">电量电费</p>
              <p className="text-2xl font-bold text-gray-900">¥72,000</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">月度电费趋势</h2>
        <div className="h-64 flex items-end justify-between gap-4">
          {monthlyData.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex gap-1">
                <div
                  className="flex-1 bg-blue-500 rounded-t"
                  style={{ height: `${(item.basic / 8000) * 200}px` }}
                />
                <div
                  className="flex-1 bg-yellow-500 rounded-t"
                  style={{ height: `${(item.quantity / 80000) * 200}px` }}
                />
              </div>
              <span className="text-xs text-gray-500 mt-2">{item.month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-blue-500 rounded" />
            <span className="text-sm text-gray-600">基本电费</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-yellow-500 rounded" />
            <span className="text-sm text-gray-600">电量电费</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">电费构成分析</h2>
          <div className="flex items-center justify-center h-48">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray={`${3 * 2.51} 251`} />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#eab308" strokeWidth="12" strokeDasharray={`${97 * 2.51} 251`} strokeDashoffset={`-${3 * 2.51}`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">¥74K</span>
                <span className="text-sm text-gray-500">本月合计</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">电费明细</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-600">基本电费</span>
              <span className="font-bold text-blue-700">¥2,000</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-gray-600">尖峰电费 (15,000 kWh × 0.85)</span>
              <span className="font-bold text-yellow-700">¥12,750</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-gray-600">高峰电费 (25,000 kWh × 0.67)</span>
              <span className="font-bold text-orange-700">¥16,750</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-600">平段电费 (20,000 kWh × 0.52)</span>
              <span className="font-bold text-green-700">¥10,400</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
              <span className="text-gray-600">低谷电费 (12,000 kWh × 0.30)</span>
              <span className="font-bold text-cyan-700">¥3,600</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-t border-gray-200 mt-2">
              <span className="font-bold text-gray-900">合计</span>
              <span className="text-xl font-bold text-gray-900">¥74,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
