import { powerDistributionData } from '../data/mockData';
import { Zap, Activity, TrendingUp, AlertCircle } from 'lucide-react';

export default function PowerDistribution() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">配电监测</h1>
        <p className="text-gray-500 mt-1">实时监测配电系统的运行状态</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {powerDistributionData.map((item) => (
          <div
            key={item.name}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-600 font-medium">正常运行</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">电流</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{item.current} A</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">电压</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{item.voltage} kV</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-600">功率</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{item.power} kW</span>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">负载率</span>
                  <span className="font-medium text-gray-900">
                    {((item.current / 500) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      (item.current / 500) * 100 > 80
                        ? 'bg-red-500'
                        : (item.current / 500) * 100 > 60
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${(item.current / 500) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">配电系统拓扑图</h2>
        <div className="bg-gray-50 rounded-lg p-8">
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-5 flex justify-center">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  电网
                </div>
                <div className="w-20 h-1 bg-gray-300" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    主配电柜
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-5 flex justify-center mt-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  变压器A
                </div>
                <div className="w-12 h-1 bg-gray-300" />
                <div className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  主配电柜
                </div>
                <div className="w-12 h-1 bg-gray-300" />
                <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  变压器B
                </div>
              </div>
            </div>
            <div className="col-span-5 flex justify-center mt-8">
              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-12 bg-gray-300" />
                  <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center text-white text-xs mt-2">
                    出线1
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-2 h-12 bg-gray-300" />
                  <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center text-white text-xs mt-2">
                    出线2
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-2 h-12 bg-gray-300" />
                  <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center text-white text-xs mt-2">
                    出线3
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
