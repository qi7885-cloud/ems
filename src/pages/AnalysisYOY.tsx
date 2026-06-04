import { useState } from 'react';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

export default function AnalysisYOY() {
  const [selectedYear, setSelectedYear] = useState('2024');

  const yoyData = [
    { month: '1月', current: 2800000, previous: 2650000, change: 5.7 },
    { month: '2月', current: 2650000, previous: 2580000, change: 2.7 },
    { month: '3月', current: 3100000, previous: 2980000, change: 4.0 },
    { month: '4月', current: 3250000, previous: 3100000, change: 4.8 },
    { month: '5月', current: 3500000, previous: 3350000, change: 4.5 },
    { month: '6月', current: 3750000, previous: 3580000, change: 4.7 },
  ];

  const totalCurrent = yoyData.reduce((sum, item) => sum + item.current, 0);
  const totalPrevious = yoyData.reduce((sum, item) => sum + item.previous, 0);
  const totalChange = ((totalCurrent - totalPrevious) / totalPrevious * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">能耗同比分析</h1>
          <p className="text-gray-500 mt-1">与去年同期数据进行对比分析</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="2024">2024年</option>
            <option value="2023">2023年</option>
            <option value="2022">2022年</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">累计同比对比</h2>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
            parseFloat(totalChange) > 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            {parseFloat(totalChange) > 0 ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
            <span className="font-bold">{Math.abs(parseFloat(totalChange))}%</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 mb-2">{selectedYear}年累计</p>
            <p className="text-3xl font-bold text-blue-700">{(totalCurrent / 10000).toFixed(0)}万 kWh</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">{parseInt(selectedYear) - 1}年累计</p>
            <p className="text-3xl font-bold text-gray-700">{(totalPrevious / 10000).toFixed(0)}万 kWh</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">月度同比分析</h2>
        <div className="h-64 flex items-end justify-between gap-4">
          {yoyData.map((month, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex gap-1">
                <div
                  className="flex-1 bg-blue-500 rounded-t"
                  style={{ height: `${(month.current / 4000000) * 200}px` }}
                />
                <div
                  className="flex-1 bg-gray-400 rounded-t"
                  style={{ height: `${(month.previous / 4000000) * 200}px` }}
                />
              </div>
              <div className={`mt-2 px-2 py-1 rounded text-xs font-medium ${
                month.change > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {month.change > 0 ? '+' : ''}{month.change}%
              </div>
              <span className="text-xs text-gray-500 mt-2">{month.month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-blue-500 rounded" />
            <span className="text-sm text-gray-600">{selectedYear}年</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-gray-400 rounded" />
            <span className="text-sm text-gray-600">{parseInt(selectedYear) - 1}年</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">同比分析报告</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">节能成效</h3>
            <p className="text-sm text-green-700">
              通过技术改造和管理优化，上半年单位产品能耗同比下降3.2%。
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">关注事项</h3>
            <p className="text-sm text-yellow-700">
              6月份能耗同比增长4.7%，主要受生产任务增加影响。
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">改进建议</h3>
            <p className="text-sm text-blue-700">
              建议加强非工作时段能耗管控，优化设备运行调度。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
