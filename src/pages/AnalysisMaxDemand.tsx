import { useState } from 'react';
import { Gauge, AlertTriangle, TrendingUp, Calendar, Zap } from 'lucide-react';

export default function AnalysisMaxDemand() {
  const [selectedMonth, setSelectedMonth] = useState('2024-06');

  const demandData = [
    { date: '06-01', demand: 580, peak: 620, offpeak: 450 },
    { date: '06-05', demand: 610, peak: 650, offpeak: 480 },
    { date: '06-10', demand: 595, peak: 630, offpeak: 465 },
    { date: '06-15', demand: 625, peak: 670, offpeak: 500 },
    { date: '06-20', demand: 605, peak: 645, offpeak: 475 },
    { date: '06-25', demand: 635, peak: 680, offpeak: 510 },
    { date: '06-30', demand: 615, peak: 655, offpeak: 490 },
  ];

  const monthlyStats = {
    maxDemand: 680,
    avgDemand: 608,
    peakHours: 186,
    penaltyFee: 12500,
    target: 650,
  };

  const penaltyRate = ((monthlyStats.maxDemand - monthlyStats.target) / monthlyStats.target * 100).toFixed(1);

  const historyData = [
    { month: '1月', maxDemand: 640, target: 650 },
    { month: '2月', maxDemand: 620, target: 650 },
    { month: '3月', maxDemand: 655, target: 650 },
    { month: '4月', maxDemand: 668, target: 650 },
    { month: '5月', maxDemand: 672, target: 650 },
    { month: '6月', maxDemand: 680, target: 650 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">最大需量分析</h1>
          <p className="text-gray-500 mt-1">分析最大需量变化趋势与费用影响</p>
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
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Gauge className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">本月最大需量</p>
              <p className="text-2xl font-bold text-gray-900">{monthlyStats.maxDemand} <span className="text-sm font-normal text-gray-500">kW</span></p>
            </div>
          </div>
          {monthlyStats.maxDemand > monthlyStats.target && (
            <div className="mt-3 flex items-center gap-1 text-red-600 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>超目标 {penaltyRate}%</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">平均需量</p>
              <p className="text-2xl font-bold text-gray-900">{monthlyStats.avgDemand} <span className="text-sm font-normal text-gray-500">kW</span></p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">高峰时段</p>
              <p className="text-2xl font-bold text-gray-900">{monthlyStats.peakHours} <span className="text-sm font-normal text-gray-500">小时</span></p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">需量罚款</p>
              <p className="text-2xl font-bold text-red-600">¥{monthlyStats.penaltyFee.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">本月需量变化</h2>
          <div className="h-64 flex items-end justify-between gap-4">
            {demandData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex gap-1">
                  <div
                    className="flex-1 bg-red-500 rounded-t"
                    style={{ height: `${(item.peak / 700) * 180}px` }}
                  />
                  <div
                    className="flex-1 bg-blue-500 rounded-t"
                    style={{ height: `${(item.demand / 700) * 180}px` }}
                  />
                  <div
                    className="flex-1 bg-green-500 rounded-t"
                    style={{ height: `${(item.offpeak / 700) * 180}px` }}
                  />
                </div>
                <span className="text-xs text-gray-500 mt-2">{item.date}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded" />
              <span className="text-xs text-gray-600">高峰</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded" />
              <span className="text-xs text-gray-600">平均</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded" />
              <span className="text-xs text-gray-600">低谷</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">历史最大需量对比</h2>
          <div className="h-64 flex items-end justify-between gap-4">
            {historyData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex gap-1">
                  <div
                    className={`flex-1 rounded-t ${item.maxDemand > item.target ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ height: `${(item.maxDemand / 700) * 180}px` }}
                  />
                  <div
                    className="flex-1 bg-gray-300 rounded-t border-t-2 border-dashed border-gray-400"
                    style={{ height: `${(item.target / 700) * 180}px` }}
                  />
                </div>
                {item.maxDemand > item.target && (
                  <span className="mt-1 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">超目标</span>
                )}
                <span className="text-xs text-gray-500 mt-1">{item.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded" />
              <span className="text-xs text-gray-600">实际需量</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-300 rounded border-t-2 border-dashed border-gray-400" />
              <span className="text-xs text-gray-600">目标值</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">需量控制建议</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-orange-50 rounded-lg">
            <h3 className="font-semibold text-orange-800 mb-2">削峰建议</h3>
            <p className="text-sm text-orange-700">
              在尖峰时段(08:00-11:00, 17:00-21:00)合理安排大型设备错峰运行。
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">负荷转移</h3>
            <p className="text-sm text-blue-700">
              将部分生产任务转移至平段和低谷时段，降低高峰负荷。
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">节能改造</h3>
            <p className="text-sm text-green-700">
              对高耗能设备进行节能改造，降低单位产量能耗。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}