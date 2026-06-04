import { useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, ArrowRight } from 'lucide-react';

export default function AnalysisMOM() {
  const [selectedMonth, setSelectedMonth] = useState('2024-06');

  const momData = [
    { category: '用电量', current: 3750000, previous: 3580000, change: 4.7, unit: 'kWh' },
    { category: '用水量', current: 24000, previous: 22800, change: 5.3, unit: '吨' },
    { category: '用气量', current: 85000, previous: 82000, change: 3.7, unit: 'm³' },
    { category: '总费用', current: 2680000, previous: 2560000, change: 4.7, unit: '元' },
  ];

  const monthlyTrend = [
    { month: '1月', value: 3100000 },
    { month: '2月', value: 2950000 },
    { month: '3月', value: 3200000 },
    { month: '4月', value: 3350000 },
    { month: '5月', value: 3580000 },
    { month: '6月', value: 3750000 },
  ];

  const lastMonth = '2024-05';
  const lastMonthData = {
    electricity: 3580000,
    water: 22800,
    gas: 82000,
    total: 2560000,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">能耗环比分析</h1>
          <p className="text-gray-500 mt-1">本月与上月数据进行对比分析</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="2024-06">2024年6月</option>
            <option value="2024-05">2024年5月</option>
            <option value="2024-04">2024年4月</option>
            <option value="2024-03">2024年3月</option>
            <option value="2024-02">2024年2月</option>
            <option value="2024-01">2024年1月</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {momData.map((item, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">{item.category}</span>
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                item.change > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
              }`}>
                {item.change > 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {item.change > 0 ? '+' : ''}{item.change}%
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-gray-900">{(item.current / 10000).toFixed(1)}</span>
              <span className="text-gray-500">万 {item.unit}</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
              <ArrowRight className="w-4 h-4" />
              <span>上月: {(item.previous / 10000).toFixed(1)}万 {item.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">月度能耗趋势</h2>
          <div className="h-64 flex items-end justify-between gap-4">
            {monthlyTrend.map((month, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full rounded-t transition-colors ${
                    month.month === '6月' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  style={{ height: `${(month.value / 4000000) * 200}px` }}
                />
                <span className="text-xs text-gray-500 mt-2">{month.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">本月对比上月</h2>
          <div className="space-y-4">
            {[
              { label: '用电量', current: 3750000, previous: lastMonthData.electricity },
              { label: '用水量', current: 24000, previous: lastMonthData.water },
              { label: '用气量', current: 85000, previous: lastMonthData.gas },
              { label: '总费用', current: 2680000, previous: lastMonthData.total },
            ].map((item, index) => {
              const percentage = (item.current / (item.current + item.previous)) * 100;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">{item.label}</span>
                    <span className="text-sm text-gray-500">
                      {(item.current / 10000).toFixed(1)}万 vs {(item.previous / 10000).toFixed(1)}万
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                    <div
                      className="h-full bg-gray-300 rounded-full"
                      style={{ width: `${100 - percentage}%`, marginLeft: `-${100 - percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">环比分析摘要</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">下降项</h3>
            <p className="text-sm text-green-700">无</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">上升项</h3>
            <p className="text-sm text-red-700">用电量、用水量、用气量、总费用</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">主要原因</h3>
            <p className="text-sm text-yellow-700">生产任务增加约12%</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">建议措施</h3>
            <p className="text-sm text-blue-700">优化生产排班，合理安排设备运行</p>
          </div>
        </div>
      </div>
    </div>
  );
}