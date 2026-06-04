import { useState } from 'react';
import { Clock, Zap, Sun, Moon } from 'lucide-react';

export default function StatisticsTimeSegment() {
  const [selectedDate, setSelectedDate] = useState('2024-06-07');

  const timeSegments = [
    { period: '尖峰时段', time: '08:00-11:00', power: 15000, percentage: 35, icon: Sun, color: 'bg-red-500' },
    { period: '高峰时段', time: '14:00-17:00', power: 13500, percentage: 31, icon: Zap, color: 'bg-orange-500' },
    { period: '平段', time: '11:00-14:00, 17:00-21:00', power: 9500, percentage: 22, icon: Clock, color: 'bg-yellow-500' },
    { period: '低谷时段', time: '21:00-08:00', power: 5200, percentage: 12, icon: Moon, color: 'bg-blue-500' },
  ];

  const dayData = [
    { hour: '00:00', power: 2500, segment: '低谷' },
    { hour: '04:00', power: 2200, segment: '低谷' },
    { hour: '08:00', power: 12000, segment: '尖峰' },
    { hour: '10:00', power: 15500, segment: '尖峰' },
    { hour: '12:00', power: 8500, segment: '平段' },
    { hour: '14:00', power: 13800, segment: '高峰' },
    { hour: '16:00', power: 14200, segment: '高峰' },
    { hour: '18:00', power: 9200, segment: '平段' },
    { hour: '22:00', power: 3500, segment: '低谷' },
  ];

  const segmentColors = {
    '低谷': 'bg-blue-500',
    '平段': 'bg-yellow-500',
    '高峰': 'bg-orange-500',
    '尖峰': 'bg-red-500',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">分时段报表</h1>
          <p className="text-gray-500 mt-1">按尖峰/高峰/平段/低谷时段统计能耗</p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {timeSegments.map((item, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{item.percentage}%</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.period}</h3>
            <p className="text-sm text-gray-500 mb-2">{item.time}</p>
            <p className="text-xl font-bold text-gray-900">{item.power.toLocaleString()} kWh</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">24小时负荷曲线</h2>
        <div className="h-64 flex items-end justify-between gap-2">
          {dayData.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className={`w-full rounded-t ${segmentColors[item.segment as keyof typeof segmentColors]}`}
                style={{ height: `${(item.power / 16000) * 240}px` }}
              />
              <span className="text-xs text-gray-500 mt-2">{item.hour}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          {Object.entries(segmentColors).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <span className={`w-3 h-3 ${value} rounded-full`} />
              <span className="text-sm text-gray-600">{key}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">时段电费估算</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-600 mb-2">尖峰电费</p>
            <p className="text-2xl font-bold text-red-700">¥12,750</p>
            <p className="text-xs text-gray-500 mt-1">电价: 0.85元/kWh</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-600 mb-2">高峰电费</p>
            <p className="text-2xl font-bold text-orange-700">¥9,045</p>
            <p className="text-xs text-gray-500 mt-1">电价: 0.67元/kWh</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-600 mb-2">平段电费</p>
            <p className="text-2xl font-bold text-yellow-700">¥4,940</p>
            <p className="text-xs text-gray-500 mt-1">电价: 0.52元/kWh</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 mb-2">低谷电费</p>
            <p className="text-2xl font-bold text-blue-700">¥1,560</p>
            <p className="text-xs text-gray-500 mt-1">电价: 0.30元/kWh</p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">合计电费</span>
            <span className="text-2xl font-bold text-gray-900">¥28,295</span>
          </div>
        </div>
      </div>
    </div>
  );
}
