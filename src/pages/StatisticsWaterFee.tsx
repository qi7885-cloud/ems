import { Droplets, DollarSign, TrendingUp, CloudRain } from 'lucide-react';

export default function StatisticsWaterFee() {
  const waterData = [
    { month: '1月', usage: 24000, fee: 108000, sewage: 28800, total: 136800 },
    { month: '2月', usage: 22000, fee: 99000, sewage: 26400, total: 125400 },
    { month: '3月', usage: 26000, fee: 117000, sewage: 31200, total: 148200 },
    { month: '4月', usage: 28000, fee: 126000, sewage: 33600, total: 159600 },
    { month: '5月', usage: 30000, fee: 135000, sewage: 36000, total: 171000 },
    { month: '6月', usage: 32000, fee: 144000, sewage: 38400, total: 182400 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">综合水费</h1>
        <p className="text-gray-500 mt-1">统计分析水费和排污费支出情况</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
              <Droplets className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">本月用水量</p>
              <p className="text-2xl font-bold text-gray-900">32,000 吨</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">水费</p>
              <p className="text-2xl font-bold text-gray-900">¥144,000</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CloudRain className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">排污费</p>
              <p className="text-2xl font-bold text-gray-900">¥38,400</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">合计费用</p>
              <p className="text-2xl font-bold text-gray-900">¥182,400</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">月度水费趋势</h2>
        <div className="h-64 flex items-end justify-between gap-4">
          {waterData.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex gap-1">
                <div
                  className="flex-1 bg-blue-500 rounded-t"
                  style={{ height: `${(item.fee / 150000) * 200}px` }}
                />
                <div
                  className="flex-1 bg-green-500 rounded-t"
                  style={{ height: `${(item.sewage / 40000) * 200}px` }}
                />
              </div>
              <span className="text-xs text-gray-500 mt-2">{item.month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-blue-500 rounded" />
            <span className="text-sm text-gray-600">水费</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-green-500 rounded" />
            <span className="text-sm text-gray-600">排污费</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">费用构成分析</h2>
          <div className="flex items-center justify-center h-48">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray={`${79 * 2.51} 251`} />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="12" strokeDasharray={`${21 * 2.51} 251`} strokeDashoffset={`-${79 * 2.51}`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">¥182K</span>
                <span className="text-sm text-gray-500">本月合计</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">单价明细</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-600">自来水费</span>
              <span className="font-bold text-blue-700">¥4.50 / 吨</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-600">排污费</span>
              <span className="font-bold text-green-700">¥1.20 / 吨</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
              <span className="text-gray-600">水资源费</span>
              <span className="font-bold text-cyan-700">¥0.80 / 吨</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-t border-gray-200 mt-2">
              <span className="font-bold text-gray-900">综合单价</span>
              <span className="text-xl font-bold text-gray-900">¥6.50 / 吨</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
