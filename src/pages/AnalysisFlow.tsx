import { Activity, Zap, Droplets, Factory, ArrowRight } from 'lucide-react';

export default function AnalysisFlow() {
  const energyFlow = [
    { source: '电网', value: 100000, unit: 'kWh', color: 'bg-blue-500' },
    { source: '变压器A', value: 55000, unit: 'kWh', color: 'bg-yellow-500' },
    { source: '变压器B', value: 45000, unit: 'kWh', color: 'bg-orange-500' },
    { source: '造纸车间', value: 45000, unit: 'kWh', color: 'bg-green-500' },
    { source: '水处理车间', value: 28000, unit: 'kWh', color: 'bg-cyan-500' },
    { source: '配电室', value: 18000, unit: 'kWh', color: 'bg-purple-500' },
    { source: '办公楼', value: 9000, unit: 'kWh', color: 'bg-pink-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">能源流向图</h1>
        <p className="text-gray-500 mt-1">可视化展示能源从源头到各消耗端的流动情况</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">能源流向示意图</h2>
        <div className="relative">
          <div className="flex flex-col items-center">
            <div className="w-32 h-16 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold mb-4">
              电网输入
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400 rotate-90 mb-4" />
            <div className="flex gap-8">
              <div className="flex flex-col items-center">
                <div className="w-24 h-12 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold">
                  变压器A
                </div>
                <span className="text-sm text-gray-500 mt-2">55,000 kWh</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-24 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                  变压器B
                </div>
                <span className="text-sm text-gray-500 mt-2">45,000 kWh</span>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400 rotate-90 mb-4 mt-4" />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <div className="w-20 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  造纸车间
                </div>
                <span className="text-xs text-gray-500 mt-1">45,000 kWh</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-20 h-10 bg-cyan-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  水处理车间
                </div>
                <span className="text-xs text-gray-500 mt-1">28,000 kWh</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-20 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  配电室
                </div>
                <span className="text-xs text-gray-500 mt-1">18,000 kWh</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-20 h-10 bg-pink-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  办公楼
                </div>
                <span className="text-xs text-gray-500 mt-1">9,000 kWh</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">流向数据明细</h2>
        <div className="space-y-3">
          {energyFlow.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center text-white`}>
                <Activity className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{item.source}</span>
                  <span className="text-gray-600">{item.value.toLocaleString()} {item.unit}</span>
                </div>
                <div className="mt-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${(item.value / 100000) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
