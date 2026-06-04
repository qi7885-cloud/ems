import { useState } from 'react';
import { transformerData } from '../data/mockData';
import { Thermometer, Activity, Zap, TrendingUp, AlertTriangle } from 'lucide-react';

export default function Transformer() {
  const [selectedTransformer, setSelectedTransformer] = useState(0);
  const [showTrend, setShowTrend] = useState(true);

  const transformer = transformerData[selectedTransformer];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">变压器监测</h1>
        <p className="text-gray-500 mt-1">实时监测变压器的运行状态</p>
      </div>

      <div className="flex gap-4 mb-6">
        {transformerData.map((item, index) => (
          <button
            key={item.name}
            onClick={() => setSelectedTransformer(index)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedTransformer === index
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Thermometer className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">温度</p>
              <p className="text-2xl font-bold text-gray-900">{transformer.temperature}°C</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">温度状态</span>
              <span className={`font-medium ${
                transformer.temperature > 70 ? 'text-red-600' : 
                transformer.temperature > 60 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {transformer.temperature > 70 ? '偏高' : 
                 transformer.temperature > 60 ? '正常' : '良好'}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  transformer.temperature > 70 ? 'bg-red-500' : 
                  transformer.temperature > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${(transformer.temperature / 100) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">负载率</p>
              <p className="text-2xl font-bold text-gray-900">{transformer.load_rate}%</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">负载状态</span>
              <span className={`font-medium ${
                transformer.load_rate > 80 ? 'text-red-600' : 
                transformer.load_rate > 60 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {transformer.load_rate > 80 ? '过载' : 
                 transformer.load_rate > 60 ? '正常' : '偏低'}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  transformer.load_rate > 80 ? 'bg-red-500' : 
                  transformer.load_rate > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${transformer.load_rate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">电流</p>
              <p className="text-2xl font-bold text-gray-900">{transformer.current} A</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            额定电流: 300 A
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">电压</p>
              <p className="text-2xl font-bold text-gray-900">{transformer.voltage} kV</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            额定电压: 10.5 kV
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">温度趋势</h2>
          <button
            onClick={() => setShowTrend(!showTrend)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              showTrend ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {showTrend ? '隐藏趋势' : '显示趋势'}
          </button>
        </div>
        
        {showTrend && (
          <div className="h-64 bg-gray-50 rounded-lg p-4">
            <div className="flex items-end justify-between h-full gap-2">
              {Array.from({ length: 24 }).map((_, i) => {
                const baseTemp = transformer.temperature;
                const height = 20 + Math.sin(i * 0.5) * 15 + Math.random() * 10;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div
                      className={`w-full rounded-t transition-all ${
                        height > 60 ? 'bg-red-500' : height > 50 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-gray-500 mt-2">{i}:00</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">运行日志</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">温度预警</p>
              <p className="text-xs text-gray-500 mt-1">2024-06-01 10:30 - {transformer.name}温度达到{transformer.temperature}°C，接近预警阈值</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Activity className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">例行巡检</p>
              <p className="text-xs text-gray-500 mt-1">2024-06-01 08:00 - 设备运行正常</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
